import Axios from 'core/common/config/axios-config';
import When from 'when';

import MdEntityActions from 'core/metamodel/mdEntityActions';
import MdEntity from 'core/metamodel/mdEntity';
import MdField from 'core/metamodel/mdField';

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
            entity.__proto__ = MdEntity.prototype;

            for(let fieldName in entity.fields) {
              let field = entity.fields[fieldName];
              field.__proto__ = MdField.prototype;
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


