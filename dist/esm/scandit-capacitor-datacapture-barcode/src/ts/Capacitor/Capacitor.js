import { Plugins } from '@capacitor/core';
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
})(CapacitorFunction || (CapacitorFunction = {}));
const pluginName = 'ScanditBarcodeNative';
// tslint:disable-next-line:variable-name
export const Capacitor = {
    pluginName,
    defaults: {},
    exec: (success, error, functionName, args) => capacitorExec(success, error, pluginName, functionName, args),
};
export const getDefaults = new Promise((resolve, reject) => Plugins[Capacitor.pluginName][CapacitorFunction.GetDefaults]().then((defaultsJSON) => {
    const defaults = defaultsFromJSON(defaultsJSON);
    Capacitor.defaults = defaults;
    resolve(defaults);
}, reject));
// To circumvent a circular dependency
SymbologyDescription.defaults = () => Capacitor.defaults;
//# sourceMappingURL=Capacitor.js.map