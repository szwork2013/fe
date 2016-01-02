import Axios from 'core/common/config/axios-config';


class PartyService  {


  readParty(partyId) {
    return Axios.get('/party/' + partyId)
      .then(response => response.data);
  }



  addressLine(address, countryEntity) {

    let numbers = "";
    if (address.descriptiveNumber && address.orientationalNumber) {
      numbers = address.descriptiveNumber + '/' + address.orientationalNumber;
    } else if (address.descriptiveNumber) {
      numbers = address.descriptiveNumber;
    } else if (address.orientationalNumber) {
      numbers = address.orientationalNumber;
    }

    return address.street + ((numbers)?' ' + numbers : '')
      + ((address.city || address.zip)? ',' : '')
      + ((address.city)? ' ' + address.city : '')
      + ((address.zip)? ' ' + address.zip : '')
      + ((address.country)? ', ' + countryEntity.getLovItem(address.country).label : '');
  }

  /**
   * spec :  {ico: 456456}, {birthNumber: 346456456}, {ico: 456456, birthNumber: 346456456}
   * @param spec
   * @returns {*}
     */
  partyExist(spec) {
    return Axios.get('/party/party-exist', {params:spec})
      .then(response => response.data);
  }

  partySave(party) {
    return Axios.post('/party', party)
    .then((response) => response.data);
  }


}

export default new PartyService();

