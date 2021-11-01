import { CameraSettings } from '../../../../scandit-capacitor-datacapture-core/src/ts/Camera+Related';
import { CameraSettingsDefaultsJSON } from '../../../../scandit-capacitor-datacapture-core/src/ts/Capacitor/Defaults';
import { Color } from '../../../../scandit-capacitor-datacapture-core/src/ts/Common';
import { PrivateCompositeTypeDescription, SymbologyDescription, SymbologySettings } from '../Barcode';
declare type BarcodeCaptureOverlayStyle = any;
declare type BarcodeTrackingBasicOverlayStyle = any;
export interface Defaults {
    SymbologySettings: {
        [key: string]: SymbologySettings;
    };
    SymbologyDescriptions: SymbologyDescription[];
    CompositeTypeDescriptions: PrivateCompositeTypeDescription[];
    BarcodeCapture: {
        BarcodeCaptureOverlay: {
            defaultStyle: BarcodeCaptureOverlayStyle;
            styles: any;
            DefaultBrush: {
                fillColor: Color;
                strokeColor: Color;
                strokeWidth: number;
            };
        };
        BarcodeCaptureSettings: {
            codeDuplicateFilter: number;
        };
        RecommendedCameraSettings: CameraSettings;
    };
    BarcodeTracking: {
        RecommendedCameraSettings: CameraSettings;
        BarcodeTrackingBasicOverlay: {
            defaultStyle: BarcodeTrackingBasicOverlayStyle;
            styles: any;
            DefaultBrush: {
                fillColor: Color;
                strokeColor: Color;
                strokeWidth: number;
            };
        };
    };
}
export interface DefaultsJSON {
    SymbologySettings: {
        [key: string]: string;
    };
    SymbologyDescriptions: string[];
    CompositeTypeDescriptions: string[];
    BarcodeCapture: {
        BarcodeCaptureOverlay: {
            defaultStyle: string;
            styles: any;
            DefaultBrush: {
                fillColor: string;
                strokeColor: string;
                strokeWidth: number;
            };
        };
        BarcodeCaptureSettings: {
            codeDuplicateFilter: number;
        };
        RecommendedCameraSettings: CameraSettingsDefaultsJSON;
    };
    BarcodeTracking: {
        RecommendedCameraSettings: CameraSettingsDefaultsJSON;
        BarcodeTrackingBasicOverlay: {
            defaultStyle: string;
            styles: any;
            DefaultBrush: {
                fillColor: string;
                strokeColor: string;
                strokeWidth: number;
            };
        };
    };
}
export declare const defaultsFromJSON: (json: DefaultsJSON) => Defaults;
export {};
