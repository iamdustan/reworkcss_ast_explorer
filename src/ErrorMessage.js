"use strict";

var React = require('react');

var ErrorMessage = React.createClass({
  render: function() {
    return <div id="Error">{this.props.message}</div>;
  }
});

module.exports = ErrorMessage;
