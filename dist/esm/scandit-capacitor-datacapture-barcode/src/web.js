var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WebPlugin } from '@capacitor/core';
import { getDefaults } from './ts/Capacitor/Capacitor';
import { Barcode, Checksum, CompositeFlag, CompositeType, EncodingRange, LocalizedOnlyBarcode, Range, Symbology, SymbologyDescription, SymbologySettings, TrackedBarcode, } from './ts/Barcode';
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
export class ScanditBarcodePlugin extends WebPlugin {
    constructor() {
        super({
            name: 'ScanditBarcodePlugin',
            platforms: ['android', 'ios'],
        });
    }
    initialize() {
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
                BarcodeTrackingBasicOverlay,
                BarcodeTrackingBasicOverlayStyle,
                BarcodeTrackingAdvancedOverlay,
                EncodingRange,
                LocalizedOnlyBarcode,
                Range,
                TrackedBarcodeView,
            };
            return new Promise((resolve, reject) => getDefaults.then(() => {
                resolve(api);
            }, reject));
        });
    }
}
const scanditBarcode = new ScanditBarcodePlugin();
export { scanditBarcode };
import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(scanditBarcode);
//# sourceMappingURL=web.js.map