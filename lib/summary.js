'use strict';

var chalk = require('chalk');
var Table = require('cli-table');


var defaultOptions = {
  verbose: false,
  statistics: false,
  unicode: process.platform  !== 'win32',
  positionCol: 'gray',
  reasonCol: 'cyan',
  codeCol: 'gray',
  fileCol: 'yellow,bold',
  errorsCol: 'red,bold',
  okCol: 'green'
};

var tableChars = {
  'top': '' ,
  'top-mid': '' ,
  'top-left': '' ,
  'top-right': '',
  'bottom': '' ,
  'bottom-mid': '' ,
  'bottom-left': '' ,
  'bottom-right': '',
  'left': '  ',
  'left-mid': '',
  'mid': '',
  'mid-mid': '',
  'right-mid': '',
  'right': '',
  'middle': ' '
};


function paint(opt, text) {
  var chalkFn = opt.split(',').reduce(function(dest, src) {
    return typeof dest[src] === 'function' ? dest[src] : dest;
  }, chalk);

  return chalkFn === chalk ? text : chalkFn(text);
}


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
    var lines = [];
    var table;

    // Issues found.
    result.forEach(function(item) {
      if (item.file !== prevfile) {
        if (table) {
          lines.push(table.toString());
        }

        lines.push('\n' + paint(options.fileCol, item.file) + '\n');

        table = new Table({
          chars: tableChars,
          style : {
            compact : true,
            'padding-left' : 0
          }
        });

        prevfile = item.file;
      }

      var err = item.error;
      var line = [
        paint(options.positionCol, 'Line ' + err.line + ', Col ' + err.character),
        paint(options.reasonCol, err.reason)
      ];

      if (options.verbose) {
        line.push(paint(options.codeCol, err.code));
      }

      table.push(line);
    });

    if (table) {
      lines.push(table.toString());
    }

    lines.push('');

    // Various code statistics.
    if (options.statistics) {
      data.forEach(function(data) {
        if (data.implieds || data.unused) {
          lines.push('\n' + paint(options.fileCol, data.file) + '\n');

          table = new Table({
            chars: tableChars,
            style : {
              compact : true,
              'padding-left' : 0
            }
          });

          if (data.implieds) {
            table.push({
              'Implied globals:': [data.implieds.map(function (global) {
                return global.name  + ': ' + global.line;
              }).join(', ')]
            });
          }

          if (data.unused) {
            table.push({
              'Unused variables:': [data.unused.map(function (unused) {
                return unused.name  + ': ' + unused.line;
              }).join(', ')]
            });
          }

          lines.push(table.toString() + '\n');
        }
      });
    }

    // Final summary line
    if (result.length > 0) {
      lines.push(paint(options.errorsCol, '  ' + (options.unicode ? '✖ ' : '') + result.length + ' problem' + (result.length === 1 ? '' : 's')));
    }
    else {
      lines.push(paint(options.okCol, '  ' + (options.unicode ? '✔ ' : '') + 'No problems'));
    }

    lines.push('');

    console.log(lines.join('\n'));
  };

  reporter.options = options;

  // JSHint reporters export an object with a single key called `reporter`.
  return {
    reporter: reporter,
    options: options
  };
};