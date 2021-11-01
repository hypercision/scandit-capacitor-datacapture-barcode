var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DefaultSerializeable, ignoreFromSerialization, nameForSerialization } from '../../../scandit-capacitor-datacapture-core/src/ts/Serializeable';
import { Brush } from '../../../scandit-capacitor-datacapture-core/src/ts/Viewfinder';
import { TrackedBarcode } from './Barcode';
import { BarcodeTrackingAdvancedOverlayProxy } from './Capacitor/BarcodeTrackingAdvancedOverlayProxy';
import { BarcodeTrackingBasicOverlayProxy } from './Capacitor/BarcodeTrackingBasicOverlayProxy';
import { Capacitor } from './Capacitor/Capacitor';
export class BarcodeTrackingSession {
    get addedTrackedBarcodes() {
        return this._addedTrackedBarcodes;
    }
    get removedTrackedBarcodes() {
        return this._removedTrackedBarcodes;
    }
    get updatedTrackedBarcodes() {
        return this._updatedTrackedBarcodes;
    }
    get trackedBarcodes() {
        return this._trackedBarcodes;
    }
    get frameSequenceID() {
        return this._frameSequenceID;
    }
    static fromJSON(json) {
        const session = new BarcodeTrackingSession();
        session._frameSequenceID = json.frameSequenceId;
        session._addedTrackedBarcodes = json.addedTrackedBarcodes
            .map(TrackedBarcode.fromJSON);
        session._removedTrackedBarcodes = json.removedTrackedBarcodes;
        session._updatedTrackedBarcodes = json.updatedTrackedBarcodes
            .map(TrackedBarcode.fromJSON);
        session._trackedBarcodes = Object.keys(json.trackedBarcodes)
            .reduce((trackedBarcodes, identifier) => {
            const trackedBarcode = TrackedBarcode
                .fromJSON(json.trackedBarcodes[identifier]);
            trackedBarcode.sessionFrameSequenceID = `${json.frameSequenceId}`;
            trackedBarcodes[identifier] = trackedBarcode;
            return trackedBarcodes;
        }, {});
        return session;
    }
}
export var BarcodeTrackingBasicOverlayStyle;
(function (BarcodeTrackingBasicOverlayStyle) {
    BarcodeTrackingBasicOverlayStyle["Frame"] = "frame";
    BarcodeTrackingBasicOverlayStyle["Dot"] = "dot";
    BarcodeTrackingBasicOverlayStyle["Legacy"] = "legacy";
})(BarcodeTrackingBasicOverlayStyle || (BarcodeTrackingBasicOverlayStyle = {}));
export class BarcodeTrackingBasicOverlay extends DefaultSerializeable {
    constructor() {
        super();
        this.type = 'barcodeTrackingBasic';
        this._defaultBrush = new Brush(Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.styles[Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.defaultStyle].DefaultBrush.fillColor, Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.styles[Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.defaultStyle].DefaultBrush.strokeColor, Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.styles[Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.defaultStyle].DefaultBrush.strokeWidth);
        this._shouldShowScanAreaGuides = false;
        this.listener = null;
    }
    static get defaultBrush() {
        // tslint:disable-next-line:no-console
        console.warn('defaultBrush is deprecated and will be removed in a future release. ' +
            'Use .brush to get the default for your selected style');
        return new Brush(Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.styles[Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.defaultStyle].DefaultBrush.fillColor, Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.styles[Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.defaultStyle].DefaultBrush.strokeColor, Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.styles[Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.defaultStyle].DefaultBrush.strokeWidth);
    }
    get brush() {
        return this._defaultBrush;
    }
    set brush(newBrush) {
        this._defaultBrush = newBrush;
        this.barcodeTracking.didChange();
    }
    get proxy() {
        if (!this._proxy) {
            this.initialize();
        }
        return this._proxy;
    }
    get shouldShowScanAreaGuides() {
        return this._shouldShowScanAreaGuides;
    }
    set shouldShowScanAreaGuides(shouldShow) {
        this._shouldShowScanAreaGuides = shouldShow;
        this.barcodeTracking.didChange();
    }
    get style() {
        return this._style;
    }
    static withBarcodeTracking(barcodeTracking) {
        return BarcodeTrackingBasicOverlay.withBarcodeTrackingForView(barcodeTracking, null);
    }
    static withBarcodeTrackingForView(barcodeTracking, view) {
        return this.withBarcodeTrackingForViewWithStyle(barcodeTracking, view, Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.defaultStyle);
    }
    static withBarcodeTrackingForViewWithStyle(barcodeTracking, view, style) {
        const overlay = new BarcodeTrackingBasicOverlay();
        overlay.barcodeTracking = barcodeTracking;
        overlay._style = style;
        overlay._defaultBrush = new Brush(Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.styles[overlay._style]
            .DefaultBrush.fillColor, Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.styles[overlay._style]
            .DefaultBrush.strokeColor, Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.styles[overlay._style]
            .DefaultBrush.strokeWidth);
        if (view) {
            view.addOverlay(overlay);
        }
        overlay.initialize();
        return overlay;
    }
    setBrushForTrackedBarcode(brush, trackedBarcode) {
        return this.proxy.setBrushForTrackedBarcode(brush, trackedBarcode);
    }
    clearTrackedBarcodeBrushes() {
        return this.proxy.clearTrackedBarcodeBrushes();
    }
    initialize() {
        if (this._proxy) {
            return;
        }
        this._proxy = BarcodeTrackingBasicOverlayProxy.forOverlay(this);
    }
}
__decorate([
    ignoreFromSerialization
], BarcodeTrackingBasicOverlay.prototype, "barcodeTracking", void 0);
__decorate([
    nameForSerialization('defaultBrush')
], BarcodeTrackingBasicOverlay.prototype, "_defaultBrush", void 0);
__decorate([
    nameForSerialization('shouldShowScanAreaGuides')
], BarcodeTrackingBasicOverlay.prototype, "_shouldShowScanAreaGuides", void 0);
__decorate([
    ignoreFromSerialization
], BarcodeTrackingBasicOverlay.prototype, "listener", void 0);
__decorate([
    ignoreFromSerialization
], BarcodeTrackingBasicOverlay.prototype, "_proxy", void 0);
__decorate([
    nameForSerialization('style')
], BarcodeTrackingBasicOverlay.prototype, "_style", void 0);
export class BarcodeTrackingAdvancedOverlay extends DefaultSerializeable {
    constructor() {
        super();
        this.type = 'barcodeTrackingAdvanced';
        this._shouldShowScanAreaGuides = false;
        this.listener = null;
    }
    get shouldShowScanAreaGuides() {
        return this._shouldShowScanAreaGuides;
    }
    set shouldShowScanAreaGuides(shouldShow) {
        this._shouldShowScanAreaGuides = shouldShow;
        this.barcodeTracking.didChange();
    }
    get proxy() {
        if (!this._proxy) {
            this.initialize();
        }
        return this._proxy;
    }
    static withBarcodeTrackingForView(barcodeTracking, view) {
        const overlay = new BarcodeTrackingAdvancedOverlay();
        overlay.barcodeTracking = barcodeTracking;
        if (view) {
            view.addOverlay(overlay);
        }
        overlay.initialize();
        return overlay;
    }
    setViewForTrackedBarcode(view, trackedBarcode) {
        return this.proxy.setViewForTrackedBarcode(view, trackedBarcode);
    }
    setAnchorForTrackedBarcode(anchor, trackedBarcode) {
        return this.proxy.setAnchorForTrackedBarcode(anchor, trackedBarcode);
    }
    setOffsetForTrackedBarcode(offset, trackedBarcode) {
        return this.proxy.setOffsetForTrackedBarcode(offset, trackedBarcode);
    }
    clearTrackedBarcodeViews() {
        return this.proxy.clearTrackedBarcodeViews();
    }
    initialize() {
        if (this._proxy) {
            return;
        }
        this._proxy = BarcodeTrackingAdvancedOverlayProxy.forOverlay(this);
    }
}
__decorate([
    nameForSerialization('shouldShowScanAreaGuides')
], BarcodeTrackingAdvancedOverlay.prototype, "_shouldShowScanAreaGuides", void 0);
__decorate([
    ignoreFromSerialization
], BarcodeTrackingAdvancedOverlay.prototype, "barcodeTracking", void 0);
__decorate([
    ignoreFromSerialization
], BarcodeTrackingAdvancedOverlay.prototype, "listener", void 0);
__decorate([
    ignoreFromSerialization
], BarcodeTrackingAdvancedOverlay.prototype, "_proxy", void 0);
//# sourceMappingURL=BarcodeTracking+Related.js.map