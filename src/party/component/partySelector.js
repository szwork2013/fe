import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {TextField, FlatButton, Styles, FontIcon} from 'material-ui';
import When from 'when';

import BlockComp from 'core/components/blockComp/blockComp';
import {FieldText} from 'core/form/formUtils';
import {customizeTheme}  from 'core/common/config/mui-theme';
import GridService from 'core/grid/gridService';
import Grid from 'core/grid/domain/grid';

const Colors = Styles.Colors;
const partySearchGridLocation = 'partySearch';

export default class PartySelector extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  static contextTypes = {
    muiTheme: React.PropTypes.object
  };

  static propTypes = {
    partyObject: React.PropTypes.object,
    dataObject: React.PropTypes.object,
    partyEntity: React.PropTypes.object.isRequired,
    onDisconnect: React.PropTypes.func,
    setDataAction: React.PropTypes.func.isRequired
  };


  XcomponentWillMount() {
    customizeTheme(this.context.muiTheme, {
      flatButton: {
        color: Colors.transparent
      }
    });
  }


  onSearch = (e) => {
    e.preventDefault();
    console.log('onSearch');

    let {dataObject, setDataAction} = this.props;

    let gridPromise;
    if (dataObject.$partySelector.grid) {
      gridPromise = When(dataObject.$partySelector.grid);
    } else {
      gridPromise = GridService.fetchGrids(partySearchGridLocation)
      .then(grid => Grid.clone(grid));
    }

    gridPromise.then(grid => {
        grid.searchTerm = dataObject.$partySelector.searchTerm;
        GridService.search(grid)
          .then(grid => {
            setDataAction(dataObject);
          })
      });

  };

  onNew = (e) => {
    console.log('onNew');
  };

  //onDisconnect = (e) => {
  //  console.log('onDisconnect');
  //};


  render() {

    let {partyObject, partyEntity, setDataAction, dataObject} = this.props;


    let searchForm = () => (
      <form onSubmit={this.onSearch}>
        <TextField hintText="Search party..."
                   onChange={(e) => {dataObject.$partySelector.searchTerm = e.target.value; setDataAction(dataObject);}}/>
        <FlatButton type="submit" secondary={true} label="Search" labelPosition="after" labelStyle={{paddingLeft: 8}}
                    style={{paddingLeft: 10, marginLeft: 5}}>
          <FontIcon className="fa fa-search" style={{fontSize:14, color: Colors.indigo500}}/>
        </FlatButton>
        <FlatButton onClick={this.onNew} secondary={true} label="New" labelPosition="after"
                    labelStyle={{paddingLeft: 8}} style={{paddingLeft: 5}}>
          <FontIcon className="fa fa-file-o" style={{fontSize:14, color: Colors.indigo500}}/>
        </FlatButton>

      </form>
    );

    let partyText = () => (
      <div style={{display: 'flex', alignItems: 'baseline' }}>
        <div style={{fontSize: '18px', fontWeight: 'bold'}}>{partyObject.fullName}</div>
        <FieldText label={partyEntity.fields.ico.label} value={partyObject.ico}/>
        <FieldText label={partyEntity.fields.birthNumber.label} value={partyObject.birthNumber}/>
        <FlatButton onClick={this.props.onDisconnect} secondary={true} label="Disconnect" labelPosition="after"
                    labelStyle={{paddingLeft: 8}} style={{paddingLeft: 10, marginLeft: 10}}>
          <FontIcon className="fa fa-chain-broken" style={{fontSize:14, color: Colors.indigo500}}/>
        </FlatButton>
      </div>
    );


    return (
      <div>
        {(partyObject) ? partyText() : searchForm() }
      </div>
    );
  }
}
