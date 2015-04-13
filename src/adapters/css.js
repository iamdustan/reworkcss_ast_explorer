
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
    return Object.keys(object).filter(k => k !== 'position');
  },

  indexFromPos(pos, doc) {
    if (!doc) return - 1;
    if (!doc.indexFromPos) return -1;
    if (typeof pos.line === 'undefined' ||
        typeof pos.column === 'undefined') return -1;

    return doc.indexFromPos({
      line: pos.line - 1,
      ch: pos.column - 1,
    });
  }
};

