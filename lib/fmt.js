'use strict';



var modifiers = {
  dev: function(s) {
    return s.replace(/\n/g, '\\n');
  }
};




/**
 * Simple string substution function.
 *
 *   fmt('x={0}, y={1}', 12, 4) -> 'x=12, y=4'
 *   fmt('x={x}, y={y}', { x: 12, y: 4 }) -> 'x=12, y=4'
 *   fmt('x={x}, y={{moo}}', { x: 12, y: 4 }) -> 'x=12, y={moo}'
 *   fmt('{x}: {y.thing}', { x: 'foo', y: { thing: 'bar' }}) -> 'foo: bar'
 *   fmt('{x}: {y.a[1]}', { x: 'foo', y: { thing: 'bar', a: [6, 7] }}) -> 'foo: 7'
 *   fmt('{0[2]}, {0[-2]}', [{ x: 12, y: 4 }, 7, 120, 777, 999]) -> '120, 777'
 *   fmt('{0[-5].y}', [{ x: 12, y: 4 }, 7, 120, 777, 999]) -> '4'
 *   fmt('{a[-5].x}', {a: [{ x: 12, y: 4 }, 7, 120, 777, 999]}) -> '12'
 *
 * @param {String} format
 * @param {Object|Object+} data
 * @return {String}
 */
var fmt = exports.fmt = function(format, data) {
  data = arguments.length === 2 && typeof data === 'object' && data.constructor !== Array
    ? data
    : [].slice.call(arguments, 1);

  return format
    .replace(/\{\{/g, String.fromCharCode(0))
    .replace(/\}\}/g, String.fromCharCode(1))
    .replace(/\{([^}]+)\}/g, function(match, path) {
      try {
        var p = path.replace(/\[(-?\w+)\]/g, '.$1').split('.');
        //console.log('path="%s" (%s), data=%s', path, p.toSource(), data.toSource());
        return String(p.reduce(function(o, n) {
          return o.slice && !isNaN(n) ? o.slice(n).shift() :  o[n];
        }, data));
      }
      catch (ex) {
        return match;
      }
    })
    .replace(/\x00/g, '{')
    .replace(/\x01/g, '}');
};
