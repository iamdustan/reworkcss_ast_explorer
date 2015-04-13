
module.exports = {
  getRange(node) {
    var {position} = node;
    if (!position) return;

    return [
      {line: position.start.line, ch: position.end.column},
      {line: position.end.line, ch: position.end.column},
    ]
  },

  ObjectFormatterKeys(object) {
    return Object.keys(object).filter(k => k !== 'range');
  }
};


