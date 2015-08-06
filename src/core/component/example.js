import React from 'react';
import connectToStores from 'alt/utils/connectToStores';
import DummyStore from 'core/store/dummyStore';
import DummyActions from 'core/action/dummyActions';

@connectToStores
class Example extends React.Component {

  state = {
    name: this.props.name
  };


  static getStores(props) {
    return [DummyStore];
  }

  static getPropsFromStores(props) {
    return DummyStore.getState();
  }

  render() {
    return (
      <div>
        <input type="text" value={this.state.name} onChange={this.onChange}/>
        <h1>It works: {this.props.name}</h1>
      </div>
    );
  }

  onChange = evt => {
    this.setState({name: evt.target.value});
    DummyActions.updateName(evt.target.value);
  }
}

export default Example;
