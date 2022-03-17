var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Feedback } from '../../../scandit-capacitor-datacapture-core/src/ts/Feedback';
import { DefaultSerializeable, ignoreFromSerialization, nameForSerialization, serializationDefault, } from '../../../scandit-capacitor-datacapture-core/src/ts/Serializeable';
import { Brush, NoViewfinder } from '../../../scandit-capacitor-datacapture-core/src/ts/Viewfinder';
import { Barcode, LocalizedOnlyBarcode, } from './Barcode';
import { Capacitor } from './Capacitor/Capacitor';
export class BarcodeCaptureSession {
    get newlyRecognizedBarcodes() {
        return this._newlyRecognizedBarcodes;
    }
    get newlyLocalizedBarcodes() {
        return this._newlyLocalizedBarcodes;
    }
    get frameSequenceID() {
        return this._frameSequenceID;
    }
    static fromJSON(json) {
        const session = new BarcodeCaptureSession();
        session._newlyRecognizedBarcodes = json.newlyRecognizedBarcodes
            .map(Barcode.fromJSON);
        session._newlyLocalizedBarcodes = json.newlyLocalizedBarcodes
            .map(LocalizedOnlyBarcode.fromJSON);
        session._frameSequenceID = json.frameSequenceId;
        return session;
    }
    reset() {
        return this.listenerProxy.reset();
    }
}
export class BarcodeCaptureFeedback extends DefaultSerializeable {
    constructor() {
        super(...arguments);
        this.success = Feedback.defaultFeedback;
    }
    static get default() {
        return new BarcodeCaptureFeedback();
    }
}
export var BarcodeCaptureOverlayStyle;
(function (BarcodeCaptureOverlayStyle) {
    BarcodeCaptureOverlayStyle["Frame"] = "frame";
    BarcodeCaptureOverlayStyle["Legacy"] = "legacy";
})(BarcodeCaptureOverlayStyle || (BarcodeCaptureOverlayStyle = {}));
export class BarcodeCaptureOverlay extends DefaultSerializeable {
    constructor() {
        super();
        this.type = 'barcodeCapture';
        this._shouldShowScanAreaGuides = false;
        this._viewfinder = null;
        this._brush = BarcodeCaptureOverlay.defaultBrush;
    }
    static get defaultBrush() {
        // tslint:disable-next-line:no-console
        console.warn('defaultBrush is deprecated and will be removed in a future release. ' +
            'Use .brush to get the default for your selected style');
        return new Brush(Capacitor.defaults.BarcodeCapture.BarcodeCaptureOverlay.styles[Capacitor.defaults.BarcodeCapture.BarcodeCaptureOverlay.defaultStyle].DefaultBrush.fillColor, Capacitor.defaults.BarcodeCapture.BarcodeCaptureOverlay.styles[Capacitor.defaults.BarcodeCapture.BarcodeCaptureOverlay.defaultStyle].DefaultBrush.strokeColor, Capacitor.defaults.BarcodeCapture.BarcodeCaptureOverlay.styles[Capacitor.defaults.BarcodeCapture.BarcodeCaptureOverlay.defaultStyle].DefaultBrush.strokeWidth);
    }
    get brush() {
        return this._brush;
    }
    set brush(newBrush) {
        this._brush = newBrush;
        this.barcodeCapture.didChange();
    }
    get viewfinder() {
        return this._viewfinder;
    }
    set viewfinder(newViewfinder) {
        this._viewfinder = newViewfinder;
        this.barcodeCapture.didChange();
    }
    get shouldShowScanAreaGuides() {
        return this._shouldShowScanAreaGuides;
    }
    set shouldShowScanAreaGuides(shouldShow) {
        this._shouldShowScanAreaGuides = shouldShow;
        this.barcodeCapture.didChange();
    }
    get style() {
        return this._style;
    }
    static withBarcodeCapture(barcodeCapture) {
        return BarcodeCaptureOverlay.withBarcodeCaptureForView(barcodeCapture, null);
    }
    static withBarcodeCaptureForView(barcodeCapture, view) {
        return this.withBarcodeCaptureForViewWithStyle(barcodeCapture, view, Capacitor.defaults.BarcodeCapture.BarcodeCaptureOverlay.defaultStyle);
    }
    static withBarcodeCaptureForViewWithStyle(barcodeCapture, view, style) {
        const overlay = new BarcodeCaptureOverlay();
        overlay.barcodeCapture = barcodeCapture;
        overlay._style = style;
        overlay._brush = new Brush(Capacitor.defaults.BarcodeCapture.BarcodeCaptureOverlay.styles[overlay._style].DefaultBrush.fillColor, Capacitor.defaults.BarcodeCapture.BarcodeCaptureOverlay.styles[overlay._style].DefaultBrush.strokeColor, Capacitor.defaults.BarcodeCapture.BarcodeCaptureOverlay.styles[overlay._style].DefaultBrush.strokeWidth);
        if (view) {
            view.addOverlay(overlay);
        }
        return overlay;
    }
}
__decorate([
    ignoreFromSerialization
], BarcodeCaptureOverlay.prototype, "barcodeCapture", void 0);
__decorate([
    nameForSerialization('shouldShowScanAreaGuides')
], BarcodeCaptureOverlay.prototype, "_shouldShowScanAreaGuides", void 0);
__decorate([
    serializationDefault(NoViewfinder),
    nameForSerialization('viewfinder')
], BarcodeCaptureOverlay.prototype, "_viewfinder", void 0);
__decorate([
    nameForSerialization('brush')
], BarcodeCaptureOverlay.prototype, "_brush", void 0);
__decorate([
    nameForSerialization('style')
], BarcodeCaptureOverlay.prototype, "_style", void 0);
//# sourceMappingURL=BarcodeCapture+Related.js.map