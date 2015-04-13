"use strict";

var React = require('react');

var css = require('css');

var indexOf = (a, b) => {
  for (var i = 0; i < a.length; i++)
    if (a[i] === b) return i;
  return -1
};

var PasteDropTarget = React.createClass({
  propTypes: {
    dropindiciator: React.PropTypes.element,
    onText: React.PropTypes.func,
    onError: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      dragging: false
    };
  },

  componentDidMount: function() {
    this._listeners = [];
    var target = this.refs.container.getDOMNode();

    // Handle pastes
    this._bindListener(document, 'paste', event => {
      if (!event.clipboardData) {
        // No browser support? :(
        return;
      }
      var cbdata = event.clipboardData;

      // Plain text
      if (indexOf(cbdata.types, 'text/plain') > -1) {
        try {
          if (this.props.onText) {
            var code = this._jsonToCode(cbdata.getData('text/plain'));
            event.stopPropagation();
            event.preventDefault();
            this.props.onText('paste', event, code);
          }
        }
        catch(ex) {
          if (event.target.nodeName !== 'TEXTAREA') {
            this.props.onError && this.props.onError(
              'paste',
              event,
              'Cannot process pasted AST: ' + ex.message
            );
            throw ex;
          }
        }
      }
    }, true);

    var acceptedFileTypes = {
      'text/css': true,
      'text/javascript': true,
      'application/json': true,
      'text/plain': true
    };

    var timer;

    // Handle file drops
    this._bindListener(target, 'dragenter', event => {
      clearTimeout(timer);
      event.preventDefault();
      this.setState({dragging: true});
    }, true);

    this._bindListener(target, 'dragover', event => {
      clearTimeout(timer);
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    }, true);

    this._bindListener(target, 'drop', event => {
      this.setState({dragging: false});
      var files = event.dataTransfer.files;
      var type = files[0].type;
      if (!acceptedFileTypes[type] || !this.props.onText) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      var reader = new FileReader();
      reader.onload = event => {
        var text = event.target.result;
        switch (type) {
          case 'text/css':
            this.props.onText('drop', event, text);
            break;
          case 'text/javascipt':
            this.props.onText('drop', event, text);
            break;
          case 'application/json':
            try {
              this.props.onText('drop', event, this._jsonToCode(text));
            }
            catch(ex) {
              this.props.onError && this.props.onError(
                'drop',
                event,
                'Unable to handle dropped file: ' + ex.message
              );
              throw ex;
            }
            break;
          default:
            // JSON AST ?
            try {
              text = this._jsonToCode(text);
            }
            catch(ex) { /* swallow exception */}
            finally {
              this.props.onText('drop', event, text);
            }
            break;
        }
      };
      reader.readAsText(files[0]);
    }, true);

    this._bindListener(target, 'dragleave', event => {
      clearTimeout(timer);
      timer = setTimeout(() => this.setState({dragging: false}), 50);
    }, true);
  },

  componentWillUnmount: function() {
    for (var i = 0; i < this._listeners.length; i+= 4) {
      var [elem, event, listener, capture] = this._listeners[i];
      elem.removeEventListener(event, listener, capture);
    }
    this._listeners = null;
  },

  _jsonToCode: function(json) {
    var ast = JSON.parse(json);
    return css.stringify(ast, {format: {indent: {style: '  '}}}).code;
  },

  _bindListener: function(elem, event, listener, capture) {
    event.split(/\s+/).forEach(e => {
      elem.addEventListener(e, listener, capture);
      this._listeners.push(elem, listener, capture);
    });
  },

  render: function() {
    var {children, dropindicator, ...props} = this.props;
    if (!this.state.dragging) {
      dropindicator = null;
    }
    return (
      <div
        ref="container"
        {...props}>
        {dropindicator}
        {children}
      </div>
    );
  }
});

module.exports = PasteDropTarget;
