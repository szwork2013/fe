import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {TextField, FlatButton, Styles, FontIcon, Dialog} from 'material-ui';
import When from 'when';

import BlockComp from 'core/components/blockComp/blockComp';
import {FieldText} from 'core/form/formUtils';
import {customizeTheme}  from 'core/common/config/mui-theme';
import GridService from 'core/grid/gridService';
import PartyService from 'party/partyService';
import CommonService from 'core/common/service/commonService';
import Grid from 'core/grid/domain/grid';
import GridComp from 'core/grid/component/gridComp';
import {preSave} from 'core/form/formUtils';
import PartyFoForm from 'party/component/partyFoForm';
import MdEntityService from 'core/metamodel/mdEntityService';

const Colors = Styles.Colors;
const partySearchGridLocation = 'partySearch';

export default class PartySelector extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  static contextTypes = {
    muiTheme: React.PropTypes.object
  };

  static propTypes = {
    entities: React.PropTypes.object.isRequired,
    partyObject: React.PropTypes.object,
    dataObject: React.PropTypes.object,
    partyEntity: React.PropTypes.object.isRequired,
    setDataAction: React.PropTypes.func.isRequired,
    onPartyChange: React.PropTypes.func.isRequired,
    newPartyTemplate: React.PropTypes.object.isRequired
  };


  onSearch = (e) => {
    e.preventDefault();
    console.log('onSearch');

    let {dataObject, setDataAction, onPartyChange} = this.props;

    dataObject.$partySelector.notFound = undefined;

    let gridPromise;
    if (dataObject.$partySelector.grid) {
      gridPromise = When(dataObject.$partySelector.grid);
    } else {
      gridPromise = GridService.fetchGrids(partySearchGridLocation)
        .then(gridMap => {
          dataObject.$partySelector.grid = Grid.clone(gridMap.get(partySearchGridLocation));
          return dataObject.$partySelector.grid;
        });
    }

    gridPromise
      .then(grid => {
        console.log('onSearch %O', grid);
        grid.activeGridConfig = grid.getActiveGridConfig();
        grid.searchTerm = dataObject.$partySelector.searchTerm;
        return GridService.search(grid);
      })
      .then(grid => {
        let dataLength = grid.data.rows.length;
        if (dataLength === 0) {
          dataObject.$partySelector.notFound = 'No party found';
          setDataAction(dataObject);
        } else if (dataLength === 1) {
          onPartyChange(this.createPartyObject(grid, 0));
        } else {
          dataObject.$partySelector.searchDialogOpened = true;
          setDataAction(dataObject);
        }

      })


  };

  selectParty = (partyId, index) => {
    console.log('selectParty %s .. %s', partyId, index);
    let {onPartyChange, dataObject} = this.props;
    dataObject.$partySelector.searchDialogOpened = false;
    if (index === -1) {
      onPartyChange(undefined);
    } else {
      let partyObject = this.createPartyObject(dataObject.$partySelector.grid, index);
      onPartyChange(partyObject);
    }
  };

  updateGrid = (grid) => {
    let {dataObject, setDataAction} = this.props;
    dataObject.$partySelector.grid = Grid.clone(grid);
    //dataObject.$partySelector.searchTerm = grid.searchTerm;
    setDataAction(dataObject);
  };


  onNew = (e) => {
    console.log('onNew');
    let {dataObject, setDataAction, onPartyChange, newPartyTemplate} = this.props;

    MdEntityService.fetchEntityMetadata(['Party'])
    .then(entityMap => {
      dataObject.$partySelector.newDialogOpened = true;
      dataObject.$partySelector.newParty = Object.assign({$new: true}, newPartyTemplate);
      setDataAction(dataObject);
    });

  };

  cancelNewParty = () => {
    let {dataObject, setDataAction, onPartyChange} = this.props;
    dataObject.$partySelector.newDialogOpened = false;
    setDataAction(dataObject);
  };

  saveNewParty = () => {
    let {dataObject, setDataAction, onPartyChange} = this.props;


    let result = preSave(dataObject.$partySelector.newParty, null);
    if (!result) {
      setDataAction(dataObject);
      return;
    }

    CommonService.loading(true);
    PartyService.partySave(dataObject.$partySelector.newParty)
      .then( (partyId) => {

        let partyObject = dataObject.$partySelector.newParty;
        partyObject.partyId = partyId;
        partyObject.$new = undefined;
        dataObject.$partySelector.newParty = undefined;

        dataObject.$partySelector.newDialogOpened = false;
        CommonService.loading(false);

        onPartyChange(partyObject);

        CommonService.toastSuccess("Party " + partyObject.fullName + " byl úspěšně uložen");

      });


  };

  render() {

    let {partyObject, partyEntity, setDataAction, dataObject, onPartyChange, entities} = this.props;

    console.log('%c partySelector render: partyObject = %O', 'background-color: yellow', partyObject);
    let searchForm = () => (
      <form onSubmit={this.onSearch}>
        <TextField hintText="Search party..." style={{fontSize: 14, height: 54, width: 140}}
                   onChange={(e) => {dataObject.$partySelector.searchTerm = e.target.value; setDataAction(dataObject);}}/>
        <FlatButton type="submit" secondary={true} label="Search" labelPosition="after" labelStyle={{paddingLeft: 8}}
                    style={{paddingLeft: 10, marginLeft: 5}}>
          <FontIcon className="fa fa-search" style={{fontSize:14, color: Colors.indigo500}}/>
        </FlatButton>
        <FlatButton onClick={this.onNew} secondary={true} label="New" labelPosition="after"
                    labelStyle={{paddingLeft: 8}} style={{paddingLeft: 5}}>
          <FontIcon className="fa fa-file-o" style={{fontSize:14, color: Colors.indigo500}}/>
        </FlatButton>
        { (dataObject.$partySelector.notFound) ? (<div style={{display: 'block', color: Colors.red500}}>{dataObject.$partySelector.notFound}</div>) : ''}
      </form>
    );

    let partyText = () => (
      <div style={{display: 'flex', alignItems: 'baseline' }}>
        <div style={{fontSize: '18px', fontWeight: 'bold', marginRight: 8}}>{partyObject.fullName}</div>
        <FieldText label={partyEntity.fields.ico.label} value={partyObject.ico}/>
        <FieldText label={partyEntity.fields.birthNumber.label} value={partyObject.birthNumber}/>
        <FlatButton onClick={onPartyChange.bind(this, undefined)} secondary={true} label="Disconnect" labelPosition="after"
                    labelStyle={{paddingLeft: 8}} style={{paddingLeft: 10, marginLeft: 10}}>
          <FontIcon className="fa fa-chain-broken" style={{fontSize:14, color: Colors.indigo500}}/>
        </FlatButton>
      </div>
    );


    return (
      <div>
        {(partyObject) ? partyText() : searchForm() }
        { (dataObject.$partySelector.searchDialogOpened) ? (
          <Dialog
            title="Found parties" bodyStyle={{display: 'flex', flexDirection: 'column'}}
            actions={this._searchDialogActions()}
            modal={true}
            open={dataObject.$partySelector.searchDialogOpened}>
            <GridComp ref={dataObject.$partySelector.grid.gridLocation} grid={dataObject.$partySelector.grid} multiSelect={false}
                      uiLocation="dialog" bodyStyle={{paddingBottom: 7}} updateGrid={this.updateGrid} functionMap={{chooseParty: this.selectParty.bind(this)}} />
          </Dialog>
        ) : ''}
        { (dataObject.$partySelector.newDialogOpened) ? (
          <Dialog
            title="New party"
            actions={this._newDialogActions()}
            modal={true}
            open={dataObject.$partySelector.newDialogOpened}>
            <PartyFoForm dataObject={dataObject.$partySelector.newParty} rootObject={dataObject} entity={partyEntity} entities={entities} setDataAction={setDataAction} />;
          </Dialog>
        ) : ''}
      </div>
    );
  }

  createPartyObject(grid, index) {
    return {
      partyId: this.getGridFieldValue(grid, index, 'partyId'),
      fullName: this.getGridFieldValue(grid, index, 'fullName'),
      ico: this.getGridFieldValue(grid, index, 'ico'),
      birthNumber: this.getGridFieldValue(grid, index, 'birthNumber')
    }
  }

  getGridFieldValue(grid, index, fieldName) {
    let fieldIndex = grid.activeGridConfig.$columnRefs.findIndex(mdField => mdField.fieldName === fieldName);
    let rows = grid.data.rows;
    if (fieldIndex >= 0 && rows.length > index) {
      return rows[index].cells[fieldIndex].value;
    } else {
      return undefined;
    }
  }

  _searchDialogActions() {
    return [
      <FlatButton
        label="Cancel"
        secondary={true}
        onClick={this.selectParty.bind(this, null, -1)} />
    ];
  }



  _newDialogActions() {
    return [
      <FlatButton
        label="Cancel"
        secondary={true}
        onClick={this.cancelNewParty} />,
      <FlatButton
        label="Save"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.saveNewParty} />
    ];
  }
}
