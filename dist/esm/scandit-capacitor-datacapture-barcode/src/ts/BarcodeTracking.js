var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CameraSettings } from '../../../scandit-capacitor-datacapture-core/src/ts/Camera+Related';
import { DefaultSerializeable, ignoreFromSerialization, nameForSerialization } from '../../../scandit-capacitor-datacapture-core/src/ts/Serializeable';
import { BarcodeTrackingListenerProxy } from './Capacitor/BarcodeTrackingListenerProxy';
import { Capacitor } from './Capacitor/Capacitor';
export class BarcodeTracking extends DefaultSerializeable {
    constructor() {
        super(...arguments);
        this.type = 'barcodeTracking';
        this._isEnabled = true;
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
    static get recommendedCameraSettings() {
        return new CameraSettings(Capacitor.defaults.BarcodeTracking.RecommendedCameraSettings);
    }
    static forContext(context, settings) {
        const barcodeTracking = new BarcodeTracking();
        barcodeTracking.settings = settings;
        if (context) {
            context.addMode(barcodeTracking);
        }
        barcodeTracking.listenerProxy = BarcodeTrackingListenerProxy.forBarcodeTracking(barcodeTracking);
        return barcodeTracking;
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
], BarcodeTracking.prototype, "_isEnabled", void 0);
__decorate([
    ignoreFromSerialization
], BarcodeTracking.prototype, "_context", void 0);
__decorate([
    ignoreFromSerialization
], BarcodeTracking.prototype, "listeners", void 0);
__decorate([
    ignoreFromSerialization
], BarcodeTracking.prototype, "listenerProxy", void 0);
//# sourceMappingURL=BarcodeTracking.js.map