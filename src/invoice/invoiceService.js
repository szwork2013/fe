import Axios from 'core/common/config/axios-config';


class InvoiceService  {


  readInvoice(invoiceId) {
    return Axios.get('/invoice/' + invoiceId)
      .then(response => response.data);
  }


}

export default new InvoiceService();

