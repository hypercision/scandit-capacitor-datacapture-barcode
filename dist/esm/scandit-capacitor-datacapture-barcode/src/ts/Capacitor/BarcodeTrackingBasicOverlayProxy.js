import { TrackedBarcode } from '../Barcode';
import { Plugins } from '@capacitor/core';
import { doReturnWithFinish } from '../../../../scandit-capacitor-datacapture-core/src/ts/Capacitor/CommonCapacitor';
import { Capacitor, CapacitorFunction } from './Capacitor';
var BarcodeTrackingBasicOverlayListenerEvent;
(function (BarcodeTrackingBasicOverlayListenerEvent) {
    BarcodeTrackingBasicOverlayListenerEvent["BrushForTrackedBarcode"] = "onBrushForTrackedBarcodeEvent";
    BarcodeTrackingBasicOverlayListenerEvent["DidTapTrackedBarcode"] = "onDidTapTrackedBarcodeEvent";
})(BarcodeTrackingBasicOverlayListenerEvent || (BarcodeTrackingBasicOverlayListenerEvent = {}));
export class BarcodeTrackingBasicOverlayProxy {
    static forOverlay(overlay) {
        const proxy = new BarcodeTrackingBasicOverlayProxy();
        proxy.overlay = overlay;
        proxy.initialize();
        return proxy;
    }
    setBrushForTrackedBarcode(brush, trackedBarcode) {
        return new Promise((resolve, reject) => {
            BarcodeTrackingBasicOverlayProxy.capacitorExec(resolve, reject, CapacitorFunction.SetBrushForTrackedBarcode, {
                brush: brush ? JSON.stringify(brush.toJSON()) : null,
                sessionFrameSequenceID: trackedBarcode.sessionFrameSequenceID,
                trackedBarcodeID: trackedBarcode.identifier,
            });
        });
    }
    clearTrackedBarcodeBrushes() {
        return new Promise((resolve, reject) => {
            BarcodeTrackingBasicOverlayProxy.capacitorExec(resolve, reject, CapacitorFunction.ClearTrackedBarcodeBrushes, null);
        });
    }
    subscribeListener() {
        Plugins[Capacitor.pluginName][CapacitorFunction.SubscribeBarcodeTrackingBasicOverlayListener]();
        Plugins[Capacitor.pluginName]
            .addListener(BarcodeTrackingBasicOverlayListenerEvent.BrushForTrackedBarcode, this.notifyListeners.bind(this));
        Plugins[Capacitor.pluginName]
            .addListener(BarcodeTrackingBasicOverlayListenerEvent.DidTapTrackedBarcode, this.notifyListeners.bind(this));
    }
    notifyListeners(event) {
        if (!event || !this.overlay.listener) {
            // The event could be undefined/null in case the plugin result did not pass a "message",
            // which could happen e.g. in case of "ok" results, which could signal e.g. successful
            // listener subscriptions.
            return doReturnWithFinish(event.name, null);
        }
        event = Object.assign(Object.assign(Object.assign({}, event), event.argument), { argument: undefined });
        switch (event.name) {
            case BarcodeTrackingBasicOverlayListenerEvent.BrushForTrackedBarcode:
                if (this.overlay.listener.brushForTrackedBarcode) {
                    const trackedBarcode = TrackedBarcode
                        .fromJSON(JSON.parse(event.trackedBarcode));
                    const brush = this.overlay.listener.brushForTrackedBarcode(this.overlay, trackedBarcode);
                    return doReturnWithFinish(event.name, { brush: brush ? JSON.stringify(brush.toJSON()) : null });
                }
                break;
            case BarcodeTrackingBasicOverlayListenerEvent.DidTapTrackedBarcode:
                if (this.overlay.listener.didTapTrackedBarcode) {
                    const trackedBarcode = TrackedBarcode
                        .fromJSON(JSON.parse(event.trackedBarcode));
                    this.overlay.listener.didTapTrackedBarcode(this.overlay, trackedBarcode);
                }
                break;
        }
        return doReturnWithFinish(event.name, null);
    }
    initialize() {
        this.subscribeListener();
    }
}
BarcodeTrackingBasicOverlayProxy.capacitorExec = Capacitor.exec;
//# sourceMappingURL=BarcodeTrackingBasicOverlayProxy.js.map