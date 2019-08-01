# makefile just to lint the code
.PHONY: lint run

lint:
	@eslint --version > /dev/null || (echo "please run npm install -g eslint"; exit 1)
	eslint js/

run:
	@python -m SimpleHTTPServer
