var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DefaultSerializeable, ignoreFromSerialization, nameForSerialization, } from '../../../scandit-capacitor-datacapture-core/src/ts/Serializeable';
import { BarcodeCountFeedback } from './BarcodeCount+Related';
import { Capacitor } from './Capacitor/Capacitor';
import { BarcodeCountListenerProxy } from './Capacitor/BarcodeCountListenerProxy';
export class BarcodeCount extends DefaultSerializeable {
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
    get _context() {
        return this.privateContext;
    }
    set _context(newContext) {
        if (newContext == null) {
            this.listenerProxy.unsubscribeListener();
        }
        this.privateContext = newContext;
    }
    static forContext(context, settings) {
        const barcodeCount = new BarcodeCount();
        barcodeCount._context = context;
        barcodeCount.settings = settings;
        return barcodeCount;
    }
    constructor() {
        super();
        this.type = 'barcodeCount';
        this._feedback = BarcodeCountFeedback.default;
        this._isEnabled = true;
        this.listeners = [];
        this._additionalBarcodes = [];
        this.isInListenerCallback = false;
        this.privateContext = null;
        this.listenerProxy = BarcodeCountListenerProxy.forBarcodeCount(this);
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
        this.listeners.splice(this.listeners.indexOf(listener));
        this.checkAndUnsubscribeListeners();
    }
    checkAndUnsubscribeListeners() {
        if (this.listeners.length === 0) {
            this.listenerProxy.unsubscribeListener();
        }
    }
    reset() {
        return this.listenerProxy.reset();
    }
    startScanningPhase() {
        this.listenerProxy.startScanningPhase();
    }
    endScanningPhase() {
        this.listenerProxy.endScanningPhase();
    }
    setBarcodeCountCaptureList(barcodeCountCaptureList) {
        this.listenerProxy.setBarcodeCountCaptureList(barcodeCountCaptureList);
    }
    setAdditionalBarcodes(barcodes) {
        this._additionalBarcodes = barcodes;
        return this.didChange();
    }
    clearAdditionalBarcodes() {
        this._additionalBarcodes = [];
        return this.didChange();
    }
    static get recommendedCameraSettings() {
        return Capacitor.defaults.BarcodeCount.RecommendedCameraSettings;
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
    nameForSerialization('feedback')
], BarcodeCount.prototype, "_feedback", void 0);
__decorate([
    nameForSerialization('enabled')
], BarcodeCount.prototype, "_isEnabled", void 0);
__decorate([
    ignoreFromSerialization
], BarcodeCount.prototype, "listeners", void 0);
__decorate([
    nameForSerialization('additionalBarcodes')
], BarcodeCount.prototype, "_additionalBarcodes", void 0);
__decorate([
    ignoreFromSerialization
], BarcodeCount.prototype, "isInListenerCallback", void 0);
__decorate([
    ignoreFromSerialization
], BarcodeCount.prototype, "privateContext", void 0);
__decorate([
    ignoreFromSerialization
], BarcodeCount.prototype, "listenerProxy", void 0);
//# sourceMappingURL=BarcodeCount.js.map