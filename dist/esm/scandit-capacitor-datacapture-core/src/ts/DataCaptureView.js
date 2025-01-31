var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Capacitor } from './Capacitor/Capacitor';
import { DataCaptureViewProxy } from './Capacitor/DataCaptureViewProxy';
import { DefaultSerializeable, ignoreFromSerialization } from './Serializeable';
export class TorchSwitchControl extends DefaultSerializeable {
    constructor() {
        super(...arguments);
        this.type = 'torch';
        this.icon = {
            on: { default: null, pressed: null },
            off: { default: null, pressed: null },
        };
        this.view = null;
    }
    get torchOffImage() {
        return this.icon.off.default;
    }
    set torchOffImage(torchOffImage) {
        this.icon.off.default = torchOffImage;
        this.view.controlUpdated();
    }
    get torchOffPressedImage() {
        return this.icon.off.pressed;
    }
    set torchOffPressedImage(torchOffPressedImage) {
        this.icon.off.pressed = torchOffPressedImage;
        this.view.controlUpdated();
    }
    get torchOnImage() {
        return this.icon.on.default;
    }
    set torchOnImage(torchOnImage) {
        this.icon.on.default = torchOnImage;
        this.view.controlUpdated();
    }
    get torchOnPressedImage() {
        return this.icon.on.pressed;
    }
    set torchOnPressedImage(torchOnPressedImage) {
        this.icon.on.pressed = torchOnPressedImage;
        this.view.controlUpdated();
    }
}
__decorate([
    ignoreFromSerialization
], TorchSwitchControl.prototype, "view", void 0);
export class ZoomSwitchControl extends DefaultSerializeable {
    constructor() {
        super(...arguments);
        this.type = 'zoom';
        this.icon = {
            zoomedOut: { default: null, pressed: null },
            zoomedIn: { default: null, pressed: null },
        };
        this.view = null;
    }
    get zoomedOutImage() {
        return this.icon.zoomedOut.default;
    }
    set zoomedOutImage(zoomedOutImage) {
        var _a;
        this.icon.zoomedOut.default = zoomedOutImage;
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
    }
    get zoomedInImage() {
        return this.icon.zoomedIn.default;
    }
    set zoomedInImage(zoomedInImage) {
        var _a;
        this.icon.zoomedIn.default = zoomedInImage;
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
    }
    get zoomedInPressedImage() {
        return this.icon.zoomedIn.pressed;
    }
    set zoomedInPressedImage(zoomedInPressedImage) {
        var _a;
        this.icon.zoomedIn.pressed = zoomedInPressedImage;
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
    }
    get zoomedOutPressedImage() {
        return this.icon.zoomedOut.pressed;
    }
    set zoomedOutPressedImage(zoomedOutPressedImage) {
        var _a;
        this.icon.zoomedOut.pressed = zoomedOutPressedImage;
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
    }
}
__decorate([
    ignoreFromSerialization
], ZoomSwitchControl.prototype, "view", void 0);
export var Anchor;
(function (Anchor) {
    Anchor["TopLeft"] = "topLeft";
    Anchor["TopCenter"] = "topCenter";
    Anchor["TopRight"] = "topRight";
    Anchor["CenterLeft"] = "centerLeft";
    Anchor["Center"] = "center";
    Anchor["CenterRight"] = "centerRight";
    Anchor["BottomLeft"] = "bottomLeft";
    Anchor["BottomCenter"] = "bottomCenter";
    Anchor["BottomRight"] = "bottomRight";
})(Anchor || (Anchor = {}));
export class HTMLElementState {
    constructor() {
        this.isShown = false;
        this.position = null;
        this.size = null;
        this.shouldBeUnderContent = false;
    }
    get isValid() {
        return this.isShown !== undefined && this.isShown !== null
            && this.position !== undefined && this.position !== null
            && this.size !== undefined && this.size !== null
            && this.shouldBeUnderContent !== undefined && this.shouldBeUnderContent !== null;
    }
    didChangeComparedTo(other) {
        return this.position !== other.position
            || this.size !== other.size
            || this.shouldBeUnderContent !== other.shouldBeUnderContent;
    }
}
export class DataCaptureView extends DefaultSerializeable {
    get context() {
        return this._context;
    }
    set context(context) {
        this._context = context;
        if (context) {
            context.view = this;
        }
    }
    get viewProxy() {
        if (!this._viewProxy) {
            this.initialize();
        }
        return this._viewProxy;
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
    /**
     * The current context as a PrivateDataCaptureContext
     */
    get privateContext() {
        return this.context;
    }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    static forContext(context) {
        const view = new DataCaptureView();
        view.context = context;
        return view;
    }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    constructor() {
        super();
        this._context = null;
        this.scanAreaMargins = Capacitor.defaults.DataCaptureView.scanAreaMargins;
        this.pointOfInterest = Capacitor.defaults.DataCaptureView.pointOfInterest;
        this.logoAnchor = Capacitor.defaults.DataCaptureView.logoAnchor;
        this.logoOffset = Capacitor.defaults.DataCaptureView.logoOffset;
        this.focusGesture = Capacitor.defaults.DataCaptureView.focusGesture;
        this.zoomGesture = Capacitor.defaults.DataCaptureView.zoomGesture;
        this.logoStyle = Capacitor.defaults.DataCaptureView.logoStyle;
        this.overlays = [];
        this.controls = [];
        this.listeners = [];
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
    addOverlay(overlay) {
        if (this.overlays.includes(overlay)) {
            return;
        }
        this.overlays.push(overlay);
        this.privateContext.update();
    }
    removeOverlay(overlay) {
        if (!this.overlays.includes(overlay)) {
            return;
        }
        this.overlays.splice(this.overlays.indexOf(overlay), 1);
        this.privateContext.update();
    }
    addListener(listener) {
        if (!this.listeners.includes(listener)) {
            this.listeners.push(listener);
        }
    }
    removeListener(listener) {
        if (this.listeners.includes(listener)) {
            this.listeners.splice(this.listeners.indexOf(listener), 1);
        }
    }
    viewPointForFramePoint(point) {
        return this.viewProxy.viewPointForFramePoint(point);
    }
    viewQuadrilateralForFrameQuadrilateral(quadrilateral) {
        return this.viewProxy.viewQuadrilateralForFrameQuadrilateral(quadrilateral);
    }
    addControl(control) {
        if (!this.controls.includes(control)) {
            this.controls.push(control);
            this.privateContext.update();
        }
    }
    removeControl(control) {
        if (this.controls.includes(control)) {
            control.view = null;
            this.controls.splice(this.overlays.indexOf(control), 1);
            this.privateContext.update();
        }
    }
    controlUpdated() {
        this.privateContext.update();
    }
    initialize() {
        if (this._viewProxy) {
            return;
        }
        this._viewProxy = DataCaptureViewProxy.forDataCaptureView(this);
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
        if (!this.context) {
            throw new Error('There should be a context attached to a view that should be shown');
        }
        this.privateContext.initialize();
        return this.viewProxy.show();
    }
    _hide() {
        if (!this.context) {
            throw new Error('There should be a context attached to a view that should be shown');
        }
        return this.viewProxy.hide();
    }
}
__decorate([
    ignoreFromSerialization
], DataCaptureView.prototype, "_context", void 0);
__decorate([
    ignoreFromSerialization
], DataCaptureView.prototype, "_viewProxy", void 0);
__decorate([
    ignoreFromSerialization
], DataCaptureView.prototype, "listeners", void 0);
__decorate([
    ignoreFromSerialization
], DataCaptureView.prototype, "htmlElement", void 0);
__decorate([
    ignoreFromSerialization
], DataCaptureView.prototype, "_htmlElementState", void 0);
__decorate([
    ignoreFromSerialization
], DataCaptureView.prototype, "scrollListener", void 0);
__decorate([
    ignoreFromSerialization
], DataCaptureView.prototype, "domObserver", void 0);
__decorate([
    ignoreFromSerialization
], DataCaptureView.prototype, "orientationChangeListener", void 0);
//# sourceMappingURL=DataCaptureView.js.map