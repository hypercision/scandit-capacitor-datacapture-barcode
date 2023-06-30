import { Feedback } from '../../../../scandit-capacitor-datacapture-core/src/ts/Feedback';
import { Brush } from '../../../../scandit-capacitor-datacapture-core/src/ts/Viewfinder';
import { BarcodeFilterSettings } from '../BarcodeFilterSettings';
import { CameraSettings } from '../../../../scandit-capacitor-datacapture-core/src/ts/Camera+Related';
import { Color } from '../../../../scandit-capacitor-datacapture-core/src/ts/Common';
export var BarcodeCountViewStyle;
(function (BarcodeCountViewStyle) {
    BarcodeCountViewStyle["Icon"] = "icon";
    BarcodeCountViewStyle["Dot"] = "dot";
})(BarcodeCountViewStyle || (BarcodeCountViewStyle = {}));
export const barcodeCountDefaultsFromJSON = (rootJson) => {
    var _a, _b, _c, _d, _e;
    function buildBrush(json) {
        if (!json || !json.fillColor || !json.strokeColor || !json.strokeWidth) {
            return new Brush();
        }
        const fillColor = Color.fromJSON(json.fillColor);
        const strokeColor = Color.fromJSON(json.strokeColor);
        const strokeWidth = json.strokeWidth;
        return new Brush(fillColor, strokeColor, strokeWidth);
    }
    const json = rootJson.BarcodeCount;
    return {
        RecommendedCameraSettings: CameraSettings
            .fromJSON(rootJson.BarcodeCapture.RecommendedCameraSettings),
        Feedback: {
            success: Feedback.fromJSON(JSON.parse(json.BarcodeCountFeedback).success),
            failure: Feedback.fromJSON(JSON.parse(json.BarcodeCountFeedback).failure)
        },
        BarcodeCountSettings: {
            expectOnlyUniqueBarcodes: (_b = (_a = json.BarcodeCountSettings) === null || _a === void 0 ? void 0 : _a.expectOnlyUniqueBarcodes) !== null && _b !== void 0 ? _b : false,
            disableModeWhenCaptureListCompleted: (_d = (_c = json.BarcodeCountSettings) === null || _c === void 0 ? void 0 : _c.disableModeWhenCaptureListCompleted) !== null && _d !== void 0 ? _d : true,
            barcodeFilterSettings: BarcodeFilterSettings.fromJSON((_e = json.BarcodeCountSettings) === null || _e === void 0 ? void 0 : _e.barcodeFilterSettings)
        },
        BarcodeCountView: Object.assign(Object.assign({}, json.BarcodeCountView), { defaultNotInListBrush: buildBrush(json.BarcodeCountView.defaultNotInListBrush), defaultRecognizedBrush: buildBrush(json.BarcodeCountView.defaultRecognizedBrush), defaultUnrecognizedBrush: buildBrush(json.BarcodeCountView.defaultUnrecognizedBrush) })
    };
};
//# sourceMappingURL=BarcodeCountDefaults.js.map