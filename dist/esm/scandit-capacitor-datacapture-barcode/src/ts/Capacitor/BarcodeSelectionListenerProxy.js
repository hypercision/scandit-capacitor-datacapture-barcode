import { CameraProxy } from '../../../../scandit-capacitor-datacapture-core/src/ts/Capacitor/CameraProxy';
import { BarcodeSelectionSession, } from '../BarcodeSelection+Related';
import { Capacitor, CapacitorFunction } from './Capacitor';
var BarcodeSelectionListenerEvent;
(function (BarcodeSelectionListenerEvent) {
    BarcodeSelectionListenerEvent["DidUpdateSelection"] = "didUpdateSelectionInBarcodeSelection";
    BarcodeSelectionListenerEvent["DidUpdateSession"] = "didUpdateSessionInBarcodeSelection";
})(BarcodeSelectionListenerEvent || (BarcodeSelectionListenerEvent = {}));
export class BarcodeSelectionListenerProxy {
    static forBarcodeSelection(barcodeSelection) {
        const proxy = new BarcodeSelectionListenerProxy();
        proxy.barcodeSelection = barcodeSelection;
        proxy.initialize();
        return proxy;
    }
    getCount(barcode) {
        return new Promise((resolve, reject) => {
            BarcodeSelectionListenerProxy.exec((response) => resolve(response.result), reject, CapacitorFunction.GetCountForBarcodeInBarcodeSelectionSession, {
                selectionIdentifier: barcode.selectionIdentifier,
            });
        });
    }
    reset() {
        return window.Capacitor.Plugins[Capacitor.pluginName][CapacitorFunction.ResetBarcodeSelectionSession]();
    }
    initialize() {
        this.subscribeListener();
    }
    subscribeListener() {
        window.Capacitor.Plugins[Capacitor.pluginName][CapacitorFunction.SubscribeBarcodeSelectionListener]();
        window.Capacitor.Plugins[Capacitor.pluginName]
            .addListener(BarcodeSelectionListenerEvent.DidUpdateSession, this.notifyListeners.bind(this));
        window.Capacitor.Plugins[Capacitor.pluginName]
            .addListener(BarcodeSelectionListenerEvent.DidUpdateSelection, this.notifyListeners.bind(this));
    }
    notifyListeners(event) {
        const done = () => {
            this.barcodeSelection.isInListenerCallback = false;
            window.Capacitor.Plugins[Capacitor.pluginName].finishCallback({
                result: {
                    enabled: this.barcodeSelection.isEnabled,
                    finishCallbackID: event.name,
                },
            });
            return { enabled: this.barcodeSelection.isEnabled };
        };
        this.barcodeSelection.isInListenerCallback = true;
        if (!event) {
            // The event could be undefined/null in case the plugin result did not pass a "message",
            // which could happen e.g. in case of "ok" results, which could signal e.g. successful
            // listener subscriptions.
            return done();
        }
        event = Object.assign(Object.assign(Object.assign({}, event), event.argument), { argument: undefined });
        this.barcodeSelection.listeners.forEach((listener) => {
            switch (event.name) {
                case BarcodeSelectionListenerEvent.DidUpdateSelection:
                    if (listener.didUpdateSelection) {
                        const session = BarcodeSelectionSession
                            .fromJSON(JSON.parse(event.session));
                        session.listenerProxy = this;
                        listener.didUpdateSelection(this.barcodeSelection, session, CameraProxy.getLastFrame);
                    }
                    break;
                case BarcodeSelectionListenerEvent.DidUpdateSession:
                    if (listener.didUpdateSession) {
                        const session = BarcodeSelectionSession
                            .fromJSON(JSON.parse(event.session));
                        session.listenerProxy = this;
                        listener.didUpdateSession(this.barcodeSelection, session, CameraProxy.getLastFrame);
                    }
                    break;
            }
        });
        return done();
    }
}
BarcodeSelectionListenerProxy.exec = Capacitor.exec;
//# sourceMappingURL=BarcodeSelectionListenerProxy.js.map