import { CameraProxy } from '../../../../scandit-capacitor-datacapture-core/src/ts/Capacitor/CameraProxy';
import { BarcodeTrackingSession, } from '../BarcodeTracking+Related';
import { Capacitor, CapacitorFunction } from './Capacitor';
var BarcodeTrackingListenerEvent;
(function (BarcodeTrackingListenerEvent) {
    BarcodeTrackingListenerEvent["DidUpdateSession"] = "onTrackingSessionUpdateEvent";
})(BarcodeTrackingListenerEvent || (BarcodeTrackingListenerEvent = {}));
export class BarcodeTrackingListenerProxy {
    static forBarcodeTracking(barcodeTracking) {
        const proxy = new BarcodeTrackingListenerProxy();
        proxy.barcodeTracking = barcodeTracking;
        proxy.initialize();
        return proxy;
    }
    initialize() {
        this.subscribeListener();
    }
    subscribeListener() {
        window.Capacitor.Plugins[Capacitor.pluginName][CapacitorFunction.SubscribeBarcodeTrackingListener]();
        window.Capacitor.Plugins[Capacitor.pluginName]
            .addListener(BarcodeTrackingListenerEvent.DidUpdateSession, this.notifyListeners.bind(this));
    }
    reset() {
        return window.Capacitor.Plugins[Capacitor.pluginName][CapacitorFunction.ResetBarcodeTrackingSession]();
    }
    notifyListeners(event) {
        const done = () => {
            this.barcodeTracking.isInListenerCallback = false;
            window.Capacitor.Plugins[Capacitor.pluginName].finishCallback({
                result: {
                    enabled: this.barcodeTracking.isEnabled,
                    finishCallbackID: event.name,
                },
            });
            return { enabled: this.barcodeTracking.isEnabled };
        };
        this.barcodeTracking.isInListenerCallback = true;
        if (!event) {
            // The event could be undefined/null in case the plugin result did not pass a "message",
            // which could happen e.g. in case of "ok" results, which could signal e.g. successful
            // listener subscriptions.
            return done();
        }
        event = Object.assign(Object.assign(Object.assign({}, event), event.argument), { argument: undefined });
        this.barcodeTracking.listeners.forEach((listener) => {
            switch (event.name) {
                case BarcodeTrackingListenerEvent.DidUpdateSession:
                    if (listener.didUpdateSession) {
                        listener.didUpdateSession(this.barcodeTracking, BarcodeTrackingSession
                            .fromJSON(JSON.parse(event.session)), CameraProxy.getLastFrame);
                    }
                    break;
            }
        });
        return done();
    }
}
BarcodeTrackingListenerProxy.capacitorExec = Capacitor.exec;
//# sourceMappingURL=BarcodeTrackingListenerProxy.js.map