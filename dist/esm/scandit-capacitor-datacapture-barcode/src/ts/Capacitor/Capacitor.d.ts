import { Defaults } from './Defaults';
export declare enum CapacitorFunction {
    GetDefaults = "getDefaults",
    SubscribeBarcodeCaptureListener = "subscribeBarcodeCaptureListener",
    SubscribeBarcodeTrackingListener = "subscribeBarcodeTrackingListener",
    SubscribeBarcodeTrackingBasicOverlayListener = "subscribeBarcodeTrackingBasicOverlayListener",
    SetBrushForTrackedBarcode = "setBrushForTrackedBarcode",
    ClearTrackedBarcodeBrushes = "clearTrackedBarcodeBrushes",
    SubscribeBarcodeTrackingAdvancedOverlayListener = "subscribeBarcodeTrackingAdvancedOverlayListener",
    SetViewForTrackedBarcode = "setViewForTrackedBarcode",
    SetAnchorForTrackedBarcode = "setAnchorForTrackedBarcode",
    SetOffsetForTrackedBarcode = "setOffsetForTrackedBarcode",
    ClearTrackedBarcodeViews = "clearTrackedBarcodeViews",
    SubscribeBarcodeSelectionListener = "subscribeBarcodeSelectionListener",
    GetCountForBarcodeInBarcodeSelectionSession = "getCountForBarcodeInBarcodeSelectionSession",
    ResetBarcodeCaptureSession = "resetBarcodeCaptureSession",
    ResetBarcodeTrackingSession = "resetBarcodeTrackingSession",
    ResetBarcodeSelectionSession = "resetBarcodeSelectionSession",
    ResetBarcodeSelection = "resetBarcodeSelection",
    UnfreezeCameraInBarcodeSelection = "unfreezeCameraInBarcodeSelection",
    SubscribeBarcodeCountListener = "registerBarcodeCountListener",
    UnsubscribeBarcodeCountListener = "unregisterBarcodeCountListener",
    ResetBarcodeCountSession = "resetBarcodeCountSession",
    StartBarcodeCountScanningPhase = "startScanningPhase",
    EndBarcodeCountScanningPhase = "endScanningPhase",
    SetBarcodeCountCaptureList = "setBarcodeCountCaptureList"
}
export declare const Capacitor: {
    pluginName: string;
    defaults: Defaults;
    exec: (success: Optional<Function>, error: Optional<Function>, functionName: string, args: Optional<[any]>) => void;
};
export interface CapacitorWindow extends Window {
    Scandit: any;
    Capacitor: any;
}
export declare const getDefaults: () => Promise<Defaults>;
