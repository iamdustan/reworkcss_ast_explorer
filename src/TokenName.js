"use strict";

var React = require('react');

var TokenName = React.createClass({
  render: function() {
    return (
      <span className="tokenName nc" onClick={this.props.onClick}>
        {this.props.object.type}
      </span>
    );
  }
});

module.exports = TokenName;
