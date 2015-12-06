import Axios from 'core/common/config/axios-config';

import When from 'when';

import {updateEntitiesAction} from 'core/metamodel/metamodelActions';
import {store} from 'core/common/redux/store';

import MdEntity from 'core/metamodel/mdEntity';
import MdField from 'core/metamodel/mdField';

import Utils from 'core/common/utils/utils';


class MdEntityService {


  /**
   * Dotahne ze serveru entity ze zadanych entityNames, ktere neexistuji v MdEntityStore
   * Pokud je zadane pole withLovs, tak k nim jeste dotahne lovItems, pokud nejsou jeste dotazene (lovitems === undefined)
   * Pokud se neco dotahovalo aktualizuje MdEntityStore
   *  Vrati promise resolvovany do (doplneneho) entityObject
   * @param entityNames - pole [Party, ...]
   * @param entityObject - objekt {entityName: MdEntity, ...}
   * @param withLovs - pole [true, false..] o stejne delce jako entityNames, kde pokud je true tak se dotahnou i lov do mdEntity.lovItems
   * @returns Promise<entityObject>
     */
  fetchEntities(entityNames, entityObject, withLovs) {

    let unresolvedEntityNames = [];

    for(let entityName of entityNames) {
      let mdEntity =  store.getState().getIn(['core', 'metamodel', 'entities', entityName]);
      if (mdEntity) {
        entityObject[entityName] = mdEntity;
      } else {
        unresolvedEntityNames.push(entityName);
      }
    }
    var promise;
    var asyncFetch = false;
    if (unresolvedEntityNames.length > 0) {
      asyncFetch = true;
      promise = this.fetchMissingEntities(unresolvedEntityNames, entityObject);
    } else {
      promise = When(entityObject);
    }

    var finalPromise = promise.then((entityObject) => {
      if (withLovs && withLovs.length === entityNames.length) {
        var keyWithLovs = entityNames.filter( (k,i) => withLovs[i]);
        let unresolvedLovs = [];
        for(let k of keyWithLovs) {
          let mdEntity = entityObject[k];
          if (mdEntity.lovItems === undefined) {
            unresolvedLovs.push(k);
          }
        }
        var promiseLov;
        if (unresolvedLovs.length > 0) {
          asyncFetch = true;
          promiseLov = this.fetchMissingEntityLovs(unresolvedLovs, entityObject);
        } else {
          promiseLov = When(entityObject);
        }
        return promiseLov;
      } else {
        return entityObject;
      }
    });

    return finalPromise.then((entityObject) => {
      if (asyncFetch) {
        store.dispatch(updateEntitiesAction(entityObject));
      }
      return entityObject;
    });

  }


  fetchMissingEntities(entityNames, entityObject) {
    return Axios.get('/core/metamodel/entity', {params: {entityName: entityNames}})
      .then((response) => {
        if (response.data.length  > 0) {
          for(let entity of response.data) {
            Object.setPrototypeOf(entity, MdEntity.prototype);

            for(let fieldName in entity.fields) {
              let field = entity.fields[fieldName];
              Object.setPrototypeOf(field, MdField.prototype);
              field.fieldKey = Utils.formatId(entity.id, fieldName);
            }

            entityObject[entity.id] = entity;
          }

        }
        return entityObject;
      });
  }

  fetchMissingEntityLovs(entityNames, entityObject) {
    return Axios.get('/core/metamodel/lovitem', {params: {entityName: entityNames}})
      .then((response) => {
        var mapa = response.data;
        for(let ek of entityNames) {
          entityObject[ek].lovItems = mapa[ek];
        }
        return entityObject;
      });
  }


}

export default new MdEntityService();


