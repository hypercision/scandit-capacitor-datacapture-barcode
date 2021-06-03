import { CameraSettings } from '../../../scandit-capacitor-datacapture-core/src/ts/Camera+Related';
import { DataCaptureContext, DataCaptureMode, PrivateDataCaptureMode } from '../../../scandit-capacitor-datacapture-core/src/ts/DataCaptureContext';
import { DefaultSerializeable } from '../../../scandit-capacitor-datacapture-core/src/ts/Serializeable';
import { BarcodeTrackingListener } from './BarcodeTracking+Related';
import { BarcodeTrackingSettings } from './BarcodeTrackingSettings';
export interface PrivateBarcodeTracking extends PrivateDataCaptureMode {
    _context: Optional<DataCaptureContext>;
    didChange: () => Promise<void>;
}
export declare class BarcodeTracking extends DefaultSerializeable implements DataCaptureMode {
    get isEnabled(): boolean;
    set isEnabled(isEnabled: boolean);
    get context(): Optional<DataCaptureContext>;
    static get recommendedCameraSettings(): CameraSettings;
    private type;
    private _isEnabled;
    private settings;
    private _context;
    private listeners;
    private listenerProxy;
    private isInListenerCallback;
    static forContext(context: Optional<DataCaptureContext>, settings: BarcodeTrackingSettings): BarcodeTracking;
    applySettings(settings: BarcodeTrackingSettings): Promise<void>;
    addListener(listener: BarcodeTrackingListener): void;
    removeListener(listener: BarcodeTrackingListener): void;
    private didChange;
}
