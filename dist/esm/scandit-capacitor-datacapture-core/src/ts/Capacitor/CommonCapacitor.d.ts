export declare class CapacitorError {
    code: number;
    message: string;
    static fromJSON(json: any): Optional<CapacitorError>;
    constructor(code: number, message: string);
}
export interface BlockingModeListenerResult {
    enabled: boolean;
}
export declare const capacitorExec: (successCallback: Function | null, errorCallback: Function | null, pluginName: string, functionName: string, args: Optional<[any]>) => void;
export declare const doReturnWithFinish: (finishCallbackID: string, result: any) => any;
