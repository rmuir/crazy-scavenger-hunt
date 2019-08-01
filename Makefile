# makefile just to lint the code
.PHONY: lint

lint:
	@eslint --version > /dev/null || (echo "please run npm install -g eslint"; exit 1)
	eslint js/
