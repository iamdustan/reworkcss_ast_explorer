"use strict";

var React = require('react');
var TokenName = require('./TokenName');
var Adapter = require('./adapters/css');

var ObjectFormatter = React.createClass({
  render: function() {
    var object = this.props.object;
    var keys = Adapter.ObjectFormatterKeys(object);

    if (keys.length === 0) {
      return <span className="p">{"{ }"}</span>;
    }
    else {
      return (
        <span>
          {object.type && <TokenName onClick={this.props.onClick} object={object} />}
          <span className="p">{" {"}</span>
          <span className="placeholder ge">{keys.join(', ')}</span>
          <span className="p">{"}"}</span>
        </span>
      );
    }
  }
});

module.exports = ObjectFormatter;
