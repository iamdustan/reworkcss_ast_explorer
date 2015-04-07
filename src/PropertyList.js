"use strict";
var React = require('react');

var PropertyList = React.createClass({
  getDefaultProps: function() {
    return {
      object: {},
      deepOpen: false
    };
  },

  render: function() {
    var Element = require('./Element');
    var focusPath = this.props.focusPath;
    var level = this.props.level;

    var properties = Object.keys(this.props.object).map(key => {
      if (key === 'range') return;
      var v = this.props.object[key];
      return (
        <Element
          key={key}
          name={key}
          focusPath={focusPath}
          deepOpen={this.props.deepOpen}
          value={v}
          level={level}
        />
      );
    });
    return <ul className="value-body">{properties}</ul>;
  }
});

module.exports = PropertyList;
