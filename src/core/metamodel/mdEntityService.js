import Axios from 'core/common/config/axios-config';

import MdEntityActions from 'core/metamodel/mdEntityActions';
import MdEntity from 'core/metamodel/mdEntity';
import MdField from 'core/metamodel/mdField';

import Utils from 'core/common/utils/utils';

class MdEntityService {


  /**
   * Vrati promise resolvovany do (doplneneho) entityObject
   * @param entityKeys - pole [party_Party, ...]
   * @param entityObject - objekt {entityKey: MdEntity, ...}
   * @returns Promise<entityObject>
     */
  fetchEntities(entityKeys, entityObject) {
    return Axios.get('/core/metamodel/entity', {params: {entityKey: entityKeys}})
      .then((response) => {
        if (response.data.length  > 0) {
          for(let entity of response.data) {
            Object.setPrototypeOf(entity, MdEntity.prototype);

            for(let fieldName in entity.fields) {
              let field = entity.fields[fieldName];
              Object.setPrototypeOf(field, MdField.prototype);
              field.fieldKey = Utils.formatId(entity.entityKey, fieldName);
            }

            entityObject[entity.id] = entity;
          }
          MdEntityActions.updateEntities(entityObject);
        }
        return entityObject;
      });
  }



}

export default new MdEntityService();


