import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import When from 'when';
import { connect } from 'react-redux';
import { FlatButton, Styles} from 'material-ui';

import PageAncestor from 'core/common/page/pageAncestor';
import Toolmenu from 'core/components/toolmenu/toolmenu';
import {store} from 'core/common/redux/store';
import MdEntityService from 'core/metamodel/mdEntityService';
import ProductService from 'product/productService';
import {setProductAction} from 'product/productActions';



function mapStateToProps(state) {
  return {
    productObject: state.getIn(['product', 'productObject']),
    entities: state.getIn(['metamodel', 'entities'])
  };
}


@connect(mapStateToProps, {setProductAction})
export default class ProductDetail extends PageAncestor {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  static title = 'Product';
  static icon = 'cube';

  static contextTypes = {
    router: React.PropTypes.func.isRequired
  };

  static fetchData(routerParams, query) {
    console.log("ProductDetail#fetchData()");

    return MdEntityService.fetchEntityMetadata(['Product'])
      .then((entityMap) => {
        var promise = (routerParams.id === 'new') ? When(Object.assign({}, query)) : ProductService.readProduct(routerParams.id);
        return promise.then(productObject => store.dispatch(setProductAction(productObject)));
      });
  }

  onSave = (evt) => {
    console.log('onSave');
  };
  onDelete = (evt) => {
    console.log('onDelete');
  };
  onBack = (evt) => {
    console.log('onBack');
    this.context.router.goBack();
  };



  render() {

    const {
      productObject,
      entities,
      setProductAction
      } = this.props;

    const propsForCreateForm = {dataObject: productObject, entity: entities.get('Product'), entities, setDataAction: setProductAction};

    return (

      <main className="main-content">
        {this._createToolMenu(invoiceObject)}
        <form style={{marginTop: 10}}>
          <div className="row">
            <div className="col-xs-12">
                TODO
            </div>
          </div>
        </form>




      </main>

    );
  }



  _createToolMenu(productObject) {
    return (
      <Toolmenu>
          <FlatButton onClick={this.onSave}>
            <span className="fa fa-save"/><span> Save Invoice</span>
          </FlatButton>
        { (productObject.productId > 0) ? (
          <FlatButton onClick={this.onDelete}>
            <span className="fa fa-trash"/><span> Delete Invoice</span>
          </FlatButton>
        ) : <div/>}
        <FlatButton onClick={this.onBack}>
          <span className="fa fa-chevron-left"/><span> Back</span>
        </FlatButton>
      </Toolmenu>
    );
  }


}

