.PHONEY: build
build:
	cd node-app && yarn && yarn build
	cd go-wrapper && go build -buildmode=c-shared -o ../build/litsdk.so

.PHONEY: wrapper
wrapper:
	rm -rf build/
	cd go-wrapper && go build -buildmode=c-shared -o ../build/litsdk.so

.PHONEY: clean
clean:
	rm -rf go-wrapper/build
	rm -rf build/

.PHONEY: all
all: clean build