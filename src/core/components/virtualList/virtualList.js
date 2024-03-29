import  React from 'react';
import ReactDOM from 'react-dom';
import * as utils from 'core/components/virtualList/utils';

var VirtualList = React.createClass({
  propTypes: {
    items: React.PropTypes.array.isRequired,
    itemHeight: React.PropTypes.number.isRequired,
    renderItem: React.PropTypes.func.isRequired,
    container: React.PropTypes.object.isRequired,
    tagName: React.PropTypes.string.isRequired,
    scrollDelay: React.PropTypes.number,
    resizeDelay: React.PropTypes.number,
    useRAF: React.PropTypes.bool,
    itemBuffer: React.PropTypes.number,
    header: React.PropTypes.object
  },
  getDefaultProps: function() {
    return {
      container: typeof window !== 'undefined' ? window : undefined,
      tagName: 'div',
      scrollDelay: 0,
      resizeDelay: 0,
      itemBuffer: 0
    };
  },
  getVirtualState: function(props) {
    // default values
    var state = {
      items: [],
      bufferStart: 0,
      height: 0
    };

    // early return if nothing to render
    if (typeof props.container === 'undefined' || props.items.length === 0 || props.itemHeight <= 0 || !this.isMounted()) return state;

    var items = props.items;

    state.height = props.items.length * props.itemHeight;

    var container = props.container;

    var viewHeight = typeof container.innerHeight !== 'undefined' ? container.innerHeight : container.clientHeight;
    //console.log('%c virtualList viewHeight = ' + viewHeight, "background-color: yellow");

    // no space to render
    if (viewHeight <= 0) return state;

    var list = ReactDOM.findDOMNode(this);

    var offsetTop = utils.topDifference(list, container);

    var viewTop = typeof container.scrollY !== 'undefined' ? container.scrollY : container.scrollTop;

    var renderStats = VirtualList.getItems(viewTop, viewHeight, offsetTop, props.itemHeight, items.length, props.itemBuffer);

    // no items to render
    if (renderStats.itemsInView.length === 0) return state;

    state.items = items.slice(renderStats.firstItemIndex, renderStats.lastItemIndex + 1);
    state.bufferStart = renderStats.firstItemIndex * props.itemHeight;

    return state;
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    if (this.state.bufferStart !== nextState.bufferStart) {
      //console.log('state.bufferStart se lisi, returning TRUE');
      return true;
    }
    if (this.state.height !== nextState.height) {
      //console.log('state.height se lisi, returning TRUE');
      return true;
    }
    var equal = utils.areArraysEqual(this.state.items, nextState.items);
    //console.log('state.items array returning ' + !equal);
    return !equal;
  },

  componentWillReceiveProps: function(nextProps) {
    console.log('virtualList#componentWillReceiveProps %O', nextProps);
    var state = this.getVirtualState(nextProps);

    if (this.props.scrollDelay != nextProps.scrollDelay) {
      this.props.container.removeEventListener('scroll', this.onScrollDebounced);
      this.onScrollDebounced = utils.debounce(this.onScroll, nextProps.scrollDelay, false);
      nextProps.container.addEventListener('scroll', this.onScrollDebounced);
    }

    if (this.props.resizeDelay != nextProps.resizeDelay) {
      window.removeEventListener('resize', this.onResizeDebounced);
      this.onResizeDebounced = utils.debounce(this.onResize, nextProps.resizeDelay, false);
      window.addEventListener('resize', this.onResizeDebounced);
    }

    this.setState(state);
  },

  componentWillMount: function() {
    //console.log('virtualList#componentWillMount %O', this.props);
    var state = this.getVirtualState(this.props);
    this.setState(state);

    this.onScrollDebounced = utils.debounce(this.onScroll, this.props.scrollDelay, false);
    this.onResizeDebounced = utils.debounce(this.onResize, this.props.resizeDelay, false);
  },
  componentDidMount: function() {
    //console.log('virtualList#componentDidMount %O', this.props.container);
    var state = this.getVirtualState(this.props);

    this.setState(state);

    this.props.container.addEventListener('scroll', this.onScrollDebounced);

    window.addEventListener('resize', this.onResizeDebounced);

  },
  remountScroll: function(container) {  // hack kvuli remountovani pri zmene rozliseni
    console.log('remountScroll %O', container);
    container.addEventListener('scroll', this.onScrollDebounced);
  },

  componentWillUnmount: function() {
    //console.log('virtualList#componentWillUnmount %O', this.props);
    this.props.container.removeEventListener('scroll', this.onScrollDebounced);
    window.removeEventListener('resize', this.onResizeDebounced);
  },
  onScroll: function() {

    //console.log('onScroll %O', this.props.container);

    var fn = () => {
      var state = this.getVirtualState(this.props);
      this.setState(state);
      // v pripade ze je header, posuneme ho do spravne pozice
      if (this.props.header) { this.props.header.style.left = -this.props.container.scrollLeft + 'px'; }
    };

    if (this.props.useRAF) {
      window.requestAnimationFrame(fn);
    } else {
      fn();
    }
  },
  onResize: function() {
    var fn = () => {
      var state = this.getVirtualState(this.props);
      this.setState(state);
    };
    if (this.props.useRAF) {
      window.requestAnimationFrame(fn);
    } else {
      fn();
    }
  },

  // in case you need to get the currently visible items
  visibleItems: function() {
    return this.state.items;
  },
  scrollTop: function() {
    this.props.container.scrollTop = 0;
  },

  render: function() {
    //console.log("%cVirtualList#render: items.length = " + this.state.items.length, "background-color: red");
    try {
      return (
        <this.props.tagName {...this.props} style={{boxSizing: 'border-box', height: this.state.height, paddingTop: this.state.bufferStart }} >
          {this.state.items.map(this.props.renderItem)}
        </this.props.tagName>
      );
    } catch(err) {
      console.error('Error in render item: ', err);
    }
  }
});

VirtualList.getBox = function(view, list) {
  list.height = list.height || list.bottom - list.top;

  return {
    top: Math.max(0, Math.min(view.top - list.top)),
    bottom: Math.max(0, Math.min(list.height, view.bottom - list.top))
  };
};

VirtualList.getItems = function(viewTop, viewHeight, listTop, itemHeight, itemCount, itemBuffer) {
  if (itemCount === 0 || itemHeight === 0) return {
    itemsInView: 0
  };

  var listHeight = itemHeight * itemCount;

  var listBox = {
    top: listTop,
    height: listHeight,
    bottom: listTop + listHeight
  };

  var bufferHeight = itemBuffer * itemHeight;
  viewTop -= bufferHeight;
  viewHeight += bufferHeight * 2;

  var viewBox = {
    top: viewTop,
    bottom: viewTop + viewHeight
  };

  // list is below viewport
  if (viewBox.bottom < listBox.top) return {
    itemsInView: 0
  };

  // list is above viewport
  if (viewBox.top > listBox.bottom) return {
    itemsInView: 0
  };

  var listViewBox = VirtualList.getBox(viewBox, listBox);

  var firstItemIndex = Math.max(0,  Math.floor(listViewBox.top / itemHeight));
  var lastItemIndex = Math.ceil(listViewBox.bottom / itemHeight) - 1;

  var itemsInView = lastItemIndex - firstItemIndex + 1;

  var result = {
    firstItemIndex: firstItemIndex,
    lastItemIndex: lastItemIndex,
    itemsInView: itemsInView,
  };

  //console.log('VirtualList.getItems state = %O', result);
  return result;
};

export default VirtualList;
