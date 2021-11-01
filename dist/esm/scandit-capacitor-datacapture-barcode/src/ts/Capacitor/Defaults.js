import { CameraSettings } from '../../../../scandit-capacitor-datacapture-core/src/ts/Camera+Related';
import { Color } from '../../../../scandit-capacitor-datacapture-core/src/ts/Common';
import { SymbologyDescription, SymbologySettings, } from '../Barcode';
export const defaultsFromJSON = (json) => {
    return {
        SymbologySettings: Object.keys(json.SymbologySettings)
            .reduce((settings, identifier) => {
            settings[identifier] = SymbologySettings
                .fromJSON(JSON.parse(json.SymbologySettings[identifier]));
            return settings;
        }, {}),
        SymbologyDescriptions: json.SymbologyDescriptions.map(description => SymbologyDescription.fromJSON(JSON.parse(description))),
        CompositeTypeDescriptions: json.CompositeTypeDescriptions.map(description => JSON.parse(description)),
        BarcodeCapture: {
            BarcodeCaptureOverlay: {
                defaultStyle: json.BarcodeCapture.BarcodeCaptureOverlay.defaultStyle,
                DefaultBrush: {
                    fillColor: Color
                        .fromJSON(json.BarcodeCapture.BarcodeCaptureOverlay.DefaultBrush.fillColor),
                    strokeColor: Color
                        .fromJSON(json.BarcodeCapture.BarcodeCaptureOverlay.DefaultBrush.strokeColor),
                    strokeWidth: json.BarcodeCapture.BarcodeCaptureOverlay.DefaultBrush.strokeWidth,
                },
                styles: Object
                    .keys(json.BarcodeCapture.BarcodeCaptureOverlay.styles)
                    .reduce((previousValue, currentValue) => {
                    return Object.assign(Object.assign({}, previousValue), { [currentValue]: {
                            DefaultBrush: {
                                fillColor: Color
                                    .fromJSON(json.BarcodeCapture.BarcodeCaptureOverlay.styles[currentValue].DefaultBrush.fillColor),
                                strokeColor: Color
                                    .fromJSON(json.BarcodeCapture.BarcodeCaptureOverlay.styles[currentValue].DefaultBrush.strokeColor),
                                strokeWidth: json.BarcodeCapture.BarcodeCaptureOverlay.styles[currentValue].DefaultBrush.strokeWidth,
                            },
                        } });
                }, {}),
            },
            BarcodeCaptureSettings: {
                codeDuplicateFilter: json.BarcodeCapture.BarcodeCaptureSettings.codeDuplicateFilter,
            },
            RecommendedCameraSettings: CameraSettings
                .fromJSON(json.BarcodeCapture.RecommendedCameraSettings),
        },
        BarcodeTracking: {
            RecommendedCameraSettings: CameraSettings
                .fromJSON(json.BarcodeTracking.RecommendedCameraSettings),
            BarcodeTrackingBasicOverlay: {
                defaultStyle: json.BarcodeTracking.BarcodeTrackingBasicOverlay.defaultStyle,
                DefaultBrush: {
                    fillColor: Color
                        .fromJSON(json.BarcodeTracking.BarcodeTrackingBasicOverlay.DefaultBrush.fillColor),
                    strokeColor: Color
                        .fromJSON(json.BarcodeTracking.BarcodeTrackingBasicOverlay.DefaultBrush.strokeColor),
                    strokeWidth: json.BarcodeTracking.BarcodeTrackingBasicOverlay.DefaultBrush.strokeWidth,
                },
                styles: Object
                    .keys(json.BarcodeTracking.BarcodeTrackingBasicOverlay.styles)
                    .reduce((previousValue, currentValue) => {
                    return Object.assign(Object.assign({}, previousValue), { [currentValue]: {
                            DefaultBrush: {
                                fillColor: Color
                                    .fromJSON(json.BarcodeTracking.BarcodeTrackingBasicOverlay.
                                    styles[currentValue].DefaultBrush.fillColor),
                                strokeColor: Color
                                    .fromJSON(json.BarcodeTracking.BarcodeTrackingBasicOverlay.
                                    styles[currentValue].DefaultBrush.strokeColor),
                                strokeWidth: json.BarcodeTracking.BarcodeTrackingBasicOverlay.
                                    styles[currentValue].DefaultBrush.strokeWidth,
                            },
                        } });
                }, {}),
            },
        },
    };
};
//# sourceMappingURL=Defaults.js.map