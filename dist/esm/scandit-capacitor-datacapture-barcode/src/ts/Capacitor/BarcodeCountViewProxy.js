import { ScanditBarcodeCountPluginNative } from '../../web';
import { TrackedBarcode } from '../Barcode';
import { Capacitor } from './Capacitor';
var BarcodeCountViewEventName;
(function (BarcodeCountViewEventName) {
    BarcodeCountViewEventName["singleScanButtonTapped"] = "barcodeCountViewUiListener-onSingleScanButtonTapped";
    BarcodeCountViewEventName["listButtonTapped"] = "barcodeCountViewUiListener-onListButtonTapped";
    BarcodeCountViewEventName["exitButtonTapped"] = "barcodeCountViewUiListener-onExitButtonTapped";
    BarcodeCountViewEventName["brushForRecognizedBarcode"] = "barcodeCountViewListener-brushForRecognizedBarcode";
    BarcodeCountViewEventName["brushForRecognizedBarcodeNotInList"] = "barcodeCountViewListener-brushForRecognizedBarcodeNotInList";
    BarcodeCountViewEventName["brushForUnrecognizedBarcode"] = "barcodeCountViewListener-brushForUnrecognizedBarcode";
    BarcodeCountViewEventName["filteredBarcodeTapped"] = "barcodeCountViewListener-onFilteredBarcodeTapped";
    BarcodeCountViewEventName["recognizedBarcodeNotInListTapped"] = "barcodeCountViewListener-onRecognizedBarcodeNotInListTapped";
    BarcodeCountViewEventName["recognizedBarcodeTapped"] = "barcodeCountViewListener-onRecognizedBarcodeTapped";
    BarcodeCountViewEventName["unrecognizedBarcodeTapped"] = "barcodeCountViewListener-onUnrecognizedBarcodeTapped";
    BarcodeCountViewEventName["captureListCompleted"] = "barcodeCountViewListener-onCaptureListCompleted";
})(BarcodeCountViewEventName || (BarcodeCountViewEventName = {}));
export class BarcodeCountViewProxy {
    static forBarcodeCount(view) {
        const viewProxy = new BarcodeCountViewProxy();
        viewProxy.barcodeCount = view._barcodeCount;
        viewProxy.view = view;
        // // First we need to initialize the context, so it will set up the DataCaptureContextProxy.
        view._context.initialize();
        // // We call update because it returns a promise, this guarantees, that by the time
        // // we need the deserialized context, it will be set in the native layer.
        // (view.context as any as PrivateDataCaptureContext).update().then(() => {
        //   viewProxy.create();
        // });
        view._context.update();
        viewProxy.create();
        viewProxy.subscribeListeners();
        return viewProxy;
    }
    constructor() {
        this.isInListenerCallback = false;
        this.notifyListeners = this.notifyListeners.bind(this);
        this.recognizedBarcodeTappedHandler = this.recognizedBarcodeTappedHandler.bind(this);
        this.singleScanButtonTappedHandler = this.singleScanButtonTappedHandler.bind(this);
        this.listButtonTappedHandler = this.listButtonTappedHandler.bind(this);
        this.exitButtonTappedHandler = this.exitButtonTappedHandler.bind(this);
        this.filteredBarcodeTappedHandler = this.filteredBarcodeTappedHandler.bind(this);
        this.recognizedBarcodeNotInListTappedHandler = this.recognizedBarcodeNotInListTappedHandler.bind(this);
        this.unrecognizedBarcodeTappedHandler = this.unrecognizedBarcodeTappedHandler.bind(this);
        this.captureListCompletedHandler = this.captureListCompletedHandler.bind(this);
    }
    update() {
        const barcodeCountView = this.view.toJSON();
        const json = JSON.stringify(barcodeCountView);
        return ScanditBarcodeCountPluginNative.updateView({ BarcodeCountView: json });
    }
    create() {
        const barcodeCountView = this.view.toJSON();
        const json = {
            BarcodeCount: JSON.stringify(this.view._barcodeCount.toJSON()),
            BarcodeCountView: JSON.stringify(barcodeCountView)
        };
        return ScanditBarcodeCountPluginNative.createView(json);
    }
    dispose() {
        this.unsubscribeListeners();
    }
    setUiListener(listener) {
        if (!!listener) {
            ScanditBarcodeCountPluginNative.registerBarcodeCountViewUiListener();
        }
        else {
            ScanditBarcodeCountPluginNative.unregisterBarcodeCountViewUiListener();
        }
    }
    setListener(listener) {
        if (!!listener) {
            ScanditBarcodeCountPluginNative.registerBarcodeCountViewListener();
        }
        else {
            ScanditBarcodeCountPluginNative.unregisterBarcodeCountViewListener();
        }
    }
    clearHighlights() {
        return ScanditBarcodeCountPluginNative.clearBarcodeCountViewHighlights();
    }
    setPositionAndSize(top, left, width, height, shouldBeUnderWebView) {
        return ScanditBarcodeCountPluginNative.setViewPositionAndSize({ position: { top, left, width, height, shouldBeUnderWebView } });
    }
    show() {
        return ScanditBarcodeCountPluginNative.showView();
    }
    hide() {
        return ScanditBarcodeCountPluginNative.hideView();
    }
    subscribeListeners() {
        window.Capacitor.Plugins[Capacitor.pluginName]
            .addListener(BarcodeCountViewEventName.singleScanButtonTapped, this.singleScanButtonTappedHandler);
        window.Capacitor.Plugins[Capacitor.pluginName]
            .addListener(BarcodeCountViewEventName.listButtonTapped, this.listButtonTappedHandler);
        window.Capacitor.Plugins[Capacitor.pluginName]
            .addListener(BarcodeCountViewEventName.exitButtonTapped, this.exitButtonTappedHandler);
        window.Capacitor.Plugins[Capacitor.pluginName]
            .addListener(BarcodeCountViewEventName.brushForRecognizedBarcode, this.notifyListeners);
        window.Capacitor.Plugins[Capacitor.pluginName]
            .addListener(BarcodeCountViewEventName.brushForRecognizedBarcodeNotInList, this.notifyListeners);
        window.Capacitor.Plugins[Capacitor.pluginName]
            .addListener(BarcodeCountViewEventName.brushForUnrecognizedBarcode, this.notifyListeners);
        window.Capacitor.Plugins[Capacitor.pluginName]
            .addListener(BarcodeCountViewEventName.filteredBarcodeTapped, this.filteredBarcodeTappedHandler);
        window.Capacitor.Plugins[Capacitor.pluginName]
            .addListener(BarcodeCountViewEventName.recognizedBarcodeNotInListTapped, this.recognizedBarcodeNotInListTappedHandler);
        window.Capacitor.Plugins[Capacitor.pluginName]
            .addListener(BarcodeCountViewEventName.recognizedBarcodeTapped, this.recognizedBarcodeTappedHandler);
        window.Capacitor.Plugins[Capacitor.pluginName]
            .addListener(BarcodeCountViewEventName.unrecognizedBarcodeTapped, this.unrecognizedBarcodeTappedHandler);
        window.Capacitor.Plugins[Capacitor.pluginName]
            .addListener(BarcodeCountViewEventName.captureListCompleted, this.captureListCompletedHandler);
    }
    unsubscribeListeners() {
        window.Capacitor.Plugins[Capacitor.pluginName]
            .removeListener(BarcodeCountViewEventName.singleScanButtonTapped, this.singleScanButtonTappedHandler);
        window.Capacitor.Plugins[Capacitor.pluginName]
            .removeListener(BarcodeCountViewEventName.listButtonTapped, this.listButtonTappedHandler);
        window.Capacitor.Plugins[Capacitor.pluginName]
            .removeListener(BarcodeCountViewEventName.exitButtonTapped, this.exitButtonTappedHandler);
        window.Capacitor.Plugins[Capacitor.pluginName]
            .removeListener(BarcodeCountViewEventName.brushForRecognizedBarcode, this.notifyListeners);
        window.Capacitor.Plugins[Capacitor.pluginName]
            .removeListener(BarcodeCountViewEventName.brushForRecognizedBarcodeNotInList, this.notifyListeners);
        window.Capacitor.Plugins[Capacitor.pluginName]
            .removeListener(BarcodeCountViewEventName.brushForUnrecognizedBarcode, this.notifyListeners);
        window.Capacitor.Plugins[Capacitor.pluginName]
            .removeListener(BarcodeCountViewEventName.filteredBarcodeTapped, this.filteredBarcodeTappedHandler);
        window.Capacitor.Plugins[Capacitor.pluginName]
            .removeListener(BarcodeCountViewEventName.recognizedBarcodeNotInListTapped, this.recognizedBarcodeNotInListTappedHandler);
        window.Capacitor.Plugins[Capacitor.pluginName]
            .removeListener(BarcodeCountViewEventName.recognizedBarcodeTapped, this.recognizedBarcodeTappedHandler);
        window.Capacitor.Plugins[Capacitor.pluginName]
            .removeListener(BarcodeCountViewEventName.unrecognizedBarcodeTapped, this.unrecognizedBarcodeTappedHandler);
        window.Capacitor.Plugins[Capacitor.pluginName]
            .removeListener(BarcodeCountViewEventName.captureListCompleted, this.captureListCompletedHandler);
    }
    singleScanButtonTappedHandler() {
        var _a, _b;
        this.isInListenerCallback = true;
        (_b = (_a = this.view.uiListener) === null || _a === void 0 ? void 0 : _a.didTapSingleScanButton) === null || _b === void 0 ? void 0 : _b.call(_a, this.view);
        this.isInListenerCallback = false;
    }
    listButtonTappedHandler() {
        var _a, _b;
        this.isInListenerCallback = true;
        (_b = (_a = this.view.uiListener) === null || _a === void 0 ? void 0 : _a.didTapListButton) === null || _b === void 0 ? void 0 : _b.call(_a, this.view);
        this.isInListenerCallback = false;
    }
    exitButtonTappedHandler() {
        var _a, _b;
        this.isInListenerCallback = true;
        (_b = (_a = this.view.uiListener) === null || _a === void 0 ? void 0 : _a.didTapExitButton) === null || _b === void 0 ? void 0 : _b.call(_a, this.view);
        this.isInListenerCallback = false;
    }
    filteredBarcodeTappedHandler(trackedBarcode) {
        if (this.view.listener && this.view.listener.didTapFilteredBarcode) {
            this.view.listener.didTapFilteredBarcode(this.view, trackedBarcode);
        }
    }
    recognizedBarcodeNotInListTappedHandler(trackedBarcode) {
        if (this.view.listener && this.view.listener.didTapRecognizedBarcodeNotInList) {
            this.view.listener.didTapRecognizedBarcodeNotInList(this.view, trackedBarcode);
        }
    }
    recognizedBarcodeTappedHandler(trackedBarcode) {
        if (this.view.listener && this.view.listener.didTapRecognizedBarcode) {
            this.view.listener.didTapRecognizedBarcode(this.view, trackedBarcode);
        }
    }
    unrecognizedBarcodeTappedHandler(trackedBarcode) {
        if (this.view.listener && this.view.listener.didTapUnrecognizedBarcode) {
            this.view.listener.didTapUnrecognizedBarcode(this.view, trackedBarcode);
        }
    }
    captureListCompletedHandler() {
        if (this.view.listener && this.view.listener.didCompleteCaptureList) {
            this.view.listener.didCompleteCaptureList(this.view);
        }
    }
    notifyListeners(event) {
        var _a, _b, _c;
        const done = () => {
            this.barcodeCount.isInListenerCallback = false;
            return { enabled: this.barcodeCount.isEnabled };
        };
        this.barcodeCount.isInListenerCallback = true;
        if (!event) {
            // The event could be undefined/null in case the plugin result did not pass a "message",
            // which could happen e.g. in case of "ok" results, which could signal e.g. successful
            // listener subscriptions.
            return done();
        }
        let trackedBarcode;
        let brush;
        event = Object.assign(Object.assign(Object.assign({}, event), event.argument), { argument: undefined });
        switch (event.name) {
            case BarcodeCountViewEventName.brushForRecognizedBarcode:
                trackedBarcode = TrackedBarcode
                    .fromJSON(JSON.parse((_a = event.trackedBarcode) !== null && _a !== void 0 ? _a : ''));
                brush = this.view.recognizedBrush;
                if (this.view.listener && this.view.listener.brushForRecognizedBarcode) {
                    brush = this.view.listener.brushForRecognizedBarcode(this.view, trackedBarcode);
                }
                const brushForRecognizedBarcodePayload = { brush: brush ? JSON.stringify(brush.toJSON()) : null, trackedBarcodeId: trackedBarcode.identifier };
                ScanditBarcodeCountPluginNative.finishBarcodeCountViewListenerBrushForRecognizedBarcode(brushForRecognizedBarcodePayload);
                break;
            case BarcodeCountViewEventName.brushForRecognizedBarcodeNotInList:
                trackedBarcode = TrackedBarcode
                    .fromJSON(JSON.parse((_b = event.trackedBarcode) !== null && _b !== void 0 ? _b : ''));
                brush = this.view.notInListBrush;
                if (this.view.listener && this.view.listener.brushForRecognizedBarcodeNotInList) {
                    brush = this.view.listener.brushForRecognizedBarcodeNotInList(this.view, trackedBarcode);
                }
                const brushForRecognizedBarcodeNotInListPayload = { brush: brush ? JSON.stringify(brush.toJSON()) : null, trackedBarcodeId: trackedBarcode.identifier };
                ScanditBarcodeCountPluginNative.finishBarcodeCountViewListenerBrushForRecognizedBarcodeNotInList(brushForRecognizedBarcodeNotInListPayload);
                break;
            case BarcodeCountViewEventName.brushForUnrecognizedBarcode:
                trackedBarcode = TrackedBarcode
                    .fromJSON(JSON.parse((_c = event.trackedBarcode) !== null && _c !== void 0 ? _c : ''));
                brush = this.view.unrecognizedBrush;
                if (this.view.listener && this.view.listener.brushForUnrecognizedBarcode) {
                    brush = this.view.listener.brushForUnrecognizedBarcode(this.view, trackedBarcode);
                }
                const brushForUnrecognizedBarcodePayload = { brush: brush ? JSON.stringify(brush.toJSON()) : null, trackedBarcodeId: trackedBarcode.identifier };
                ScanditBarcodeCountPluginNative.finishBarcodeCountViewListenerOnBrushForUnrecognizedBarcode(brushForUnrecognizedBarcodePayload);
                break;
        }
        return done();
    }
}
//# sourceMappingURL=BarcodeCountViewProxy.js.map