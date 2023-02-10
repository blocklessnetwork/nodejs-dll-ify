"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CGIExtension = void 0;
/**
 * CGI Extension Wrapper
 */
class CGIExtension {
    constructor(info) {
        // Store all method references
        this.methods = {};
        this.name = info.name;
        this.alias = info.alias;
        this.description = info.description;
    }
    export(method, fn) {
        this.methods[method] = fn;
    }
    verify() {
        const encoder = new TextEncoder();
        return encoder.encode(JSON.stringify({
            alias: this.alias,
            name: this.name,
            description: this.description,
            is_cgi: true,
        }));
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.argv.indexOf("--ext_verify") !== -1) {
                process.stdout.write(this.verify());
            }
            else {
                const encoder = new TextEncoder();
                const decoder = new TextDecoder();
                process.stdin.on("data", (chunk) => __awaiter(this, void 0, void 0, function* () {
                    const chunkStr = decoder.decode(chunk);
                    const [_len, body] = chunkStr.split("\r\n");
                    const request = JSON.parse(body);
                    let response = "";
                    if (request && request.method && !!this.methods[request.method]) {
                        try {
                            response =
                                (yield this.methods[request.method](...request.parameters))
                                    .toString();
                        }
                        catch (error) {
                            response = error.message;
                        }
                    }
                    else {
                        response = "Invalid command.";
                    }
                    process.stdout.write(encoder.encode(response));
                }));
            }
        });
    }
}
exports.CGIExtension = CGIExtension;
