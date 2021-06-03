declare type BarcodeTracking = any;
export declare class BarcodeTrackingListenerProxy {
    private static capacitorExec;
    private barcodeTracking;
    static forBarcodeTracking(barcodeTracking: BarcodeTracking): BarcodeTrackingListenerProxy;
    private initialize;
    private subscribeListener;
    private notifyListeners;
}
export {};
