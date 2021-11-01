import { DataCaptureOverlay, DataCaptureView } from '../../../scandit-capacitor-datacapture-core/src/ts/DataCaptureView';
import { Feedback } from '../../../scandit-capacitor-datacapture-core/src/ts/Feedback';
import { DefaultSerializeable } from '../../../scandit-capacitor-datacapture-core/src/ts/Serializeable';
import { Brush, Viewfinder } from '../../../scandit-capacitor-datacapture-core/src/ts/Viewfinder';
import { Barcode, BarcodeJSON, LocalizedOnlyBarcode, LocalizedOnlyBarcodeJSON } from './Barcode';
import { BarcodeCapture } from './BarcodeCapture';
export declare class BarcodeCaptureSession {
    private _newlyRecognizedBarcodes;
    private _newlyLocalizedBarcodes;
    private _frameSequenceID;
    get newlyRecognizedBarcodes(): Barcode[];
    get newlyLocalizedBarcodes(): LocalizedOnlyBarcode[];
    get frameSequenceID(): number;
    private static fromJSON;
}
export interface BarcodeCaptureSessionJSON {
    newlyRecognizedBarcodes: BarcodeJSON[];
    newlyLocalizedBarcodes: LocalizedOnlyBarcodeJSON[];
    frameSequenceId: number;
}
export interface PrivateBarcodeCaptureSession {
    fromJSON(json: BarcodeCaptureSessionJSON): BarcodeCaptureSession;
}
export interface BarcodeCaptureListener {
    didScan?(barcodeCapture: BarcodeCapture, session: BarcodeCaptureSession): void;
    didUpdateSession?(barcodeCapture: BarcodeCapture, session: BarcodeCaptureSession): void;
}
export declare class BarcodeCaptureFeedback extends DefaultSerializeable {
    success: Feedback;
    static get default(): BarcodeCaptureFeedback;
}
export declare enum BarcodeCaptureOverlayStyle {
    Frame = "frame",
    Legacy = "legacy"
}
export declare class BarcodeCaptureOverlay extends DefaultSerializeable implements DataCaptureOverlay {
    private type;
    private barcodeCapture;
    private _shouldShowScanAreaGuides;
    private _viewfinder;
    static get defaultBrush(): Brush;
    private _brush;
    private _style;
    get brush(): Brush;
    set brush(newBrush: Brush);
    get viewfinder(): Optional<Viewfinder>;
    set viewfinder(newViewfinder: Optional<Viewfinder>);
    get shouldShowScanAreaGuides(): boolean;
    set shouldShowScanAreaGuides(shouldShow: boolean);
    get style(): BarcodeCaptureOverlayStyle;
    static withBarcodeCapture(barcodeCapture: BarcodeCapture): BarcodeCaptureOverlay;
    static withBarcodeCaptureForView(barcodeCapture: BarcodeCapture, view: Optional<DataCaptureView>): BarcodeCaptureOverlay;
    static withBarcodeCaptureForViewWithStyle(barcodeCapture: BarcodeCapture, view: DataCaptureView | null, style: BarcodeCaptureOverlayStyle): BarcodeCaptureOverlay;
    private constructor();
}
