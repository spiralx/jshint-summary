'use strict';

var wordwrap = require('wordwrap');
var utils = require('./utilfuncs');


var symbols = {
  tick: '√',
  cross: '×'
}

var defaultOptions = {
  verbose: true,
  statistics: false,
  width: 120,
  wordWrap: false,
  fileCol: 'yellow,bold',
  positionCol: 'white',
  reasonCol: 'cyan,bold',
  codeCol: 'green',
  errorsCol: 'red,bold',
  okCol: 'green',
  labelCol: 'green',
  variableCol: 'white,bold'
};



module.exports = function(options) {

  // Merge passed options into defaults.
  options = [defaultOptions, options].reduce(function(dest, src) {
    if (src) {
      for (var k in src) {
        dest[k] = src[k];
      }
    }
    return dest;
  }, {});


  var reporter = function(result, data, jshintOptions) {
    jshintOptions = jshintOptions || {};

    var prevfile;
    var fileCount = 0;
    var lines = [];
    var table;

    var wordwrapper = options.wordWrap ? wordwrap(0, options.width) : function(s) { return s };

    // console.dir(result);
    // console.dir(data[0].functions);

    // Issues found.
    result.forEach(function(item) {
      if (item.file !== prevfile) {
        if (table) {
          lines.push(table.toString());
        }

        lines.push('\n' + utils.paint(options.fileCol, item.file));

        table = utils.createTable(options);
        prevfile = item.file;
        fileCount += 1;
      }

      var err = item.error;
      var line = [
        utils.paint(options.codeCol, err.code),
        utils.paint(options.positionCol, 'Line ' + err.line + ', Col ' + err.character),
        utils.paint(options.reasonCol, err.reason)
      ];

      table.push(line);
    });

    if (table) {
      lines.push(wordwrapper(table.toString()));
    }

    lines.push('');

    // Final summary line
    if (result.length > 0) {
      var summ = [symbols.cross, result.length, utils.pluralise('problem', result.length),
        'in', fileCount, utils.pluralise('file', fileCount)];

      lines.push(utils.paint(options.errorsCol, '  ' + summ.join(' ')));
    }
    else {
      lines.push(utils.paint(options.okCol, '  ' + symbols.tick + ' No problems'));
    }

    lines.push('');

    // Various code statistics.
    if (options.statistics) {
      data.forEach(function(data) {
        if (data.implieds || data.unused || data.globals) {
          lines.push('\n' + utils.paint(options.fileCol, data.file));

          table = utils.createTable(options);

          var varBrush = utils.paintbrush(options.variableCol);

          if (data.globals) {
            table.push({
              'Module globals:': varBrush(data.globals.sort().join(', '))
            });
          }

          if (data.implieds) {
            table.push({
              'Implied globals:': data.implieds.map(function (global) {
                return varBrush(global.name)  + ' @ line ' + global.line;
              }).join(', ')
            });
          }

          if (data.unused) {
            table.push({
              'Unused variables:': data.unused.map(function (unused) {
                return varBrush(unused.name)  + ' @ line ' + unused.line;
              }).join(', ')
            });
          }

          lines.push(wordwrapper(table.toString()) + '\n');
        }
      });
    }

    console.log(lines.join('\n'));
  };

  reporter.options = options;

  // JSHint reporters export an object with a single key called `reporter`.
  return {
    reporter: reporter,
    options: options
  };
};
