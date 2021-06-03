import { CameraSettings } from '../../../scandit-capacitor-datacapture-core/src/ts/Camera+Related';
import { DataCaptureContext, DataCaptureMode, PrivateDataCaptureMode } from '../../../scandit-capacitor-datacapture-core/src/ts/DataCaptureContext';
import { DefaultSerializeable } from '../../../scandit-capacitor-datacapture-core/src/ts/Serializeable';
import { BarcodeCaptureFeedback, BarcodeCaptureListener } from './BarcodeCapture+Related';
import { BarcodeCaptureSettings } from './BarcodeCaptureSettings';
export interface PrivateBarcodeCapture extends PrivateDataCaptureMode {
    _context: Optional<DataCaptureContext>;
    didChange: () => Promise<void>;
}
export declare class BarcodeCapture extends DefaultSerializeable implements DataCaptureMode {
    get isEnabled(): boolean;
    set isEnabled(isEnabled: boolean);
    get context(): Optional<DataCaptureContext>;
    get feedback(): BarcodeCaptureFeedback;
    set feedback(feedback: BarcodeCaptureFeedback);
    static get recommendedCameraSettings(): CameraSettings;
    private type;
    private _isEnabled;
    private _feedback;
    private settings;
    private _context;
    private listeners;
    private listenerProxy;
    private isInListenerCallback;
    static forContext(context: Optional<DataCaptureContext>, settings: BarcodeCaptureSettings): BarcodeCapture;
    applySettings(settings: BarcodeCaptureSettings): Promise<void>;
    addListener(listener: BarcodeCaptureListener): void;
    removeListener(listener: BarcodeCaptureListener): void;
    private didChange;
}
