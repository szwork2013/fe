import Axios from 'core/common/config/axios-config';
import When from 'when';
import {flatten} from 'lodash';

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
   * @param entityNamesOrSpecs - pole jmen entit [Party, ...] (potom se predpoklada, ze je to without lov) nebo pole objektu [{entity: 'Country', lov: true}, ...]
   * @returns Promise<entityObject>
     */
  fetchEntities(entityNamesOrSpecs) {

    const entityMap = store.getState().getIn(['metamodel', 'entities']);

    let entitySpecs = entityNamesOrSpecs.map(v => (typeof v === 'string') ? {entity: v} : v);

    let unresolvedEntitySpecs = entitySpecs.filter(v => !entityMap.has(v.entity));

    let unresolvedLovNames = entitySpecs.filter(v => v.lov).filter(v => {
      let entityObject = entityMap.get(v.entity);
      return (!entityObject || entityObject.lovItems === undefined);
    }).map(v => v.entity);


    var promiseArray = [(unresolvedEntitySpecs.length) ? this.fetchMissingEntities(unresolvedEntitySpecs.map(s => s.entity), entityMap) : entityMap,
      (unresolvedLovNames.length) ? this.fetchMissingEntityLovs(unresolvedLovNames) : {}];

    return When.all(promiseArray)
      .then( ([entityMap, lovObject]) => {
        for(let entityName in lovObject) {
          let entityObject = entityMap.get(entityName);
          entityObject.lovItems = lovObject[entityName];
          entityMap = entityMap.set(entityName, entityObject);
        }
        if ( unresolvedEntitySpecs.length || unresolvedLovNames.length ) {
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

  fetchMissingEntityLovs(entityNames) {
    return Axios.get('/core/metamodel/lovitem', {params: {entityName: entityNames}})
      .then((response) => response.data);
  }


  /**
   *
   * @param mainEntityNames - pole jmen hlavnich entit, ktere dotahneme bez lov a k nim potom dotahneme entity vsech fieldu s localValueSource vcetne lov
   * @param entityNamesOrSpecs - pole jmen entit ktere dotahneme bez lovs, nebo pole objektu [{entity: 'Country', lov: true}, ...]
   * @returns {Promise.<entityObject>|Promise|*}
   */
  fetchEntityMetadata(mainEntityNames, entityNamesOrSpecs) {

    entityNamesOrSpecs = (entityNamesOrSpecs) ? entityNamesOrSpecs : [];
    let entitySpecs = entityNamesOrSpecs.map(v => (typeof v === 'string') ? {entity: v} : v);

    return this.fetchEntities(mainEntityNames)
      .then(entityMap => {

        let allFields = flatten(mainEntityNames.map(entityName => Object.values(entityMap.get(entityName).fields)));
        let fieldSpecs = allFields.filter(f => f.hasLocalValueSource()).map(f => ({entity: f.valueSource, lov: true}));
        let allEntitySpecs = fieldSpecs.concat(entitySpecs);

        let objectifiedSpecs = allEntitySpecs.reduce( (acc, spec) => {
          let old = acc[spec.entity];
          if (old) {
            old.lov = old.lov || spec.lov;
          } else {
            acc[spec.entity] = spec;
          }
          return acc;
        }, {});

        return this.fetchEntities(Object.values(objectifiedSpecs));
      })
  }



}

export default new MdEntityService();


