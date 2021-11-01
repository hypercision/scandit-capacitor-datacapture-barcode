import { PointWithUnit } from '../../../scandit-capacitor-datacapture-core/src/ts/Common';
import { Anchor, DataCaptureOverlay, DataCaptureView } from '../../../scandit-capacitor-datacapture-core/src/ts/DataCaptureView';
import { DefaultSerializeable } from '../../../scandit-capacitor-datacapture-core/src/ts/Serializeable';
import { Brush } from '../../../scandit-capacitor-datacapture-core/src/ts/Viewfinder';
import { TrackedBarcode, TrackedBarcodeJSON } from './Barcode';
import { BarcodeTracking } from './BarcodeTracking';
import { TrackedBarcodeView } from './TrackedBarcodeView';
export interface BarcodeTrackingSessionJSON {
    addedTrackedBarcodes: TrackedBarcodeJSON[];
    removedTrackedBarcodes: string[];
    updatedTrackedBarcodes: TrackedBarcodeJSON[];
    trackedBarcodes: {
        [key: string]: TrackedBarcodeJSON;
    };
    frameSequenceId: number;
}
export interface PrivateBarcodeTrackingSession {
    fromJSON(json: BarcodeTrackingSessionJSON): BarcodeTrackingSession;
}
export declare class BarcodeTrackingSession {
    private _addedTrackedBarcodes;
    private _removedTrackedBarcodes;
    private _updatedTrackedBarcodes;
    private _trackedBarcodes;
    private _frameSequenceID;
    get addedTrackedBarcodes(): TrackedBarcode[];
    get removedTrackedBarcodes(): string[];
    get updatedTrackedBarcodes(): TrackedBarcode[];
    get trackedBarcodes(): {
        [key: string]: TrackedBarcode;
    };
    get frameSequenceID(): number;
    private static fromJSON;
}
export interface BarcodeTrackingListener {
    didUpdateSession?(barcodeTracking: BarcodeTracking, session: BarcodeTrackingSession): void;
}
export interface BarcodeTrackingBasicOverlayListener {
    brushForTrackedBarcode?(overlay: BarcodeTrackingBasicOverlay, trackedBarcode: TrackedBarcode): Optional<Brush>;
    didTapTrackedBarcode?(overlay: BarcodeTrackingBasicOverlay, trackedBarcode: TrackedBarcode): void;
}
export interface PrivateBarcodeTrackingBasicOverlay {
    toJSON(): object;
}
export declare enum BarcodeTrackingBasicOverlayStyle {
    Frame = "frame",
    Dot = "dot",
    Legacy = "legacy"
}
export declare class BarcodeTrackingBasicOverlay extends DefaultSerializeable implements DataCaptureOverlay {
    private type;
    private barcodeTracking;
    static get defaultBrush(): Brush;
    private _defaultBrush;
    get brush(): Optional<Brush>;
    set brush(newBrush: Optional<Brush>);
    private _shouldShowScanAreaGuides;
    listener: Optional<BarcodeTrackingBasicOverlayListener>;
    private _proxy;
    private get proxy();
    get shouldShowScanAreaGuides(): boolean;
    set shouldShowScanAreaGuides(shouldShow: boolean);
    private _style;
    get style(): BarcodeTrackingBasicOverlayStyle;
    static withBarcodeTracking(barcodeTracking: BarcodeTracking): BarcodeTrackingBasicOverlay;
    static withBarcodeTrackingForView(barcodeTracking: BarcodeTracking, view: Optional<DataCaptureView>): BarcodeTrackingBasicOverlay;
    static withBarcodeTrackingForViewWithStyle(barcodeTracking: BarcodeTracking, view: DataCaptureView | null, style: BarcodeTrackingBasicOverlayStyle): BarcodeTrackingBasicOverlay;
    private constructor();
    setBrushForTrackedBarcode(brush: Brush, trackedBarcode: TrackedBarcode): Promise<void>;
    clearTrackedBarcodeBrushes(): Promise<void>;
    private initialize;
}
export interface BarcodeTrackingAdvancedOverlayListener {
    viewForTrackedBarcode?(overlay: BarcodeTrackingAdvancedOverlay, trackedBarcode: TrackedBarcode): Promise<Optional<TrackedBarcodeView>>;
    anchorForTrackedBarcode?(overlay: BarcodeTrackingAdvancedOverlay, trackedBarcode: TrackedBarcode): Anchor;
    offsetForTrackedBarcode?(overlay: BarcodeTrackingAdvancedOverlay, trackedBarcode: TrackedBarcode): PointWithUnit;
    didTapViewForTrackedBarcode?(overlay: BarcodeTrackingAdvancedOverlay, trackedBarcode: TrackedBarcode): void;
}
export interface PrivateBarcodeTrackingAdvancedOverlay {
    toJSON(): object;
}
export declare class BarcodeTrackingAdvancedOverlay extends DefaultSerializeable implements DataCaptureOverlay {
    private type;
    private _shouldShowScanAreaGuides;
    get shouldShowScanAreaGuides(): boolean;
    set shouldShowScanAreaGuides(shouldShow: boolean);
    private barcodeTracking;
    listener: Optional<BarcodeTrackingAdvancedOverlayListener>;
    private _proxy;
    private get proxy();
    static withBarcodeTrackingForView(barcodeTracking: BarcodeTracking, view: Optional<DataCaptureView>): BarcodeTrackingAdvancedOverlay;
    private constructor();
    setViewForTrackedBarcode(view: Promise<Optional<TrackedBarcodeView>>, trackedBarcode: TrackedBarcode): Promise<void>;
    setAnchorForTrackedBarcode(anchor: Anchor, trackedBarcode: TrackedBarcode): Promise<void>;
    setOffsetForTrackedBarcode(offset: PointWithUnit, trackedBarcode: TrackedBarcode): Promise<void>;
    clearTrackedBarcodeViews(): Promise<void>;
    private initialize;
}
