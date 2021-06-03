import { PointWithUnit } from '../../../../scandit-capacitor-datacapture-core/src/ts/Common';
import { Anchor } from '../../../../scandit-capacitor-datacapture-core/src/ts/DataCaptureView';
import { TrackedBarcode } from '../Barcode';
import { BarcodeTrackingAdvancedOverlay } from '../BarcodeTracking+Related';
import { TrackedBarcodeView } from '../TrackedBarcodeView';
export declare class BarcodeTrackingAdvancedOverlayProxy {
    private static capacitorExec;
    private overlay;
    static forOverlay(overlay: BarcodeTrackingAdvancedOverlay): BarcodeTrackingAdvancedOverlayProxy;
    setViewForTrackedBarcode(view: Promise<Optional<TrackedBarcodeView>>, trackedBarcode: TrackedBarcode): Promise<void>;
    private setViewForTrackedBarcodeSync;
    setAnchorForTrackedBarcode(anchor: Anchor, trackedBarcode: TrackedBarcode): Promise<void>;
    setOffsetForTrackedBarcode(offset: PointWithUnit, trackedBarcode: TrackedBarcode): Promise<void>;
    clearTrackedBarcodeViews(): Promise<void>;
    private subscribeListener;
    private notifyListeners;
    private initialize;
}
