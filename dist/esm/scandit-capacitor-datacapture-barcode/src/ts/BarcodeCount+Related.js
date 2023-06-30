var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Feedback } from '../../../scandit-capacitor-datacapture-core/src/ts/Feedback';
import { DefaultSerializeable, nameForSerialization, } from '../../../scandit-capacitor-datacapture-core/src/ts/Serializeable';
import { TrackedBarcode } from './Barcode';
import { Capacitor } from './Capacitor/Capacitor';
import { ScanditBarcodeCountPluginNative } from '../web';
const BarcodeCountDefaults = {
    get Feedback() { return Capacitor.defaults.BarcodeCount.Feedback; }
};
export class BarcodeCountFeedback extends DefaultSerializeable {
    static get default() {
        return new BarcodeCountFeedback(BarcodeCountDefaults.Feedback.success, BarcodeCountDefaults.Feedback.failure);
    }
    static fromJSON(json) {
        const success = Feedback.fromJSON(json.success);
        const failure = Feedback.fromJSON(json.failure);
        return new BarcodeCountFeedback(success, failure);
    }
    constructor(success, error) {
        super();
        this.success = BarcodeCountDefaults.Feedback.success;
        this.failure = BarcodeCountDefaults.Feedback.success;
        this.success = success;
        this.failure = error;
    }
}
export class BarcodeCountSession extends DefaultSerializeable {
    static fromJSON(json) {
        const session = new BarcodeCountSession();
        session._frameSequenceID = json.frameSequenceId;
        session._additionalBarcodes = json.additionalBarcodes;
        session._recognizedBarcodes = {};
        Object.entries(json.recognizedBarcodes)
            .forEach(([key, value]) => {
            // TODO
            // const trackedBarcode = (TrackedBarcode as any as PrivateTrackedBarcode).fromJSON(value as any as TrackedBarcodeJSON, session._frameSequenceID);
            const trackedBarcode = TrackedBarcode.fromJSON(value);
            session._recognizedBarcodes[parseInt(key, 10)] = trackedBarcode;
        });
        return session;
    }
    get recognizedBarcodes() {
        return this._recognizedBarcodes;
    }
    get additionalBarcodes() {
        return this._additionalBarcodes;
    }
    get frameSequenceID() {
        return this._frameSequenceID;
    }
    reset() {
        return ScanditBarcodeCountPluginNative.resetBarcodeCountSession();
    }
}
__decorate([
    nameForSerialization('recognizedBarcodes')
], BarcodeCountSession.prototype, "_recognizedBarcodes", void 0);
__decorate([
    nameForSerialization('additionalBarcodes')
], BarcodeCountSession.prototype, "_additionalBarcodes", void 0);
__decorate([
    nameForSerialization('frameSequenceID')
], BarcodeCountSession.prototype, "_frameSequenceID", void 0);
//# sourceMappingURL=BarcodeCount+Related.js.map