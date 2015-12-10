import Axios from 'core/common/config/axios-config';


class ProductService  {


  readProduct(productId) {
    return Axios.get('/product/' + productId)
      .then(response => response.data);
  }


}

export default new ProductService();

