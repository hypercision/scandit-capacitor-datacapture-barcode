var capacitorPlugin = (function (exports, core) {
    'use strict';

    class CapacitorError {
        static fromJSON(json) {
            if (json && json.code && json.message) {
                return new CapacitorError(json.code, json.message);
            }
            else {
                return null;
            }
        }
        constructor(code, message) {
            this.code = code;
            this.message = message;
        }
    }
    const capacitorExec = (successCallback, errorCallback, pluginName, functionName, args) => {
        if (window.Scandit && window.Scandit.DEBUG) {
            // tslint:disable-next-line:no-console
            console.log(`Called native function: ${functionName}`, args, { success: successCallback, error: errorCallback });
        }
        const extendedSuccessCallback = (message) => {
            const shouldCallback = message && message.shouldNotifyWhenFinished;
            const finishCallbackID = shouldCallback ? message.finishCallbackID : null;
            const started = Date.now();
            let callbackResult;
            if (successCallback) {
                callbackResult = successCallback(message);
            }
            if (shouldCallback) {
                const maxCallbackDuration = 50;
                const callbackDuration = Date.now() - started;
                if (callbackDuration > maxCallbackDuration) {
                    // tslint:disable-next-line:no-console
                    console.log(`[SCANDIT WARNING] Took ${callbackDuration}ms to execute callback that's blocking native execution. You should keep this duration short, for more information, take a look at the documentation.`);
                }
                window.Capacitor.Plugins[pluginName].finishCallback([{
                        finishCallbackID,
                        result: callbackResult,
                    }]);
            }
        };
        const extendedErrorCallback = (error) => {
            if (errorCallback) {
                const capacitorError = CapacitorError.fromJSON(error);
                if (capacitorError !== null) {
                    error = capacitorError;
                }
                errorCallback(error);
            }
        };
        window.Capacitor.Plugins[pluginName][functionName](args).then(extendedSuccessCallback, extendedErrorCallback);
    };
    const doReturnWithFinish = (finishCallbackID, result) => {
        if (window.Capacitor.Plugins.ScanditBarcodeNative) {
            window.Capacitor.Plugins.ScanditBarcodeNative.finishCallback({ result: Object.assign({ finishCallbackID }, result) });
        }
        else if (window.Capacitor.Plugins.ScanditIdNative) {
            window.Capacitor.Plugins.ScanditIdNative.finishCallback({ result: Object.assign({ finishCallbackID }, result) });
        }
        return result;
    };

    // tslint:disable-next-line:ban-types
    function ignoreFromSerialization(target, propertyName) {
        target.ignoredProperties = target.ignoredProperties || [];
        target.ignoredProperties.push(propertyName);
    }
    // tslint:disable-next-line:ban-types
    function nameForSerialization(customName) {
        return (target, propertyName) => {
            target.customPropertyNames = target.customPropertyNames || {};
            target.customPropertyNames[propertyName] = customName;
        };
    }
    // tslint:disable-next-line:ban-types
    function ignoreFromSerializationIfNull(target, propertyName) {
        target.ignoredIfNullProperties = target.ignoredIfNullProperties || [];
        target.ignoredIfNullProperties.push(propertyName);
    }
    // tslint:disable-next-line:ban-types
    function serializationDefault(defaultValue) {
        return (target, propertyName) => {
            target.customPropertyDefaults = target.customPropertyDefaults || {};
            target.customPropertyDefaults[propertyName] = defaultValue;
        };
    }
    class DefaultSerializeable {
        toJSON() {
            const properties = Object.keys(this);
            // use @ignoreFromSerialization to ignore properties
            const ignoredProperties = this.ignoredProperties || [];
            // use @ignoreFromSerializationIfNull to ignore properties if they're null
            const ignoredIfNullProperties = this.ignoredIfNullProperties || [];
            // use @nameForSerialization('customName') to rename properties in the JSON output
            const customPropertyNames = this.customPropertyNames || {};
            // use @serializationDefault({}) to use a different value in the JSON output if they're null
            const customPropertyDefaults = this.customPropertyDefaults || {};
            return properties.reduce((json, property) => {
                if (ignoredProperties.includes(property)) {
                    return json;
                }
                let value = this[property];
                if (value === undefined) {
                    return json;
                }
                // Ignore if it's null and should be ignored.
                // This is basically responsible for not including optional properties in the JSON if they're null,
                // as that's not always deserialized to mean the same as not present.
                if (value === null && ignoredIfNullProperties.includes(property)) {
                    return json;
                }
                if (value === null && customPropertyDefaults[property] !== undefined) {
                    value = customPropertyDefaults[property];
                }
                // Serialize if serializeable
                if (value != null && value.toJSON) {
                    value = value.toJSON();
                }
                // Serialize the array if the elements are serializeable
                if (Array.isArray(value)) {
                    value = value.map(e => e.toJSON ? e.toJSON() : e);
                }
                const propertyName = customPropertyNames[property] || property;
                json[propertyName] = value;
                return json;
            }, {});
        }
    }

    var __decorate$k = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    class Point extends DefaultSerializeable {
        get x() {
            return this._x;
        }
        get y() {
            return this._y;
        }
        static fromJSON(json) {
            return new Point(json.x, json.y);
        }
        constructor(x, y) {
            super();
            this._x = x;
            this._y = y;
        }
    }
    __decorate$k([
        nameForSerialization('x')
    ], Point.prototype, "_x", void 0);
    __decorate$k([
        nameForSerialization('y')
    ], Point.prototype, "_y", void 0);
    class Quadrilateral extends DefaultSerializeable {
        get topLeft() {
            return this._topLeft;
        }
        get topRight() {
            return this._topRight;
        }
        get bottomRight() {
            return this._bottomRight;
        }
        get bottomLeft() {
            return this._bottomLeft;
        }
        static fromJSON(json) {
            return new Quadrilateral(Point.fromJSON(json.topLeft), Point.fromJSON(json.topRight), Point.fromJSON(json.bottomRight), Point.fromJSON(json.bottomLeft));
        }
        constructor(topLeft, topRight, bottomRight, bottomLeft) {
            super();
            this._topLeft = topLeft;
            this._topRight = topRight;
            this._bottomRight = bottomRight;
            this._bottomLeft = bottomLeft;
        }
    }
    __decorate$k([
        nameForSerialization('topLeft')
    ], Quadrilateral.prototype, "_topLeft", void 0);
    __decorate$k([
        nameForSerialization('topRight')
    ], Quadrilateral.prototype, "_topRight", void 0);
    __decorate$k([
        nameForSerialization('bottomRight')
    ], Quadrilateral.prototype, "_bottomRight", void 0);
    __decorate$k([
        nameForSerialization('bottomLeft')
    ], Quadrilateral.prototype, "_bottomLeft", void 0);
    var MeasureUnit;
    (function (MeasureUnit) {
        MeasureUnit["DIP"] = "dip";
        MeasureUnit["Pixel"] = "pixel";
        MeasureUnit["Fraction"] = "fraction";
    })(MeasureUnit || (MeasureUnit = {}));
    class NumberWithUnit extends DefaultSerializeable {
        get value() {
            return this._value;
        }
        get unit() {
            return this._unit;
        }
        static fromJSON(json) {
            return new NumberWithUnit(json.value, json.unit);
        }
        constructor(value, unit) {
            super();
            this._value = value;
            this._unit = unit;
        }
    }
    __decorate$k([
        nameForSerialization('value')
    ], NumberWithUnit.prototype, "_value", void 0);
    __decorate$k([
        nameForSerialization('unit')
    ], NumberWithUnit.prototype, "_unit", void 0);
    class PointWithUnit extends DefaultSerializeable {
        get x() {
            return this._x;
        }
        get y() {
            return this._y;
        }
        static fromJSON(json) {
            return new PointWithUnit(NumberWithUnit.fromJSON(json.x), NumberWithUnit.fromJSON(json.y));
        }
        static get zero() {
            return new PointWithUnit(new NumberWithUnit(0, MeasureUnit.Pixel), new NumberWithUnit(0, MeasureUnit.Pixel));
        }
        constructor(x, y) {
            super();
            this._x = x;
            this._y = y;
        }
    }
    __decorate$k([
        nameForSerialization('x')
    ], PointWithUnit.prototype, "_x", void 0);
    __decorate$k([
        nameForSerialization('y')
    ], PointWithUnit.prototype, "_y", void 0);
    class Rect extends DefaultSerializeable {
        get origin() {
            return this._origin;
        }
        get size() {
            return this._size;
        }
        constructor(origin, size) {
            super();
            this._origin = origin;
            this._size = size;
        }
    }
    __decorate$k([
        nameForSerialization('origin')
    ], Rect.prototype, "_origin", void 0);
    __decorate$k([
        nameForSerialization('size')
    ], Rect.prototype, "_size", void 0);
    class RectWithUnit extends DefaultSerializeable {
        get origin() {
            return this._origin;
        }
        get size() {
            return this._size;
        }
        constructor(origin, size) {
            super();
            this._origin = origin;
            this._size = size;
        }
    }
    __decorate$k([
        nameForSerialization('origin')
    ], RectWithUnit.prototype, "_origin", void 0);
    __decorate$k([
        nameForSerialization('size')
    ], RectWithUnit.prototype, "_size", void 0);
    class SizeWithUnit extends DefaultSerializeable {
        get width() {
            return this._width;
        }
        get height() {
            return this._height;
        }
        constructor(width, height) {
            super();
            this._width = width;
            this._height = height;
        }
    }
    __decorate$k([
        nameForSerialization('width')
    ], SizeWithUnit.prototype, "_width", void 0);
    __decorate$k([
        nameForSerialization('height')
    ], SizeWithUnit.prototype, "_height", void 0);
    class Size extends DefaultSerializeable {
        get width() {
            return this._width;
        }
        get height() {
            return this._height;
        }
        static fromJSON(json) {
            return new Size(json.width, json.height);
        }
        constructor(width, height) {
            super();
            this._width = width;
            this._height = height;
        }
    }
    __decorate$k([
        nameForSerialization('width')
    ], Size.prototype, "_width", void 0);
    __decorate$k([
        nameForSerialization('height')
    ], Size.prototype, "_height", void 0);
    class SizeWithAspect {
        get size() {
            return this._size;
        }
        get aspect() {
            return this._aspect;
        }
        constructor(size, aspect) {
            this._size = size;
            this._aspect = aspect;
        }
    }
    __decorate$k([
        nameForSerialization('size')
    ], SizeWithAspect.prototype, "_size", void 0);
    __decorate$k([
        nameForSerialization('aspect')
    ], SizeWithAspect.prototype, "_aspect", void 0);
    var SizingMode;
    (function (SizingMode) {
        SizingMode["WidthAndHeight"] = "widthAndHeight";
        SizingMode["WidthAndAspectRatio"] = "widthAndAspectRatio";
        SizingMode["HeightAndAspectRatio"] = "heightAndAspectRatio";
        SizingMode["ShorterDimensionAndAspectRatio"] = "shorterDimensionAndAspectRatio";
    })(SizingMode || (SizingMode = {}));
    class SizeWithUnitAndAspect {
        constructor() {
            this._shorterDimensionAndAspectRatio = null;
        }
        get widthAndHeight() {
            return this._widthAndHeight;
        }
        get widthAndAspectRatio() {
            return this._widthAndAspectRatio;
        }
        get heightAndAspectRatio() {
            return this._heightAndAspectRatio;
        }
        get shorterDimensionAndAspectRatio() {
            return this._shorterDimensionAndAspectRatio;
        }
        get sizingMode() {
            if (this.widthAndAspectRatio) {
                return SizingMode.WidthAndAspectRatio;
            }
            if (this.heightAndAspectRatio) {
                return SizingMode.HeightAndAspectRatio;
            }
            if (this.shorterDimensionAndAspectRatio) {
                return SizingMode.ShorterDimensionAndAspectRatio;
            }
            return SizingMode.WidthAndHeight;
        }
        static sizeWithWidthAndHeight(widthAndHeight) {
            const sizeWithUnitAndAspect = new SizeWithUnitAndAspect();
            sizeWithUnitAndAspect._widthAndHeight = widthAndHeight;
            return sizeWithUnitAndAspect;
        }
        static sizeWithWidthAndAspectRatio(width, aspectRatio) {
            const sizeWithUnitAndAspect = new SizeWithUnitAndAspect();
            sizeWithUnitAndAspect._widthAndAspectRatio = new SizeWithAspect(width, aspectRatio);
            return sizeWithUnitAndAspect;
        }
        static sizeWithHeightAndAspectRatio(height, aspectRatio) {
            const sizeWithUnitAndAspect = new SizeWithUnitAndAspect();
            sizeWithUnitAndAspect._heightAndAspectRatio = new SizeWithAspect(height, aspectRatio);
            return sizeWithUnitAndAspect;
        }
        static sizeWithShorterDimensionAndAspectRatio(shorterDimension, aspectRatio) {
            const sizeWithUnitAndAspect = new SizeWithUnitAndAspect();
            sizeWithUnitAndAspect._shorterDimensionAndAspectRatio = new SizeWithAspect(shorterDimension, aspectRatio);
            return sizeWithUnitAndAspect;
        }
        static fromJSON(json) {
            if (json.width && json.height) {
                return this.sizeWithWidthAndHeight(new SizeWithUnit(NumberWithUnit.fromJSON(json.width), NumberWithUnit.fromJSON(json.height)));
            }
            else if (json.width && json.aspect) {
                return this.sizeWithWidthAndAspectRatio(NumberWithUnit.fromJSON(json.width), json.aspect);
            }
            else if (json.height && json.aspect) {
                return this.sizeWithHeightAndAspectRatio(NumberWithUnit.fromJSON(json.height), json.aspect);
            }
            else if (json.shorterDimension && json.aspect) {
                return this.sizeWithShorterDimensionAndAspectRatio(NumberWithUnit.fromJSON(json.shorterDimension), json.aspect);
            }
            else {
                throw new Error(`SizeWithUnitAndAspectJSON is malformed: ${JSON.stringify(json)}`);
            }
        }
        // no member access so our coverage check doesn't pick it up
        // TODO: https://jira.scandit.com/browse/SDC-1773
        // tslint:disable-next-line:member-access
        toJSON() {
            switch (this.sizingMode) {
                case SizingMode.WidthAndAspectRatio:
                    return {
                        width: this.widthAndAspectRatio.size.toJSON(),
                        aspect: this.widthAndAspectRatio.aspect,
                    };
                case SizingMode.HeightAndAspectRatio:
                    return {
                        height: this.heightAndAspectRatio.size.toJSON(),
                        aspect: this.heightAndAspectRatio.aspect,
                    };
                case SizingMode.ShorterDimensionAndAspectRatio:
                    return {
                        shorterDimension: this.shorterDimensionAndAspectRatio.size.toJSON(),
                        aspect: this.shorterDimensionAndAspectRatio.aspect,
                    };
                default:
                    return {
                        width: this.widthAndHeight.width.toJSON(),
                        height: this.widthAndHeight.height.toJSON(),
                    };
            }
        }
    }
    __decorate$k([
        nameForSerialization('widthAndHeight')
    ], SizeWithUnitAndAspect.prototype, "_widthAndHeight", void 0);
    __decorate$k([
        nameForSerialization('widthAndAspectRatio')
    ], SizeWithUnitAndAspect.prototype, "_widthAndAspectRatio", void 0);
    __decorate$k([
        nameForSerialization('heightAndAspectRatio')
    ], SizeWithUnitAndAspect.prototype, "_heightAndAspectRatio", void 0);
    __decorate$k([
        nameForSerialization('shorterDimensionAndAspectRatio')
    ], SizeWithUnitAndAspect.prototype, "_shorterDimensionAndAspectRatio", void 0);
    class MarginsWithUnit extends DefaultSerializeable {
        get left() {
            return this._left;
        }
        get right() {
            return this._right;
        }
        get top() {
            return this._top;
        }
        get bottom() {
            return this._bottom;
        }
        static fromJSON(json) {
            return new MarginsWithUnit(NumberWithUnit.fromJSON(json.left), NumberWithUnit.fromJSON(json.right), NumberWithUnit.fromJSON(json.top), NumberWithUnit.fromJSON(json.bottom));
        }
        static get zero() {
            return new MarginsWithUnit(new NumberWithUnit(0, MeasureUnit.Pixel), new NumberWithUnit(0, MeasureUnit.Pixel), new NumberWithUnit(0, MeasureUnit.Pixel), new NumberWithUnit(0, MeasureUnit.Pixel));
        }
        constructor(left, right, top, bottom) {
            super();
            this._left = left;
            this._right = right;
            this._top = top;
            this._bottom = bottom;
        }
    }
    __decorate$k([
        nameForSerialization('left')
    ], MarginsWithUnit.prototype, "_left", void 0);
    __decorate$k([
        nameForSerialization('right')
    ], MarginsWithUnit.prototype, "_right", void 0);
    __decorate$k([
        nameForSerialization('top')
    ], MarginsWithUnit.prototype, "_top", void 0);
    __decorate$k([
        nameForSerialization('bottom')
    ], MarginsWithUnit.prototype, "_bottom", void 0);
    class Color {
        get redComponent() {
            return this.hexadecimalString.slice(0, 2);
        }
        get greenComponent() {
            return this.hexadecimalString.slice(2, 4);
        }
        get blueComponent() {
            return this.hexadecimalString.slice(4, 6);
        }
        get alphaComponent() {
            return this.hexadecimalString.slice(6, 8);
        }
        get red() {
            return Color.hexToNumber(this.redComponent);
        }
        get green() {
            return Color.hexToNumber(this.greenComponent);
        }
        get blue() {
            return Color.hexToNumber(this.blueComponent);
        }
        get alpha() {
            return Color.hexToNumber(this.alphaComponent);
        }
        static fromHex(hex) {
            return new Color(Color.normalizeHex(hex));
        }
        static fromRGBA(red, green, blue, alpha = 1) {
            const hexString = [red, green, blue, this.normalizeAlpha(alpha)]
                .reduce((hex, colorComponent) => hex + this.numberToHex(colorComponent), '');
            return new Color(hexString);
        }
        static hexToNumber(hex) {
            return parseInt(hex, 16);
        }
        static fromJSON(json) {
            return Color.fromHex(json);
        }
        static numberToHex(x) {
            x = Math.round(x);
            let hex = x.toString(16);
            if (hex.length === 1) {
                hex = '0' + hex;
            }
            return hex.toUpperCase();
        }
        static normalizeHex(hex) {
            // remove leading #
            if (hex[0] === '#') {
                hex = hex.slice(1);
            }
            // double digits if single digit
            if (hex.length < 6) {
                hex = hex.split('').map(s => s + s).join('');
            }
            // add alpha if missing
            if (hex.length === 6) {
                hex = hex + 'FF';
            }
            return hex.toUpperCase();
        }
        static normalizeAlpha(alpha) {
            if (alpha > 0 && alpha <= 1) {
                return 255 * alpha;
            }
            return alpha;
        }
        constructor(hex) {
            this.hexadecimalString = hex;
        }
        withAlpha(alpha) {
            const newHex = this.hexadecimalString.slice(0, 6) + Color.numberToHex(Color.normalizeAlpha(alpha));
            return Color.fromHex(newHex);
        }
        // no member access so our coverage check doesn't pick it up
        // TODO: https://jira.scandit.com/browse/SDC-1773
        // tslint:disable-next-line:member-access
        toJSON() {
            return this.hexadecimalString;
        }
    }
    var Orientation;
    (function (Orientation) {
        Orientation["Unknown"] = "unknown";
        Orientation["Portrait"] = "portrait";
        Orientation["PortraitUpsideDown"] = "portraitUpsideDown";
        Orientation["LandscapeRight"] = "landscapeRight";
        Orientation["LandscapeLeft"] = "landscapeLeft";
    })(Orientation || (Orientation = {}));
    var Direction;
    (function (Direction) {
        Direction["None"] = "none";
        Direction["Horizontal"] = "horizontal";
        Direction["LeftToRight"] = "leftToRight";
        Direction["RightToLeft"] = "rightToLeft";
        Direction["Vertical"] = "vertical";
        Direction["TopToBottom"] = "topToBottom";
        Direction["BottomToTop"] = "bottomToTop";
    })(Direction || (Direction = {}));

    var LogoStyle;
    (function (LogoStyle) {
        LogoStyle["Minimal"] = "minimal";
        LogoStyle["Extended"] = "extended";
    })(LogoStyle || (LogoStyle = {}));

    var __decorate$j = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var RectangularViewfinderStyle;
    (function (RectangularViewfinderStyle) {
        RectangularViewfinderStyle["Legacy"] = "legacy";
        RectangularViewfinderStyle["Rounded"] = "rounded";
        RectangularViewfinderStyle["Square"] = "square";
    })(RectangularViewfinderStyle || (RectangularViewfinderStyle = {}));
    var RectangularViewfinderLineStyle;
    (function (RectangularViewfinderLineStyle) {
        RectangularViewfinderLineStyle["Light"] = "light";
        RectangularViewfinderLineStyle["Bold"] = "bold";
    })(RectangularViewfinderLineStyle || (RectangularViewfinderLineStyle = {}));
    var LaserlineViewfinderStyle;
    (function (LaserlineViewfinderStyle) {
        LaserlineViewfinderStyle["Legacy"] = "legacy";
        LaserlineViewfinderStyle["Animated"] = "animated";
    })(LaserlineViewfinderStyle || (LaserlineViewfinderStyle = {}));
    class RectangularViewfinderAnimation extends DefaultSerializeable {
        static fromJSON(json) {
            if (json === null) {
                return null;
            }
            return new RectangularViewfinderAnimation(json.looping);
        }
        get isLooping() {
            return this._isLooping;
        }
        constructor(isLooping) {
            super();
            this._isLooping = false;
            this._isLooping = isLooping;
        }
    }
    __decorate$j([
        nameForSerialization('isLooping')
    ], RectangularViewfinderAnimation.prototype, "_isLooping", void 0);

    (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var CapacitorFunction$1;
    (function (CapacitorFunction) {
        CapacitorFunction["GetDefaults"] = "getDefaults";
        CapacitorFunction["ContextFromJSON"] = "contextFromJSON";
        CapacitorFunction["DisposeContext"] = "disposeContext";
        CapacitorFunction["UpdateContextFromJSON"] = "updateContextFromJSON";
        CapacitorFunction["SubscribeContextListener"] = "subscribeContextListener";
        CapacitorFunction["SubscribeContextFrameListener"] = "subscribeContextFrameListener";
        CapacitorFunction["SetViewPositionAndSize"] = "setViewPositionAndSize";
        CapacitorFunction["ShowView"] = "showView";
        CapacitorFunction["HideView"] = "hideView";
        CapacitorFunction["ViewPointForFramePoint"] = "viewPointForFramePoint";
        CapacitorFunction["ViewQuadrilateralForFrameQuadrilateral"] = "viewQuadrilateralForFrameQuadrilateral";
        CapacitorFunction["SubscribeViewListener"] = "subscribeViewListener";
        CapacitorFunction["GetCurrentCameraState"] = "getCurrentCameraState";
        CapacitorFunction["GetIsTorchAvailable"] = "getIsTorchAvailable";
        CapacitorFunction["GetLastFrame"] = "getLastFrame";
        CapacitorFunction["GetLastFrameOrNull"] = "getLastFrameOrNull";
        CapacitorFunction["EmitFeedback"] = "emitFeedback";
        CapacitorFunction["SubscribeVolumeButtonObserver"] = "subscribeVolumeButtonObserver";
        CapacitorFunction["UnsubscribeVolumeButtonObserver"] = "unsubscribeVolumeButtonObserver";
    })(CapacitorFunction$1 || (CapacitorFunction$1 = {}));
    const pluginName$1 = 'ScanditCaptureCoreNative';
    // tslint:disable-next-line:variable-name
    const Capacitor$1 = {
        pluginName: pluginName$1,
        defaults: {},
        exec: (success, error, functionName, args) => capacitorExec(success, error, pluginName$1, functionName, args),
    };

    var __decorate$i = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var Symbology;
    (function (Symbology) {
        Symbology["EAN13UPCA"] = "ean13Upca";
        Symbology["UPCE"] = "upce";
        Symbology["EAN8"] = "ean8";
        Symbology["Code39"] = "code39";
        Symbology["Code93"] = "code93";
        Symbology["Code128"] = "code128";
        Symbology["Code11"] = "code11";
        Symbology["Code25"] = "code25";
        Symbology["Codabar"] = "codabar";
        Symbology["InterleavedTwoOfFive"] = "interleavedTwoOfFive";
        Symbology["MSIPlessey"] = "msiPlessey";
        Symbology["QR"] = "qr";
        Symbology["DataMatrix"] = "dataMatrix";
        Symbology["Aztec"] = "aztec";
        Symbology["MaxiCode"] = "maxicode";
        Symbology["DotCode"] = "dotcode";
        Symbology["KIX"] = "kix";
        Symbology["RM4SCC"] = "rm4scc";
        Symbology["GS1Databar"] = "databar";
        Symbology["GS1DatabarExpanded"] = "databarExpanded";
        Symbology["GS1DatabarLimited"] = "databarLimited";
        Symbology["PDF417"] = "pdf417";
        Symbology["MicroPDF417"] = "microPdf417";
        Symbology["MicroQR"] = "microQr";
        Symbology["Code32"] = "code32";
        Symbology["Lapa4SC"] = "lapa4sc";
        Symbology["IATATwoOfFive"] = "iata2of5";
        Symbology["MatrixTwoOfFive"] = "matrix2of5";
        Symbology["USPSIntelligentMail"] = "uspsIntelligentMail";
    })(Symbology || (Symbology = {}));
    var CompositeType;
    (function (CompositeType) {
        CompositeType["A"] = "A";
        CompositeType["B"] = "B";
        CompositeType["C"] = "C";
    })(CompositeType || (CompositeType = {}));
    class SymbologyDescription {
        static get all() {
            return this.defaults().SymbologyDescriptions;
        }
        get identifier() { return this._identifier; }
        get symbology() { return this.identifier; }
        get readableName() { return this._readableName; }
        get isAvailable() { return this._isAvailable; }
        get isColorInvertible() { return this._isColorInvertible; }
        get activeSymbolCountRange() { return this._activeSymbolCountRange; }
        get defaultSymbolCountRange() { return this._defaultSymbolCountRange; }
        get supportedExtensions() { return this._supportedExtensions; }
        static fromJSON(json) {
            const symbologyDescription = new SymbologyDescription();
            symbologyDescription._identifier = json.identifier;
            symbologyDescription._readableName = json.readableName;
            symbologyDescription._isAvailable = json.isAvailable;
            symbologyDescription._isColorInvertible = json.isColorInvertible;
            symbologyDescription._activeSymbolCountRange = Range.fromJSON(json.activeSymbolCountRange);
            symbologyDescription._defaultSymbolCountRange = Range.fromJSON(json.defaultSymbolCountRange);
            symbologyDescription._supportedExtensions = json.supportedExtensions;
            return symbologyDescription;
        }
        static forIdentifier(identifier) {
            const identifierIndex = SymbologyDescription.all
                .findIndex(description => description.identifier === identifier);
            if (identifierIndex === -1) {
                return null;
            }
            return new SymbologyDescription(identifier);
        }
        constructor(symbology) {
            if (!symbology) {
                return;
            }
            return SymbologyDescription.all[SymbologyDescription.all
                .findIndex(description => description.identifier === symbology)];
        }
    }
    class SymbologySettings extends DefaultSerializeable {
        get symbology() {
            return this._symbology;
        }
        get enabledExtensions() {
            return this.extensions;
        }
        static fromJSON(json) {
            const symbologySettings = new SymbologySettings();
            symbologySettings.extensions = json.extensions;
            symbologySettings.isEnabled = json.enabled;
            symbologySettings.isColorInvertedEnabled = json.colorInvertedEnabled;
            symbologySettings.checksums = json.checksums;
            symbologySettings.activeSymbolCounts = json.activeSymbolCounts;
            return symbologySettings;
        }
        setExtensionEnabled(extension, enabled) {
            const included = this.extensions.includes(extension);
            if (enabled && !included) {
                this.extensions.push(extension);
            }
            else if (!enabled && included) {
                this.extensions.splice(this.extensions.indexOf(extension), 1);
            }
        }
    }
    __decorate$i([
        ignoreFromSerialization
    ], SymbologySettings.prototype, "_symbology", void 0);
    __decorate$i([
        nameForSerialization('enabled')
    ], SymbologySettings.prototype, "isEnabled", void 0);
    __decorate$i([
        nameForSerialization('colorInvertedEnabled')
    ], SymbologySettings.prototype, "isColorInvertedEnabled", void 0);
    var Checksum;
    (function (Checksum) {
        Checksum["Mod10"] = "mod10";
        Checksum["Mod11"] = "mod11";
        Checksum["Mod16"] = "mod16";
        Checksum["Mod43"] = "mod43";
        Checksum["Mod47"] = "mod47";
        Checksum["Mod103"] = "mod103";
        Checksum["Mod10AndMod11"] = "mod1110";
        Checksum["Mod10AndMod10"] = "mod1010";
    })(Checksum || (Checksum = {}));
    class EncodingRange {
        get ianaName() { return this._ianaName; }
        get startIndex() { return this._startIndex; }
        get endIndex() { return this._endIndex; }
        static fromJSON(json) {
            const encodingRange = new EncodingRange();
            encodingRange._ianaName = json.ianaName;
            encodingRange._startIndex = json.startIndex;
            encodingRange._endIndex = json.endIndex;
            return encodingRange;
        }
    }
    var CompositeFlag;
    (function (CompositeFlag) {
        CompositeFlag["None"] = "none";
        CompositeFlag["Unknown"] = "unknown";
        CompositeFlag["Linked"] = "linked";
        CompositeFlag["GS1TypeA"] = "gs1TypeA";
        CompositeFlag["GS1TypeB"] = "gs1TypeB";
        CompositeFlag["GS1TypeC"] = "gs1TypeC";
    })(CompositeFlag || (CompositeFlag = {}));
    class Range {
        get minimum() {
            return this._minimum;
        }
        get maximum() {
            return this._maximum;
        }
        get step() {
            return this._step;
        }
        get isFixed() {
            return this.minimum === this.maximum || this.step <= 0;
        }
        static fromJSON(json) {
            const range = new Range();
            range._minimum = json.minimum;
            range._maximum = json.maximum;
            range._step = json.step;
            return range;
        }
    }
    __decorate$i([
        nameForSerialization('minimum')
    ], Range.prototype, "_minimum", void 0);
    __decorate$i([
        nameForSerialization('maximum')
    ], Range.prototype, "_maximum", void 0);
    __decorate$i([
        nameForSerialization('step')
    ], Range.prototype, "_step", void 0);
    class Barcode {
        get symbology() { return this._symbology; }
        get data() { return this._data; }
        get rawData() { return this._rawData; }
        get compositeData() { return this._compositeData; }
        get compositeRawData() { return this._compositeRawData; }
        get addOnData() { return this._addOnData; }
        get encodingRanges() { return this._encodingRanges; }
        get location() { return this._location; }
        get isGS1DataCarrier() { return this._isGS1DataCarrier; }
        get compositeFlag() { return this._compositeFlag; }
        get isColorInverted() { return this._isColorInverted; }
        get symbolCount() { return this._symbolCount; }
        get frameID() { return this._frameID; }
        get selectionIdentifier() { return this.data + this.symbology; }
        static fromJSON(json) {
            const barcode = new Barcode();
            barcode._symbology = json.symbology;
            barcode._data = json.data;
            barcode._rawData = json.rawData;
            barcode._compositeData = json.compositeData;
            barcode._compositeRawData = json.compositeRawData;
            barcode._addOnData = json.addOnData === undefined ? null : json.addOnData;
            barcode._isGS1DataCarrier = json.isGS1DataCarrier;
            barcode._compositeFlag = json.compositeFlag;
            barcode._isColorInverted = json.isColorInverted;
            barcode._symbolCount = json.symbolCount;
            barcode._frameID = json.frameId;
            barcode._encodingRanges = json.encodingRanges.map(EncodingRange.fromJSON);
            barcode._location = Quadrilateral.fromJSON(json.location);
            return barcode;
        }
    }
    class LocalizedOnlyBarcode {
        get location() {
            return this._location;
        }
        get frameID() {
            return this._frameID;
        }
        static fromJSON(json) {
            const localizedBarcode = new LocalizedOnlyBarcode();
            localizedBarcode._location = Quadrilateral.fromJSON(json.location);
            localizedBarcode._frameID = json.frameId;
            return localizedBarcode;
        }
    }
    class TrackedBarcode {
        get barcode() { return this._barcode; }
        get location() { return this._location; }
        get identifier() { return this._identifier; }
        get shouldAnimateFromPreviousToNextState() {
            // tslint:disable-next-line:no-console
            console.warn('shouldAnimateFromPreviousToNextState is deprecated and returns "false" when accessed');
            return false;
        }
        static fromJSON(json) {
            const trackedBarcode = new TrackedBarcode();
            trackedBarcode._identifier = json.identifier;
            trackedBarcode._barcode = Barcode.fromJSON(json.barcode);
            trackedBarcode._location = Quadrilateral.fromJSON(json.location);
            return trackedBarcode;
        }
    }
    class TargetBarcode extends DefaultSerializeable {
        get data() {
            return this._data;
        }
        get quantity() {
            return this._quantity;
        }
        static create(data, quantity) {
            return new TargetBarcode(data, quantity);
        }
        static fromJSON(json) {
            const data = json.data;
            const quantity = json.quantity;
            return TargetBarcode.create(data, quantity);
        }
        constructor(data, quantity) {
            super();
            this._data = data;
            this._quantity = quantity;
        }
    }
    __decorate$i([
        nameForSerialization('data')
    ], TargetBarcode.prototype, "_data", void 0);
    __decorate$i([
        nameForSerialization('quantity')
    ], TargetBarcode.prototype, "_quantity", void 0);

    var FrameSourceState;
    (function (FrameSourceState) {
        FrameSourceState["On"] = "on";
        FrameSourceState["Off"] = "off";
        FrameSourceState["Starting"] = "starting";
        FrameSourceState["Stopping"] = "stopping";
        FrameSourceState["Standby"] = "standby";
        FrameSourceState["BootingUp"] = "bootingUp";
        FrameSourceState["WakingUp"] = "wakingUp";
        FrameSourceState["GoingToSleep"] = "goingToSleep";
        FrameSourceState["ShuttingDown"] = "shuttingDown";
    })(FrameSourceState || (FrameSourceState = {}));
    var TorchState;
    (function (TorchState) {
        TorchState["On"] = "on";
        TorchState["Off"] = "off";
        TorchState["Auto"] = "auto";
    })(TorchState || (TorchState = {}));
    var CameraPosition;
    (function (CameraPosition) {
        CameraPosition["WorldFacing"] = "worldFacing";
        CameraPosition["UserFacing"] = "userFacing";
        CameraPosition["Unspecified"] = "unspecified";
    })(CameraPosition || (CameraPosition = {}));
    var VideoResolution;
    (function (VideoResolution) {
        VideoResolution["Auto"] = "auto";
        VideoResolution["HD"] = "hd";
        VideoResolution["FullHD"] = "fullHd";
        VideoResolution["UHD4K"] = "uhd4k";
    })(VideoResolution || (VideoResolution = {}));
    var FocusRange;
    (function (FocusRange) {
        FocusRange["Full"] = "full";
        FocusRange["Near"] = "near";
        FocusRange["Far"] = "far";
    })(FocusRange || (FocusRange = {}));
    var FocusGestureStrategy;
    (function (FocusGestureStrategy) {
        FocusGestureStrategy["None"] = "none";
        FocusGestureStrategy["Manual"] = "manual";
        FocusGestureStrategy["ManualUntilCapture"] = "manualUntilCapture";
        FocusGestureStrategy["AutoOnLocation"] = "autoOnLocation";
    })(FocusGestureStrategy || (FocusGestureStrategy = {}));
    var PrivateCameraProperty;
    (function (PrivateCameraProperty) {
        PrivateCameraProperty["CameraAPI"] = "api";
    })(PrivateCameraProperty || (PrivateCameraProperty = {}));
    class CameraSettings extends DefaultSerializeable {
        get focusRange() {
            return this.focus.range;
        }
        set focusRange(newRange) {
            this.focus.range = newRange;
        }
        get focusGestureStrategy() {
            return this.focus.focusGestureStrategy;
        }
        set focusGestureStrategy(newStrategy) {
            this.focus.focusGestureStrategy = newStrategy;
        }
        get shouldPreferSmoothAutoFocus() {
            return this.focus.shouldPreferSmoothAutoFocus;
        }
        set shouldPreferSmoothAutoFocus(newShouldPreferSmoothAutoFocus) {
            this.focus.shouldPreferSmoothAutoFocus = newShouldPreferSmoothAutoFocus;
        }
        static fromJSON(json) {
            const settings = new CameraSettings();
            settings.preferredResolution = json.preferredResolution;
            settings.zoomFactor = json.zoomFactor;
            settings.focusRange = json.focusRange;
            settings.zoomGestureZoomFactor = json.zoomGestureZoomFactor;
            settings.focusGestureStrategy = json.focusGestureStrategy;
            settings.shouldPreferSmoothAutoFocus = json.shouldPreferSmoothAutoFocus;
            if (json.api !== undefined && json.api !== null) {
                settings.api = json.api;
            }
            return settings;
        }
        constructor(settings) {
            super();
            this.preferredResolution = Capacitor$1.defaults.Camera.Settings.preferredResolution;
            this.zoomFactor = Capacitor$1.defaults.Camera.Settings.zoomFactor;
            this.zoomGestureZoomFactor = Capacitor$1.defaults.Camera.Settings.zoomGestureZoomFactor;
            this.api = 0;
            this.focus = {
                range: Capacitor$1.defaults.Camera.Settings.focusRange,
                focusGestureStrategy: Capacitor$1.defaults.Camera.Settings.focusGestureStrategy,
                shouldPreferSmoothAutoFocus: Capacitor$1.defaults.Camera.Settings.shouldPreferSmoothAutoFocus,
            };
            if (settings !== undefined && settings !== null) {
                Object.getOwnPropertyNames(settings).forEach(propertyName => {
                    this[propertyName] = settings[propertyName];
                });
            }
        }
        setProperty(name, value) {
            this[name] = value;
        }
        getProperty(name) {
            return this[name];
        }
    }
    class ImageBuffer {
        get width() {
            return this._width;
        }
        get height() {
            return this._height;
        }
        get data() {
            return this._data;
        }
    }
    class PrivateFrameData {
        get imageBuffers() {
            return this._imageBuffers;
        }
        get orientation() {
            return this._orientation;
        }
        static fromJSON(json) {
            const frameData = new PrivateFrameData();
            frameData._imageBuffers = json.imageBuffers.map((imageBufferJSON) => {
                const imageBuffer = new ImageBuffer();
                imageBuffer._width = imageBufferJSON.width;
                imageBuffer._height = imageBufferJSON.height;
                imageBuffer._data = imageBufferJSON.data;
                return imageBuffer;
            });
            frameData._orientation = json.orientation;
            return frameData;
        }
    }

    class FeedbackProxy {
        static forFeedback(feedback) {
            const proxy = new FeedbackProxy();
            proxy.feedback = feedback;
            return proxy;
        }
        emit() {
            window.Capacitor.Plugins[Capacitor$1.pluginName][CapacitorFunction$1.EmitFeedback]({ feedback: this.feedback.toJSON() });
        }
    }

    var __decorate$h = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var VibrationType;
    (function (VibrationType) {
        VibrationType["default"] = "default";
        VibrationType["selectionHaptic"] = "selectionHaptic";
        VibrationType["successHaptic"] = "successHaptic";
    })(VibrationType || (VibrationType = {}));
    class Vibration extends DefaultSerializeable {
        static fromJSON(json) {
            return new Vibration(json.type);
        }
        static get defaultVibration() {
            return new Vibration(VibrationType.default);
        }
        static get selectionHapticFeedback() {
            return new Vibration(VibrationType.selectionHaptic);
        }
        static get successHapticFeedback() {
            return new Vibration(VibrationType.successHaptic);
        }
        constructor(type) {
            super();
            this.type = type;
        }
    }
    class Sound extends DefaultSerializeable {
        static fromJSON(json) {
            return new Sound(json.resource);
        }
        static get defaultSound() {
            return new Sound(null);
        }
        constructor(resource) {
            super();
            this.resource = null;
            this.resource = resource;
        }
    }
    __decorate$h([
        ignoreFromSerializationIfNull
    ], Sound.prototype, "resource", void 0);
    class Feedback extends DefaultSerializeable {
        static get defaultFeedback() {
            return new Feedback(Vibration.defaultVibration, Sound.defaultSound);
        }
        static fromJSON(json) {
            return new Feedback(json.vibration ? Vibration.fromJSON(json.vibration) : null, json.sound ? Sound.fromJSON(json.sound) : null);
        }
        get vibration() {
            return this._vibration;
        }
        get sound() {
            return this._sound;
        }
        constructor(vibration, sound) {
            super();
            this._vibration = null;
            this._sound = null;
            this._vibration = vibration;
            this._sound = sound;
            this.initialize();
        }
        emit() {
            if (!this.proxy) {
                return;
            }
            this.proxy.emit();
        }
        initialize() {
            if (this.proxy) {
                return;
            }
            this.proxy = FeedbackProxy.forFeedback(this);
        }
    }
    __decorate$h([
        ignoreFromSerializationIfNull,
        nameForSerialization('vibration')
    ], Feedback.prototype, "_vibration", void 0);
    __decorate$h([
        ignoreFromSerializationIfNull,
        nameForSerialization('sound')
    ], Feedback.prototype, "_sound", void 0);
    __decorate$h([
        ignoreFromSerialization
    ], Feedback.prototype, "proxy", void 0);

    var __decorate$g = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    class Brush extends DefaultSerializeable {
        static get transparent() {
            const transparentBlack = Color.fromRGBA(255, 255, 255, 0);
            return new Brush(transparentBlack, transparentBlack, 0);
        }
        get fillColor() {
            return this.fill.color;
        }
        get strokeColor() {
            return this.stroke.color;
        }
        get strokeWidth() {
            return this.stroke.width;
        }
        constructor(fillColor = Capacitor$1.defaults.Brush.fillColor, strokeColor = Capacitor$1.defaults.Brush.strokeColor, strokeWidth = Capacitor$1.defaults.Brush.strokeWidth) {
            super();
            this.fill = { color: fillColor };
            this.stroke = { color: strokeColor, width: strokeWidth };
        }
    }
    // tslint:disable-next-line:variable-name
    const NoViewfinder = { type: 'none' };
    class LaserlineViewfinder extends DefaultSerializeable {
        constructor(style) {
            super();
            this.type = 'laserline';
            const viewfinderStyle = style || Capacitor$1.defaults.LaserlineViewfinder.defaultStyle;
            this._style = Capacitor$1.defaults.LaserlineViewfinder.styles[viewfinderStyle].style;
            this.width = Capacitor$1.defaults.LaserlineViewfinder.styles[viewfinderStyle].width;
            this.enabledColor = Capacitor$1.defaults.LaserlineViewfinder.styles[viewfinderStyle].enabledColor;
            this.disabledColor = Capacitor$1.defaults.LaserlineViewfinder.styles[viewfinderStyle].disabledColor;
        }
        get style() {
            return this._style;
        }
    }
    __decorate$g([
        nameForSerialization('style')
    ], LaserlineViewfinder.prototype, "_style", void 0);
    class RectangularViewfinder extends DefaultSerializeable {
        get sizeWithUnitAndAspect() {
            return this._sizeWithUnitAndAspect;
        }
        constructor(style, lineStyle) {
            super();
            this.type = 'rectangular';
            const viewfinderStyle = style || Capacitor$1.defaults.RectangularViewfinder.defaultStyle;
            this._style = Capacitor$1.defaults.RectangularViewfinder.styles[viewfinderStyle].style;
            this._lineStyle = Capacitor$1.defaults.RectangularViewfinder.styles[viewfinderStyle].lineStyle;
            this._dimming = parseFloat(Capacitor$1.defaults.RectangularViewfinder.styles[viewfinderStyle].dimming);
            this._disabledDimming =
                parseFloat(Capacitor$1.defaults.RectangularViewfinder.styles[viewfinderStyle].disabledDimming);
            this._animation = Capacitor$1.defaults.RectangularViewfinder.styles[viewfinderStyle].animation;
            this.color = Capacitor$1.defaults.RectangularViewfinder.styles[viewfinderStyle].color;
            this._sizeWithUnitAndAspect = Capacitor$1.defaults.RectangularViewfinder.styles[viewfinderStyle].size;
            if (lineStyle !== undefined) {
                this._lineStyle = lineStyle;
            }
        }
        get style() {
            return this._style;
        }
        get lineStyle() {
            return this._lineStyle;
        }
        get dimming() {
            return this._dimming;
        }
        set dimming(value) {
            this._dimming = value;
        }
        get disabledDimming() {
            return this._disabledDimming;
        }
        set disabledDimming(value) {
            this._disabledDimming = value;
        }
        get animation() {
            return this._animation;
        }
        set animation(animation) {
            this._animation = animation;
        }
        setSize(size) {
            this._sizeWithUnitAndAspect = SizeWithUnitAndAspect.sizeWithWidthAndHeight(size);
        }
        setWidthAndAspectRatio(width, heightToWidthAspectRatio) {
            this._sizeWithUnitAndAspect = SizeWithUnitAndAspect.sizeWithWidthAndAspectRatio(width, heightToWidthAspectRatio);
        }
        setHeightAndAspectRatio(height, widthToHeightAspectRatio) {
            this._sizeWithUnitAndAspect = SizeWithUnitAndAspect.sizeWithHeightAndAspectRatio(height, widthToHeightAspectRatio);
        }
        setShorterDimensionAndAspectRatio(fraction, aspectRatio) {
            this._sizeWithUnitAndAspect = SizeWithUnitAndAspect.sizeWithShorterDimensionAndAspectRatio(new NumberWithUnit(fraction, MeasureUnit.Fraction), aspectRatio);
        }
    }
    __decorate$g([
        nameForSerialization('style')
    ], RectangularViewfinder.prototype, "_style", void 0);
    __decorate$g([
        nameForSerialization('lineStyle')
    ], RectangularViewfinder.prototype, "_lineStyle", void 0);
    __decorate$g([
        nameForSerialization('dimming')
    ], RectangularViewfinder.prototype, "_dimming", void 0);
    __decorate$g([
        nameForSerialization('disabledDimming')
    ], RectangularViewfinder.prototype, "_disabledDimming", void 0);
    __decorate$g([
        nameForSerialization('animation'),
        ignoreFromSerialization
    ], RectangularViewfinder.prototype, "_animation", void 0);
    __decorate$g([
        nameForSerialization('size')
    ], RectangularViewfinder.prototype, "_sizeWithUnitAndAspect", void 0);
    class AimerViewfinder extends DefaultSerializeable {
        constructor() {
            super();
            this.type = 'aimer';
            this.frameColor = Capacitor$1.defaults.AimerViewfinder.frameColor;
            this.dotColor = Capacitor$1.defaults.AimerViewfinder.dotColor;
        }
    }

    var __decorate$f = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    class BarcodeFilterSettings extends DefaultSerializeable {
        get excludeEan13() {
            return this._excludeEan13;
        }
        set excludeEan13(value) {
            this._excludeEan13 = value;
        }
        get excludeUpca() {
            return this._excludeUpca;
        }
        set excludeUpca(value) {
            this._excludeUpca = value;
        }
        get excludedCodesRegex() {
            return this._excludedCodesRegex;
        }
        set excludedCodesRegex(value) {
            this._excludedCodesRegex = value;
        }
        get excludedSymbologies() {
            return this._excludedSymbologies;
        }
        set excludedSymbologies(values) {
            this._excludedSymbologies = values;
        }
        static fromJSON(json) {
            const excludeEan13 = json === null || json === void 0 ? void 0 : json.excludeEan13;
            const excludeUpca = json === null || json === void 0 ? void 0 : json.excludeUpca;
            const excludedCodesRegex = json === null || json === void 0 ? void 0 : json.excludedCodesRegex;
            const excludedSymbologies = json === null || json === void 0 ? void 0 : json.excludedSymbologies;
            const excludedSymbolCounts = json === null || json === void 0 ? void 0 : json.excludedSymbolCounts;
            return new BarcodeFilterSettings(excludeEan13, excludeUpca, excludedCodesRegex, excludedSymbolCounts, excludedSymbologies);
        }
        constructor(excludeEan13, excludeUpca, excludedCodesRegex, excludedSymbolCounts, excludedSymbologies) {
            super();
            this._excludeEan13 = false;
            this._excludeUpca = false;
            this._excludedCodesRegex = '';
            this._excludedSymbolCounts = {};
            this._excludedSymbologies = [];
            this.excludeEan13 = excludeEan13;
            this.excludeUpca = excludeUpca;
            this.excludedCodesRegex = excludedCodesRegex;
            this._excludedSymbolCounts = excludedSymbolCounts;
            this.excludedSymbologies = excludedSymbologies;
        }
        getExcludedSymbolCountsForSymbology(symbology) {
            return this._excludedSymbolCounts[symbology] || [];
        }
        setExcludedSymbolCounts(excludedSymbolCounts, symbology) {
            this._excludedSymbolCounts[symbology] = excludedSymbolCounts;
        }
    }
    __decorate$f([
        nameForSerialization('excludeEan13')
    ], BarcodeFilterSettings.prototype, "_excludeEan13", void 0);
    __decorate$f([
        nameForSerialization('excludeUpca')
    ], BarcodeFilterSettings.prototype, "_excludeUpca", void 0);
    __decorate$f([
        nameForSerialization('excludedCodesRegex')
    ], BarcodeFilterSettings.prototype, "_excludedCodesRegex", void 0);
    __decorate$f([
        nameForSerialization('excludedSymbolCounts')
    ], BarcodeFilterSettings.prototype, "_excludedSymbolCounts", void 0);
    __decorate$f([
        nameForSerialization('excludedSymbologies')
    ], BarcodeFilterSettings.prototype, "_excludedSymbologies", void 0);
    var BarcodeFilterHighlightType;
    (function (BarcodeFilterHighlightType) {
        BarcodeFilterHighlightType["Brush"] = "brush";
    })(BarcodeFilterHighlightType || (BarcodeFilterHighlightType = {}));
    class BarcodeFilterHighlightSettingsBrush extends DefaultSerializeable {
        static create(brush) {
            return new BarcodeFilterHighlightSettingsBrush(brush);
        }
        constructor(brush) {
            super();
            this._brush = null;
            this._highlightType = BarcodeFilterHighlightType.Brush;
            this._brush = brush;
        }
        get highlightType() {
            return this._highlightType;
        }
        get brush() {
            return this._brush;
        }
    }
    __decorate$f([
        nameForSerialization('highlightType')
    ], BarcodeFilterHighlightSettingsBrush.prototype, "_highlightType", void 0);
    __decorate$f([
        nameForSerialization('brush')
    ], BarcodeFilterHighlightSettingsBrush.prototype, "_brush", void 0);

    var BarcodeCountViewStyle$1;
    (function (BarcodeCountViewStyle) {
        BarcodeCountViewStyle["Icon"] = "icon";
        BarcodeCountViewStyle["Dot"] = "dot";
    })(BarcodeCountViewStyle$1 || (BarcodeCountViewStyle$1 = {}));
    const barcodeCountDefaultsFromJSON = (rootJson) => {
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

    const defaultsFromJSON = (json) => {
        const defaults = {
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
            BarcodeSelection: {
                RecommendedCameraSettings: CameraSettings
                    .fromJSON(json.BarcodeSelection.RecommendedCameraSettings),
                feedback: ({
                    selection: Feedback
                        .fromJSON(JSON.parse(json.BarcodeSelection.feedback).selection),
                }),
                BarcodeSelectionSettings: {
                    codeDuplicateFilter: json.BarcodeSelection.BarcodeSelectionSettings.codeDuplicateFilter,
                    singleBarcodeAutoDetection: json.BarcodeSelection.BarcodeSelectionSettings.singleBarcodeAutoDetection,
                    selectionType: fromJSON => fromJSON(JSON.parse(json.BarcodeSelection.BarcodeSelectionSettings.selectionType)),
                },
                BarcodeSelectionTapSelection: {
                    defaultFreezeBehavior: json.BarcodeSelection.BarcodeSelectionTapSelection
                        .defaultFreezeBehavior,
                    defaultTapBehavior: json.BarcodeSelection.BarcodeSelectionTapSelection
                        .defaultTapBehavior,
                },
                BarcodeSelectionAimerSelection: {
                    defaultSelectionStrategy: fromJSON => fromJSON(JSON.parse(json.BarcodeSelection.BarcodeSelectionAimerSelection.defaultSelectionStrategy)),
                },
                BarcodeSelectionBasicOverlay: {
                    defaultStyle: json.BarcodeSelection
                        .BarcodeSelectionBasicOverlay.defaultStyle,
                    DefaultTrackedBrush: {
                        fillColor: Color
                            .fromJSON(json.BarcodeSelection.BarcodeSelectionBasicOverlay.DefaultTrackedBrush.fillColor),
                        strokeColor: Color
                            .fromJSON(json.BarcodeSelection.BarcodeSelectionBasicOverlay.DefaultTrackedBrush.strokeColor),
                        strokeWidth: json.BarcodeSelection.BarcodeSelectionBasicOverlay.DefaultTrackedBrush.strokeWidth,
                    },
                    DefaultAimedBrush: {
                        fillColor: Color
                            .fromJSON(json.BarcodeSelection.BarcodeSelectionBasicOverlay.DefaultAimedBrush.fillColor),
                        strokeColor: Color
                            .fromJSON(json.BarcodeSelection.BarcodeSelectionBasicOverlay.DefaultAimedBrush.strokeColor),
                        strokeWidth: json.BarcodeSelection.BarcodeSelectionBasicOverlay.DefaultAimedBrush.strokeWidth,
                    },
                    DefaultSelectedBrush: {
                        fillColor: Color
                            .fromJSON(json.BarcodeSelection.BarcodeSelectionBasicOverlay.DefaultSelectedBrush.fillColor),
                        strokeColor: Color
                            .fromJSON(json.BarcodeSelection.BarcodeSelectionBasicOverlay.DefaultSelectedBrush.strokeColor),
                        strokeWidth: json.BarcodeSelection.BarcodeSelectionBasicOverlay.DefaultSelectedBrush.strokeWidth,
                    },
                    DefaultSelectingBrush: {
                        fillColor: Color
                            .fromJSON(json.BarcodeSelection.BarcodeSelectionBasicOverlay.DefaultSelectingBrush.fillColor),
                        strokeColor: Color
                            .fromJSON(json.BarcodeSelection.BarcodeSelectionBasicOverlay.DefaultSelectingBrush.strokeColor),
                        strokeWidth: json.BarcodeSelection.BarcodeSelectionBasicOverlay.DefaultSelectingBrush.strokeWidth,
                    },
                    styles: Object
                        .keys(json.BarcodeSelection.BarcodeSelectionBasicOverlay.styles)
                        .reduce((previousValue, currentValue) => {
                        return Object.assign(Object.assign({}, previousValue), { [currentValue]: {
                                DefaultTrackedBrush: {
                                    fillColor: Color
                                        .fromJSON(json.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[currentValue]
                                        .DefaultTrackedBrush.fillColor),
                                    strokeColor: Color
                                        .fromJSON(json.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[currentValue]
                                        .DefaultTrackedBrush.strokeColor),
                                    strokeWidth: json.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[currentValue]
                                        .DefaultTrackedBrush.strokeWidth,
                                },
                                DefaultAimedBrush: {
                                    fillColor: Color
                                        .fromJSON(json.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[currentValue]
                                        .DefaultAimedBrush.fillColor),
                                    strokeColor: Color
                                        .fromJSON(json.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[currentValue]
                                        .DefaultAimedBrush.strokeColor),
                                    strokeWidth: json.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[currentValue]
                                        .DefaultAimedBrush.strokeWidth,
                                },
                                DefaultSelectedBrush: {
                                    fillColor: Color
                                        .fromJSON(json.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[currentValue]
                                        .DefaultSelectedBrush.fillColor),
                                    strokeColor: Color
                                        .fromJSON(json.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[currentValue]
                                        .DefaultSelectedBrush.strokeColor),
                                    strokeWidth: json.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[currentValue]
                                        .DefaultSelectedBrush.strokeWidth,
                                },
                                DefaultSelectingBrush: {
                                    fillColor: Color
                                        .fromJSON(json.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[currentValue]
                                        .DefaultSelectingBrush.fillColor),
                                    strokeColor: Color
                                        .fromJSON(json.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[currentValue]
                                        .DefaultSelectingBrush.strokeColor),
                                    strokeWidth: json.BarcodeSelection.BarcodeSelectionBasicOverlay.styles[currentValue]
                                        .DefaultSelectingBrush.strokeWidth,
                                },
                            } });
                    }, {}),
                },
            },
            BarcodeCount: barcodeCountDefaultsFromJSON(json)
        };
        return defaults;
    };

    var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var CapacitorFunction;
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
        CapacitorFunction["SubscribeBarcodeCountListener"] = "registerBarcodeCountListener";
        CapacitorFunction["UnsubscribeBarcodeCountListener"] = "unregisterBarcodeCountListener";
        CapacitorFunction["ResetBarcodeCountSession"] = "resetBarcodeCountSession";
        CapacitorFunction["StartBarcodeCountScanningPhase"] = "startScanningPhase";
        CapacitorFunction["EndBarcodeCountScanningPhase"] = "endScanningPhase";
        CapacitorFunction["SetBarcodeCountCaptureList"] = "setBarcodeCountCaptureList";
    })(CapacitorFunction || (CapacitorFunction = {}));
    const pluginName = 'ScanditBarcodeNative';
    // tslint:disable-next-line:variable-name
    const Capacitor = {
        pluginName,
        defaults: {},
        exec: (success, error, functionName, args) => capacitorExec(success, error, pluginName, functionName, args),
    };
    const getDefaults = () => __awaiter$1(void 0, void 0, void 0, function* () {
        try {
            const defaultsJSON = yield window.Capacitor.Plugins[pluginName][CapacitorFunction.GetDefaults]();
            const defaults = defaultsFromJSON(defaultsJSON);
            Capacitor.defaults = defaults;
        }
        catch (error) {
            // tslint:disable-next-line:no-console
            console.warn(error);
        }
        return Capacitor.defaults;
    });
    // To circumvent a circular dependency
    SymbologyDescription.defaults = () => Capacitor.defaults;

    var __decorate$e = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    class BarcodeCaptureSession {
        get newlyRecognizedBarcodes() {
            return this._newlyRecognizedBarcodes;
        }
        get newlyLocalizedBarcodes() {
            return this._newlyLocalizedBarcodes;
        }
        get frameSequenceID() {
            return this._frameSequenceID;
        }
        static fromJSON(json) {
            const session = new BarcodeCaptureSession();
            session._newlyRecognizedBarcodes = json.newlyRecognizedBarcodes
                .map(Barcode.fromJSON);
            session._newlyLocalizedBarcodes = json.newlyLocalizedBarcodes
                .map(LocalizedOnlyBarcode.fromJSON);
            session._frameSequenceID = json.frameSequenceId;
            return session;
        }
        reset() {
            return this.listenerProxy.reset();
        }
    }
    class BarcodeCaptureFeedback extends DefaultSerializeable {
        constructor() {
            super(...arguments);
            this.success = Feedback.defaultFeedback;
        }
        static get default() {
            return new BarcodeCaptureFeedback();
        }
    }
    var BarcodeCaptureOverlayStyle;
    (function (BarcodeCaptureOverlayStyle) {
        BarcodeCaptureOverlayStyle["Frame"] = "frame";
        BarcodeCaptureOverlayStyle["Legacy"] = "legacy";
    })(BarcodeCaptureOverlayStyle || (BarcodeCaptureOverlayStyle = {}));
    class BarcodeCaptureOverlay extends DefaultSerializeable {
        static get defaultBrush() {
            // tslint:disable-next-line:no-console
            console.warn('defaultBrush is deprecated and will be removed in a future release. ' +
                'Use .brush to get the default for your selected style');
            return new Brush(Capacitor.defaults.BarcodeCapture.BarcodeCaptureOverlay.styles[Capacitor.defaults.BarcodeCapture.BarcodeCaptureOverlay.defaultStyle].DefaultBrush.fillColor, Capacitor.defaults.BarcodeCapture.BarcodeCaptureOverlay.styles[Capacitor.defaults.BarcodeCapture.BarcodeCaptureOverlay.defaultStyle].DefaultBrush.strokeColor, Capacitor.defaults.BarcodeCapture.BarcodeCaptureOverlay.styles[Capacitor.defaults.BarcodeCapture.BarcodeCaptureOverlay.defaultStyle].DefaultBrush.strokeWidth);
        }
        get brush() {
            return this._brush;
        }
        set brush(newBrush) {
            this._brush = newBrush;
            this.barcodeCapture.didChange();
        }
        get viewfinder() {
            return this._viewfinder;
        }
        set viewfinder(newViewfinder) {
            this._viewfinder = newViewfinder;
            this.barcodeCapture.didChange();
        }
        get shouldShowScanAreaGuides() {
            return this._shouldShowScanAreaGuides;
        }
        set shouldShowScanAreaGuides(shouldShow) {
            this._shouldShowScanAreaGuides = shouldShow;
            this.barcodeCapture.didChange();
        }
        get style() {
            return this._style;
        }
        static withBarcodeCapture(barcodeCapture) {
            return BarcodeCaptureOverlay.withBarcodeCaptureForView(barcodeCapture, null);
        }
        static withBarcodeCaptureForView(barcodeCapture, view) {
            return this.withBarcodeCaptureForViewWithStyle(barcodeCapture, view, Capacitor.defaults.BarcodeCapture.BarcodeCaptureOverlay.defaultStyle);
        }
        static withBarcodeCaptureForViewWithStyle(barcodeCapture, view, style) {
            const overlay = new BarcodeCaptureOverlay();
            overlay.barcodeCapture = barcodeCapture;
            overlay._style = style;
            overlay._brush = new Brush(Capacitor.defaults.BarcodeCapture.BarcodeCaptureOverlay.styles[overlay._style].DefaultBrush.fillColor, Capacitor.defaults.BarcodeCapture.BarcodeCaptureOverlay.styles[overlay._style].DefaultBrush.strokeColor, Capacitor.defaults.BarcodeCapture.BarcodeCaptureOverlay.styles[overlay._style].DefaultBrush.strokeWidth);
            if (view) {
                view.addOverlay(overlay);
            }
            return overlay;
        }
        constructor() {
            super();
            this.type = 'barcodeCapture';
            this._shouldShowScanAreaGuides = false;
            this._viewfinder = null;
            this._brush = BarcodeCaptureOverlay.defaultBrush;
        }
    }
    __decorate$e([
        ignoreFromSerialization
    ], BarcodeCaptureOverlay.prototype, "barcodeCapture", void 0);
    __decorate$e([
        nameForSerialization('shouldShowScanAreaGuides')
    ], BarcodeCaptureOverlay.prototype, "_shouldShowScanAreaGuides", void 0);
    __decorate$e([
        serializationDefault(NoViewfinder),
        nameForSerialization('viewfinder')
    ], BarcodeCaptureOverlay.prototype, "_viewfinder", void 0);
    __decorate$e([
        nameForSerialization('brush')
    ], BarcodeCaptureOverlay.prototype, "_brush", void 0);
    __decorate$e([
        nameForSerialization('style')
    ], BarcodeCaptureOverlay.prototype, "_style", void 0);

    class CameraProxy {
        static forCamera(camera) {
            const proxy = new CameraProxy();
            proxy.camera = camera;
            return proxy;
        }
        static getLastFrame() {
            return new Promise(resolve => window.Capacitor.Plugins[Capacitor$1.pluginName][CapacitorFunction$1.GetLastFrame]().then((frameDataJSONString) => {
                let parsedData;
                if (frameDataJSONString.data) {
                    parsedData = JSON.parse(frameDataJSONString.data);
                }
                else {
                    parsedData = frameDataJSONString;
                }
                resolve(PrivateFrameData.fromJSON(parsedData));
            }));
        }
        static getLastFrameOrNull() {
            return new Promise(resolve => window.Capacitor.Plugins[Capacitor$1.pluginName][CapacitorFunction$1.GetLastFrameOrNull]()
                .then((frameDataJSONString) => {
                if (!frameDataJSONString) {
                    return resolve(null);
                }
                resolve(PrivateFrameData.fromJSON(JSON.parse(frameDataJSONString)));
            }));
        }
        getCurrentState() {
            return new Promise((resolve, reject) => window.Capacitor.Plugins[Capacitor$1.pluginName][CapacitorFunction$1.GetCurrentCameraState]()
                .then(resolve, reject));
        }
        getIsTorchAvailable() {
            return new Promise((resolve, reject) => window.Capacitor.Plugins[Capacitor$1.pluginName][CapacitorFunction$1.GetIsTorchAvailable]({
                position: this.camera.position,
            }).then(resolve, reject));
        }
    }

    var BarcodeCaptureListenerEvent;
    (function (BarcodeCaptureListenerEvent) {
        BarcodeCaptureListenerEvent["DidScan"] = "onBarcodeScannedEvent";
        BarcodeCaptureListenerEvent["DidUpdateSession"] = "onSessionUpdateEvent";
    })(BarcodeCaptureListenerEvent || (BarcodeCaptureListenerEvent = {}));
    class BarcodeCaptureListenerProxy {
        static forBarcodeCapture(barcodeCapture) {
            const proxy = new BarcodeCaptureListenerProxy();
            proxy.barcodeCapture = barcodeCapture;
            proxy.initialize();
            return proxy;
        }
        constructor() {
            this.notifyListeners = this.notifyListeners.bind(this);
        }
        initialize() {
            this.subscribeListener();
        }
        reset() {
            return window.Capacitor.Plugins[Capacitor.pluginName][CapacitorFunction.ResetBarcodeCaptureSession]();
        }
        addListener(listener) {
            if (listener.didScan) {
                window.Capacitor.Plugins[Capacitor.pluginName]
                    .addListener(BarcodeCaptureListenerEvent.DidScan, this.notifyListeners);
            }
            if (listener.didUpdateSession) {
                window.Capacitor.Plugins[Capacitor.pluginName]
                    .addListener(BarcodeCaptureListenerEvent.DidUpdateSession, this.notifyListeners);
            }
        }
        removeListener(listener) {
            if (listener.didScan) {
                window.Capacitor.Plugins[Capacitor.pluginName]
                    .removeListener(BarcodeCaptureListenerEvent.DidScan, this.notifyListeners);
            }
            if (listener.didUpdateSession) {
                window.Capacitor.Plugins[Capacitor.pluginName]
                    .removeListener(BarcodeCaptureListenerEvent.DidUpdateSession, this.notifyListeners);
            }
        }
        subscribeListener() {
            window.Capacitor.Plugins[Capacitor.pluginName][CapacitorFunction.SubscribeBarcodeCaptureListener]();
        }
        notifyListeners(event) {
            const done = () => {
                this.barcodeCapture.isInListenerCallback = false;
                window.Capacitor.Plugins[Capacitor.pluginName].finishCallback({
                    result: {
                        enabled: this.barcodeCapture.isEnabled,
                        finishCallbackID: event.name,
                    },
                });
                return { enabled: this.barcodeCapture.isEnabled };
            };
            this.barcodeCapture.isInListenerCallback = true;
            if (!event) {
                // The event could be undefined/null in case the plugin result did not pass a "message",
                // which could happen e.g. in case of "ok" results, which could signal e.g. successful
                // listener subscriptions.
                return done();
            }
            event = Object.assign(Object.assign(Object.assign({}, event), event.argument), { argument: undefined });
            this.barcodeCapture.listeners.forEach((listener) => {
                switch (event.name) {
                    case BarcodeCaptureListenerEvent.DidScan:
                        if (listener.didScan) {
                            listener.didScan(this.barcodeCapture, BarcodeCaptureSession
                                .fromJSON(JSON.parse(event.session)), CameraProxy.getLastFrame);
                        }
                        break;
                    case BarcodeCaptureListenerEvent.DidUpdateSession:
                        if (listener.didUpdateSession) {
                            listener.didUpdateSession(this.barcodeCapture, BarcodeCaptureSession
                                .fromJSON(JSON.parse(event.session)), CameraProxy.getLastFrame);
                        }
                        break;
                }
            });
            return done();
        }
    }
    BarcodeCaptureListenerProxy.capacitorExec = Capacitor.exec;

    var __decorate$d = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    class BarcodeCapture extends DefaultSerializeable {
        constructor() {
            super(...arguments);
            this.type = 'barcodeCapture';
            this._isEnabled = true;
            this._feedback = BarcodeCaptureFeedback.default;
            this._context = null;
            this.listeners = [];
            this.listenerProxy = null;
            this.isInListenerCallback = false;
        }
        get isEnabled() {
            return this._isEnabled;
        }
        set isEnabled(isEnabled) {
            this._isEnabled = isEnabled;
            if (!this.isInListenerCallback) {
                // If we're "in" a listener callback, we don't want to deserialize the context to update the enabled state,
                // but rather pass that back to be applied in the native callback.
                this.didChange();
            }
        }
        get context() {
            return this._context;
        }
        get feedback() {
            return this._feedback;
        }
        set feedback(feedback) {
            this._feedback = feedback;
            this.didChange();
        }
        static get recommendedCameraSettings() {
            return new CameraSettings(Capacitor.defaults.BarcodeCapture.RecommendedCameraSettings);
        }
        static forContext(context, settings) {
            const barcodeCapture = new BarcodeCapture();
            barcodeCapture.settings = settings;
            if (context) {
                context.addMode(barcodeCapture);
            }
            barcodeCapture.listenerProxy = BarcodeCaptureListenerProxy.forBarcodeCapture(barcodeCapture);
            return barcodeCapture;
        }
        applySettings(settings) {
            this.settings = settings;
            return this.didChange();
        }
        addListener(listener) {
            var _a;
            if (this.listeners.includes(listener)) {
                return;
            }
            (_a = this.listenerProxy) === null || _a === void 0 ? void 0 : _a.addListener(listener);
            this.listeners.push(listener);
        }
        removeListener(listener) {
            var _a;
            if (!this.listeners.includes(listener)) {
                return;
            }
            (_a = this.listenerProxy) === null || _a === void 0 ? void 0 : _a.removeListener(listener);
            this.listeners.splice(this.listeners.indexOf(listener), 1);
        }
        didChange() {
            if (this.context) {
                return this.context.update();
            }
            else {
                return Promise.resolve();
            }
        }
    }
    __decorate$d([
        nameForSerialization('enabled')
    ], BarcodeCapture.prototype, "_isEnabled", void 0);
    __decorate$d([
        nameForSerialization('feedback')
    ], BarcodeCapture.prototype, "_feedback", void 0);
    __decorate$d([
        ignoreFromSerialization
    ], BarcodeCapture.prototype, "_context", void 0);
    __decorate$d([
        ignoreFromSerialization
    ], BarcodeCapture.prototype, "listeners", void 0);
    __decorate$d([
        ignoreFromSerialization
    ], BarcodeCapture.prototype, "listenerProxy", void 0);
    __decorate$d([
        ignoreFromSerialization
    ], BarcodeCapture.prototype, "isInListenerCallback", void 0);

    var __decorate$c = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    class BarcodeSelectionFeedback extends DefaultSerializeable {
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
    class PrivateBarcodeSelectionStrategy {
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
    class BarcodeSelectionAutoSelectionStrategy extends DefaultSerializeable {
        constructor() {
            super(...arguments);
            this.type = BarcodeSelectionStrategyType.Auto;
        }
        static get autoSelectionStrategy() {
            return new BarcodeSelectionAutoSelectionStrategy();
        }
    }
    class BarcodeSelectionManualSelectionStrategy extends DefaultSerializeable {
        constructor() {
            super(...arguments);
            this.type = BarcodeSelectionStrategyType.Manual;
        }
        static get manualSelectionStrategy() {
            return new BarcodeSelectionManualSelectionStrategy();
        }
    }
    var BarcodeSelectionFreezeBehavior;
    (function (BarcodeSelectionFreezeBehavior) {
        BarcodeSelectionFreezeBehavior["Manual"] = "manual";
        BarcodeSelectionFreezeBehavior["ManualAndAutomatic"] = "manualAndAutomatic";
    })(BarcodeSelectionFreezeBehavior || (BarcodeSelectionFreezeBehavior = {}));
    var BarcodeSelectionTapBehavior;
    (function (BarcodeSelectionTapBehavior) {
        BarcodeSelectionTapBehavior["ToggleSelection"] = "toggleSelection";
        BarcodeSelectionTapBehavior["RepeatSelection"] = "repeatSelection";
    })(BarcodeSelectionTapBehavior || (BarcodeSelectionTapBehavior = {}));
    var BarcodeSelectionTypeName;
    (function (BarcodeSelectionTypeName) {
        BarcodeSelectionTypeName["Aimer"] = "aimerSelection";
        BarcodeSelectionTypeName["Tap"] = "tapSelection";
    })(BarcodeSelectionTypeName || (BarcodeSelectionTypeName = {}));
    class PrivateBarcodeSelectionType {
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
    class BarcodeSelectionAimerSelection extends DefaultSerializeable {
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
    class BarcodeSelectionTapSelection extends DefaultSerializeable {
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
    class BarcodeSelectionSession {
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
    var BarcodeSelectionBasicOverlayStyle;
    (function (BarcodeSelectionBasicOverlayStyle) {
        BarcodeSelectionBasicOverlayStyle["Frame"] = "frame";
        BarcodeSelectionBasicOverlayStyle["Dot"] = "dot";
    })(BarcodeSelectionBasicOverlayStyle || (BarcodeSelectionBasicOverlayStyle = {}));
    class BarcodeSelectionBasicOverlay extends DefaultSerializeable {
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
    __decorate$c([
        ignoreFromSerialization
    ], BarcodeSelectionBasicOverlay.prototype, "barcodeSelection", void 0);
    __decorate$c([
        nameForSerialization('trackedBrush')
    ], BarcodeSelectionBasicOverlay.prototype, "_trackedBrush", void 0);
    __decorate$c([
        nameForSerialization('aimedBrush')
    ], BarcodeSelectionBasicOverlay.prototype, "_aimedBrush", void 0);
    __decorate$c([
        nameForSerialization('selectedBrush')
    ], BarcodeSelectionBasicOverlay.prototype, "_selectedBrush", void 0);
    __decorate$c([
        nameForSerialization('selectingBrush')
    ], BarcodeSelectionBasicOverlay.prototype, "_selectingBrush", void 0);
    __decorate$c([
        nameForSerialization('style')
    ], BarcodeSelectionBasicOverlay.prototype, "_style", void 0);
    __decorate$c([
        nameForSerialization('shouldShowScanAreaGuides')
    ], BarcodeSelectionBasicOverlay.prototype, "_shouldShowScanAreaGuides", void 0);
    __decorate$c([
        nameForSerialization('shouldShowHints')
    ], BarcodeSelectionBasicOverlay.prototype, "_shouldShowHints", void 0);
    __decorate$c([
        nameForSerialization('viewfinder')
    ], BarcodeSelectionBasicOverlay.prototype, "_viewfinder", void 0);

    var BarcodeSelectionListenerEvent;
    (function (BarcodeSelectionListenerEvent) {
        BarcodeSelectionListenerEvent["DidUpdateSelection"] = "didUpdateSelectionInBarcodeSelection";
        BarcodeSelectionListenerEvent["DidUpdateSession"] = "didUpdateSessionInBarcodeSelection";
    })(BarcodeSelectionListenerEvent || (BarcodeSelectionListenerEvent = {}));
    class BarcodeSelectionListenerProxy {
        static forBarcodeSelection(barcodeSelection) {
            const proxy = new BarcodeSelectionListenerProxy();
            proxy.barcodeSelection = barcodeSelection;
            proxy.initialize();
            return proxy;
        }
        getCount(barcode) {
            return new Promise((resolve, reject) => {
                BarcodeSelectionListenerProxy.exec((response) => resolve(response.result), reject, CapacitorFunction.GetCountForBarcodeInBarcodeSelectionSession, {
                    selectionIdentifier: barcode.selectionIdentifier,
                });
            });
        }
        reset() {
            return window.Capacitor.Plugins[Capacitor.pluginName][CapacitorFunction.ResetBarcodeSelectionSession]();
        }
        initialize() {
            this.subscribeListener();
        }
        subscribeListener() {
            window.Capacitor.Plugins[Capacitor.pluginName][CapacitorFunction.SubscribeBarcodeSelectionListener]();
            window.Capacitor.Plugins[Capacitor.pluginName]
                .addListener(BarcodeSelectionListenerEvent.DidUpdateSession, this.notifyListeners.bind(this));
            window.Capacitor.Plugins[Capacitor.pluginName]
                .addListener(BarcodeSelectionListenerEvent.DidUpdateSelection, this.notifyListeners.bind(this));
        }
        notifyListeners(event) {
            const done = () => {
                this.barcodeSelection.isInListenerCallback = false;
                window.Capacitor.Plugins[Capacitor.pluginName].finishCallback({
                    result: {
                        enabled: this.barcodeSelection.isEnabled,
                        finishCallbackID: event.name,
                    },
                });
                return { enabled: this.barcodeSelection.isEnabled };
            };
            this.barcodeSelection.isInListenerCallback = true;
            if (!event) {
                // The event could be undefined/null in case the plugin result did not pass a "message",
                // which could happen e.g. in case of "ok" results, which could signal e.g. successful
                // listener subscriptions.
                return done();
            }
            event = Object.assign(Object.assign(Object.assign({}, event), event.argument), { argument: undefined });
            this.barcodeSelection.listeners.forEach((listener) => {
                switch (event.name) {
                    case BarcodeSelectionListenerEvent.DidUpdateSelection:
                        if (listener.didUpdateSelection) {
                            const session = BarcodeSelectionSession
                                .fromJSON(JSON.parse(event.session));
                            session.listenerProxy = this;
                            listener.didUpdateSelection(this.barcodeSelection, session, CameraProxy.getLastFrame);
                        }
                        break;
                    case BarcodeSelectionListenerEvent.DidUpdateSession:
                        if (listener.didUpdateSession) {
                            const session = BarcodeSelectionSession
                                .fromJSON(JSON.parse(event.session));
                            session.listenerProxy = this;
                            listener.didUpdateSession(this.barcodeSelection, session, CameraProxy.getLastFrame);
                        }
                        break;
                }
            });
            return done();
        }
    }
    BarcodeSelectionListenerProxy.exec = Capacitor.exec;

    class BarcodeSelectionProxy {
        reset() {
            return new Promise((resolve, reject) => {
                BarcodeSelectionProxy.exec(resolve, reject, CapacitorFunction.ResetBarcodeSelection, null);
            });
        }
        unfreezeCamera() {
            return new Promise((resolve, reject) => {
                BarcodeSelectionProxy.exec(resolve, reject, CapacitorFunction.UnfreezeCameraInBarcodeSelection, null);
            });
        }
    }
    BarcodeSelectionProxy.exec = Capacitor.exec;

    var __decorate$b = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    class BarcodeSelection extends DefaultSerializeable {
        constructor() {
            super(...arguments);
            this.type = 'barcodeSelection';
            this._isEnabled = true;
            this._feedback = BarcodeSelectionFeedback.default;
            this._pointOfInterest = null;
            this._context = null;
            this.listeners = [];
            this.listenerProxy = null;
            this.modeProxy = new BarcodeSelectionProxy();
            this.isInListenerCallback = false;
        }
        get isEnabled() {
            return this._isEnabled;
        }
        set isEnabled(isEnabled) {
            this._isEnabled = isEnabled;
            if (!this.isInListenerCallback) {
                // If we're "in" a listener callback, we don't want to deserialize the context to update the enabled state,
                // but rather pass that back to be applied in the native callback.
                this.didChange();
            }
        }
        get context() {
            return this._context;
        }
        get feedback() {
            return this._feedback;
        }
        set feedback(feedback) {
            this._feedback = feedback;
            this.didChange();
        }
        get pointOfInterest() {
            return this._pointOfInterest;
        }
        set pointOfInterest(pointOfInterest) {
            this._pointOfInterest = pointOfInterest;
            this.didChange();
        }
        static get recommendedCameraSettings() {
            return new CameraSettings(Capacitor.defaults.BarcodeSelection.RecommendedCameraSettings);
        }
        static forContext(context, settings) {
            const barcodeSelection = new BarcodeSelection();
            barcodeSelection.settings = settings;
            if (context) {
                context.addMode(barcodeSelection);
            }
            barcodeSelection.listenerProxy = BarcodeSelectionListenerProxy.forBarcodeSelection(barcodeSelection);
            return barcodeSelection;
        }
        applySettings(settings) {
            this.settings = settings;
            return this.didChange();
        }
        addListener(listener) {
            if (this.listeners.includes(listener)) {
                return;
            }
            this.listeners.push(listener);
        }
        removeListener(listener) {
            if (!this.listeners.includes(listener)) {
                return;
            }
            this.listeners.splice(this.listeners.indexOf(listener), 1);
        }
        reset() {
            return this.modeProxy.reset();
        }
        unfreezeCamera() {
            return this.modeProxy.unfreezeCamera();
        }
        didChange() {
            if (this.context) {
                return this.context.update();
            }
            else {
                return Promise.resolve();
            }
        }
    }
    __decorate$b([
        nameForSerialization('enabled')
    ], BarcodeSelection.prototype, "_isEnabled", void 0);
    __decorate$b([
        nameForSerialization('feedback')
    ], BarcodeSelection.prototype, "_feedback", void 0);
    __decorate$b([
        nameForSerialization('pointOfInterest')
    ], BarcodeSelection.prototype, "_pointOfInterest", void 0);
    __decorate$b([
        ignoreFromSerialization
    ], BarcodeSelection.prototype, "_context", void 0);
    __decorate$b([
        ignoreFromSerialization
    ], BarcodeSelection.prototype, "listeners", void 0);
    __decorate$b([
        ignoreFromSerialization
    ], BarcodeSelection.prototype, "listenerProxy", void 0);
    __decorate$b([
        ignoreFromSerialization
    ], BarcodeSelection.prototype, "modeProxy", void 0);
    __decorate$b([
        ignoreFromSerialization
    ], BarcodeSelection.prototype, "isInListenerCallback", void 0);

    var __decorate$a = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    // tslint:disable-next-line:variable-name
    const NoneLocationSelection = { type: 'none' };
    class RadiusLocationSelection extends DefaultSerializeable {
        get radius() {
            return this._radius;
        }
        constructor(radius) {
            super();
            this.type = 'radius';
            this._radius = radius;
        }
    }
    __decorate$a([
        nameForSerialization('radius')
    ], RadiusLocationSelection.prototype, "_radius", void 0);
    class RectangularLocationSelection extends DefaultSerializeable {
        constructor() {
            super(...arguments);
            this.type = 'rectangular';
        }
        get sizeWithUnitAndAspect() {
            return this._sizeWithUnitAndAspect;
        }
        static withSize(size) {
            const locationSelection = new RectangularLocationSelection();
            locationSelection._sizeWithUnitAndAspect = SizeWithUnitAndAspect.sizeWithWidthAndHeight(size);
            return locationSelection;
        }
        static withWidthAndAspectRatio(width, heightToWidthAspectRatio) {
            const locationSelection = new RectangularLocationSelection();
            locationSelection._sizeWithUnitAndAspect = SizeWithUnitAndAspect
                .sizeWithWidthAndAspectRatio(width, heightToWidthAspectRatio);
            return locationSelection;
        }
        static withHeightAndAspectRatio(height, widthToHeightAspectRatio) {
            const locationSelection = new RectangularLocationSelection();
            locationSelection._sizeWithUnitAndAspect = SizeWithUnitAndAspect
                .sizeWithHeightAndAspectRatio(height, widthToHeightAspectRatio);
            return locationSelection;
        }
    }
    __decorate$a([
        nameForSerialization('size')
    ], RectangularLocationSelection.prototype, "_sizeWithUnitAndAspect", void 0);

    var __decorate$9 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    class BarcodeCaptureSettings extends DefaultSerializeable {
        get compositeTypeDescriptions() {
            return Capacitor.defaults.CompositeTypeDescriptions.reduce((descriptions, description) => {
                descriptions[description.types[0]] = description;
                return descriptions;
            }, {});
        }
        get enabledSymbologies() {
            return Object.keys(this.symbologies)
                .filter(symbology => this.symbologies[symbology].isEnabled);
        }
        constructor() {
            super();
            this.codeDuplicateFilter = Capacitor.defaults.BarcodeCapture.BarcodeCaptureSettings.codeDuplicateFilter;
            this.locationSelection = null;
            this.enabledCompositeTypes = [];
            this.properties = {};
            this.symbologies = {};
        }
        settingsForSymbology(symbology) {
            if (!this.symbologies[symbology]) {
                const symbologySettings = Capacitor.defaults.SymbologySettings[symbology];
                symbologySettings._symbology = symbology;
                this.symbologies[symbology] = symbologySettings;
            }
            return this.symbologies[symbology];
        }
        setProperty(name, value) {
            this.properties[name] = value;
        }
        getProperty(name) {
            return this.properties[name];
        }
        enableSymbologies(symbologies) {
            symbologies.forEach(symbology => this.enableSymbology(symbology, true));
        }
        enableSymbology(symbology, enabled) {
            this.settingsForSymbology(symbology).isEnabled = enabled;
        }
        enableSymbologiesForCompositeTypes(compositeTypes) {
            compositeTypes.forEach(compositeType => {
                this.enableSymbologies(this.compositeTypeDescriptions[compositeType].symbologies);
            });
        }
    }
    __decorate$9([
        serializationDefault(NoneLocationSelection)
    ], BarcodeCaptureSettings.prototype, "locationSelection", void 0);

    var __decorate$8 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    class BarcodeSelectionSettings extends DefaultSerializeable {
        get enabledSymbologies() {
            return Object.keys(this.symbologies)
                .filter(symbology => this.symbologies[symbology].isEnabled);
        }
        constructor() {
            super();
            this.codeDuplicateFilter = Capacitor.defaults.BarcodeSelection.BarcodeSelectionSettings.codeDuplicateFilter;
            this.singleBarcodeAutoDetection = Capacitor.defaults.BarcodeSelection.BarcodeSelectionSettings.singleBarcodeAutoDetection;
            this.selectionType = Capacitor.defaults.BarcodeSelection.BarcodeSelectionSettings.selectionType(PrivateBarcodeSelectionType.fromJSON);
            this.properties = {};
            this.symbologies = {};
        }
        settingsForSymbology(symbology) {
            if (!this.symbologies[symbology]) {
                const symbologySettings = Capacitor.defaults.SymbologySettings[symbology];
                symbologySettings._symbology = symbology;
                this.symbologies[symbology] = symbologySettings;
            }
            return this.symbologies[symbology];
        }
        setProperty(name, value) {
            this.properties[name] = value;
        }
        getProperty(name) {
            return this.properties[name];
        }
        enableSymbologies(symbologies) {
            symbologies.forEach(symbology => this.enableSymbology(symbology, true));
        }
        enableSymbology(symbology, enabled) {
            this.settingsForSymbology(symbology).isEnabled = enabled;
        }
    }
    __decorate$8([
        nameForSerialization('singleBarcodeAutoDetectionEnabled')
    ], BarcodeSelectionSettings.prototype, "singleBarcodeAutoDetection", void 0);

    var BarcodeTrackingAdvancedOverlayListenerEvent;
    (function (BarcodeTrackingAdvancedOverlayListenerEvent) {
        BarcodeTrackingAdvancedOverlayListenerEvent["ViewForTrackedBarcode"] = "onViewForTrackedBarcodeEvent";
        BarcodeTrackingAdvancedOverlayListenerEvent["AnchorForTrackedBarcode"] = "onAnchorForTrackedBarcodeEvent";
        BarcodeTrackingAdvancedOverlayListenerEvent["OffsetForTrackedBarcode"] = "onOffsetForTrackedBarcodeEvent";
        BarcodeTrackingAdvancedOverlayListenerEvent["DidTapViewForTrackedBarcode"] = "onTapViewForTrackedBarcodeEvent";
    })(BarcodeTrackingAdvancedOverlayListenerEvent || (BarcodeTrackingAdvancedOverlayListenerEvent = {}));
    class BarcodeTrackingAdvancedOverlayProxy {
        static forOverlay(overlay) {
            const proxy = new BarcodeTrackingAdvancedOverlayProxy();
            proxy.overlay = overlay;
            proxy.initialize();
            return proxy;
        }
        setViewForTrackedBarcode(view, trackedBarcode) {
            if (view instanceof Promise) {
                return view.then(v => this.setViewForTrackedBarcodeSync(v, trackedBarcode));
            }
            else {
                return this.setViewForTrackedBarcodeSync(view, trackedBarcode);
            }
        }
        setViewForTrackedBarcodeSync(view, trackedBarcode) {
            return new Promise((resolve, reject) => {
                BarcodeTrackingAdvancedOverlayProxy.capacitorExec(resolve, reject, CapacitorFunction.SetViewForTrackedBarcode, {
                    view: view ? view.toJSON() : null,
                    sessionFrameSequenceID: trackedBarcode.sessionFrameSequenceID,
                    trackedBarcodeID: trackedBarcode.identifier,
                });
            });
        }
        setAnchorForTrackedBarcode(anchor, trackedBarcode) {
            return new Promise((resolve, reject) => {
                BarcodeTrackingAdvancedOverlayProxy.capacitorExec(resolve, reject, CapacitorFunction.SetAnchorForTrackedBarcode, {
                    anchor,
                    sessionFrameSequenceID: trackedBarcode.sessionFrameSequenceID,
                    trackedBarcodeID: trackedBarcode.identifier,
                });
            });
        }
        setOffsetForTrackedBarcode(offset, trackedBarcode) {
            return new Promise((resolve, reject) => {
                BarcodeTrackingAdvancedOverlayProxy.capacitorExec(resolve, reject, CapacitorFunction.SetOffsetForTrackedBarcode, {
                    offset: offset ? JSON.stringify(offset.toJSON()) : null,
                    sessionFrameSequenceID: trackedBarcode.sessionFrameSequenceID,
                    trackedBarcodeID: trackedBarcode.identifier,
                });
            });
        }
        clearTrackedBarcodeViews() {
            return new Promise((resolve, reject) => {
                BarcodeTrackingAdvancedOverlayProxy.capacitorExec(resolve, reject, CapacitorFunction.ClearTrackedBarcodeViews, null);
            });
        }
        subscribeListener() {
            window.Capacitor.Plugins[Capacitor.pluginName][CapacitorFunction.SubscribeBarcodeTrackingAdvancedOverlayListener]();
            window.Capacitor.Plugins[Capacitor.pluginName].addListener(BarcodeTrackingAdvancedOverlayListenerEvent.AnchorForTrackedBarcode, this.notifyListeners.bind(this));
            window.Capacitor.Plugins[Capacitor.pluginName].addListener(BarcodeTrackingAdvancedOverlayListenerEvent.DidTapViewForTrackedBarcode, this.notifyListeners.bind(this));
            window.Capacitor.Plugins[Capacitor.pluginName].addListener(BarcodeTrackingAdvancedOverlayListenerEvent.OffsetForTrackedBarcode, this.notifyListeners.bind(this));
            window.Capacitor.Plugins[Capacitor.pluginName].addListener(BarcodeTrackingAdvancedOverlayListenerEvent.ViewForTrackedBarcode, this.notifyListeners.bind(this));
        }
        notifyListeners(event) {
            if (!event || !this.overlay.listener) {
                // The event could be undefined/null in case the plugin result did not pass a "message",
                // which could happen e.g. in case of "ok" results, which could signal e.g. successful
                // listener subscriptions.
                return doReturnWithFinish(event.name, null);
            }
            event = Object.assign(Object.assign(Object.assign({}, event), event.argument), { argument: undefined });
            switch (event.name) {
                case BarcodeTrackingAdvancedOverlayListenerEvent.ViewForTrackedBarcode:
                    if (this.overlay.listener.viewForTrackedBarcode) {
                        const trackedBarcode = TrackedBarcode
                            .fromJSON(JSON.parse(event.trackedBarcode));
                        const view = this.overlay.listener.viewForTrackedBarcode(this.overlay, trackedBarcode);
                        if (view instanceof Promise) {
                            this.setViewForTrackedBarcode(view, trackedBarcode);
                            return doReturnWithFinish(event.name, { view: null });
                        }
                        else {
                            return doReturnWithFinish(event.name, { view: view ? view.toJSON() : null });
                        }
                    }
                    break;
                case BarcodeTrackingAdvancedOverlayListenerEvent.AnchorForTrackedBarcode:
                    if (this.overlay.listener.anchorForTrackedBarcode) {
                        const trackedBarcode = TrackedBarcode
                            .fromJSON(JSON.parse(event.trackedBarcode));
                        const anchor = this.overlay.listener.anchorForTrackedBarcode(this.overlay, trackedBarcode);
                        return doReturnWithFinish(event.name, { anchor });
                    }
                    break;
                case BarcodeTrackingAdvancedOverlayListenerEvent.OffsetForTrackedBarcode:
                    if (this.overlay.listener.offsetForTrackedBarcode) {
                        const trackedBarcode = TrackedBarcode
                            .fromJSON(JSON.parse(event.trackedBarcode));
                        const offset = this.overlay.listener.offsetForTrackedBarcode(this.overlay, trackedBarcode);
                        return doReturnWithFinish(event.name, { offset: JSON.stringify(offset.toJSON()) });
                    }
                    break;
                case BarcodeTrackingAdvancedOverlayListenerEvent.DidTapViewForTrackedBarcode:
                    if (this.overlay.listener.didTapViewForTrackedBarcode) {
                        const trackedBarcode = TrackedBarcode
                            .fromJSON(JSON.parse(event.trackedBarcode));
                        this.overlay.listener.didTapViewForTrackedBarcode(this.overlay, trackedBarcode);
                    }
                    break;
            }
            return doReturnWithFinish(event.name, null);
        }
        initialize() {
            this.subscribeListener();
        }
    }
    BarcodeTrackingAdvancedOverlayProxy.capacitorExec = Capacitor.exec;

    var BarcodeTrackingBasicOverlayListenerEvent;
    (function (BarcodeTrackingBasicOverlayListenerEvent) {
        BarcodeTrackingBasicOverlayListenerEvent["BrushForTrackedBarcode"] = "onBrushForTrackedBarcodeEvent";
        BarcodeTrackingBasicOverlayListenerEvent["DidTapTrackedBarcode"] = "onDidTapTrackedBarcodeEvent";
    })(BarcodeTrackingBasicOverlayListenerEvent || (BarcodeTrackingBasicOverlayListenerEvent = {}));
    class BarcodeTrackingBasicOverlayProxy {
        static forOverlay(overlay) {
            const proxy = new BarcodeTrackingBasicOverlayProxy();
            proxy.overlay = overlay;
            proxy.initialize();
            return proxy;
        }
        setBrushForTrackedBarcode(brush, trackedBarcode) {
            return new Promise((resolve, reject) => {
                BarcodeTrackingBasicOverlayProxy.capacitorExec(resolve, reject, CapacitorFunction.SetBrushForTrackedBarcode, {
                    brush: brush ? JSON.stringify(brush.toJSON()) : null,
                    sessionFrameSequenceID: trackedBarcode.sessionFrameSequenceID,
                    trackedBarcodeID: trackedBarcode.identifier,
                });
            });
        }
        clearTrackedBarcodeBrushes() {
            return new Promise((resolve, reject) => {
                BarcodeTrackingBasicOverlayProxy.capacitorExec(resolve, reject, CapacitorFunction.ClearTrackedBarcodeBrushes, null);
            });
        }
        subscribeListener() {
            window.Capacitor.Plugins[Capacitor.pluginName][CapacitorFunction.SubscribeBarcodeTrackingBasicOverlayListener]();
            window.Capacitor.Plugins[Capacitor.pluginName]
                .addListener(BarcodeTrackingBasicOverlayListenerEvent.BrushForTrackedBarcode, this.notifyListeners.bind(this));
            window.Capacitor.Plugins[Capacitor.pluginName]
                .addListener(BarcodeTrackingBasicOverlayListenerEvent.DidTapTrackedBarcode, this.notifyListeners.bind(this));
        }
        notifyListeners(event) {
            if (!event || !this.overlay.listener) {
                // The event could be undefined/null in case the plugin result did not pass a "message",
                // which could happen e.g. in case of "ok" results, which could signal e.g. successful
                // listener subscriptions.
                return doReturnWithFinish(event.name, null);
            }
            event = Object.assign(Object.assign(Object.assign({}, event), event.argument), { argument: undefined });
            switch (event.name) {
                case BarcodeTrackingBasicOverlayListenerEvent.BrushForTrackedBarcode:
                    if (this.overlay.listener.brushForTrackedBarcode) {
                        const trackedBarcode = TrackedBarcode
                            .fromJSON(JSON.parse(event.trackedBarcode));
                        const brush = this.overlay.listener.brushForTrackedBarcode(this.overlay, trackedBarcode);
                        return doReturnWithFinish(event.name, { brush: brush ? JSON.stringify(brush.toJSON()) : null });
                    }
                    break;
                case BarcodeTrackingBasicOverlayListenerEvent.DidTapTrackedBarcode:
                    if (this.overlay.listener.didTapTrackedBarcode) {
                        const trackedBarcode = TrackedBarcode
                            .fromJSON(JSON.parse(event.trackedBarcode));
                        this.overlay.listener.didTapTrackedBarcode(this.overlay, trackedBarcode);
                    }
                    break;
            }
            return doReturnWithFinish(event.name, null);
        }
        initialize() {
            this.subscribeListener();
        }
    }
    BarcodeTrackingBasicOverlayProxy.capacitorExec = Capacitor.exec;

    var __decorate$7 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    class BarcodeTrackingSession {
        get addedTrackedBarcodes() {
            return this._addedTrackedBarcodes;
        }
        get removedTrackedBarcodes() {
            return this._removedTrackedBarcodes;
        }
        get updatedTrackedBarcodes() {
            return this._updatedTrackedBarcodes;
        }
        get trackedBarcodes() {
            return this._trackedBarcodes;
        }
        get frameSequenceID() {
            return this._frameSequenceID;
        }
        static fromJSON(json) {
            const session = new BarcodeTrackingSession();
            session._frameSequenceID = json.frameSequenceId;
            session._addedTrackedBarcodes = json.addedTrackedBarcodes
                .map(TrackedBarcode.fromJSON);
            session._removedTrackedBarcodes = json.removedTrackedBarcodes;
            session._updatedTrackedBarcodes = json.updatedTrackedBarcodes
                .map(TrackedBarcode.fromJSON);
            session._trackedBarcodes = Object.keys(json.trackedBarcodes)
                .reduce((trackedBarcodes, identifier) => {
                const trackedBarcode = TrackedBarcode
                    .fromJSON(json.trackedBarcodes[identifier]);
                trackedBarcode.sessionFrameSequenceID = `${json.frameSequenceId}`;
                trackedBarcodes[identifier] = trackedBarcode;
                return trackedBarcodes;
            }, {});
            return session;
        }
        reset() {
            return this.listenerProxy.reset();
        }
    }
    var BarcodeTrackingBasicOverlayStyle;
    (function (BarcodeTrackingBasicOverlayStyle) {
        BarcodeTrackingBasicOverlayStyle["Frame"] = "frame";
        BarcodeTrackingBasicOverlayStyle["Dot"] = "dot";
        BarcodeTrackingBasicOverlayStyle["Legacy"] = "legacy";
    })(BarcodeTrackingBasicOverlayStyle || (BarcodeTrackingBasicOverlayStyle = {}));
    class BarcodeTrackingBasicOverlay extends DefaultSerializeable {
        static get defaultBrush() {
            // tslint:disable-next-line:no-console
            console.warn('defaultBrush is deprecated and will be removed in a future release. ' +
                'Use .brush to get the default for your selected style');
            return new Brush(Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.styles[Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.defaultStyle].DefaultBrush.fillColor, Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.styles[Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.defaultStyle].DefaultBrush.strokeColor, Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.styles[Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.defaultStyle].DefaultBrush.strokeWidth);
        }
        get brush() {
            return this._defaultBrush;
        }
        set brush(newBrush) {
            this._defaultBrush = newBrush;
            this.barcodeTracking.didChange();
        }
        get proxy() {
            if (!this._proxy) {
                this.initialize();
            }
            return this._proxy;
        }
        get shouldShowScanAreaGuides() {
            return this._shouldShowScanAreaGuides;
        }
        set shouldShowScanAreaGuides(shouldShow) {
            this._shouldShowScanAreaGuides = shouldShow;
            this.barcodeTracking.didChange();
        }
        get style() {
            return this._style;
        }
        static withBarcodeTracking(barcodeTracking) {
            return BarcodeTrackingBasicOverlay.withBarcodeTrackingForView(barcodeTracking, null);
        }
        static withBarcodeTrackingForView(barcodeTracking, view) {
            return this.withBarcodeTrackingForViewWithStyle(barcodeTracking, view, Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.defaultStyle);
        }
        static withBarcodeTrackingForViewWithStyle(barcodeTracking, view, style) {
            const overlay = new BarcodeTrackingBasicOverlay();
            overlay.barcodeTracking = barcodeTracking;
            overlay._style = style;
            overlay._defaultBrush = new Brush(Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.styles[overlay._style]
                .DefaultBrush.fillColor, Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.styles[overlay._style]
                .DefaultBrush.strokeColor, Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.styles[overlay._style]
                .DefaultBrush.strokeWidth);
            if (view) {
                view.addOverlay(overlay);
            }
            overlay.initialize();
            return overlay;
        }
        constructor() {
            super();
            this.type = 'barcodeTrackingBasic';
            this._defaultBrush = new Brush(Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.styles[Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.defaultStyle].DefaultBrush.fillColor, Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.styles[Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.defaultStyle].DefaultBrush.strokeColor, Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.styles[Capacitor.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.defaultStyle].DefaultBrush.strokeWidth);
            this._shouldShowScanAreaGuides = false;
            this.listener = null;
        }
        setBrushForTrackedBarcode(brush, trackedBarcode) {
            return this.proxy.setBrushForTrackedBarcode(brush, trackedBarcode);
        }
        clearTrackedBarcodeBrushes() {
            return this.proxy.clearTrackedBarcodeBrushes();
        }
        initialize() {
            if (this._proxy) {
                return;
            }
            this._proxy = BarcodeTrackingBasicOverlayProxy.forOverlay(this);
        }
    }
    __decorate$7([
        ignoreFromSerialization
    ], BarcodeTrackingBasicOverlay.prototype, "barcodeTracking", void 0);
    __decorate$7([
        nameForSerialization('defaultBrush')
    ], BarcodeTrackingBasicOverlay.prototype, "_defaultBrush", void 0);
    __decorate$7([
        nameForSerialization('shouldShowScanAreaGuides')
    ], BarcodeTrackingBasicOverlay.prototype, "_shouldShowScanAreaGuides", void 0);
    __decorate$7([
        ignoreFromSerialization
    ], BarcodeTrackingBasicOverlay.prototype, "listener", void 0);
    __decorate$7([
        ignoreFromSerialization
    ], BarcodeTrackingBasicOverlay.prototype, "_proxy", void 0);
    __decorate$7([
        nameForSerialization('style')
    ], BarcodeTrackingBasicOverlay.prototype, "_style", void 0);
    class BarcodeTrackingAdvancedOverlay extends DefaultSerializeable {
        get shouldShowScanAreaGuides() {
            return this._shouldShowScanAreaGuides;
        }
        set shouldShowScanAreaGuides(shouldShow) {
            this._shouldShowScanAreaGuides = shouldShow;
            this.barcodeTracking.didChange();
        }
        get proxy() {
            if (!this._proxy) {
                this.initialize();
            }
            return this._proxy;
        }
        static withBarcodeTrackingForView(barcodeTracking, view) {
            const overlay = new BarcodeTrackingAdvancedOverlay();
            overlay.barcodeTracking = barcodeTracking;
            if (view) {
                view.addOverlay(overlay);
            }
            overlay.initialize();
            return overlay;
        }
        constructor() {
            super();
            this.type = 'barcodeTrackingAdvanced';
            this._shouldShowScanAreaGuides = false;
            this.listener = null;
        }
        setViewForTrackedBarcode(view, trackedBarcode) {
            return this.proxy.setViewForTrackedBarcode(view, trackedBarcode);
        }
        setAnchorForTrackedBarcode(anchor, trackedBarcode) {
            return this.proxy.setAnchorForTrackedBarcode(anchor, trackedBarcode);
        }
        setOffsetForTrackedBarcode(offset, trackedBarcode) {
            return this.proxy.setOffsetForTrackedBarcode(offset, trackedBarcode);
        }
        clearTrackedBarcodeViews() {
            return this.proxy.clearTrackedBarcodeViews();
        }
        initialize() {
            if (this._proxy) {
                return;
            }
            this._proxy = BarcodeTrackingAdvancedOverlayProxy.forOverlay(this);
        }
    }
    __decorate$7([
        nameForSerialization('shouldShowScanAreaGuides')
    ], BarcodeTrackingAdvancedOverlay.prototype, "_shouldShowScanAreaGuides", void 0);
    __decorate$7([
        ignoreFromSerialization
    ], BarcodeTrackingAdvancedOverlay.prototype, "barcodeTracking", void 0);
    __decorate$7([
        ignoreFromSerialization
    ], BarcodeTrackingAdvancedOverlay.prototype, "listener", void 0);
    __decorate$7([
        ignoreFromSerialization
    ], BarcodeTrackingAdvancedOverlay.prototype, "_proxy", void 0);

    var BarcodeTrackingListenerEvent;
    (function (BarcodeTrackingListenerEvent) {
        BarcodeTrackingListenerEvent["DidUpdateSession"] = "onTrackingSessionUpdateEvent";
    })(BarcodeTrackingListenerEvent || (BarcodeTrackingListenerEvent = {}));
    class BarcodeTrackingListenerProxy {
        static forBarcodeTracking(barcodeTracking) {
            const proxy = new BarcodeTrackingListenerProxy();
            proxy.barcodeTracking = barcodeTracking;
            proxy.initialize();
            return proxy;
        }
        initialize() {
            this.subscribeListener();
        }
        subscribeListener() {
            window.Capacitor.Plugins[Capacitor.pluginName][CapacitorFunction.SubscribeBarcodeTrackingListener]();
            window.Capacitor.Plugins[Capacitor.pluginName]
                .addListener(BarcodeTrackingListenerEvent.DidUpdateSession, this.notifyListeners.bind(this));
        }
        reset() {
            return window.Capacitor.Plugins[Capacitor.pluginName][CapacitorFunction.ResetBarcodeTrackingSession]();
        }
        notifyListeners(event) {
            const done = () => {
                this.barcodeTracking.isInListenerCallback = false;
                window.Capacitor.Plugins[Capacitor.pluginName].finishCallback({
                    result: {
                        enabled: this.barcodeTracking.isEnabled,
                        finishCallbackID: event.name,
                    },
                });
                return { enabled: this.barcodeTracking.isEnabled };
            };
            this.barcodeTracking.isInListenerCallback = true;
            if (!event) {
                // The event could be undefined/null in case the plugin result did not pass a "message",
                // which could happen e.g. in case of "ok" results, which could signal e.g. successful
                // listener subscriptions.
                return done();
            }
            event = Object.assign(Object.assign(Object.assign({}, event), event.argument), { argument: undefined });
            this.barcodeTracking.listeners.forEach((listener) => {
                switch (event.name) {
                    case BarcodeTrackingListenerEvent.DidUpdateSession:
                        if (listener.didUpdateSession) {
                            listener.didUpdateSession(this.barcodeTracking, BarcodeTrackingSession
                                .fromJSON(JSON.parse(event.session)), CameraProxy.getLastFrame);
                        }
                        break;
                }
            });
            return done();
        }
    }
    BarcodeTrackingListenerProxy.capacitorExec = Capacitor.exec;

    var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    class BarcodeTracking extends DefaultSerializeable {
        constructor() {
            super(...arguments);
            this.type = 'barcodeTracking';
            this._isEnabled = true;
            this._context = null;
            this.listeners = [];
            this.listenerProxy = null;
            this.isInListenerCallback = false;
        }
        get isEnabled() {
            return this._isEnabled;
        }
        set isEnabled(isEnabled) {
            this._isEnabled = isEnabled;
            if (!this.isInListenerCallback) {
                // If we're "in" a listener callback, we don't want to deserialize the context to update the enabled state,
                // but rather pass that back to be applied in the native callback.
                this.didChange();
            }
        }
        get context() {
            return this._context;
        }
        static get recommendedCameraSettings() {
            return new CameraSettings(Capacitor.defaults.BarcodeTracking.RecommendedCameraSettings);
        }
        static forContext(context, settings) {
            const barcodeTracking = new BarcodeTracking();
            barcodeTracking.settings = settings;
            if (context) {
                context.addMode(barcodeTracking);
            }
            barcodeTracking.listenerProxy = BarcodeTrackingListenerProxy.forBarcodeTracking(barcodeTracking);
            return barcodeTracking;
        }
        applySettings(settings) {
            this.settings = settings;
            return this.didChange();
        }
        addListener(listener) {
            if (this.listeners.includes(listener)) {
                return;
            }
            this.listeners.push(listener);
        }
        removeListener(listener) {
            if (!this.listeners.includes(listener)) {
                return;
            }
            this.listeners.splice(this.listeners.indexOf(listener), 1);
        }
        didChange() {
            if (this.context) {
                return this.context.update();
            }
            else {
                return Promise.resolve();
            }
        }
    }
    __decorate$6([
        nameForSerialization('enabled')
    ], BarcodeTracking.prototype, "_isEnabled", void 0);
    __decorate$6([
        ignoreFromSerialization
    ], BarcodeTracking.prototype, "_context", void 0);
    __decorate$6([
        ignoreFromSerialization
    ], BarcodeTracking.prototype, "listeners", void 0);
    __decorate$6([
        ignoreFromSerialization
    ], BarcodeTracking.prototype, "listenerProxy", void 0);

    var BarcodeTrackingScenario;
    (function (BarcodeTrackingScenario) {
        BarcodeTrackingScenario["A"] = "A";
        BarcodeTrackingScenario["B"] = "B";
    })(BarcodeTrackingScenario || (BarcodeTrackingScenario = {}));
    class BarcodeTrackingSettings extends DefaultSerializeable {
        get enabledSymbologies() {
            return Object.keys(this.symbologies)
                .filter(symbology => this.symbologies[symbology].isEnabled);
        }
        static forScenario(scenario) {
            const settings = new BarcodeTrackingSettings();
            settings.scenario = scenario;
            return settings;
        }
        constructor() {
            super();
            this.scenario = null;
            this.properties = {};
            this.symbologies = {};
        }
        settingsForSymbology(symbology) {
            if (!this.symbologies[symbology]) {
                const symbologySettings = Capacitor.defaults.SymbologySettings[symbology];
                symbologySettings._symbology = symbology;
                this.symbologies[symbology] = symbologySettings;
            }
            return this.symbologies[symbology];
        }
        setProperty(name, value) {
            this.properties[name] = value;
        }
        getProperty(name) {
            return this.properties[name];
        }
        enableSymbologies(symbologies) {
            symbologies.forEach(symbology => this.enableSymbology(symbology, true));
        }
        enableSymbology(symbology, enabled) {
            this.settingsForSymbology(symbology).isEnabled = enabled;
        }
    }

    class TrackedBarcodeView extends DefaultSerializeable {
        static withHTMLElement(element, options) {
            return this.getEncodedImageData(element).then(data => new TrackedBarcodeView(data, options));
        }
        static withBase64EncodedData(data, options) {
            return Promise.resolve(new TrackedBarcodeView(data, options));
        }
        static getEncodedImageData(element) {
            return this.getBase64DataForSVG(this.getSVGDataForElement(element));
        }
        static getSize(element) {
            const isInDOM = document.body.contains(element);
            if (!isInDOM) {
                document.body.appendChild(element);
            }
            const size = element.getBoundingClientRect();
            if (!isInDOM) {
                document.body.removeChild(element);
            }
            return new Size(size.width, size.height);
        }
        static getSVGDataForElement(element) {
            const size = this.getSize(element);
            const data = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}px" height="${size.height}px">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml">
            ${element.outerHTML}
          </div>
        </foreignObject>
      </svg>`);
            return { data, size };
        }
        static getCanvasWithSize(size) {
            const canvas = document.createElement('canvas');
            canvas.width = size.width;
            canvas.height = size.height;
            return canvas;
        }
        static getBase64DataForSVG(svgData) {
            return new Promise((resolve, reject) => {
                const image = new Image();
                image.onload = () => {
                    const canvas = this.getCanvasWithSize(svgData.size);
                    canvas.getContext('2d').drawImage(image, 0, 0);
                    resolve(canvas.toDataURL('image/png', 1));
                };
                image.onerror = reject;
                image.src = 'data:image/svg+xml,' + svgData.data;
            });
        }
        constructor(encodedData, options) {
            super();
            if (options == null) {
                options = { scale: 1 };
            }
            this.data = encodedData;
            this.options = options;
        }
    }

    var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    const BarcodeCountDefaults$2 = {
        get Feedback() { return Capacitor.defaults.BarcodeCount.Feedback; }
    };
    class BarcodeCountFeedback extends DefaultSerializeable {
        static get default() {
            return new BarcodeCountFeedback(BarcodeCountDefaults$2.Feedback.success, BarcodeCountDefaults$2.Feedback.failure);
        }
        static fromJSON(json) {
            const success = Feedback.fromJSON(json.success);
            const failure = Feedback.fromJSON(json.failure);
            return new BarcodeCountFeedback(success, failure);
        }
        constructor(success, error) {
            super();
            this.success = BarcodeCountDefaults$2.Feedback.success;
            this.failure = BarcodeCountDefaults$2.Feedback.success;
            this.success = success;
            this.failure = error;
        }
    }
    class BarcodeCountSession extends DefaultSerializeable {
        static fromJSON(json) {
            const session = new BarcodeCountSession();
            session._frameSequenceID = json.frameSequenceId;
            session._additionalBarcodes = json.additionalBarcodes;
            session._recognizedBarcodes = {};
            Object.entries(json.recognizedBarcodes)
                .forEach(([key, value]) => {
                // TODO
                // const trackedBarcode = (TrackedBarcode as any as PrivateTrackedBarcode).fromJSON(value as any as TrackedBarcodeJSON, session._frameSequenceID);
                const trackedBarcode = TrackedBarcode.fromJSON(value);
                session._recognizedBarcodes[parseInt(key, 10)] = trackedBarcode;
            });
            return session;
        }
        get recognizedBarcodes() {
            return this._recognizedBarcodes;
        }
        get additionalBarcodes() {
            return this._additionalBarcodes;
        }
        get frameSequenceID() {
            return this._frameSequenceID;
        }
        reset() {
            return ScanditBarcodeCountPluginNative.resetBarcodeCountSession();
        }
    }
    __decorate$5([
        nameForSerialization('recognizedBarcodes')
    ], BarcodeCountSession.prototype, "_recognizedBarcodes", void 0);
    __decorate$5([
        nameForSerialization('additionalBarcodes')
    ], BarcodeCountSession.prototype, "_additionalBarcodes", void 0);
    __decorate$5([
        nameForSerialization('frameSequenceID')
    ], BarcodeCountSession.prototype, "_frameSequenceID", void 0);

    var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    class BarcodeCountCaptureList {
        static create(listener, targetBarcodes) {
            return new BarcodeCountCaptureList(listener, targetBarcodes);
        }
        constructor(listener, targetBarcodes) {
            this.listener = listener;
            this.targetBarcodes = targetBarcodes;
        }
    }
    class BarcodeCountCaptureListSession extends DefaultSerializeable {
        get correctBarcodes() {
            return this._correctBarcodes;
        }
        get wrongBarcodes() {
            return this._wrongBarcodes;
        }
        get missingBarcodes() {
            return this._missingBarcodes;
        }
        get additionalBarcodes() {
            return this._additionalBarcodes;
        }
        static fromJSON(json) {
            const correctBarcodes = json.correctBarcodes;
            const wrongBarcodes = json.wrongBarcodes;
            const missingBarcodes = json.missingBarcodes;
            const additionalBarcodes = json.additionalBarcodes;
            return new BarcodeCountCaptureListSession(correctBarcodes, wrongBarcodes, missingBarcodes, additionalBarcodes);
        }
        constructor(correctBarcodes, wrongBarcodes, missingBarcodes, additionalBarcodes) {
            super();
            this._correctBarcodes = correctBarcodes;
            this._wrongBarcodes = wrongBarcodes;
            this._missingBarcodes = missingBarcodes;
            this._additionalBarcodes = additionalBarcodes;
        }
    }
    __decorate$4([
        nameForSerialization('correctBarcodes')
    ], BarcodeCountCaptureListSession.prototype, "_correctBarcodes", void 0);
    __decorate$4([
        nameForSerialization('wrongBarcodes')
    ], BarcodeCountCaptureListSession.prototype, "_wrongBarcodes", void 0);
    __decorate$4([
        nameForSerialization('missingBarcodes')
    ], BarcodeCountCaptureListSession.prototype, "_missingBarcodes", void 0);
    __decorate$4([
        nameForSerialization('additionalBarcodes')
    ], BarcodeCountCaptureListSession.prototype, "_additionalBarcodes", void 0);

    var BarcodeCountListenerEventName;
    (function (BarcodeCountListenerEventName) {
        BarcodeCountListenerEventName["didScan"] = "barcodeCountListener-scan";
        BarcodeCountListenerEventName["didListSessionUpdate"] = "barcodeCountCaptureListListener-onCaptureListSessionUpdated";
    })(BarcodeCountListenerEventName || (BarcodeCountListenerEventName = {}));
    class BarcodeCountListenerProxy {
        static forBarcodeCount(barcodeCount) {
            const proxy = new BarcodeCountListenerProxy();
            proxy.barcodeCount = barcodeCount;
            proxy.initialize();
            return proxy;
        }
        constructor() {
            this.notifyListeners = this.notifyListeners.bind(this);
        }
        initialize() {
            this.subscribeListener();
        }
        reset() {
            return ScanditBarcodeCountPluginNative.resetBarcodeCount();
        }
        resetSession() {
            return ScanditBarcodeCountPluginNative.resetBarcodeCountSession();
        }
        subscribeListener() {
            ScanditBarcodeCountPluginNative.registerBarcodeCountListener();
            window.Capacitor.Plugins[Capacitor.pluginName]
                .addListener(BarcodeCountListenerEventName.didScan, this.notifyListeners);
            window.Capacitor.Plugins[Capacitor.pluginName]
                .addListener(BarcodeCountListenerEventName.didListSessionUpdate, this.notifyListeners);
        }
        unsubscribeListener() {
            window.Capacitor.Plugins[Capacitor.pluginName][CapacitorFunction.UnsubscribeBarcodeCountListener]();
            window.Capacitor.Plugins[Capacitor.pluginName]
                .removeListener(BarcodeCountListenerEventName.didScan, this.notifyListeners);
            window.Capacitor.Plugins[Capacitor.pluginName]
                .removeListener(BarcodeCountListenerEventName.didListSessionUpdate, this.notifyListeners);
        }
        startScanningPhase() {
            ScanditBarcodeCountPluginNative.startScanningPhase();
        }
        endScanningPhase() {
            ScanditBarcodeCountPluginNative.endScanningPhase();
        }
        setBarcodeCountCaptureList(barcodeCountCaptureList) {
            this._barcodeCountCaptureList = barcodeCountCaptureList;
            const targetBarcodesJson = barcodeCountCaptureList.targetBarcodes;
            ScanditBarcodeCountPluginNative.setBarcodeCountCaptureList({ TargetBarcodes: targetBarcodesJson });
        }
        notifyListeners(event) {
            var _a;
            const barcodeCount = this.barcodeCount;
            const done = () => {
                barcodeCount.isInListenerCallback = false;
                window.Capacitor.Plugins[Capacitor.pluginName].finishBarcodeCountListenerOnScan();
                return { enabled: this.barcodeCount.isEnabled };
            };
            barcodeCount.isInListenerCallback = true;
            if (!event) {
                // The event could be undefined/null in case the plugin result did not pass a "message",
                // which could happen e.g. in case of "ok" results, which could signal e.g. successful
                // listener subscriptions.
                return done();
            }
            event = Object.assign(Object.assign(Object.assign({}, event), event.argument), { argument: undefined });
            barcodeCount.listeners.forEach((listener) => {
                switch (event.name) {
                    case BarcodeCountListenerEventName.didScan:
                        if (listener.didScan) {
                            listener.didScan(this.barcodeCount, BarcodeCountSession.fromJSON(JSON.parse(event.session)), CameraProxy.getLastFrame);
                        }
                        break;
                }
            });
            if (event.name === BarcodeCountListenerEventName.didListSessionUpdate) {
                const barcodeCountCaptureListListener = (_a = this._barcodeCountCaptureList) === null || _a === void 0 ? void 0 : _a.listener;
                if (barcodeCountCaptureListListener && (barcodeCountCaptureListListener === null || barcodeCountCaptureListListener === void 0 ? void 0 : barcodeCountCaptureListListener.didUpdateSession)) {
                    barcodeCountCaptureListListener.didUpdateSession(this._barcodeCountCaptureList, BarcodeCountCaptureListSession.fromJSON(JSON.parse(event.session)));
                }
            }
            return done();
        }
    }

    var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    class BarcodeCount extends DefaultSerializeable {
        get isEnabled() {
            return this._isEnabled;
        }
        set isEnabled(isEnabled) {
            this._isEnabled = isEnabled;
            if (!this.isInListenerCallback) {
                // If we're "in" a listener callback, we don't want to deserialize the context to update the enabled state,
                // but rather pass that back to be applied in the native callback.
                this.didChange();
            }
        }
        get context() {
            return this._context;
        }
        get feedback() {
            return this._feedback;
        }
        set feedback(feedback) {
            this._feedback = feedback;
            this.didChange();
        }
        get _context() {
            return this.privateContext;
        }
        set _context(newContext) {
            if (newContext == null) {
                this.listenerProxy.unsubscribeListener();
            }
            this.privateContext = newContext;
        }
        static forContext(context, settings) {
            const barcodeCount = new BarcodeCount();
            barcodeCount._context = context;
            barcodeCount.settings = settings;
            return barcodeCount;
        }
        constructor() {
            super();
            this.type = 'barcodeCount';
            this._feedback = BarcodeCountFeedback.default;
            this._isEnabled = true;
            this.listeners = [];
            this._additionalBarcodes = [];
            this.isInListenerCallback = false;
            this.privateContext = null;
            this.listenerProxy = BarcodeCountListenerProxy.forBarcodeCount(this);
        }
        applySettings(settings) {
            this.settings = settings;
            return this.didChange();
        }
        addListener(listener) {
            if (this.listeners.includes(listener)) {
                return;
            }
            this.listeners.push(listener);
        }
        removeListener(listener) {
            if (!this.listeners.includes(listener)) {
                return;
            }
            this.listeners.splice(this.listeners.indexOf(listener));
            this.checkAndUnsubscribeListeners();
        }
        checkAndUnsubscribeListeners() {
            if (this.listeners.length === 0) {
                this.listenerProxy.unsubscribeListener();
            }
        }
        reset() {
            return this.listenerProxy.reset();
        }
        startScanningPhase() {
            this.listenerProxy.startScanningPhase();
        }
        endScanningPhase() {
            this.listenerProxy.endScanningPhase();
        }
        setBarcodeCountCaptureList(barcodeCountCaptureList) {
            this.listenerProxy.setBarcodeCountCaptureList(barcodeCountCaptureList);
        }
        setAdditionalBarcodes(barcodes) {
            this._additionalBarcodes = barcodes;
            return this.didChange();
        }
        clearAdditionalBarcodes() {
            this._additionalBarcodes = [];
            return this.didChange();
        }
        static get recommendedCameraSettings() {
            return Capacitor.defaults.BarcodeCount.RecommendedCameraSettings;
        }
        didChange() {
            if (this.context) {
                return this.context.update();
            }
            else {
                return Promise.resolve();
            }
        }
    }
    __decorate$3([
        nameForSerialization('feedback')
    ], BarcodeCount.prototype, "_feedback", void 0);
    __decorate$3([
        nameForSerialization('enabled')
    ], BarcodeCount.prototype, "_isEnabled", void 0);
    __decorate$3([
        ignoreFromSerialization
    ], BarcodeCount.prototype, "listeners", void 0);
    __decorate$3([
        nameForSerialization('additionalBarcodes')
    ], BarcodeCount.prototype, "_additionalBarcodes", void 0);
    __decorate$3([
        ignoreFromSerialization
    ], BarcodeCount.prototype, "isInListenerCallback", void 0);
    __decorate$3([
        ignoreFromSerialization
    ], BarcodeCount.prototype, "privateContext", void 0);
    __decorate$3([
        ignoreFromSerialization
    ], BarcodeCount.prototype, "listenerProxy", void 0);

    var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    class BarcodeCountSettings extends DefaultSerializeable {
        constructor() {
            super();
            this.symbologies = {};
            this.properties = {};
            this._filterSettings = Capacitor.defaults.BarcodeCount.BarcodeCountSettings.barcodeFilterSettings;
            this._expectsOnlyUniqueBarcodes = Capacitor.defaults.BarcodeCount.BarcodeCountSettings.expectOnlyUniqueBarcodes;
        }
        get expectsOnlyUniqueBarcodes() {
            return this._expectsOnlyUniqueBarcodes;
        }
        get filterSettings() {
            return this._filterSettings;
        }
        get enabledSymbologies() {
            return Object.keys(this.symbologies)
                .filter(symbology => this.symbologies[symbology].isEnabled);
        }
        settingsForSymbology(symbology) {
            if (!this.symbologies[symbology]) {
                const symbologySettings = Capacitor.defaults.SymbologySettings[symbology];
                symbologySettings._symbology = symbology;
                this.symbologies[symbology] = symbologySettings;
            }
            return this.symbologies[symbology];
        }
        enableSymbologies(symbologies) {
            symbologies.forEach(symbology => this.enableSymbology(symbology, true));
        }
        enableSymbology(symbology, enabled) {
            this.settingsForSymbology(symbology).isEnabled = enabled;
        }
        setProperty(name, value) {
            this.properties[name] = value;
        }
        getProperty(name) {
            return this.properties[name];
        }
    }
    __decorate$2([
        nameForSerialization('filterSettings')
    ], BarcodeCountSettings.prototype, "_filterSettings", void 0);
    __decorate$2([
        nameForSerialization('expectsOnlyUniqueBarcodes')
    ], BarcodeCountSettings.prototype, "_expectsOnlyUniqueBarcodes", void 0);

    var BarcodeCountViewEventName;
    (function (BarcodeCountViewEventName) {
        BarcodeCountViewEventName["singleScanButtonTapped"] = "barcodeCountViewUiListener-onSingleScanButtonTapped";
        BarcodeCountViewEventName["listButtonTapped"] = "barcodeCountViewUiListener-onListButtonTapped";
        BarcodeCountViewEventName["exitButtonTapped"] = "barcodeCountViewUiListener-onExitButtonTapped";
        BarcodeCountViewEventName["brushForRecognizedBarcode"] = "barcodeCountViewListener-brushForRecognizedBarcode";
        BarcodeCountViewEventName["brushForRecognizedBarcodeNotInList"] = "barcodeCountViewListener-brushForRecognizedBarcodeNotInList";
        BarcodeCountViewEventName["brushForUnrecognizedBarcode"] = "barcodeCountViewListener-brushForUnrecognizedBarcode";
        BarcodeCountViewEventName["filteredBarcodeTapped"] = "barcodeCountViewListener-onFilteredBarcodeTapped";
        BarcodeCountViewEventName["recognizedBarcodeNotInListTapped"] = "barcodeCountViewListener-onRecognizedBarcodeNotInListTapped";
        BarcodeCountViewEventName["recognizedBarcodeTapped"] = "barcodeCountViewListener-onRecognizedBarcodeTapped";
        BarcodeCountViewEventName["unrecognizedBarcodeTapped"] = "barcodeCountViewListener-onUnrecognizedBarcodeTapped";
        BarcodeCountViewEventName["captureListCompleted"] = "barcodeCountViewListener-onCaptureListCompleted";
    })(BarcodeCountViewEventName || (BarcodeCountViewEventName = {}));
    class BarcodeCountViewProxy {
        static forBarcodeCount(view) {
            const viewProxy = new BarcodeCountViewProxy();
            viewProxy.barcodeCount = view._barcodeCount;
            viewProxy.view = view;
            // // First we need to initialize the context, so it will set up the DataCaptureContextProxy.
            view._context.initialize();
            // // We call update because it returns a promise, this guarantees, that by the time
            // // we need the deserialized context, it will be set in the native layer.
            // (view.context as any as PrivateDataCaptureContext).update().then(() => {
            //   viewProxy.create();
            // });
            view._context.update();
            viewProxy.create();
            viewProxy.subscribeListeners();
            return viewProxy;
        }
        constructor() {
            this.isInListenerCallback = false;
            this.notifyListeners = this.notifyListeners.bind(this);
            this.recognizedBarcodeTappedHandler = this.recognizedBarcodeTappedHandler.bind(this);
            this.singleScanButtonTappedHandler = this.singleScanButtonTappedHandler.bind(this);
            this.listButtonTappedHandler = this.listButtonTappedHandler.bind(this);
            this.exitButtonTappedHandler = this.exitButtonTappedHandler.bind(this);
            this.filteredBarcodeTappedHandler = this.filteredBarcodeTappedHandler.bind(this);
            this.recognizedBarcodeNotInListTappedHandler = this.recognizedBarcodeNotInListTappedHandler.bind(this);
            this.unrecognizedBarcodeTappedHandler = this.unrecognizedBarcodeTappedHandler.bind(this);
            this.captureListCompletedHandler = this.captureListCompletedHandler.bind(this);
        }
        update() {
            const barcodeCountView = this.view.toJSON();
            const json = JSON.stringify(barcodeCountView);
            return ScanditBarcodeCountPluginNative.updateView({ BarcodeCountView: json });
        }
        create() {
            const barcodeCountView = this.view.toJSON();
            const json = {
                BarcodeCount: JSON.stringify(this.view._barcodeCount.toJSON()),
                BarcodeCountView: JSON.stringify(barcodeCountView)
            };
            return ScanditBarcodeCountPluginNative.createView(json);
        }
        dispose() {
            this.unsubscribeListeners();
        }
        setUiListener(listener) {
            if (!!listener) {
                ScanditBarcodeCountPluginNative.registerBarcodeCountViewUiListener();
            }
            else {
                ScanditBarcodeCountPluginNative.unregisterBarcodeCountViewUiListener();
            }
        }
        setListener(listener) {
            if (!!listener) {
                ScanditBarcodeCountPluginNative.registerBarcodeCountViewListener();
            }
            else {
                ScanditBarcodeCountPluginNative.unregisterBarcodeCountViewListener();
            }
        }
        clearHighlights() {
            return ScanditBarcodeCountPluginNative.clearBarcodeCountViewHighlights();
        }
        setPositionAndSize(top, left, width, height, shouldBeUnderWebView) {
            return ScanditBarcodeCountPluginNative.setViewPositionAndSize({ position: { top, left, width, height, shouldBeUnderWebView } });
        }
        show() {
            return ScanditBarcodeCountPluginNative.showView();
        }
        hide() {
            return ScanditBarcodeCountPluginNative.hideView();
        }
        subscribeListeners() {
            window.Capacitor.Plugins[Capacitor.pluginName]
                .addListener(BarcodeCountViewEventName.singleScanButtonTapped, this.singleScanButtonTappedHandler);
            window.Capacitor.Plugins[Capacitor.pluginName]
                .addListener(BarcodeCountViewEventName.listButtonTapped, this.listButtonTappedHandler);
            window.Capacitor.Plugins[Capacitor.pluginName]
                .addListener(BarcodeCountViewEventName.exitButtonTapped, this.exitButtonTappedHandler);
            window.Capacitor.Plugins[Capacitor.pluginName]
                .addListener(BarcodeCountViewEventName.brushForRecognizedBarcode, this.notifyListeners);
            window.Capacitor.Plugins[Capacitor.pluginName]
                .addListener(BarcodeCountViewEventName.brushForRecognizedBarcodeNotInList, this.notifyListeners);
            window.Capacitor.Plugins[Capacitor.pluginName]
                .addListener(BarcodeCountViewEventName.brushForUnrecognizedBarcode, this.notifyListeners);
            window.Capacitor.Plugins[Capacitor.pluginName]
                .addListener(BarcodeCountViewEventName.filteredBarcodeTapped, this.filteredBarcodeTappedHandler);
            window.Capacitor.Plugins[Capacitor.pluginName]
                .addListener(BarcodeCountViewEventName.recognizedBarcodeNotInListTapped, this.recognizedBarcodeNotInListTappedHandler);
            window.Capacitor.Plugins[Capacitor.pluginName]
                .addListener(BarcodeCountViewEventName.recognizedBarcodeTapped, this.recognizedBarcodeTappedHandler);
            window.Capacitor.Plugins[Capacitor.pluginName]
                .addListener(BarcodeCountViewEventName.unrecognizedBarcodeTapped, this.unrecognizedBarcodeTappedHandler);
            window.Capacitor.Plugins[Capacitor.pluginName]
                .addListener(BarcodeCountViewEventName.captureListCompleted, this.captureListCompletedHandler);
        }
        unsubscribeListeners() {
            window.Capacitor.Plugins[Capacitor.pluginName]
                .removeListener(BarcodeCountViewEventName.singleScanButtonTapped, this.singleScanButtonTappedHandler);
            window.Capacitor.Plugins[Capacitor.pluginName]
                .removeListener(BarcodeCountViewEventName.listButtonTapped, this.listButtonTappedHandler);
            window.Capacitor.Plugins[Capacitor.pluginName]
                .removeListener(BarcodeCountViewEventName.exitButtonTapped, this.exitButtonTappedHandler);
            window.Capacitor.Plugins[Capacitor.pluginName]
                .removeListener(BarcodeCountViewEventName.brushForRecognizedBarcode, this.notifyListeners);
            window.Capacitor.Plugins[Capacitor.pluginName]
                .removeListener(BarcodeCountViewEventName.brushForRecognizedBarcodeNotInList, this.notifyListeners);
            window.Capacitor.Plugins[Capacitor.pluginName]
                .removeListener(BarcodeCountViewEventName.brushForUnrecognizedBarcode, this.notifyListeners);
            window.Capacitor.Plugins[Capacitor.pluginName]
                .removeListener(BarcodeCountViewEventName.filteredBarcodeTapped, this.filteredBarcodeTappedHandler);
            window.Capacitor.Plugins[Capacitor.pluginName]
                .removeListener(BarcodeCountViewEventName.recognizedBarcodeNotInListTapped, this.recognizedBarcodeNotInListTappedHandler);
            window.Capacitor.Plugins[Capacitor.pluginName]
                .removeListener(BarcodeCountViewEventName.recognizedBarcodeTapped, this.recognizedBarcodeTappedHandler);
            window.Capacitor.Plugins[Capacitor.pluginName]
                .removeListener(BarcodeCountViewEventName.unrecognizedBarcodeTapped, this.unrecognizedBarcodeTappedHandler);
            window.Capacitor.Plugins[Capacitor.pluginName]
                .removeListener(BarcodeCountViewEventName.captureListCompleted, this.captureListCompletedHandler);
        }
        singleScanButtonTappedHandler() {
            var _a, _b;
            this.isInListenerCallback = true;
            (_b = (_a = this.view.uiListener) === null || _a === void 0 ? void 0 : _a.didTapSingleScanButton) === null || _b === void 0 ? void 0 : _b.call(_a, this.view);
            this.isInListenerCallback = false;
        }
        listButtonTappedHandler() {
            var _a, _b;
            this.isInListenerCallback = true;
            (_b = (_a = this.view.uiListener) === null || _a === void 0 ? void 0 : _a.didTapListButton) === null || _b === void 0 ? void 0 : _b.call(_a, this.view);
            this.isInListenerCallback = false;
        }
        exitButtonTappedHandler() {
            var _a, _b;
            this.isInListenerCallback = true;
            (_b = (_a = this.view.uiListener) === null || _a === void 0 ? void 0 : _a.didTapExitButton) === null || _b === void 0 ? void 0 : _b.call(_a, this.view);
            this.isInListenerCallback = false;
        }
        filteredBarcodeTappedHandler(trackedBarcode) {
            if (this.view.listener && this.view.listener.didTapFilteredBarcode) {
                this.view.listener.didTapFilteredBarcode(this.view, trackedBarcode);
            }
        }
        recognizedBarcodeNotInListTappedHandler(trackedBarcode) {
            if (this.view.listener && this.view.listener.didTapRecognizedBarcodeNotInList) {
                this.view.listener.didTapRecognizedBarcodeNotInList(this.view, trackedBarcode);
            }
        }
        recognizedBarcodeTappedHandler(trackedBarcode) {
            if (this.view.listener && this.view.listener.didTapRecognizedBarcode) {
                this.view.listener.didTapRecognizedBarcode(this.view, trackedBarcode);
            }
        }
        unrecognizedBarcodeTappedHandler(trackedBarcode) {
            if (this.view.listener && this.view.listener.didTapUnrecognizedBarcode) {
                this.view.listener.didTapUnrecognizedBarcode(this.view, trackedBarcode);
            }
        }
        captureListCompletedHandler() {
            if (this.view.listener && this.view.listener.didCompleteCaptureList) {
                this.view.listener.didCompleteCaptureList(this.view);
            }
        }
        notifyListeners(event) {
            var _a, _b, _c;
            const done = () => {
                this.barcodeCount.isInListenerCallback = false;
                return { enabled: this.barcodeCount.isEnabled };
            };
            this.barcodeCount.isInListenerCallback = true;
            if (!event) {
                // The event could be undefined/null in case the plugin result did not pass a "message",
                // which could happen e.g. in case of "ok" results, which could signal e.g. successful
                // listener subscriptions.
                return done();
            }
            let trackedBarcode;
            let brush;
            event = Object.assign(Object.assign(Object.assign({}, event), event.argument), { argument: undefined });
            switch (event.name) {
                case BarcodeCountViewEventName.brushForRecognizedBarcode:
                    trackedBarcode = TrackedBarcode
                        .fromJSON(JSON.parse((_a = event.trackedBarcode) !== null && _a !== void 0 ? _a : ''));
                    brush = this.view.recognizedBrush;
                    if (this.view.listener && this.view.listener.brushForRecognizedBarcode) {
                        brush = this.view.listener.brushForRecognizedBarcode(this.view, trackedBarcode);
                    }
                    const brushForRecognizedBarcodePayload = { brush: brush ? JSON.stringify(brush.toJSON()) : null, trackedBarcodeId: trackedBarcode.identifier };
                    ScanditBarcodeCountPluginNative.finishBarcodeCountViewListenerBrushForRecognizedBarcode(brushForRecognizedBarcodePayload);
                    break;
                case BarcodeCountViewEventName.brushForRecognizedBarcodeNotInList:
                    trackedBarcode = TrackedBarcode
                        .fromJSON(JSON.parse((_b = event.trackedBarcode) !== null && _b !== void 0 ? _b : ''));
                    brush = this.view.notInListBrush;
                    if (this.view.listener && this.view.listener.brushForRecognizedBarcodeNotInList) {
                        brush = this.view.listener.brushForRecognizedBarcodeNotInList(this.view, trackedBarcode);
                    }
                    const brushForRecognizedBarcodeNotInListPayload = { brush: brush ? JSON.stringify(brush.toJSON()) : null, trackedBarcodeId: trackedBarcode.identifier };
                    ScanditBarcodeCountPluginNative.finishBarcodeCountViewListenerBrushForRecognizedBarcodeNotInList(brushForRecognizedBarcodeNotInListPayload);
                    break;
                case BarcodeCountViewEventName.brushForUnrecognizedBarcode:
                    trackedBarcode = TrackedBarcode
                        .fromJSON(JSON.parse((_c = event.trackedBarcode) !== null && _c !== void 0 ? _c : ''));
                    brush = this.view.unrecognizedBrush;
                    if (this.view.listener && this.view.listener.brushForUnrecognizedBarcode) {
                        brush = this.view.listener.brushForUnrecognizedBarcode(this.view, trackedBarcode);
                    }
                    const brushForUnrecognizedBarcodePayload = { brush: brush ? JSON.stringify(brush.toJSON()) : null, trackedBarcodeId: trackedBarcode.identifier };
                    ScanditBarcodeCountPluginNative.finishBarcodeCountViewListenerOnBrushForUnrecognizedBarcode(brushForUnrecognizedBarcodePayload);
                    break;
            }
            return done();
        }
    }

    var DataCaptureViewListenerEvent;
    (function (DataCaptureViewListenerEvent) {
        DataCaptureViewListenerEvent["DidChangeSizeOrientation"] = "didChangeSizeOrientation";
    })(DataCaptureViewListenerEvent || (DataCaptureViewListenerEvent = {}));
    class DataCaptureViewProxy {
        static forDataCaptureView(view) {
            const viewProxy = new DataCaptureViewProxy();
            viewProxy.view = view;
            viewProxy.initialize();
            return viewProxy;
        }
        setPositionAndSize(top, left, width, height, shouldBeUnderWebView) {
            return new Promise((resolve, reject) => window.Capacitor.Plugins[Capacitor$1.pluginName][CapacitorFunction$1.SetViewPositionAndSize]({
                position: { top, left, width, height, shouldBeUnderWebView },
            }).then(resolve.bind(this), reject.bind(this)));
        }
        show() {
            return window.Capacitor.Plugins[Capacitor$1.pluginName][CapacitorFunction$1.ShowView]();
        }
        hide() {
            return window.Capacitor.Plugins[Capacitor$1.pluginName][CapacitorFunction$1.HideView]();
        }
        viewPointForFramePoint(point) {
            return new Promise((resolve, reject) => window.Capacitor.Plugins[Capacitor$1.pluginName][CapacitorFunction$1.ViewPointForFramePoint]({
                point: point.toJSON(),
            }).then((convertedPoint) => resolve(Point.fromJSON(convertedPoint)), reject.bind(this)));
        }
        viewQuadrilateralForFrameQuadrilateral(quadrilateral) {
            return new Promise((resolve, reject) => window.Capacitor.Plugins[Capacitor$1.pluginName][CapacitorFunction$1.ViewQuadrilateralForFrameQuadrilateral]({
                point: quadrilateral.toJSON(),
            }).then((convertedQuadrilateral) => resolve(Quadrilateral
                .fromJSON(convertedQuadrilateral)), reject.bind(this)));
        }
        subscribeListener() {
            window.Capacitor.Plugins[Capacitor$1.pluginName][CapacitorFunction$1.SubscribeViewListener]();
            window.Capacitor.Plugins[Capacitor$1.pluginName]
                .addListener(DataCaptureViewListenerEvent.DidChangeSizeOrientation, this.notifyListeners.bind(this));
        }
        notifyListeners(event) {
            if (!event) {
                // The event could be undefined/null in case the plugin result did not pass a "message",
                // which could happen e.g. in case of "ok" results, which could signal e.g. successful
                // listener subscriptions.
                return doReturnWithFinish('', null);
            }
            event = Object.assign(Object.assign(Object.assign({}, event), event.argument), { argument: undefined });
            this.view.listeners.forEach((listener) => {
                switch (event.name) {
                    case DataCaptureViewListenerEvent.DidChangeSizeOrientation:
                        if (listener.didChangeSize) {
                            const size = Size.fromJSON(event.size);
                            const orientation = event.orientation;
                            listener.didChangeSize(this.view, size, orientation);
                            return doReturnWithFinish(event.name, null);
                        }
                        break;
                }
            });
        }
        initialize() {
            this.subscribeListener();
        }
    }

    var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    class TorchSwitchControl extends DefaultSerializeable {
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
    __decorate$1([
        ignoreFromSerialization
    ], TorchSwitchControl.prototype, "view", void 0);
    class ZoomSwitchControl extends DefaultSerializeable {
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
    __decorate$1([
        ignoreFromSerialization
    ], ZoomSwitchControl.prototype, "view", void 0);
    var Anchor;
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
    class HTMLElementState {
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
    class DataCaptureView extends DefaultSerializeable {
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
            this.scanAreaMargins = Capacitor$1.defaults.DataCaptureView.scanAreaMargins;
            this.pointOfInterest = Capacitor$1.defaults.DataCaptureView.pointOfInterest;
            this.logoAnchor = Capacitor$1.defaults.DataCaptureView.logoAnchor;
            this.logoOffset = Capacitor$1.defaults.DataCaptureView.logoOffset;
            this.focusGesture = Capacitor$1.defaults.DataCaptureView.focusGesture;
            this.zoomGesture = Capacitor$1.defaults.DataCaptureView.zoomGesture;
            this.logoStyle = Capacitor$1.defaults.DataCaptureView.logoStyle;
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
    __decorate$1([
        ignoreFromSerialization
    ], DataCaptureView.prototype, "_context", void 0);
    __decorate$1([
        ignoreFromSerialization
    ], DataCaptureView.prototype, "_viewProxy", void 0);
    __decorate$1([
        ignoreFromSerialization
    ], DataCaptureView.prototype, "listeners", void 0);
    __decorate$1([
        ignoreFromSerialization
    ], DataCaptureView.prototype, "htmlElement", void 0);
    __decorate$1([
        ignoreFromSerialization
    ], DataCaptureView.prototype, "_htmlElementState", void 0);
    __decorate$1([
        ignoreFromSerialization
    ], DataCaptureView.prototype, "scrollListener", void 0);
    __decorate$1([
        ignoreFromSerialization
    ], DataCaptureView.prototype, "domObserver", void 0);
    __decorate$1([
        ignoreFromSerialization
    ], DataCaptureView.prototype, "orientationChangeListener", void 0);

    var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    const BarcodeCountDefaults$1 = {
        get BarcodeCountView() { return Capacitor.defaults.BarcodeCount.BarcodeCountView; }
    };
    var BarcodeCountViewStyle;
    (function (BarcodeCountViewStyle) {
        BarcodeCountViewStyle["Icon"] = "icon";
        BarcodeCountViewStyle["Dot"] = "dot";
    })(BarcodeCountViewStyle || (BarcodeCountViewStyle = {}));
    class BarcodeCountView extends DefaultSerializeable {
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
            return BarcodeCountDefaults$1.BarcodeCountView.defaultRecognizedBrush;
        }
        static get defaultUnrecognizedBrush() {
            return BarcodeCountDefaults$1.BarcodeCountView.defaultUnrecognizedBrush;
        }
        static get defaultNotInListBrush() {
            return BarcodeCountDefaults$1.BarcodeCountView.defaultNotInListBrush;
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
            const style = BarcodeCountDefaults$1.BarcodeCountView.style;
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
            this._shouldShowUserGuidanceView = BarcodeCountDefaults$1.BarcodeCountView.shouldShowUserGuidanceView;
            this._shouldShowListButton = BarcodeCountDefaults$1.BarcodeCountView.shouldShowListButton;
            this._shouldShowExitButton = BarcodeCountDefaults$1.BarcodeCountView.shouldShowExitButton;
            this._shouldShowShutterButton = BarcodeCountDefaults$1.BarcodeCountView.shouldShowShutterButton;
            this._shouldShowHints = BarcodeCountDefaults$1.BarcodeCountView.shouldShowHints;
            this._shouldShowClearHighlightsButton = BarcodeCountDefaults$1.BarcodeCountView.shouldShowClearHighlightsButton;
            this._shouldShowSingleScanButton = BarcodeCountDefaults$1.BarcodeCountView.shouldShowSingleScanButton;
            this._shouldShowFloatingShutterButton = BarcodeCountDefaults$1.BarcodeCountView.shouldShowFloatingShutterButton;
            this._shouldShowToolbar = BarcodeCountDefaults$1.BarcodeCountView.shouldShowToolbar;
            this._shouldShowScanAreaGuides = BarcodeCountDefaults$1.BarcodeCountView.shouldShowScanAreaGuides;
            this._recognizedBrush = BarcodeCountDefaults$1.BarcodeCountView.defaultRecognizedBrush;
            this._unrecognizedBrush = BarcodeCountDefaults$1.BarcodeCountView.defaultUnrecognizedBrush;
            this._notInListBrush = BarcodeCountDefaults$1.BarcodeCountView.defaultNotInListBrush;
            this._filterSettings = null;
            this._style = BarcodeCountDefaults$1.BarcodeCountView.style;
            this._listButtonAccessibilityHint = BarcodeCountDefaults$1.BarcodeCountView.listButtonAccessibilityHint;
            this._listButtonAccessibilityLabel = BarcodeCountDefaults$1.BarcodeCountView.listButtonAccessibilityLabel;
            this._listButtonContentDescription = BarcodeCountDefaults$1.BarcodeCountView.listButtonContentDescription;
            this._exitButtonAccessibilityHint = BarcodeCountDefaults$1.BarcodeCountView.exitButtonAccessibilityHint;
            this._exitButtonAccessibilityLabel = BarcodeCountDefaults$1.BarcodeCountView.exitButtonAccessibilityLabel;
            this._exitButtonContentDescription = BarcodeCountDefaults$1.BarcodeCountView.exitButtonContentDescription;
            this._shutterButtonAccessibilityHint = BarcodeCountDefaults$1.BarcodeCountView.shutterButtonAccessibilityHint;
            this._shutterButtonAccessibilityLabel = BarcodeCountDefaults$1.BarcodeCountView.shutterButtonAccessibilityLabel;
            this._shutterButtonContentDescription = BarcodeCountDefaults$1.BarcodeCountView.shutterButtonContentDescription;
            this._floatingShutterButtonAccessibilityHint = BarcodeCountDefaults$1.BarcodeCountView.floatingShutterButtonAccessibilityHint;
            this._floatingShutterButtonAccessibilityLabel = BarcodeCountDefaults$1.BarcodeCountView.floatingShutterButtonAccessibilityLabel;
            this._floatingShutterButtonContentDescription = BarcodeCountDefaults$1.BarcodeCountView.floatingShutterButtonContentDescription;
            this._clearHighlightsButtonAccessibilityHint = BarcodeCountDefaults$1.BarcodeCountView.clearHighlightsButtonAccessibilityHint;
            this._clearHighlightsButtonAccessibilityLabel = BarcodeCountDefaults$1.BarcodeCountView.clearHighlightsButtonAccessibilityLabel;
            this._clearHighlightsButtonContentDescription = BarcodeCountDefaults$1.BarcodeCountView.clearHighlightsButtonContentDescription;
            this._singleScanButtonAccessibilityHint = BarcodeCountDefaults$1.BarcodeCountView.singleScanButtonAccessibilityHint;
            this._singleScanButtonAccessibilityLabel = BarcodeCountDefaults$1.BarcodeCountView.singleScanButtonAccessibilityLabel;
            this._singleScanButtonContentDescription = BarcodeCountDefaults$1.BarcodeCountView.singleScanButtonContentDescription;
            this._clearHighlightsButtonText = BarcodeCountDefaults$1.BarcodeCountView.clearHighlightsButtonText;
            this._exitButtonText = BarcodeCountDefaults$1.BarcodeCountView.exitButtonText;
            this._textForTapShutterToScanHint = BarcodeCountDefaults$1.BarcodeCountView.textForTapShutterToScanHint;
            this._textForScanningHint = BarcodeCountDefaults$1.BarcodeCountView.textForScanningHint;
            this._textForMoveCloserAndRescanHint = BarcodeCountDefaults$1.BarcodeCountView.textForMoveCloserAndRescanHint;
            this._textForMoveFurtherAndRescanHint = BarcodeCountDefaults$1.BarcodeCountView.textForMoveFurtherAndRescanHint;
            this._textForUnrecognizedBarcodesDetectedHint = BarcodeCountDefaults$1.BarcodeCountView.textForUnrecognizedBarcodesDetectedHint;
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

    const BarcodeCountDefaults = {
        get BarcodeCountView() { return Capacitor.defaults.BarcodeCount.BarcodeCountView; }
    };
    class BarcodeCountToolbarSettings extends DefaultSerializeable {
        constructor() {
            super(...arguments);
            this.audioOnButtonText = BarcodeCountDefaults.BarcodeCountView.toolbarSettings.audioOnButtonText;
            this.audioOffButtonText = BarcodeCountDefaults.BarcodeCountView.toolbarSettings.audioOffButtonText;
            this.audioButtonContentDescription = BarcodeCountDefaults.BarcodeCountView.toolbarSettings.audioButtonContentDescription;
            this.audioButtonAccessibilityHint = BarcodeCountDefaults.BarcodeCountView.toolbarSettings.audioButtonAccessibilityHint;
            this.audioButtonAccessibilityLabel = BarcodeCountDefaults.BarcodeCountView.toolbarSettings.audioButtonAccessibilityLabel;
            this.vibrationOnButtonText = BarcodeCountDefaults.BarcodeCountView.toolbarSettings.vibrationOnButtonText;
            this.vibrationOffButtonText = BarcodeCountDefaults.BarcodeCountView.toolbarSettings.vibrationOffButtonText;
            this.vibrationButtonContentDescription = BarcodeCountDefaults.BarcodeCountView.toolbarSettings.vibrationButtonContentDescription;
            this.vibrationButtonAccessibilityHint = BarcodeCountDefaults.BarcodeCountView.toolbarSettings.vibrationButtonAccessibilityHint;
            this.vibrationButtonAccessibilityLabel = BarcodeCountDefaults.BarcodeCountView.toolbarSettings.vibrationButtonAccessibilityLabel;
            this.strapModeOnButtonText = BarcodeCountDefaults.BarcodeCountView.toolbarSettings.strapModeOnButtonText;
            this.strapModeOffButtonText = BarcodeCountDefaults.BarcodeCountView.toolbarSettings.strapModeOffButtonText;
            this.strapModeButtonContentDescription = BarcodeCountDefaults.BarcodeCountView.toolbarSettings.strapModeButtonContentDescription;
            this.strapModeButtonAccessibilityHint = BarcodeCountDefaults.BarcodeCountView.toolbarSettings.strapModeButtonAccessibilityHint;
            this.strapModeButtonAccessibilityLabel = BarcodeCountDefaults.BarcodeCountView.toolbarSettings.strapModeButtonAccessibilityLabel;
            this.colorSchemeOnButtonText = BarcodeCountDefaults.BarcodeCountView.toolbarSettings.colorSchemeOnButtonText;
            this.colorSchemeOffButtonText = BarcodeCountDefaults.BarcodeCountView.toolbarSettings.colorSchemeOffButtonText;
            this.colorSchemeButtonContentDescription = BarcodeCountDefaults.BarcodeCountView.toolbarSettings.colorSchemeButtonContentDescription;
            this.colorSchemeButtonAccessibilityHint = BarcodeCountDefaults.BarcodeCountView.toolbarSettings.colorSchemeButtonAccessibilityHint;
            this.colorSchemeButtonAccessibilityLabel = BarcodeCountDefaults.BarcodeCountView.toolbarSettings.colorSchemeButtonAccessibilityLabel;
        }
    }

    var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class ScanditBarcodePluginImplementation {
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
                Capacitor$1.defaults = coreDefaults;
                const barcodeDefaults = yield getDefaults();
                Capacitor.defaults = barcodeDefaults;
                return api;
            });
        }
    }
    // tslint:disable-next-line:variable-name
    core.registerPlugin('ScanditBarcodePlugin', {
        android: () => new ScanditBarcodePluginImplementation(),
        ios: () => new ScanditBarcodePluginImplementation(),
        web: () => new ScanditBarcodePluginImplementation(),
    });
    // tslint:disable-next-line:variable-name
    const ScanditBarcodePlugin = new ScanditBarcodePluginImplementation();
    const ScanditBarcodeCountPluginNative = core.registerPlugin('ScanditBarcodeNative');

    exports.ScanditBarcodeCountPluginNative = ScanditBarcodeCountPluginNative;
    exports.ScanditBarcodePlugin = ScanditBarcodePlugin;
    exports.ScanditBarcodePluginImplementation = ScanditBarcodePluginImplementation;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, require('@capacitor/core'));
//# sourceMappingURL=plugin.js.map
