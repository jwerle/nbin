
all: clean install test
	@:

install:
	@npm install

test:
	@./node_modules/.bin/mocha -R spec ./test.js

clean:
	@rm -rf node_modules/

.PHONY: test