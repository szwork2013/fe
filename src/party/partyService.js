import Axios from 'core/common/config/axios-config';


class PartyService  {


  readParty(partyId) {
    return Axios.get('/party/' + partyId)
      .then(response => response.data);
  }


}

export default new PartyService();

