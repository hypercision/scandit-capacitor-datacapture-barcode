declare type BarcodeCapture = any;
export declare class BarcodeCaptureListenerProxy {
    private static capacitorExec;
    private barcodeCapture;
    static forBarcodeCapture(barcodeCapture: BarcodeCapture): BarcodeCaptureListenerProxy;
    private initialize;
    private subscribeListener;
    private notifyListeners;
}
export {};
