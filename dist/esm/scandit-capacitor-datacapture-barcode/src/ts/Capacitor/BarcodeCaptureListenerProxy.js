import { BarcodeCaptureSession } from '../BarcodeCapture+Related';
import { Plugins } from '@capacitor/core';
import { Capacitor, CapacitorFunction } from './Capacitor';
var BarcodeCaptureListenerEvent;
(function (BarcodeCaptureListenerEvent) {
    BarcodeCaptureListenerEvent["DidScan"] = "onBarcodeScannedEvent";
    BarcodeCaptureListenerEvent["DidUpdateSession"] = "onSessionUpdateEvent";
})(BarcodeCaptureListenerEvent || (BarcodeCaptureListenerEvent = {}));
export class BarcodeCaptureListenerProxy {
    static forBarcodeCapture(barcodeCapture) {
        const proxy = new BarcodeCaptureListenerProxy();
        proxy.barcodeCapture = barcodeCapture;
        proxy.initialize();
        return proxy;
    }
    initialize() {
        this.subscribeListener();
    }
    reset() {
        return Plugins[Capacitor.pluginName][CapacitorFunction.ResetBarcodeCaptureSession]();
    }
    subscribeListener() {
        Plugins[Capacitor.pluginName][CapacitorFunction.SubscribeBarcodeCaptureListener]();
        Plugins[Capacitor.pluginName]
            .addListener(BarcodeCaptureListenerEvent.DidScan, this.notifyListeners.bind(this));
        Plugins[Capacitor.pluginName]
            .addListener(BarcodeCaptureListenerEvent.DidUpdateSession, this.notifyListeners.bind(this));
    }
    notifyListeners(event) {
        const done = () => {
            this.barcodeCapture.isInListenerCallback = false;
            Plugins[Capacitor.pluginName].finishCallback({
                result: {
                    enabled: this.barcodeCapture.isEnabled,
                    finishCallbackID: event.name,
                },
            });
            return { enabled: this.barcodeCapture.isEnabled };
        };
        this.barcodeCapture.isInListenerCallback = true;
        if (!event) {
            // The event could be undefined/null in case the plugin result did not pass a "message",
            // which could happen e.g. in case of "ok" results, which could signal e.g. successful
            // listener subscriptions.
            return done();
        }
        event = Object.assign(Object.assign(Object.assign({}, event), event.argument), { argument: undefined });
        this.barcodeCapture.listeners.forEach((listener) => {
            switch (event.name) {
                case BarcodeCaptureListenerEvent.DidScan:
                    if (listener.didScan) {
                        listener.didScan(this.barcodeCapture, BarcodeCaptureSession
                            .fromJSON(JSON.parse(event.session)));
                    }
                    break;
                case BarcodeCaptureListenerEvent.DidUpdateSession:
                    if (listener.didUpdateSession) {
                        listener.didUpdateSession(this.barcodeCapture, BarcodeCaptureSession
                            .fromJSON(JSON.parse(event.session)));
                    }
                    break;
            }
        });
        return done();
    }
}
BarcodeCaptureListenerProxy.capacitorExec = Capacitor.exec;
//# sourceMappingURL=BarcodeCaptureListenerProxy.js.map