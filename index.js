

/**
 * module dependencies
 */

var fs = require('fs')
  , exec = require('child_process').exec
  , isArray = Array.isArray
  , Writable = require('stream').Writable


/**
 * checks if path is a directory
 *
 * @api private
 * @param {String} filepath
 */

function isDirectory (filepath) {
  return fs.statSync(filepath).isDirectory();
}


/**
 * checks if path is a file
 *
 * @api private
 * @param {String} filepath
 */

function isFile (filepath) {
  try {
    if (!isDirectory(filepath) && fs.existsSync(filepath)) {
      return true;
    }
  } catch (e) { return false; }
  return false;
}


/**
 * executes a bin found in the
 * relative `node_modules/.bin` directory
 *
 * @api public
 * @param {String} dir
 */

module.exports = nbin;
module.exports.nbin = nbin;
function nbin (dir) {
  if (!isDirectory(dir)) throw new Error("invalid directory");
  else if (!isDirectory([dir, 'node_modules'].join('/'))) throw new Error("failed to find `node_modules` directory");

  return {
    bins: nbin.bins(dir),
    exec: function (bin, args) {
      return nbin.exec(dir, bin, args);
    }
  }
}


/**
 * returns an array of bins
 *
 * @api public
 * @param {String} dir
 */

nbin.bins = function (dir) {
  var bins = [dir, 'node_modules', '.bin'].join('/');
  if (isDirectory(bins)) return fs.readdirSync(bins);
  else return [];
}


/**
 * executes a given bin within a provided node module
 * directory with arguments
 *
 * @api public
 * @param {String} dir
 * @param {String} bin
 * @param {Array} args - optional
 */

nbin.exec = function (dir, bin, args) {
  var binpath = [dir, 'node_modules', '.bin', bin].join('/')
  if (!isFile(binpath)) throw new Error("invalid `bin` file");
  args = isArray(args)? args : ('string' === typeof args)? [args] : [];
  binpath = binpath.replace(/(\s)/, "\\ ");
  var cmd = [binpath].concat(args).join(' ')
  var child = exec(cmd, function (err) {
    if (err) child.stdout.emit('error', err);
  });
  return child.stdout;
}
