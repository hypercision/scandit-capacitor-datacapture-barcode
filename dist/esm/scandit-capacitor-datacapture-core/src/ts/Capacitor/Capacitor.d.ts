import { Defaults } from './Defaults';
export declare enum CapacitorFunction {
    GetDefaults = "getDefaults",
    ContextFromJSON = "contextFromJSON",
    DisposeContext = "disposeContext",
    UpdateContextFromJSON = "updateContextFromJSON",
    SubscribeContextListener = "subscribeContextListener",
    SubscribeContextFrameListener = "subscribeContextFrameListener",
    SetViewPositionAndSize = "setViewPositionAndSize",
    ShowView = "showView",
    HideView = "hideView",
    ViewPointForFramePoint = "viewPointForFramePoint",
    ViewQuadrilateralForFrameQuadrilateral = "viewQuadrilateralForFrameQuadrilateral",
    SubscribeViewListener = "subscribeViewListener",
    GetCurrentCameraState = "getCurrentCameraState",
    GetIsTorchAvailable = "getIsTorchAvailable",
    EmitFeedback = "emitFeedback",
    SubscribeVolumeButtonObserver = "subscribeVolumeButtonObserver",
    UnsubscribeVolumeButtonObserver = "unsubscribeVolumeButtonObserver"
}
export declare const pluginName = "ScanditCaptureCoreNative";
export declare const Capacitor: {
    pluginName: string;
    defaults: Defaults;
    exec: (success: Function | null, error: Function | null, functionName: string, args: Optional<[any]>) => void;
};
export declare const getDefaults: Promise<Defaults>;
