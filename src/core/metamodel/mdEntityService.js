import Axios from 'core/common/config/axios-config';

import When from 'when';

import MdEntityActions from 'core/metamodel/mdEntityActions';
import MdEntity from 'core/metamodel/mdEntity';
import MdField from 'core/metamodel/mdField';
import MdEntityStore from 'core/metamodel/mdEntityStore';

import Utils from 'core/common/utils/utils';


class MdEntityService {


  /**
   * Dotahne ze serveru entity ze zadanych entityKeys, ktere neexistuji v MdEntityStore
   * Pokud je zadane pole withLovs, tak k nim jeste dotahne lovItems, pokud nejsou jeste dotazene (lovitems === undefined)
   * Pokud se neco dotahovalo aktualizuje MdEntityStore
   *  Vrati promise resolvovany do (doplneneho) entityObject
   * @param entityKeys - pole [party_Party, ...]
   * @param entityObject - objekt {entityKey: MdEntity, ...}
   * @param withLovs - pole [true, false..] o stejne delce jako entityKeys, kde pokud je true tak se dotahnou i lov do mdEntity.lovItems
   * @returns Promise<entityObject>
     */
  fetchEntities(entityKeys, entityObject, withLovs) {

    let unresolvedEntityKeys = [];

    for(let entityKey of entityKeys) {
      let mdEntity = MdEntityStore.getEntity(entityKey);
      if (mdEntity) {
        entityObject[entityKey] = mdEntity;
      } else {
        unresolvedEntityKeys.push(entityKey);
      }
    }
    var promise;
    var asyncFetch = false;
    if (unresolvedEntityKeys.length > 0) {
      asyncFetch = true;
      promise = this.fetchMissingEntities(unresolvedEntityKeys, entityObject);
    } else {
      promise = When(entityObject);
    }

    var finalPromise = promise.then((entityObject) => {
      if (withLovs && withLovs.length === entityKeys.length) {
        var keyWithLovs = entityKeys.filter( (k,i) => withLovs[i]);
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
        MdEntityActions.updateEntities(entityObject);
      }
      return entityObject;
    });

  }


  fetchMissingEntities(entityKeys, entityObject) {
    return Axios.get('/core/metamodel/entity', {params: {entityKey: entityKeys}})
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

  fetchMissingEntityLovs(entityKeys, entityObject) {
    return Axios.get('/core/metamodel/lovitem', {params: {entityKey: entityKeys}})
      .then((response) => {
        var mapa = response.data;
        for(let ek of entityKeys) {
          entityObject[ek].lovItems = mapa[ek];
        }
        return entityObject;
      });
  }


}

export default new MdEntityService();


