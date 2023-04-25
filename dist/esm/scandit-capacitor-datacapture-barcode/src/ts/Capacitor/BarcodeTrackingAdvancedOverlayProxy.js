import { TrackedBarcode } from '../Barcode';
import { doReturnWithFinish } from '../../../../scandit-capacitor-datacapture-core/src/ts/Capacitor/CommonCapacitor';
import { Capacitor, CapacitorFunction } from './Capacitor';
var BarcodeTrackingAdvancedOverlayListenerEvent;
(function (BarcodeTrackingAdvancedOverlayListenerEvent) {
    BarcodeTrackingAdvancedOverlayListenerEvent["ViewForTrackedBarcode"] = "onViewForTrackedBarcodeEvent";
    BarcodeTrackingAdvancedOverlayListenerEvent["AnchorForTrackedBarcode"] = "onAnchorForTrackedBarcodeEvent";
    BarcodeTrackingAdvancedOverlayListenerEvent["OffsetForTrackedBarcode"] = "onOffsetForTrackedBarcodeEvent";
    BarcodeTrackingAdvancedOverlayListenerEvent["DidTapViewForTrackedBarcode"] = "onTapViewForTrackedBarcodeEvent";
})(BarcodeTrackingAdvancedOverlayListenerEvent || (BarcodeTrackingAdvancedOverlayListenerEvent = {}));
export class BarcodeTrackingAdvancedOverlayProxy {
    static forOverlay(overlay) {
        const proxy = new BarcodeTrackingAdvancedOverlayProxy();
        proxy.overlay = overlay;
        proxy.initialize();
        return proxy;
    }
    setViewForTrackedBarcode(view, trackedBarcode) {
        if (view instanceof Promise) {
            return view.then(v => this.setViewForTrackedBarcodeSync(v, trackedBarcode));
        }
        else {
            return this.setViewForTrackedBarcodeSync(view, trackedBarcode);
        }
    }
    setViewForTrackedBarcodeSync(view, trackedBarcode) {
        return new Promise((resolve, reject) => {
            BarcodeTrackingAdvancedOverlayProxy.capacitorExec(resolve, reject, CapacitorFunction.SetViewForTrackedBarcode, {
                view: view ? view.toJSON() : null,
                sessionFrameSequenceID: trackedBarcode.sessionFrameSequenceID,
                trackedBarcodeID: trackedBarcode.identifier,
            });
        });
    }
    setAnchorForTrackedBarcode(anchor, trackedBarcode) {
        return new Promise((resolve, reject) => {
            BarcodeTrackingAdvancedOverlayProxy.capacitorExec(resolve, reject, CapacitorFunction.SetAnchorForTrackedBarcode, {
                anchor,
                sessionFrameSequenceID: trackedBarcode.sessionFrameSequenceID,
                trackedBarcodeID: trackedBarcode.identifier,
            });
        });
    }
    setOffsetForTrackedBarcode(offset, trackedBarcode) {
        return new Promise((resolve, reject) => {
            BarcodeTrackingAdvancedOverlayProxy.capacitorExec(resolve, reject, CapacitorFunction.SetOffsetForTrackedBarcode, {
                offset: offset ? JSON.stringify(offset.toJSON()) : null,
                sessionFrameSequenceID: trackedBarcode.sessionFrameSequenceID,
                trackedBarcodeID: trackedBarcode.identifier,
            });
        });
    }
    clearTrackedBarcodeViews() {
        return new Promise((resolve, reject) => {
            BarcodeTrackingAdvancedOverlayProxy.capacitorExec(resolve, reject, CapacitorFunction.ClearTrackedBarcodeViews, null);
        });
    }
    subscribeListener() {
        window.Capacitor.Plugins[Capacitor.pluginName][CapacitorFunction.SubscribeBarcodeTrackingAdvancedOverlayListener]();
        window.Capacitor.Plugins[Capacitor.pluginName].addListener(BarcodeTrackingAdvancedOverlayListenerEvent.AnchorForTrackedBarcode, this.notifyListeners.bind(this));
        window.Capacitor.Plugins[Capacitor.pluginName].addListener(BarcodeTrackingAdvancedOverlayListenerEvent.DidTapViewForTrackedBarcode, this.notifyListeners.bind(this));
        window.Capacitor.Plugins[Capacitor.pluginName].addListener(BarcodeTrackingAdvancedOverlayListenerEvent.OffsetForTrackedBarcode, this.notifyListeners.bind(this));
        window.Capacitor.Plugins[Capacitor.pluginName].addListener(BarcodeTrackingAdvancedOverlayListenerEvent.ViewForTrackedBarcode, this.notifyListeners.bind(this));
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
            case BarcodeTrackingAdvancedOverlayListenerEvent.ViewForTrackedBarcode:
                if (this.overlay.listener.viewForTrackedBarcode) {
                    const trackedBarcode = TrackedBarcode
                        .fromJSON(JSON.parse(event.trackedBarcode));
                    const view = this.overlay.listener.viewForTrackedBarcode(this.overlay, trackedBarcode);
                    if (view instanceof Promise) {
                        this.setViewForTrackedBarcode(view, trackedBarcode);
                        return doReturnWithFinish(event.name, { view: null });
                    }
                    else {
                        return doReturnWithFinish(event.name, { view: view ? view.toJSON() : null });
                    }
                }
                break;
            case BarcodeTrackingAdvancedOverlayListenerEvent.AnchorForTrackedBarcode:
                if (this.overlay.listener.anchorForTrackedBarcode) {
                    const trackedBarcode = TrackedBarcode
                        .fromJSON(JSON.parse(event.trackedBarcode));
                    const anchor = this.overlay.listener.anchorForTrackedBarcode(this.overlay, trackedBarcode);
                    return doReturnWithFinish(event.name, { anchor });
                }
                break;
            case BarcodeTrackingAdvancedOverlayListenerEvent.OffsetForTrackedBarcode:
                if (this.overlay.listener.offsetForTrackedBarcode) {
                    const trackedBarcode = TrackedBarcode
                        .fromJSON(JSON.parse(event.trackedBarcode));
                    const offset = this.overlay.listener.offsetForTrackedBarcode(this.overlay, trackedBarcode);
                    return doReturnWithFinish(event.name, { offset: JSON.stringify(offset.toJSON()) });
                }
                break;
            case BarcodeTrackingAdvancedOverlayListenerEvent.DidTapViewForTrackedBarcode:
                if (this.overlay.listener.didTapViewForTrackedBarcode) {
                    const trackedBarcode = TrackedBarcode
                        .fromJSON(JSON.parse(event.trackedBarcode));
                    this.overlay.listener.didTapViewForTrackedBarcode(this.overlay, trackedBarcode);
                }
                break;
        }
        return doReturnWithFinish(event.name, null);
    }
    initialize() {
        this.subscribeListener();
    }
}
BarcodeTrackingAdvancedOverlayProxy.capacitorExec = Capacitor.exec;
//# sourceMappingURL=BarcodeTrackingAdvancedOverlayProxy.js.map