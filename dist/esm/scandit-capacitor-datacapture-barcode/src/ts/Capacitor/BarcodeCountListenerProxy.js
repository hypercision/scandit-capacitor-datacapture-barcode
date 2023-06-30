import { CameraProxy } from '../../../../scandit-capacitor-datacapture-core/src/ts/Capacitor/CameraProxy';
import { Capacitor, CapacitorFunction } from './Capacitor';
import { BarcodeCountSession } from '../BarcodeCount+Related';
import { BarcodeCountCaptureListSession } from '../BarcodeCountCaptureList';
import { ScanditBarcodeCountPluginNative } from '../../web';
var BarcodeCountListenerEventName;
(function (BarcodeCountListenerEventName) {
    BarcodeCountListenerEventName["didScan"] = "barcodeCountListener-scan";
    BarcodeCountListenerEventName["didListSessionUpdate"] = "barcodeCountCaptureListListener-onCaptureListSessionUpdated";
})(BarcodeCountListenerEventName || (BarcodeCountListenerEventName = {}));
export class BarcodeCountListenerProxy {
    static forBarcodeCount(barcodeCount) {
        const proxy = new BarcodeCountListenerProxy();
        proxy.barcodeCount = barcodeCount;
        proxy.initialize();
        return proxy;
    }
    constructor() {
        this.notifyListeners = this.notifyListeners.bind(this);
    }
    initialize() {
        this.subscribeListener();
    }
    reset() {
        return ScanditBarcodeCountPluginNative.resetBarcodeCount();
    }
    resetSession() {
        return ScanditBarcodeCountPluginNative.resetBarcodeCountSession();
    }
    subscribeListener() {
        ScanditBarcodeCountPluginNative.registerBarcodeCountListener();
        window.Capacitor.Plugins[Capacitor.pluginName]
            .addListener(BarcodeCountListenerEventName.didScan, this.notifyListeners);
        window.Capacitor.Plugins[Capacitor.pluginName]
            .addListener(BarcodeCountListenerEventName.didListSessionUpdate, this.notifyListeners);
    }
    unsubscribeListener() {
        window.Capacitor.Plugins[Capacitor.pluginName][CapacitorFunction.UnsubscribeBarcodeCountListener]();
        window.Capacitor.Plugins[Capacitor.pluginName]
            .removeListener(BarcodeCountListenerEventName.didScan, this.notifyListeners);
        window.Capacitor.Plugins[Capacitor.pluginName]
            .removeListener(BarcodeCountListenerEventName.didListSessionUpdate, this.notifyListeners);
    }
    startScanningPhase() {
        ScanditBarcodeCountPluginNative.startScanningPhase();
    }
    endScanningPhase() {
        ScanditBarcodeCountPluginNative.endScanningPhase();
    }
    setBarcodeCountCaptureList(barcodeCountCaptureList) {
        this._barcodeCountCaptureList = barcodeCountCaptureList;
        const targetBarcodesJson = barcodeCountCaptureList.targetBarcodes;
        ScanditBarcodeCountPluginNative.setBarcodeCountCaptureList({ TargetBarcodes: targetBarcodesJson });
    }
    notifyListeners(event) {
        var _a;
        const barcodeCount = this.barcodeCount;
        const done = () => {
            barcodeCount.isInListenerCallback = false;
            window.Capacitor.Plugins[Capacitor.pluginName].finishBarcodeCountListenerOnScan();
            return { enabled: this.barcodeCount.isEnabled };
        };
        barcodeCount.isInListenerCallback = true;
        if (!event) {
            // The event could be undefined/null in case the plugin result did not pass a "message",
            // which could happen e.g. in case of "ok" results, which could signal e.g. successful
            // listener subscriptions.
            return done();
        }
        event = Object.assign(Object.assign(Object.assign({}, event), event.argument), { argument: undefined });
        barcodeCount.listeners.forEach((listener) => {
            switch (event.name) {
                case BarcodeCountListenerEventName.didScan:
                    if (listener.didScan) {
                        listener.didScan(this.barcodeCount, BarcodeCountSession.fromJSON(JSON.parse(event.session)), CameraProxy.getLastFrame);
                    }
                    break;
            }
        });
        if (event.name === BarcodeCountListenerEventName.didListSessionUpdate) {
            const barcodeCountCaptureListListener = (_a = this._barcodeCountCaptureList) === null || _a === void 0 ? void 0 : _a.listener;
            if (barcodeCountCaptureListListener && (barcodeCountCaptureListListener === null || barcodeCountCaptureListListener === void 0 ? void 0 : barcodeCountCaptureListListener.didUpdateSession)) {
                barcodeCountCaptureListListener.didUpdateSession(this._barcodeCountCaptureList, BarcodeCountCaptureListSession.fromJSON(JSON.parse(event.session)));
            }
        }
        return done();
    }
}
//# sourceMappingURL=BarcodeCountListenerProxy.js.map