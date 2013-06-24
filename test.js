
var nbin = require('./')
	, assert = require('assert')
	, Stream = require('stream').Stream
	, fs = require('fs')

describe('nbin(dir)', function () {
	var samplebin = [__dirname, 'node_modules', '.bin', 'testbin'].join('/')
	// create an empty bin
	before(function () {
		fs.closeSync(fs.openSync(samplebin, 'w+', '0777'))

		fs.writeFileSync(samplebin, [
			'echo "starting sample bin"',
			'echo "sample bin"',
			'exit 0'
		].join('\n'));
	});

	it("should accept a valid module directory and read from the `./node_modules/.bin` directory", function () {
		
		assert(nbin(__dirname).bins.length);

	});

	describe('nbin(dir).exec(bin)', function () {
		it("should execute a given `bin` and return a stream", function (done) {
			var stream = nbin(__dirname).exec('testbin')
			assert(stream instanceof Stream);
			stream.on('data', function (chunk) {
				assert(chunk)
				done();
			});

			stream.on('error', done);
		});
	});

	// destroy the empty bin
	after(function () {
		fs.unlinkSync(samplebin);
	});
});