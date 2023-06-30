var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Capacitor } from './Capacitor/Capacitor';
import { DefaultSerializeable, ignoreFromSerialization, nameForSerialization, } from '../../../scandit-capacitor-datacapture-core/src/ts/Serializeable';
import { BarcodeCountViewProxy } from './Capacitor/BarcodeCountViewProxy';
import { HTMLElementState } from '../../../scandit-capacitor-datacapture-core/src/ts/DataCaptureView';
const BarcodeCountDefaults = {
    get BarcodeCountView() { return Capacitor.defaults.BarcodeCount.BarcodeCountView; }
};
export var BarcodeCountViewStyle;
(function (BarcodeCountViewStyle) {
    BarcodeCountViewStyle["Icon"] = "icon";
    BarcodeCountViewStyle["Dot"] = "dot";
})(BarcodeCountViewStyle || (BarcodeCountViewStyle = {}));
export class BarcodeCountView extends DefaultSerializeable {
    get uiListener() {
        return this._uiListener;
    }
    set uiListener(listener) {
        this._uiListener = listener;
        this.viewProxy.setUiListener(listener);
    }
    get listener() {
        return this._listener;
    }
    set listener(listener) {
        this._listener = listener;
        this.viewProxy.setListener(listener);
    }
    get shouldShowUserGuidanceView() {
        return this._shouldShowUserGuidanceView;
    }
    set shouldShowUserGuidanceView(newValue) {
        this._shouldShowUserGuidanceView = newValue;
        this.updateNative();
    }
    get shouldShowListButton() {
        return this._shouldShowListButton;
    }
    set shouldShowListButton(newValue) {
        this._shouldShowListButton = newValue;
        this.updateNative();
    }
    get shouldShowExitButton() {
        return this._shouldShowExitButton;
    }
    set shouldShowExitButton(newValue) {
        this._shouldShowExitButton = newValue;
        this.updateNative();
    }
    get shouldShowShutterButton() {
        return this._shouldShowShutterButton;
    }
    set shouldShowShutterButton(newValue) {
        this._shouldShowShutterButton = newValue;
        this.updateNative();
    }
    get shouldShowHints() {
        return this._shouldShowHints;
    }
    set shouldShowHints(newValue) {
        this._shouldShowHints = newValue;
        this.updateNative();
    }
    get shouldShowClearHighlightsButton() {
        return this._shouldShowClearHighlightsButton;
    }
    set shouldShowClearHighlightsButton(newValue) {
        this._shouldShowClearHighlightsButton = newValue;
        this.updateNative();
    }
    get shouldShowSingleScanButton() {
        return this._shouldShowSingleScanButton;
    }
    set shouldShowSingleScanButton(newValue) {
        this._shouldShowSingleScanButton = newValue;
        this.updateNative();
    }
    get shouldShowFloatingShutterButton() {
        return this._shouldShowFloatingShutterButton;
    }
    set shouldShowFloatingShutterButton(newValue) {
        this._shouldShowFloatingShutterButton = newValue;
        this.updateNative();
    }
    get shouldShowToolbar() {
        return this._shouldShowToolbar;
    }
    set shouldShowToolbar(newValue) {
        this._shouldShowToolbar = newValue;
        this.updateNative();
    }
    get shouldShowScanAreaGuides() {
        return this._shouldShowScanAreaGuides;
    }
    set shouldShowScanAreaGuides(newValue) {
        this._shouldShowScanAreaGuides = newValue;
        this.updateNative();
    }
    static get defaultRecognizedBrush() {
        return BarcodeCountDefaults.BarcodeCountView.defaultRecognizedBrush;
    }
    static get defaultUnrecognizedBrush() {
        return BarcodeCountDefaults.BarcodeCountView.defaultUnrecognizedBrush;
    }
    static get defaultNotInListBrush() {
        return BarcodeCountDefaults.BarcodeCountView.defaultNotInListBrush;
    }
    get recognizedBrush() {
        return this._recognizedBrush;
    }
    set recognizedBrush(newValue) {
        this._recognizedBrush = newValue;
        this.updateNative();
    }
    get unrecognizedBrush() {
        return this._unrecognizedBrush;
    }
    set unrecognizedBrush(newValue) {
        this._unrecognizedBrush = newValue;
        this.updateNative();
    }
    get notInListBrush() {
        return this._notInListBrush;
    }
    set notInListBrush(newValue) {
        this._notInListBrush = newValue;
        this.updateNative();
    }
    get filterSettings() {
        return this._filterSettings;
    }
    set filterSettings(newValue) {
        this._filterSettings = newValue;
        this.updateNative();
    }
    get style() {
        return this._style;
    }
    get listButtonAccessibilityHint() {
        return this._listButtonAccessibilityHint;
    }
    set listButtonAccessibilityHint(newValue) {
        this._listButtonAccessibilityHint = newValue;
        this.updateNative();
    }
    get listButtonAccessibilityLabel() {
        return this._listButtonAccessibilityLabel;
    }
    set listButtonAccessibilityLabel(newValue) {
        this._listButtonAccessibilityLabel = newValue;
        this.updateNative();
    }
    get listButtonContentDescription() {
        return this._listButtonContentDescription;
    }
    set listButtonContentDescription(newValue) {
        this._listButtonContentDescription = newValue;
        this.updateNative();
    }
    get exitButtonAccessibilityHint() {
        return this._exitButtonAccessibilityHint;
    }
    set exitButtonAccessibilityHint(newValue) {
        this._exitButtonAccessibilityHint = newValue;
        this.updateNative();
    }
    get exitButtonAccessibilityLabel() {
        return this._exitButtonAccessibilityLabel;
    }
    set exitButtonAccessibilityLabel(newValue) {
        this._exitButtonAccessibilityLabel = newValue;
        this.updateNative();
    }
    get exitButtonContentDescription() {
        return this._exitButtonContentDescription;
    }
    set exitButtonContentDescription(newValue) {
        this._exitButtonContentDescription = newValue;
        this.updateNative();
    }
    get shutterButtonAccessibilityHint() {
        return this._shutterButtonAccessibilityHint;
    }
    set shutterButtonAccessibilityHint(newValue) {
        this._shutterButtonAccessibilityHint = newValue;
        this.updateNative();
    }
    get shutterButtonAccessibilityLabel() {
        return this._shutterButtonAccessibilityLabel;
    }
    set shutterButtonAccessibilityLabel(newValue) {
        this._shutterButtonAccessibilityLabel = newValue;
        this.updateNative();
    }
    get shutterButtonContentDescription() {
        return this._shutterButtonContentDescription;
    }
    set shutterButtonContentDescription(newValue) {
        this._shutterButtonContentDescription = newValue;
        this.updateNative();
    }
    get floatingShutterButtonAccessibilityHint() {
        return this._floatingShutterButtonAccessibilityHint;
    }
    set floatingShutterButtonAccessibilityHint(newValue) {
        this._floatingShutterButtonAccessibilityHint = newValue;
        this.updateNative();
    }
    get floatingShutterButtonAccessibilityLabel() {
        return this._floatingShutterButtonAccessibilityLabel;
    }
    set floatingShutterButtonAccessibilityLabel(newValue) {
        this._floatingShutterButtonAccessibilityLabel = newValue;
        this.updateNative();
    }
    get floatingShutterButtonContentDescription() {
        return this._floatingShutterButtonContentDescription;
    }
    set floatingShutterButtonContentDescription(newValue) {
        this._floatingShutterButtonContentDescription = newValue;
        this.updateNative();
    }
    get clearHighlightsButtonAccessibilityHint() {
        return this._clearHighlightsButtonAccessibilityHint;
    }
    set clearHighlightsButtonAccessibilityHint(newValue) {
        this._clearHighlightsButtonAccessibilityHint = newValue;
        this.updateNative();
    }
    get clearHighlightsButtonAccessibilityLabel() {
        return this._clearHighlightsButtonAccessibilityLabel;
    }
    set clearHighlightsButtonAccessibilityLabel(newValue) {
        this._clearHighlightsButtonAccessibilityLabel = newValue;
        this.updateNative();
    }
    get clearHighlightsButtonContentDescription() {
        return this._clearHighlightsButtonContentDescription;
    }
    set clearHighlightsButtonContentDescription(newValue) {
        this.clearHighlightsButtonContentDescription = newValue;
        this.updateNative();
    }
    get singleScanButtonAccessibilityHint() {
        return this._singleScanButtonAccessibilityHint;
    }
    set singleScanButtonAccessibilityHint(newValue) {
        this._singleScanButtonAccessibilityHint = newValue;
        this.updateNative();
    }
    get singleScanButtonAccessibilityLabel() {
        return this._singleScanButtonAccessibilityLabel;
    }
    set singleScanButtonAccessibilityLabel(newValue) {
        this._singleScanButtonAccessibilityLabel = newValue;
        this.updateNative();
    }
    get singleScanButtonContentDescription() {
        return this._singleScanButtonContentDescription;
    }
    set singleScanButtonContentDescription(newValue) {
        this._singleScanButtonContentDescription = newValue;
        this.updateNative();
    }
    get clearHighlightsButtonText() {
        return this._clearHighlightsButtonText;
    }
    set clearHighlightsButtonText(newValue) {
        this._clearHighlightsButtonText = newValue;
        this.updateNative();
    }
    get exitButtonText() {
        return this._exitButtonText;
    }
    set exitButtonText(newValue) {
        this._exitButtonText = newValue;
        this.updateNative();
    }
    get textForTapShutterToScanHint() {
        return this._textForTapShutterToScanHint;
    }
    set textForTapShutterToScanHint(newValue) {
        this._textForTapShutterToScanHint = newValue;
        this.updateNative();
    }
    get textForScanningHint() {
        return this._textForScanningHint;
    }
    set textForScanningHint(newValue) {
        this._textForScanningHint = newValue;
        this.updateNative();
    }
    get textForMoveCloserAndRescanHint() {
        return this._textForMoveCloserAndRescanHint;
    }
    set textForMoveCloserAndRescanHint(newValue) {
        this._textForMoveCloserAndRescanHint = newValue;
        this.updateNative();
    }
    get textForMoveFurtherAndRescanHint() {
        return this._textForMoveFurtherAndRescanHint;
    }
    set textForMoveFurtherAndRescanHint(newValue) {
        this._textForMoveFurtherAndRescanHint = newValue;
        this.updateNative();
    }
    get textForUnrecognizedBarcodesDetectedHint() {
        return this._textForUnrecognizedBarcodesDetectedHint;
    }
    set textForUnrecognizedBarcodesDetectedHint(newValue) {
        this._textForUnrecognizedBarcodesDetectedHint = newValue;
        this.updateNative();
    }
    set htmlElementState(newState) {
        const didChangeShown = this._htmlElementState.isShown !== newState.isShown;
        const didChangePositionOrSize = this._htmlElementState.didChangeComparedTo(newState);
        this._htmlElementState = newState;
        if (didChangePositionOrSize) {
            this.updatePositionAndSize();
        }
        if (didChangeShown) {
            if (this._htmlElementState.isShown) {
                this._show();
            }
            else {
                this._hide();
            }
        }
    }
    get htmlElementState() {
        return this._htmlElementState;
    }
    static forContextWithMode(context, barcodeCount) {
        const style = BarcodeCountDefaults.BarcodeCountView.style;
        const view = new BarcodeCountView({ context, barcodeCount, style });
        return view;
    }
    static forContextWithModeAndStyle(context, barcodeCount, style) {
        const view = new BarcodeCountView({ context, barcodeCount, style });
        return view;
    }
    constructor({ context, barcodeCount, style }) {
        super();
        this._uiListener = null;
        this._listener = null;
        this._shouldShowUserGuidanceView = BarcodeCountDefaults.BarcodeCountView.shouldShowUserGuidanceView;
        this._shouldShowListButton = BarcodeCountDefaults.BarcodeCountView.shouldShowListButton;
        this._shouldShowExitButton = BarcodeCountDefaults.BarcodeCountView.shouldShowExitButton;
        this._shouldShowShutterButton = BarcodeCountDefaults.BarcodeCountView.shouldShowShutterButton;
        this._shouldShowHints = BarcodeCountDefaults.BarcodeCountView.shouldShowHints;
        this._shouldShowClearHighlightsButton = BarcodeCountDefaults.BarcodeCountView.shouldShowClearHighlightsButton;
        this._shouldShowSingleScanButton = BarcodeCountDefaults.BarcodeCountView.shouldShowSingleScanButton;
        this._shouldShowFloatingShutterButton = BarcodeCountDefaults.BarcodeCountView.shouldShowFloatingShutterButton;
        this._shouldShowToolbar = BarcodeCountDefaults.BarcodeCountView.shouldShowToolbar;
        this._shouldShowScanAreaGuides = BarcodeCountDefaults.BarcodeCountView.shouldShowScanAreaGuides;
        this._recognizedBrush = BarcodeCountDefaults.BarcodeCountView.defaultRecognizedBrush;
        this._unrecognizedBrush = BarcodeCountDefaults.BarcodeCountView.defaultUnrecognizedBrush;
        this._notInListBrush = BarcodeCountDefaults.BarcodeCountView.defaultNotInListBrush;
        this._filterSettings = null;
        this._style = BarcodeCountDefaults.BarcodeCountView.style;
        this._listButtonAccessibilityHint = BarcodeCountDefaults.BarcodeCountView.listButtonAccessibilityHint;
        this._listButtonAccessibilityLabel = BarcodeCountDefaults.BarcodeCountView.listButtonAccessibilityLabel;
        this._listButtonContentDescription = BarcodeCountDefaults.BarcodeCountView.listButtonContentDescription;
        this._exitButtonAccessibilityHint = BarcodeCountDefaults.BarcodeCountView.exitButtonAccessibilityHint;
        this._exitButtonAccessibilityLabel = BarcodeCountDefaults.BarcodeCountView.exitButtonAccessibilityLabel;
        this._exitButtonContentDescription = BarcodeCountDefaults.BarcodeCountView.exitButtonContentDescription;
        this._shutterButtonAccessibilityHint = BarcodeCountDefaults.BarcodeCountView.shutterButtonAccessibilityHint;
        this._shutterButtonAccessibilityLabel = BarcodeCountDefaults.BarcodeCountView.shutterButtonAccessibilityLabel;
        this._shutterButtonContentDescription = BarcodeCountDefaults.BarcodeCountView.shutterButtonContentDescription;
        this._floatingShutterButtonAccessibilityHint = BarcodeCountDefaults.BarcodeCountView.floatingShutterButtonAccessibilityHint;
        this._floatingShutterButtonAccessibilityLabel = BarcodeCountDefaults.BarcodeCountView.floatingShutterButtonAccessibilityLabel;
        this._floatingShutterButtonContentDescription = BarcodeCountDefaults.BarcodeCountView.floatingShutterButtonContentDescription;
        this._clearHighlightsButtonAccessibilityHint = BarcodeCountDefaults.BarcodeCountView.clearHighlightsButtonAccessibilityHint;
        this._clearHighlightsButtonAccessibilityLabel = BarcodeCountDefaults.BarcodeCountView.clearHighlightsButtonAccessibilityLabel;
        this._clearHighlightsButtonContentDescription = BarcodeCountDefaults.BarcodeCountView.clearHighlightsButtonContentDescription;
        this._singleScanButtonAccessibilityHint = BarcodeCountDefaults.BarcodeCountView.singleScanButtonAccessibilityHint;
        this._singleScanButtonAccessibilityLabel = BarcodeCountDefaults.BarcodeCountView.singleScanButtonAccessibilityLabel;
        this._singleScanButtonContentDescription = BarcodeCountDefaults.BarcodeCountView.singleScanButtonContentDescription;
        this._clearHighlightsButtonText = BarcodeCountDefaults.BarcodeCountView.clearHighlightsButtonText;
        this._exitButtonText = BarcodeCountDefaults.BarcodeCountView.exitButtonText;
        this._textForTapShutterToScanHint = BarcodeCountDefaults.BarcodeCountView.textForTapShutterToScanHint;
        this._textForScanningHint = BarcodeCountDefaults.BarcodeCountView.textForScanningHint;
        this._textForMoveCloserAndRescanHint = BarcodeCountDefaults.BarcodeCountView.textForMoveCloserAndRescanHint;
        this._textForMoveFurtherAndRescanHint = BarcodeCountDefaults.BarcodeCountView.textForMoveFurtherAndRescanHint;
        this._textForUnrecognizedBarcodesDetectedHint = BarcodeCountDefaults.BarcodeCountView.textForUnrecognizedBarcodesDetectedHint;
        this._toolbarSettings = null;
        this.htmlElement = null;
        this._htmlElementState = new HTMLElementState();
        this.scrollListener = this.elementDidChange.bind(this);
        this.domObserver = new MutationObserver(this.elementDidChange.bind(this));
        this.orientationChangeListener = (() => {
            this.elementDidChange();
            // SDC-1784 -> workaround because at the moment of this callback the element doesn't have the updated size.
            setTimeout(this.elementDidChange.bind(this), 100);
            setTimeout(this.elementDidChange.bind(this), 300);
            setTimeout(this.elementDidChange.bind(this), 1000);
        });
        this._style = style;
        this._barcodeCount = barcodeCount;
        this._context = context;
        barcodeCount._context = context;
        this.viewProxy = BarcodeCountViewProxy.forBarcodeCount(this);
    }
    clearHighlights() {
        return this.viewProxy.clearHighlights();
    }
    setToolbarSettings(settings) {
        this._toolbarSettings = settings;
        this.updateNative();
    }
    updateNative() {
        return this.viewProxy.update();
    }
    connectToElement(element) {
        this.htmlElement = element;
        this.htmlElementState = new HTMLElementState();
        // Initial update
        this.elementDidChange();
        this.subscribeToChangesOnHTMLElement();
    }
    detachFromElement() {
        this.unsubscribeFromChangesOnHTMLElement();
        this.htmlElement = null;
        this.elementDidChange();
    }
    setFrame(frame, isUnderContent = false) {
        return this.viewProxy.setPositionAndSize(frame.origin.y, frame.origin.x, frame.size.width, frame.size.height, isUnderContent);
    }
    show() {
        if (this.htmlElement) {
            throw new Error("Views should only be manually shown if they're manually sized using setFrame");
        }
        return this._show();
    }
    hide() {
        if (this.htmlElement) {
            throw new Error("Views should only be manually hidden if they're manually sized using setFrame");
        }
        return this._hide();
    }
    subscribeToChangesOnHTMLElement() {
        this.domObserver.observe(document, { attributes: true, childList: true, subtree: true });
        window.addEventListener('scroll', this.scrollListener);
        window.addEventListener('orientationchange', this.orientationChangeListener);
    }
    unsubscribeFromChangesOnHTMLElement() {
        this.domObserver.disconnect();
        window.removeEventListener('scroll', this.scrollListener);
        window.removeEventListener('orientationchange', this.orientationChangeListener);
    }
    elementDidChange() {
        if (!this.htmlElement) {
            this.htmlElementState = new HTMLElementState();
            return;
        }
        const newState = new HTMLElementState();
        const boundingRect = this.htmlElement.getBoundingClientRect();
        newState.position = { top: boundingRect.top, left: boundingRect.left };
        newState.size = { width: boundingRect.width, height: boundingRect.height };
        newState.shouldBeUnderContent = parseInt(this.htmlElement.style.zIndex || '1', 10) < 0
            || parseInt(getComputedStyle(this.htmlElement).zIndex || '1', 10) < 0;
        const isDisplayed = getComputedStyle(this.htmlElement).display !== 'none'
            && this.htmlElement.style.display !== 'none';
        const isInDOM = document.body.contains(this.htmlElement);
        newState.isShown = isDisplayed && isInDOM && !this.htmlElement.hidden;
        this.htmlElementState = newState;
    }
    updatePositionAndSize() {
        if (!this.htmlElementState || !this.htmlElementState.isValid) {
            return;
        }
        this.viewProxy.setPositionAndSize(this.htmlElementState.position.top, this.htmlElementState.position.left, this.htmlElementState.size.width, this.htmlElementState.size.height, this.htmlElementState.shouldBeUnderContent);
    }
    _show() {
        if (!this._context) {
            throw new Error('There should be a context attached to a view that should be shown');
        }
        return this.viewProxy.show();
    }
    _hide() {
        if (!this._context) {
            throw new Error('There should be a context attached to a view that should be shown');
        }
        return this.viewProxy.hide();
    }
}
__decorate([
    ignoreFromSerialization
], BarcodeCountView.prototype, "_barcodeCount", void 0);
__decorate([
    ignoreFromSerialization
], BarcodeCountView.prototype, "_context", void 0);
__decorate([
    ignoreFromSerialization
], BarcodeCountView.prototype, "viewProxy", void 0);
__decorate([
    ignoreFromSerialization
], BarcodeCountView.prototype, "_uiListener", void 0);
__decorate([
    ignoreFromSerialization
], BarcodeCountView.prototype, "_listener", void 0);
__decorate([
    nameForSerialization('shouldShowUserGuidanceView')
], BarcodeCountView.prototype, "_shouldShowUserGuidanceView", void 0);
__decorate([
    nameForSerialization('shouldShowListButton')
], BarcodeCountView.prototype, "_shouldShowListButton", void 0);
__decorate([
    nameForSerialization('shouldShowExitButton')
], BarcodeCountView.prototype, "_shouldShowExitButton", void 0);
__decorate([
    nameForSerialization('shouldShowShutterButton')
], BarcodeCountView.prototype, "_shouldShowShutterButton", void 0);
__decorate([
    nameForSerialization('shouldShowHints')
], BarcodeCountView.prototype, "_shouldShowHints", void 0);
__decorate([
    nameForSerialization('shouldShowClearHighlightsButton')
], BarcodeCountView.prototype, "_shouldShowClearHighlightsButton", void 0);
__decorate([
    nameForSerialization('shouldShowSingleScanButton')
], BarcodeCountView.prototype, "_shouldShowSingleScanButton", void 0);
__decorate([
    nameForSerialization('shouldShowFloatingShutterButton')
], BarcodeCountView.prototype, "_shouldShowFloatingShutterButton", void 0);
__decorate([
    nameForSerialization('shouldShowToolbar')
], BarcodeCountView.prototype, "_shouldShowToolbar", void 0);
__decorate([
    nameForSerialization('shouldShowScanAreaGuides')
], BarcodeCountView.prototype, "_shouldShowScanAreaGuides", void 0);
__decorate([
    nameForSerialization('recognizedBrush')
], BarcodeCountView.prototype, "_recognizedBrush", void 0);
__decorate([
    nameForSerialization('unrecognizedBrush')
], BarcodeCountView.prototype, "_unrecognizedBrush", void 0);
__decorate([
    nameForSerialization('notInListBrush')
], BarcodeCountView.prototype, "_notInListBrush", void 0);
__decorate([
    nameForSerialization('filterSettings')
], BarcodeCountView.prototype, "_filterSettings", void 0);
__decorate([
    nameForSerialization('style')
], BarcodeCountView.prototype, "_style", void 0);
__decorate([
    nameForSerialization('listButtonAccessibilityHint')
], BarcodeCountView.prototype, "_listButtonAccessibilityHint", void 0);
__decorate([
    nameForSerialization('listButtonAccessibilityLabel')
], BarcodeCountView.prototype, "_listButtonAccessibilityLabel", void 0);
__decorate([
    nameForSerialization('listButtonContentDescription')
], BarcodeCountView.prototype, "_listButtonContentDescription", void 0);
__decorate([
    nameForSerialization('exitButtonAccessibilityHint')
], BarcodeCountView.prototype, "_exitButtonAccessibilityHint", void 0);
__decorate([
    nameForSerialization('exitButtonAccessibilityLabel')
], BarcodeCountView.prototype, "_exitButtonAccessibilityLabel", void 0);
__decorate([
    nameForSerialization('exitButtonContentDescription')
], BarcodeCountView.prototype, "_exitButtonContentDescription", void 0);
__decorate([
    nameForSerialization('shutterButtonAccessibilityHint')
], BarcodeCountView.prototype, "_shutterButtonAccessibilityHint", void 0);
__decorate([
    nameForSerialization('shutterButtonAccessibilityLabel')
], BarcodeCountView.prototype, "_shutterButtonAccessibilityLabel", void 0);
__decorate([
    nameForSerialization('shutterButtonContentDescription')
], BarcodeCountView.prototype, "_shutterButtonContentDescription", void 0);
__decorate([
    nameForSerialization('floatingShutterButtonAccessibilityHint')
], BarcodeCountView.prototype, "_floatingShutterButtonAccessibilityHint", void 0);
__decorate([
    nameForSerialization('floatingShutterButtonAccessibilityLabel')
], BarcodeCountView.prototype, "_floatingShutterButtonAccessibilityLabel", void 0);
__decorate([
    nameForSerialization('floatingShutterButtonContentDescription')
], BarcodeCountView.prototype, "_floatingShutterButtonContentDescription", void 0);
__decorate([
    nameForSerialization('clearHighlightsButtonAccessibilityHint')
], BarcodeCountView.prototype, "_clearHighlightsButtonAccessibilityHint", void 0);
__decorate([
    nameForSerialization('clearHighlightsButtonAccessibilityLabel')
], BarcodeCountView.prototype, "_clearHighlightsButtonAccessibilityLabel", void 0);
__decorate([
    nameForSerialization('clearHighlightsButtonContentDescription')
], BarcodeCountView.prototype, "_clearHighlightsButtonContentDescription", void 0);
__decorate([
    nameForSerialization('singleScanButtonAccessibilityHint')
], BarcodeCountView.prototype, "_singleScanButtonAccessibilityHint", void 0);
__decorate([
    nameForSerialization('singleScanButtonAccessibilityLabel')
], BarcodeCountView.prototype, "_singleScanButtonAccessibilityLabel", void 0);
__decorate([
    nameForSerialization('singleScanButtonContentDescription')
], BarcodeCountView.prototype, "_singleScanButtonContentDescription", void 0);
__decorate([
    nameForSerialization('clearHighlightsButtonText')
], BarcodeCountView.prototype, "_clearHighlightsButtonText", void 0);
__decorate([
    nameForSerialization('exitButtonText')
], BarcodeCountView.prototype, "_exitButtonText", void 0);
__decorate([
    nameForSerialization('textForTapShutterToScanHint')
], BarcodeCountView.prototype, "_textForTapShutterToScanHint", void 0);
__decorate([
    nameForSerialization('textForScanningHint')
], BarcodeCountView.prototype, "_textForScanningHint", void 0);
__decorate([
    nameForSerialization('textForMoveCloserAndRescanHint')
], BarcodeCountView.prototype, "_textForMoveCloserAndRescanHint", void 0);
__decorate([
    nameForSerialization('textForMoveFurtherAndRescanHint')
], BarcodeCountView.prototype, "_textForMoveFurtherAndRescanHint", void 0);
__decorate([
    nameForSerialization('textForUnrecognizedBarcodesDetectedHint')
], BarcodeCountView.prototype, "_textForUnrecognizedBarcodesDetectedHint", void 0);
__decorate([
    nameForSerialization('toolbarSettings')
], BarcodeCountView.prototype, "_toolbarSettings", void 0);
__decorate([
    ignoreFromSerialization
], BarcodeCountView.prototype, "htmlElement", void 0);
__decorate([
    ignoreFromSerialization
], BarcodeCountView.prototype, "_htmlElementState", void 0);
__decorate([
    ignoreFromSerialization
], BarcodeCountView.prototype, "scrollListener", void 0);
__decorate([
    ignoreFromSerialization
], BarcodeCountView.prototype, "domObserver", void 0);
__decorate([
    ignoreFromSerialization
], BarcodeCountView.prototype, "orientationChangeListener", void 0);
//# sourceMappingURL=BarcodeCountView.js.map