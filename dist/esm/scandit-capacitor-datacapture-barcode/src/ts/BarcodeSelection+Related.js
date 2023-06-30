var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Barcode } from './Barcode';
import { Capacitor } from './Capacitor/Capacitor';
import { DefaultSerializeable, ignoreFromSerialization, nameForSerialization, } from '../../../scandit-capacitor-datacapture-core/src/ts/Serializeable';
import { AimerViewfinder, Brush, } from '../../../scandit-capacitor-datacapture-core/src/ts/Viewfinder';
export class BarcodeSelectionFeedback extends DefaultSerializeable {
    constructor() {
        super(...arguments);
        this.selection = Capacitor.defaults.BarcodeSelection.feedback.selection;
    }
    static get default() {
        return new BarcodeSelectionFeedback();
    }
}
var BarcodeSelectionStrategyType;
(function (BarcodeSelectionStrategyType) {
    BarcodeSelectionStrategyType["Auto"] = "autoSelectionStrategy";
    BarcodeSelectionStrategyType["Manual"] = "manualSelectionStrategy";
})(BarcodeSelectionStrategyType || (BarcodeSelectionStrategyType = {}));
export class PrivateBarcodeSelectionStrategy {
    static fromJSON(json) {
        switch (json.type) {
            case BarcodeSelectionStrategyType.Auto:
                return BarcodeSelectionAutoSelectionStrategy.autoSelectionStrategy;
            case BarcodeSelectionStrategyType.Manual:
                return BarcodeSelectionManualSelectionStrategy.manualSelectionStrategy;
            default:
                throw new Error('Unknown selection strategy type: ' + json.type);
        }
    }
}
export class BarcodeSelectionAutoSelectionStrategy extends DefaultSerializeable {
    constructor() {
        super(...arguments);
        this.type = BarcodeSelectionStrategyType.Auto;
    }
    static get autoSelectionStrategy() {
        return new BarcodeSelectionAutoSelectionStrategy();
    }
}
export class BarcodeSelectionManualSelectionStrategy extends DefaultSerializeable {
    constructor() {
        super(...arguments);
        this.type = BarcodeSelectionStrategyType.Manual;
    }
    static get manualSelectionStrategy() {
        return new BarcodeSelectionManualSelectionStrategy();
    }
}
export var BarcodeSelectionFreezeBehavior;
(function (BarcodeSelectionFreezeBehavior) {
    BarcodeSelectionFreezeBehavior["Manual"] = "manual";
    BarcodeSelectionFreezeBehavior["ManualAndAutomatic"] = "manualAndAutomatic";
})(BarcodeSelectionFreezeBehavior || (BarcodeSelectionFreezeBehavior = {}));
export var BarcodeSelectionTapBehavior;
(function (BarcodeSelectionTapBehavior) {
    BarcodeSelectionTapBehavior["ToggleSelection"] = "toggleSelection";
    BarcodeSelectionTapBehavior["RepeatSelection"] = "repeatSelection";
})(BarcodeSelectionTapBehavior || (BarcodeSelectionTapBehavior = {}));
var BarcodeSelectionTypeName;
(function (BarcodeSelectionTypeName) {
    BarcodeSelectionTypeName["Aimer"] = "aimerSelection";
    BarcodeSelectionTypeName["Tap"] = "tapSelection";
})(BarcodeSelectionTypeName || (BarcodeSelectionTypeName = {}));
export class PrivateBarcodeSelectionType {
    static fromJSON(json) {
        switch (json.type) {
            case BarcodeSelectionTypeName.Aimer:
                return PrivateBarcodeSelectionAimerSelection.fromJSON(json);
            case BarcodeSelectionTypeName.Tap:
                return PrivateBarcodeSelectionTapSelection.fromJSON(json);
            default:
                throw new Error('Unknown selection strategy type: ' + json.type);
        }
    }
}
export class BarcodeSelectionAimerSelection extends DefaultSerializeable {
    static get aimerSelection() {
        return new BarcodeSelectionAimerSelection();
    }
    constructor() {
        super();
        this.type = BarcodeSelectionTypeName.Aimer;
        this.selectionStrategy = Capacitor.defaults.BarcodeSelection.BarcodeSelectionAimerSelection
            .defaultSelectionStrategy(PrivateBarcodeSelectionStrategy.fromJSON);
    }
}
class PrivateBarcodeSelectionAimerSelection {
    static fromJSON(json) {
        const selection = BarcodeSelectionAimerSelection.aimerSelection;
        selection.selectionStrategy = PrivateBarcodeSelectionStrategy.fromJSON(json.selectionStrategy);
        return selection;
    }
}
export class BarcodeSelectionTapSelection extends DefaultSerializeable {
    constructor() {
        super(...arguments);
        this.type = BarcodeSelectionTypeName.Tap;
        this.freezeBehavior = Capacitor.defaults.BarcodeSelection.BarcodeSelectionTapSelection.defaultFreezeBehavior;
        this.tapBehavior = Capacitor.defaults.BarcodeSelection.BarcodeSelectionTapSelection.defaultTapBehavior;
    }
    static get tapSelection() {
        return new BarcodeSelectionTapSelection();
    }
    static withFreezeBehaviorAndTapBehavior(freezeBehavior, tapBehavior) {
        const selection = this.tapSelection;
        selection.freezeBehavior = freezeBehavior;
        selection.tapBehavior = tapBehavior;
        return selection;
    }
}
class PrivateBarcodeSelectionTapSelection {
    static fromJSON(json) {
        const selection = BarcodeSelectionTapSelection.tapSelection;
        selection.freezeBehavior = json.freezeBehavior;
        selection.tapBehavior = json.tapBehavior;
        return selection;
    }
}
export class BarcodeSelectionSession {
    get selectedBarcodes() {
        return this._selectedBarcodes;
    }
    get newlySelectedBarcodes() {
        return this._newlySelectedBarcodes;
    }
    get newlyUnselectedBarcodes() {
        return this._newlyUnselectedBarcodes;
    }
    get frameSequenceID() {
        return this._frameSequenceID;
    }
    static fromJSON(json) {
        const session = new BarcodeSelectionSession();
        session._selectedBarcodes = json.selectedBarcodes
            .map(Barcode.fromJSON);
        session._newlySelectedBarcodes = json.newlySelectedBarcodes
            .map(Barcode.fromJSON);
        session._newlyUnselectedBarcodes = json.newlyUnselectedBarcodes
            .map(Barcode.fromJSON);
        session._frameSequenceID = json.frameSequenceId;
        return session;
    }
    getCount(barcode) {
        return this.listenerProxy.getCount(barcode);
    }
    reset() {
        return this.listenerProxy.reset();
    }
}
export var BarcodeSelectionBasicOverlayStyle;
(function (BarcodeSelectionBasicOverlayStyle) {
    BarcodeSelectionBasicOverlayStyle["Frame"] = "frame";
    BarcodeSelectionBasicOverlayStyle["Dot"] = "dot";
})(BarcodeSelectionBasicOverlayStyle || (BarcodeSelectionBasicOverlayStyle = {}));
export class BarcodeSelectionBasicOverlay extends DefaultSerializeable {
    get trackedBrush() {
        return this._trackedBrush;
    }
    set trackedBrush(newBrush) {
        this._trackedBrush = newBrush;
        this.barcodeSelection.didChange();
    }
    get aimedBrush() {
        return this._aimedBrush;
    }
    set aimedBrush(newBrush) {
        this._aimedBrush = newBrush;
        this.barcodeSelection.didChange();
    }
    get selectedBrush() {
        return this._selectedBrush;
    }
    set selectedBrush(newBrush) {
        this._selectedBrush = newBrush;
        this.barcodeSelection.didChange();
    }
    get selectingBrush() {
        return this._selectingBrush;
    }
    set selectingBrush(newBrush) {
        this._selectingBrush = newBrush;
        this.barcodeSelection.didChange();
    }
    get style() {
        return this._style;
    }
    get viewfinder() {
        return this._viewfinder;
    }
    get shouldShowScanAreaGuides() {
        return this._shouldShowScanAreaGuides;
    }
    set shouldShowScanAreaGuides(shouldShow) {
        this._shouldShowScanAreaGuides = shouldShow;
        this.barcodeSelection.didChange();
    }
    get shouldShowHints() {
        return this._shouldShowHints;
    }
    set shouldShowHints(shouldShow) {
        this._shouldShowHints = shouldShow;
        this.barcodeSelection.didChange();
    }
    static withBarcodeSelection(barcodeSelection) {
        return BarcodeSelectionBasicOverlay.withBarcodeSelectionForView(barcodeSelection, null);
    }
    static withBarcodeSelectionForView(barcodeSelection, view) {
        return this.withBarcodeSelectionForViewWithStyle(barcodeSelection, view, Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.defaultStyle);
    }
    static withBarcodeSelectionForViewWithStyle(barcodeSelection, view, style) {
        const overlay = new BarcodeSelectionBasicOverlay();
        overlay.barcodeSelection = barcodeSelection;
        overlay._style = style;
        overlay._trackedBrush = new Brush(Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[overlay._style]
            .DefaultTrackedBrush.fillColor, Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[overlay._style]
            .DefaultTrackedBrush.strokeColor, Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[overlay._style]
            .DefaultTrackedBrush.strokeWidth);
        overlay._aimedBrush = new Brush(Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[overlay._style]
            .DefaultAimedBrush.fillColor, Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[overlay._style]
            .DefaultAimedBrush.strokeColor, Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[overlay._style]
            .DefaultAimedBrush.strokeWidth);
        overlay._selectedBrush = new Brush(Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[overlay._style]
            .DefaultSelectedBrush.fillColor, Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[overlay._style]
            .DefaultSelectedBrush.strokeColor, Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[overlay._style]
            .DefaultSelectedBrush.strokeWidth);
        overlay._selectingBrush = new Brush(Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[overlay._style]
            .DefaultSelectingBrush.fillColor, Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[overlay._style]
            .DefaultSelectingBrush.strokeColor, Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[overlay._style]
            .DefaultSelectingBrush.strokeWidth);
        if (view) {
            view.addOverlay(overlay);
        }
        return overlay;
    }
    constructor() {
        super();
        this.type = 'barcodeSelectionBasic';
        this._trackedBrush = new Brush(Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.defaultStyle].DefaultTrackedBrush.fillColor, Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.defaultStyle].DefaultTrackedBrush.strokeColor, Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.defaultStyle].DefaultTrackedBrush.strokeWidth);
        this._aimedBrush = new Brush(Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.defaultStyle].DefaultAimedBrush.fillColor, Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.defaultStyle].DefaultAimedBrush.strokeColor, Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.defaultStyle].DefaultAimedBrush.strokeWidth);
        this._selectedBrush = new Brush(Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.defaultStyle].DefaultSelectedBrush.fillColor, Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.defaultStyle].DefaultSelectedBrush.strokeColor, Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.defaultStyle].DefaultSelectedBrush.strokeWidth);
        this._selectingBrush = new Brush(Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.defaultStyle].DefaultSelectingBrush.fillColor, Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.defaultStyle].DefaultSelectingBrush.strokeColor, Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[Capacitor.defaults.BarcodeSelection.BarcodeSelectionBasicOverlay.defaultStyle].DefaultSelectingBrush.strokeWidth);
        this._shouldShowScanAreaGuides = false;
        this._shouldShowHints = true;
        this._viewfinder = new AimerViewfinder();
    }
}
__decorate([
    ignoreFromSerialization
], BarcodeSelectionBasicOverlay.prototype, "barcodeSelection", void 0);
__decorate([
    nameForSerialization('trackedBrush')
], BarcodeSelectionBasicOverlay.prototype, "_trackedBrush", void 0);
__decorate([
    nameForSerialization('aimedBrush')
], BarcodeSelectionBasicOverlay.prototype, "_aimedBrush", void 0);
__decorate([
    nameForSerialization('selectedBrush')
], BarcodeSelectionBasicOverlay.prototype, "_selectedBrush", void 0);
__decorate([
    nameForSerialization('selectingBrush')
], BarcodeSelectionBasicOverlay.prototype, "_selectingBrush", void 0);
__decorate([
    nameForSerialization('style')
], BarcodeSelectionBasicOverlay.prototype, "_style", void 0);
__decorate([
    nameForSerialization('shouldShowScanAreaGuides')
], BarcodeSelectionBasicOverlay.prototype, "_shouldShowScanAreaGuides", void 0);
__decorate([
    nameForSerialization('shouldShowHints')
], BarcodeSelectionBasicOverlay.prototype, "_shouldShowHints", void 0);
__decorate([
    nameForSerialization('viewfinder')
], BarcodeSelectionBasicOverlay.prototype, "_viewfinder", void 0);
//# sourceMappingURL=BarcodeSelection+Related.js.map