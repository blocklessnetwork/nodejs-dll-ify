interface CGIExtensionInfo {
    name: string;
    alias: string;
    description: string;
}
type CGIExtensionMethodSync = (...args: any) => string | boolean;
type CGIExtensionMethodASync = (...args: any) => Promise<string | boolean>;
type CGIExtensionMethod = CGIExtensionMethodSync | CGIExtensionMethodASync;
/**
 * CGI Extension Wrapper
 */
export declare class CGIExtension {
    private name;
    private alias;
    private description;
    private methods;
    constructor(info: CGIExtensionInfo);
    export(method: string, fn: CGIExtensionMethod): void;
    verify(): Uint8Array;
    execute(): Promise<void>;
}
export {};
//# sourceMappingURL=index.d.ts.map