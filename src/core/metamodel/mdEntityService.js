import Axios from 'core/common/config/axios-config';

import When from 'when';

import {updateEntitiesAction} from 'core/metamodel/metamodelActions';
import {store} from 'core/common/redux/store';

import MdEntity from 'core/metamodel/mdEntity';
import MdField from 'core/metamodel/mdField';

import Utils from 'core/common/utils/utils';


class MdEntityService {


  /**
   * Dotahne ze serveru entity ze zadanych entityNames, ktere neexistuji v metamodel/entities
   * Pokud je zadane pole withLovs, tak k nim jeste dotahne lovItems, pokud nejsou jeste dotazene (lovitems === undefined)
   * Pokud se neco dotahovalo aktualizuje metamodel/entities
   *  Vrati promise resolvovany do (doplneneho) entityObject
   * @param entityNames - pole [Party, ...]
   * @param withLovs - pole [true, false..] o stejne delce jako entityNames, kde pokud je true tak se dotahnou i lov do mdEntity.lovItems
   * @returns Promise<entityObject>
     */
  fetchEntities(entityNames, withLovs) {

    const entityMap = store.getState().getIn(['metamodel', 'entities']);

    let unresolvedEntityNames = entityNames.filter(v => !entityMap.has(v));

    var promise;
    var asyncFetch = false;
    if (unresolvedEntityNames.length > 0) {
      asyncFetch = true;
      promise = this.fetchMissingEntities(unresolvedEntityNames, entityMap);
    } else {
      promise = When(entityMap);
    }

    var finalPromise = promise.then((entityMap) => {
      if (withLovs && withLovs.length === entityNames.length) {
        var keyWithLovs = entityNames.filter( (k,i) => withLovs[i]);
        let unresolvedLovs = keyWithLovs.filter(k => entityMap.get(k).lovItems === undefined);

        var promiseLov;
        if (unresolvedLovs.length > 0) {
          asyncFetch = true;
          promiseLov = this.fetchMissingEntityLovs(unresolvedLovs, entityMap);
        } else {
          promiseLov = When(entityMap);
        }
        return promiseLov;
      } else {
        return entityMap;
      }
    });

    return finalPromise.then((entityMap) => {
      if (asyncFetch) {
        store.dispatch(updateEntitiesAction(entityMap));
      }
      return entityMap;
    });

  }


  fetchMissingEntities(entityNames, entityMap) {
    return Axios.get('/core/metamodel/entity', {params: {entityName: entityNames}})
      .then((response) => {

        for(let entity of response.data) {
          Object.setPrototypeOf(entity, MdEntity.prototype);

          for(let fieldName in entity.fields) {
            let field = entity.fields[fieldName];
            Object.setPrototypeOf(field, MdField.prototype);
            field.fieldKey = Utils.formatId(entity.id, fieldName);
          }
          entityMap = entityMap.set(entity.id, entity);
        }
        return entityMap;
      });
  }

  fetchMissingEntityLovs(entityNames, entityMap) {
    return Axios.get('/core/metamodel/lovitem', {params: {entityName: entityNames}})
      .then((response) => {
        var data = response.data;
        for(let ek of entityNames) {
          let entity = entityMap.get(ek);
          entity.lovItems = data[ek];
          entityMap = entityMap.set(ek, entity);
        }
        return entityMap;
      });
  }


}

export default new MdEntityService();


