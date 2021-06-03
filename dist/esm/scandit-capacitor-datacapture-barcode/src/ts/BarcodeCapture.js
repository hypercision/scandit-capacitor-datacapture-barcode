var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CameraSettings } from '../../../scandit-capacitor-datacapture-core/src/ts/Camera+Related';
import { DefaultSerializeable, ignoreFromSerialization, nameForSerialization } from '../../../scandit-capacitor-datacapture-core/src/ts/Serializeable';
import { BarcodeCaptureFeedback } from './BarcodeCapture+Related';
import { BarcodeCaptureListenerProxy } from './Capacitor/BarcodeCaptureListenerProxy';
import { Capacitor } from './Capacitor/Capacitor';
export class BarcodeCapture extends DefaultSerializeable {
    constructor() {
        super(...arguments);
        this.type = 'barcodeCapture';
        this._isEnabled = true;
        this._feedback = BarcodeCaptureFeedback.default;
        this._context = null;
        this.listeners = [];
        this.listenerProxy = null;
        this.isInListenerCallback = false;
    }
    get isEnabled() {
        return this._isEnabled;
    }
    set isEnabled(isEnabled) {
        this._isEnabled = isEnabled;
        if (!this.isInListenerCallback) {
            // If we're "in" a listener callback, we don't want to deserialize the context to update the enabled state,
            // but rather pass that back to be applied in the native callback.
            this.didChange();
        }
    }
    get context() {
        return this._context;
    }
    get feedback() {
        return this._feedback;
    }
    set feedback(feedback) {
        this._feedback = feedback;
        this.didChange();
    }
    static get recommendedCameraSettings() {
        return new CameraSettings(Capacitor.defaults.BarcodeCapture.RecommendedCameraSettings);
    }
    static forContext(context, settings) {
        const barcodeCapture = new BarcodeCapture();
        barcodeCapture.settings = settings;
        if (context) {
            context.addMode(barcodeCapture);
        }
        barcodeCapture.listenerProxy = BarcodeCaptureListenerProxy.forBarcodeCapture(barcodeCapture);
        return barcodeCapture;
    }
    applySettings(settings) {
        this.settings = settings;
        return this.didChange();
    }
    addListener(listener) {
        if (this.listeners.includes(listener)) {
            return;
        }
        this.listeners.push(listener);
    }
    removeListener(listener) {
        if (!this.listeners.includes(listener)) {
            return;
        }
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    }
    didChange() {
        if (this.context) {
            return this.context.update();
        }
        else {
            return Promise.resolve();
        }
    }
}
__decorate([
    nameForSerialization('enabled')
], BarcodeCapture.prototype, "_isEnabled", void 0);
__decorate([
    nameForSerialization('feedback')
], BarcodeCapture.prototype, "_feedback", void 0);
__decorate([
    ignoreFromSerialization
], BarcodeCapture.prototype, "_context", void 0);
__decorate([
    ignoreFromSerialization
], BarcodeCapture.prototype, "listeners", void 0);
__decorate([
    ignoreFromSerialization
], BarcodeCapture.prototype, "listenerProxy", void 0);
__decorate([
    ignoreFromSerialization
], BarcodeCapture.prototype, "isInListenerCallback", void 0);
//# sourceMappingURL=BarcodeCapture.js.map