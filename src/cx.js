"use strict";

var cx = (o) => Object.keys(o).reduce((str, c) => str + (o[c] ? ` ${c}` : ''), '');

module.exports = cx;

