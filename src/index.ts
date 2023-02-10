interface CGIExtensionInfo {
  name: string;
  alias: string;
  description: string;
}

interface CGIExtensionRequest {
  id?: number;
  method: string;
  parameters: string[] | { [key: string]: string }[];
}

type CGIExtensionMethodSync = (...args: any) => string | boolean;
type CGIExtensionMethodASync = (...args: any) => Promise<string | boolean>;
type CGIExtensionMethod = CGIExtensionMethodSync | CGIExtensionMethodASync;

/**
 * CGI Extension Wrapper
 */
export class CGIExtension {
  private name: string;
  private alias: string;
  private description: string;

  // Store all method references
  private methods: { [key: string]: CGIExtensionMethod } = {};

  constructor(info: CGIExtensionInfo) {
    this.name = info.name;
    this.alias = info.alias;
    this.description = info.description;
  }

  public export(method: string, fn: CGIExtensionMethod) {
    this.methods[method] = fn;
  }

  public verify() {
    const encoder = new TextEncoder();

    return encoder.encode(JSON.stringify({
      alias: this.alias,
      name: this.name,
      description: this.description,
      is_cgi: true,
    }));
  }

  public async execute() {  
    if (process.argv.indexOf("--ext_verify") !== -1) {
      process.stdout.write(this.verify());
    } else {
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();

      process.stdin.on("data", async chunk => {
        const chunkStr = decoder.decode(chunk);
        const [_len, body] = chunkStr.split("\r\n");

        const request: CGIExtensionRequest = JSON.parse(body);
        let response = "";

        if (request && request.method && !!this.methods[request.method]) {
          try {
            response =
              (await this.methods[request.method](...request.parameters))
                .toString();
          } catch (error: any) {
            response = error.message;
          }
        } else {
          response = "Invalid command.";
        }

        process.stdout.write(encoder.encode(response as string));
      })
    }
  }
}
