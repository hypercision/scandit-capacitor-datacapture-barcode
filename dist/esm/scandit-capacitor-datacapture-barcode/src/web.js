var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { registerPlugin } from '@capacitor/core';
import { Capacitor as CapacitorCore } from '../../scandit-capacitor-datacapture-core/src/ts/Capacitor/Capacitor';
import { Capacitor as CapacitorBarcode, getDefaults } from './ts/Capacitor/Capacitor';
export * from './definitions';
import { Barcode, Checksum, CompositeFlag, CompositeType, EncodingRange, LocalizedOnlyBarcode, Range, Symbology, SymbologyDescription, SymbologySettings, TrackedBarcode, TargetBarcode } from './ts/Barcode';
import { BarcodeCapture, } from './ts/BarcodeCapture';
import { BarcodeSelection, } from './ts/BarcodeSelection';
import { BarcodeCaptureSettings, } from './ts/BarcodeCaptureSettings';
import { BarcodeSelectionSettings, } from './ts/BarcodeSelectionSettings';
import { BarcodeCaptureFeedback, BarcodeCaptureOverlay, BarcodeCaptureOverlayStyle, BarcodeCaptureSession, } from './ts/BarcodeCapture+Related';
import { BarcodeSelectionAimerSelection, BarcodeSelectionAutoSelectionStrategy, BarcodeSelectionBasicOverlay, BarcodeSelectionBasicOverlayStyle, BarcodeSelectionFeedback, BarcodeSelectionFreezeBehavior, BarcodeSelectionManualSelectionStrategy, BarcodeSelectionSession, BarcodeSelectionTapBehavior, BarcodeSelectionTapSelection, } from './ts/BarcodeSelection+Related';
import { BarcodeTracking, } from './ts/BarcodeTracking';
import { BarcodeTrackingScenario, BarcodeTrackingSettings, } from './ts/BarcodeTrackingSettings';
import { BarcodeTrackingAdvancedOverlay, BarcodeTrackingBasicOverlay, BarcodeTrackingBasicOverlayStyle, BarcodeTrackingSession, } from './ts/BarcodeTracking+Related';
import { TrackedBarcodeView, } from './ts/TrackedBarcodeView';
import { BarcodeCount } from './ts/BarcodeCount';
import { BarcodeCountFeedback, BarcodeCountSession } from './ts/BarcodeCount+Related';
import { BarcodeCountSettings } from './ts/BarcodeCountSettings';
import { BarcodeCountView, BarcodeCountViewStyle } from './ts/BarcodeCountView';
import { BarcodeCountToolbarSettings } from './ts/BarcodeCountView+Related';
import { BarcodeCountCaptureList, BarcodeCountCaptureListSession } from './ts/BarcodeCountCaptureList';
import { BarcodeFilterSettings, BarcodeFilterHighlightType, BarcodeFilterHighlightSettingsBrush } from './ts/BarcodeFilterSettings';
export class ScanditBarcodePluginImplementation {
    initialize(coreDefaults) {
        return __awaiter(this, void 0, void 0, function* () {
            const api = {
                Barcode,
                Checksum,
                CompositeFlag,
                CompositeType,
                Symbology,
                SymbologyDescription,
                SymbologySettings,
                BarcodeCapture,
                BarcodeCaptureSettings,
                BarcodeCaptureSession,
                BarcodeCaptureOverlay,
                BarcodeCaptureOverlayStyle,
                BarcodeCaptureFeedback,
                BarcodeSelection,
                BarcodeSelectionSettings,
                BarcodeSelectionAimerSelection,
                BarcodeSelectionAutoSelectionStrategy,
                BarcodeSelectionBasicOverlay,
                BarcodeSelectionBasicOverlayStyle,
                BarcodeSelectionFeedback,
                BarcodeSelectionFreezeBehavior,
                BarcodeSelectionManualSelectionStrategy,
                BarcodeSelectionSession,
                BarcodeSelectionTapBehavior,
                BarcodeSelectionTapSelection,
                BarcodeTracking,
                BarcodeTrackingSession,
                BarcodeTrackingScenario,
                BarcodeTrackingSettings,
                TrackedBarcode,
                TargetBarcode,
                BarcodeTrackingBasicOverlay,
                BarcodeTrackingBasicOverlayStyle,
                BarcodeTrackingAdvancedOverlay,
                EncodingRange,
                LocalizedOnlyBarcode,
                Range,
                TrackedBarcodeView,
                BarcodeCount,
                BarcodeCountFeedback,
                BarcodeCountSession,
                BarcodeCountSettings,
                BarcodeCountView,
                BarcodeCountViewStyle,
                BarcodeCountCaptureList,
                BarcodeCountCaptureListSession,
                BarcodeCountToolbarSettings,
                BarcodeFilterSettings,
                BarcodeFilterHighlightType,
                BarcodeFilterHighlightSettingsBrush
            };
            CapacitorCore.defaults = coreDefaults;
            const barcodeDefaults = yield getDefaults();
            CapacitorBarcode.defaults = barcodeDefaults;
            return api;
        });
    }
}
// tslint:disable-next-line:variable-name
registerPlugin('ScanditBarcodePlugin', {
    android: () => new ScanditBarcodePluginImplementation(),
    ios: () => new ScanditBarcodePluginImplementation(),
    web: () => new ScanditBarcodePluginImplementation(),
});
// tslint:disable-next-line:variable-name
export const ScanditBarcodePlugin = new ScanditBarcodePluginImplementation();
export const ScanditBarcodeCountPluginNative = registerPlugin('ScanditBarcodeNative');
//# sourceMappingURL=web.js.map