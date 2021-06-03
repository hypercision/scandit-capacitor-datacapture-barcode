import { Brush } from '../../../../scandit-capacitor-datacapture-core/src/ts/Viewfinder';
import { TrackedBarcode } from '../Barcode';
import { BarcodeTrackingBasicOverlay } from '../BarcodeTracking+Related';
export declare class BarcodeTrackingBasicOverlayProxy {
    private static capacitorExec;
    private overlay;
    static forOverlay(overlay: BarcodeTrackingBasicOverlay): BarcodeTrackingBasicOverlayProxy;
    setBrushForTrackedBarcode(brush: Brush, trackedBarcode: TrackedBarcode): Promise<void>;
    clearTrackedBarcodeBrushes(): Promise<void>;
    private subscribeListener;
    private notifyListeners;
    private initialize;
}
