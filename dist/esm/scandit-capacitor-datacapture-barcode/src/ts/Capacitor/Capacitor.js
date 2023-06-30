var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { capacitorExec } from '../../../../scandit-capacitor-datacapture-core/src/ts/Capacitor/CommonCapacitor';
import { SymbologyDescription } from '../Barcode';
import { defaultsFromJSON } from './Defaults';
export var CapacitorFunction;
(function (CapacitorFunction) {
    CapacitorFunction["GetDefaults"] = "getDefaults";
    CapacitorFunction["SubscribeBarcodeCaptureListener"] = "subscribeBarcodeCaptureListener";
    CapacitorFunction["SubscribeBarcodeTrackingListener"] = "subscribeBarcodeTrackingListener";
    CapacitorFunction["SubscribeBarcodeTrackingBasicOverlayListener"] = "subscribeBarcodeTrackingBasicOverlayListener";
    CapacitorFunction["SetBrushForTrackedBarcode"] = "setBrushForTrackedBarcode";
    CapacitorFunction["ClearTrackedBarcodeBrushes"] = "clearTrackedBarcodeBrushes";
    CapacitorFunction["SubscribeBarcodeTrackingAdvancedOverlayListener"] = "subscribeBarcodeTrackingAdvancedOverlayListener";
    CapacitorFunction["SetViewForTrackedBarcode"] = "setViewForTrackedBarcode";
    CapacitorFunction["SetAnchorForTrackedBarcode"] = "setAnchorForTrackedBarcode";
    CapacitorFunction["SetOffsetForTrackedBarcode"] = "setOffsetForTrackedBarcode";
    CapacitorFunction["ClearTrackedBarcodeViews"] = "clearTrackedBarcodeViews";
    CapacitorFunction["SubscribeBarcodeSelectionListener"] = "subscribeBarcodeSelectionListener";
    CapacitorFunction["GetCountForBarcodeInBarcodeSelectionSession"] = "getCountForBarcodeInBarcodeSelectionSession";
    CapacitorFunction["ResetBarcodeCaptureSession"] = "resetBarcodeCaptureSession";
    CapacitorFunction["ResetBarcodeTrackingSession"] = "resetBarcodeTrackingSession";
    CapacitorFunction["ResetBarcodeSelectionSession"] = "resetBarcodeSelectionSession";
    CapacitorFunction["ResetBarcodeSelection"] = "resetBarcodeSelection";
    CapacitorFunction["UnfreezeCameraInBarcodeSelection"] = "unfreezeCameraInBarcodeSelection";
    CapacitorFunction["SubscribeBarcodeCountListener"] = "registerBarcodeCountListener";
    CapacitorFunction["UnsubscribeBarcodeCountListener"] = "unregisterBarcodeCountListener";
    CapacitorFunction["ResetBarcodeCountSession"] = "resetBarcodeCountSession";
    CapacitorFunction["StartBarcodeCountScanningPhase"] = "startScanningPhase";
    CapacitorFunction["EndBarcodeCountScanningPhase"] = "endScanningPhase";
    CapacitorFunction["SetBarcodeCountCaptureList"] = "setBarcodeCountCaptureList";
})(CapacitorFunction || (CapacitorFunction = {}));
const pluginName = 'ScanditBarcodeNative';
// tslint:disable-next-line:variable-name
export const Capacitor = {
    pluginName,
    defaults: {},
    exec: (success, error, functionName, args) => capacitorExec(success, error, pluginName, functionName, args),
};
export const getDefaults = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const defaultsJSON = yield window.Capacitor.Plugins[pluginName][CapacitorFunction.GetDefaults]();
        const defaults = defaultsFromJSON(defaultsJSON);
        Capacitor.defaults = defaults;
    }
    catch (error) {
        // tslint:disable-next-line:no-console
        console.warn(error);
    }
    return Capacitor.defaults;
});
// To circumvent a circular dependency
SymbologyDescription.defaults = () => Capacitor.defaults;
//# sourceMappingURL=Capacitor.js.map