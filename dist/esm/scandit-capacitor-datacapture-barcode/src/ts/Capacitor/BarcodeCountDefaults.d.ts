import { Feedback } from '../../../../scandit-capacitor-datacapture-core/src/ts/Feedback';
import { Brush } from '../../../../scandit-capacitor-datacapture-core/src/ts/Viewfinder';
import { BarcodeFilterSettings, BarcodeFilterSettingsJSON } from '../BarcodeFilterSettings';
import { CameraSettings } from '../../../../scandit-capacitor-datacapture-core/src/ts/Camera+Related';
import { CameraSettingsDefaultsJSON } from '../../../../scandit-capacitor-datacapture-core/src/ts/Capacitor/Defaults';
import { DefaultsJSON } from './Defaults';
export declare enum BarcodeCountViewStyle {
    Icon = "icon",
    Dot = "dot"
}
interface BarcodeCountToolbarSettings {
    audioOnButtonText: string;
    audioOffButtonText: string;
    audioButtonContentDescription: string | null;
    audioButtonAccessibilityHint: string | null;
    audioButtonAccessibilityLabel: string | null;
    vibrationOnButtonText: string;
    vibrationOffButtonText: string;
    vibrationButtonContentDescription: string | null;
    vibrationButtonAccessibilityHint: string | null;
    vibrationButtonAccessibilityLabel: string | null;
    strapModeOnButtonText: string;
    strapModeOffButtonText: string;
    strapModeButtonContentDescription: string | null;
    strapModeButtonAccessibilityHint: string | null;
    strapModeButtonAccessibilityLabel: string | null;
    colorSchemeOnButtonText: string;
    colorSchemeOffButtonText: string;
    colorSchemeButtonContentDescription: string | null;
    colorSchemeButtonAccessibilityHint: string | null;
    colorSchemeButtonAccessibilityLabel: string | null;
}
interface BarcodeCountViewSettings {
    style: BarcodeCountViewStyle;
    shouldShowUserGuidanceView: boolean;
    shouldShowListButton: boolean;
    shouldShowExitButton: boolean;
    shouldShowShutterButton: boolean;
    shouldShowHints: boolean;
    shouldShowClearHighlightsButton: boolean;
    shouldShowSingleScanButton: boolean;
    shouldShowFloatingShutterButton: boolean;
    shouldShowToolbar: boolean;
    defaultNotInListBrush: Brush;
    defaultRecognizedBrush: Brush;
    defaultUnrecognizedBrush: Brush;
    shouldShowScanAreaGuides: boolean;
    clearHighlightsButtonText: string;
    exitButtonText: string;
    textForUnrecognizedBarcodesDetectedHint: string;
    textForTapShutterToScanHint: string;
    textForScanningHint: string;
    textForMoveCloserAndRescanHint: string;
    textForMoveFurtherAndRescanHint: string;
    toolbarSettings: BarcodeCountToolbarSettings;
    listButtonAccessibilityHint: string;
    listButtonAccessibilityLabel: string;
    listButtonContentDescription: string;
    exitButtonAccessibilityHint: string;
    exitButtonAccessibilityLabel: string;
    exitButtonContentDescription: string;
    shutterButtonAccessibilityHint: string;
    shutterButtonAccessibilityLabel: string;
    shutterButtonContentDescription: string;
    floatingShutterButtonAccessibilityHint: string;
    floatingShutterButtonAccessibilityLabel: string;
    floatingShutterButtonContentDescription: string;
    clearHighlightsButtonAccessibilityHint: string;
    clearHighlightsButtonAccessibilityLabel: string;
    clearHighlightsButtonContentDescription: string;
    singleScanButtonAccessibilityHint: string;
    singleScanButtonAccessibilityLabel: string;
    singleScanButtonContentDescription: string;
}
interface BrushJSON {
    fillColor: string;
    strokeColor: string;
    strokeWidth: number;
}
interface BarcodeCountViewSettingsJSON {
    style: BarcodeCountViewStyle;
    shouldShowUserGuidanceView: boolean;
    shouldShowListButton: boolean;
    shouldShowExitButton: boolean;
    shouldShowShutterButton: boolean;
    shouldShowHints: boolean;
    shouldShowClearHighlightsButton: boolean;
    shouldShowSingleScanButton: boolean;
    shouldShowFloatingShutterButton: boolean;
    shouldShowToolbar: boolean;
    defaultNotInListBrush: BrushJSON;
    defaultRecognizedBrush: BrushJSON;
    defaultUnrecognizedBrush: BrushJSON;
    shouldShowScanAreaGuides: boolean;
    clearHighlightsButtonText: string;
    exitButtonText: string;
    textForUnrecognizedBarcodesDetectedHint: string;
    textForTapShutterToScanHint: string;
    textForScanningHint: string;
    textForMoveCloserAndRescanHint: string;
    textForMoveFurtherAndRescanHint: string;
    toolbarSettings: BarcodeCountToolbarSettings;
    listButtonAccessibilityHint: string;
    listButtonAccessibilityLabel: string;
    listButtonContentDescription: string;
    exitButtonAccessibilityHint: string;
    exitButtonAccessibilityLabel: string;
    exitButtonContentDescription: string;
    shutterButtonAccessibilityHint: string;
    shutterButtonAccessibilityLabel: string;
    shutterButtonContentDescription: string;
    floatingShutterButtonAccessibilityHint: string;
    floatingShutterButtonAccessibilityLabel: string;
    floatingShutterButtonContentDescription: string;
    clearHighlightsButtonAccessibilityHint: string;
    clearHighlightsButtonAccessibilityLabel: string;
    clearHighlightsButtonContentDescription: string;
    singleScanButtonAccessibilityHint: string;
    singleScanButtonAccessibilityLabel: string;
    singleScanButtonContentDescription: string;
}
export interface BarcodeCountDefaults {
    RecommendedCameraSettings: CameraSettings;
    Feedback: {
        success: Feedback;
        failure: Feedback;
    };
    BarcodeCountSettings: {
        expectOnlyUniqueBarcodes: boolean;
        barcodeFilterSettings: BarcodeFilterSettings;
        disableModeWhenCaptureListCompleted: boolean;
    };
    BarcodeCountView: BarcodeCountViewSettings;
}
export interface BarcodeCountDefaultsJSON {
    RecommendedCameraSettings: CameraSettingsDefaultsJSON;
    BarcodeCountFeedback: string;
    BarcodeCountSettings: {
        expectOnlyUniqueBarcodes: boolean;
        barcodeFilterSettings: BarcodeFilterSettingsJSON;
        disableModeWhenCaptureListCompleted: boolean;
    };
    BarcodeCountView: BarcodeCountViewSettingsJSON;
}
export declare const barcodeCountDefaultsFromJSON: (rootJson: DefaultsJSON) => BarcodeCountDefaults;
export {};
