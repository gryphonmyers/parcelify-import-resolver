var resolve = require('resolve');
var through = require('through');
var path    = require('path');
var _ = require('lodash');
module.exports = function (file, options) {
    options = options || {};
    if (options.browserifyInstance) {
        options = _.defaults(options, _.pick(options.browserifyInstance._options, ['paths']));
    }
  var transform = function (buffer) {
    var self = this;
    var content = buffer.toString('utf8');

    content = content.replace(/!resolve\((.*?)\)/g, function (match, path) {
      try {
        return resolve.sync(path, options);
      } catch (e) {
        return self.emit(
          'error',
          new Error(
            'Could not resolve "' + path + '" in file "' + file + '": '
          )
        );
      }
    });

    this.push(new Buffer(content, 'utf8'));
  };

  var flush = function () {
    this.push(null);
  };

  return through(transform, flush);

};
