var capacitorPlugin = (function (exports, core) {
    'use strict';

    class CapacitorError {
        constructor(code, message) {
            this.code = code;
            this.message = message;
        }
        static fromJSON(json) {
            if (json && json.code && json.message) {
                return new CapacitorError(json.code, json.message);
            }
            else {
                return null;
            }
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
                core.Plugins[pluginName].finishCallback([{
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
        core.Plugins[pluginName][functionName](args).then(extendedSuccessCallback, extendedErrorCallback);
    };
    const doReturnWithFinish = (finishCallbackID, result) => {
        core.Plugins.ScanditBarcodeNative.finishCallback({ result: Object.assign({ finishCallbackID }, result) });
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

    var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    class Point extends DefaultSerializeable {
        constructor(x, y) {
            super();
            this._x = x;
            this._y = y;
        }
        get x() {
            return this._x;
        }
        get y() {
            return this._y;
        }
        static fromJSON(json) {
            return new Point(json.x, json.y);
        }
    }
    __decorate([
        nameForSerialization('x')
    ], Point.prototype, "_x", void 0);
    __decorate([
        nameForSerialization('y')
    ], Point.prototype, "_y", void 0);
    class Quadrilateral extends DefaultSerializeable {
        constructor(topLeft, topRight, bottomRight, bottomLeft) {
            super();
            this._topLeft = topLeft;
            this._topRight = topRight;
            this._bottomRight = bottomRight;
            this._bottomLeft = bottomLeft;
        }
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
    }
    __decorate([
        nameForSerialization('topLeft')
    ], Quadrilateral.prototype, "_topLeft", void 0);
    __decorate([
        nameForSerialization('topRight')
    ], Quadrilateral.prototype, "_topRight", void 0);
    __decorate([
        nameForSerialization('bottomRight')
    ], Quadrilateral.prototype, "_bottomRight", void 0);
    __decorate([
        nameForSerialization('bottomLeft')
    ], Quadrilateral.prototype, "_bottomLeft", void 0);
    var MeasureUnit;
    (function (MeasureUnit) {
        MeasureUnit["DIP"] = "dip";
        MeasureUnit["Pixel"] = "pixel";
        MeasureUnit["Fraction"] = "fraction";
    })(MeasureUnit || (MeasureUnit = {}));
    class NumberWithUnit extends DefaultSerializeable {
        constructor(value, unit) {
            super();
            this._value = value;
            this._unit = unit;
        }
        get value() {
            return this._value;
        }
        get unit() {
            return this._unit;
        }
        static fromJSON(json) {
            return new NumberWithUnit(json.value, json.unit);
        }
    }
    __decorate([
        nameForSerialization('value')
    ], NumberWithUnit.prototype, "_value", void 0);
    __decorate([
        nameForSerialization('unit')
    ], NumberWithUnit.prototype, "_unit", void 0);
    class PointWithUnit extends DefaultSerializeable {
        constructor(x, y) {
            super();
            this._x = x;
            this._y = y;
        }
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
    }
    __decorate([
        nameForSerialization('x')
    ], PointWithUnit.prototype, "_x", void 0);
    __decorate([
        nameForSerialization('y')
    ], PointWithUnit.prototype, "_y", void 0);
    class Rect extends DefaultSerializeable {
        constructor(origin, size) {
            super();
            this._origin = origin;
            this._size = size;
        }
        get origin() {
            return this._origin;
        }
        get size() {
            return this._size;
        }
    }
    __decorate([
        nameForSerialization('origin')
    ], Rect.prototype, "_origin", void 0);
    __decorate([
        nameForSerialization('size')
    ], Rect.prototype, "_size", void 0);
    class RectWithUnit extends DefaultSerializeable {
        constructor(origin, size) {
            super();
            this._origin = origin;
            this._size = size;
        }
        get origin() {
            return this._origin;
        }
        get size() {
            return this._size;
        }
    }
    __decorate([
        nameForSerialization('origin')
    ], RectWithUnit.prototype, "_origin", void 0);
    __decorate([
        nameForSerialization('size')
    ], RectWithUnit.prototype, "_size", void 0);
    class SizeWithUnit extends DefaultSerializeable {
        constructor(width, height) {
            super();
            this._width = width;
            this._height = height;
        }
        get width() {
            return this._width;
        }
        get height() {
            return this._height;
        }
    }
    __decorate([
        nameForSerialization('width')
    ], SizeWithUnit.prototype, "_width", void 0);
    __decorate([
        nameForSerialization('height')
    ], SizeWithUnit.prototype, "_height", void 0);
    class Size extends DefaultSerializeable {
        constructor(width, height) {
            super();
            this._width = width;
            this._height = height;
        }
        get width() {
            return this._width;
        }
        get height() {
            return this._height;
        }
        static fromJSON(json) {
            return new Size(json.width, json.height);
        }
    }
    __decorate([
        nameForSerialization('width')
    ], Size.prototype, "_width", void 0);
    __decorate([
        nameForSerialization('height')
    ], Size.prototype, "_height", void 0);
    class SizeWithAspect {
        constructor(size, aspect) {
            this._size = size;
            this._aspect = aspect;
        }
        get size() {
            return this._size;
        }
        get aspect() {
            return this._aspect;
        }
    }
    __decorate([
        nameForSerialization('size')
    ], SizeWithAspect.prototype, "_size", void 0);
    __decorate([
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
    __decorate([
        nameForSerialization('widthAndHeight')
    ], SizeWithUnitAndAspect.prototype, "_widthAndHeight", void 0);
    __decorate([
        nameForSerialization('widthAndAspectRatio')
    ], SizeWithUnitAndAspect.prototype, "_widthAndAspectRatio", void 0);
    __decorate([
        nameForSerialization('heightAndAspectRatio')
    ], SizeWithUnitAndAspect.prototype, "_heightAndAspectRatio", void 0);
    __decorate([
        nameForSerialization('shorterDimensionAndAspectRatio')
    ], SizeWithUnitAndAspect.prototype, "_shorterDimensionAndAspectRatio", void 0);
    class MarginsWithUnit extends DefaultSerializeable {
        constructor(left, right, top, bottom) {
            super();
            this._left = left;
            this._right = right;
            this._top = top;
            this._bottom = bottom;
        }
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
    }
    __decorate([
        nameForSerialization('left')
    ], MarginsWithUnit.prototype, "_left", void 0);
    __decorate([
        nameForSerialization('right')
    ], MarginsWithUnit.prototype, "_right", void 0);
    __decorate([
        nameForSerialization('top')
    ], MarginsWithUnit.prototype, "_top", void 0);
    __decorate([
        nameForSerialization('bottom')
    ], MarginsWithUnit.prototype, "_bottom", void 0);
    class Color {
        constructor(hex) {
            this.hexadecimalString = hex;
        }
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

    var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
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
        constructor(symbology) {
            if (!symbology) {
                return;
            }
            return SymbologyDescription.all[SymbologyDescription.all
                .findIndex(description => description.identifier === symbology)];
        }
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
    __decorate$1([
        ignoreFromSerialization
    ], SymbologySettings.prototype, "_symbology", void 0);
    __decorate$1([
        nameForSerialization('enabled')
    ], SymbologySettings.prototype, "isEnabled", void 0);
    __decorate$1([
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
    __decorate$1([
        nameForSerialization('minimum')
    ], Range.prototype, "_minimum", void 0);
    __decorate$1([
        nameForSerialization('maximum')
    ], Range.prototype, "_maximum", void 0);
    __decorate$1([
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
        get shouldAnimateFromPreviousToNextState() { return this._shouldAnimateFromPreviousToNextState; }
        static fromJSON(json) {
            const trackedBarcode = new TrackedBarcode();
            trackedBarcode._identifier = json.identifier;
            trackedBarcode._shouldAnimateFromPreviousToNextState = json.shouldAnimateFromPreviousToNextState;
            trackedBarcode._barcode = Barcode.fromJSON(json.barcode);
            trackedBarcode._location = Quadrilateral.fromJSON(json.location);
            return trackedBarcode;
        }
    }

    class PrivateFocusGestureDeserializer {
        static fromJSON(json) {
            if (json && json.type === new TapToFocus().type) {
                return new TapToFocus();
            }
            else {
                return null;
            }
        }
    }
    class TapToFocus extends DefaultSerializeable {
        constructor() {
            super();
            this.type = 'tapToFocus';
        }
    }
    class PrivateZoomGestureDeserializer {
        static fromJSON(json) {
            if (json && json.type === new SwipeToZoom().type) {
                return new SwipeToZoom();
            }
            else {
                return null;
            }
        }
    }
    class SwipeToZoom extends DefaultSerializeable {
        constructor() {
            super();
            this.type = 'swipeToZoom';
        }
    }
    var LogoStyle;
    (function (LogoStyle) {
        LogoStyle["Minimal"] = "minimal";
        LogoStyle["Extended"] = "extended";
    })(LogoStyle || (LogoStyle = {}));

    var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
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
        constructor(isLooping) {
            super();
            this._isLooping = false;
            this._isLooping = isLooping;
        }
        static fromJSON(json) {
            if (json === null) {
                return null;
            }
            return new RectangularViewfinderAnimation(json.looping);
        }
        get isLooping() {
            return this._isLooping;
        }
    }
    __decorate$2([
        nameForSerialization('isLooping')
    ], RectangularViewfinderAnimation.prototype, "_isLooping", void 0);

    const defaultsFromJSON = (json) => {
        return {
            Camera: {
                Settings: {
                    preferredResolution: json.Camera.Settings.preferredResolution,
                    zoomFactor: json.Camera.Settings.zoomFactor,
                    focusRange: json.Camera.Settings.focusRange,
                    zoomGestureZoomFactor: json.Camera.Settings.zoomGestureZoomFactor,
                    focusGestureStrategy: json.Camera.Settings.focusGestureStrategy,
                    shouldPreferSmoothAutoFocus: json.Camera.Settings.shouldPreferSmoothAutoFocus,
                },
                defaultPosition: (json.Camera.defaultPosition || null),
                availablePositions: json.Camera.availablePositions,
            },
            DataCaptureView: {
                scanAreaMargins: MarginsWithUnit
                    .fromJSON(JSON.parse(json.DataCaptureView.scanAreaMargins)),
                pointOfInterest: PointWithUnit
                    .fromJSON(JSON.parse(json.DataCaptureView.pointOfInterest)),
                logoAnchor: json.DataCaptureView.logoAnchor,
                logoOffset: PointWithUnit
                    .fromJSON(JSON.parse(json.DataCaptureView.logoOffset)),
                focusGesture: PrivateFocusGestureDeserializer.fromJSON(JSON.parse(json.DataCaptureView.focusGesture)),
                zoomGesture: PrivateZoomGestureDeserializer.fromJSON(JSON.parse(json.DataCaptureView.zoomGesture)),
                logoStyle: json.DataCaptureView.logoStyle.toLowerCase(),
            },
            LaserlineViewfinder: Object
                .keys(json.LaserlineViewfinder.styles)
                .reduce((acc, key) => {
                const viewfinder = json.LaserlineViewfinder.styles[key];
                acc.styles[key] = {
                    width: NumberWithUnit
                        .fromJSON(JSON.parse(viewfinder.width)),
                    enabledColor: Color
                        .fromJSON(viewfinder.enabledColor),
                    disabledColor: Color
                        .fromJSON(viewfinder.disabledColor),
                    style: viewfinder.style,
                };
                return acc;
            }, { defaultStyle: json.LaserlineViewfinder.defaultStyle, styles: {} }),
            RectangularViewfinder: Object
                .keys(json.RectangularViewfinder.styles)
                .reduce((acc, key) => {
                const viewfinder = json.RectangularViewfinder.styles[key];
                acc.styles[key] = {
                    size: SizeWithUnitAndAspect
                        .fromJSON(JSON.parse(viewfinder.size)),
                    color: Color
                        .fromJSON(viewfinder.color),
                    style: viewfinder.style,
                    lineStyle: viewfinder.lineStyle,
                    dimming: viewfinder.dimming,
                    animation: RectangularViewfinderAnimation
                        .fromJSON(viewfinder.animation ? JSON.parse(viewfinder.animation) : null),
                };
                return acc;
            }, { defaultStyle: json.RectangularViewfinder.defaultStyle, styles: {} }),
            AimerViewfinder: {
                frameColor: Color.fromJSON(json.AimerViewfinder.frameColor),
                dotColor: Color.fromJSON(json.AimerViewfinder.dotColor),
            },
            Brush: {
                fillColor: Color
                    .fromJSON(json.Brush.fillColor),
                strokeColor: Color
                    .fromJSON(json.Brush.strokeColor),
                strokeWidth: json.Brush.strokeWidth,
            },
            deviceID: json.deviceID,
            capacitorVersion: json.capacitorVersion,
        };
    };

    var CapacitorFunction;
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
        CapacitorFunction["EmitFeedback"] = "emitFeedback";
        CapacitorFunction["SubscribeVolumeButtonObserver"] = "subscribeVolumeButtonObserver";
        CapacitorFunction["UnsubscribeVolumeButtonObserver"] = "unsubscribeVolumeButtonObserver";
    })(CapacitorFunction || (CapacitorFunction = {}));
    const pluginName = 'ScanditCaptureCoreNative';
    // tslint:disable-next-line:variable-name
    const Capacitor = {
        pluginName,
        defaults: {},
        exec: (success, error, functionName, args) => capacitorExec(success, error, pluginName, functionName, args),
    };
    const getDefaults = new Promise((resolve, reject) => core.Plugins[Capacitor.pluginName][CapacitorFunction.GetDefaults]().then((defaultsJSON) => {
        const defaults = defaultsFromJSON(defaultsJSON);
        Capacitor.defaults = defaults;
        resolve(defaults);
    }, reject));

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
        constructor(settings) {
            super();
            this.preferredResolution = Capacitor.defaults.Camera.Settings.preferredResolution;
            this.zoomFactor = Capacitor.defaults.Camera.Settings.zoomFactor;
            this.zoomGestureZoomFactor = Capacitor.defaults.Camera.Settings.zoomGestureZoomFactor;
            this.api = 0;
            this.focus = {
                range: Capacitor.defaults.Camera.Settings.focusRange,
                focusGestureStrategy: Capacitor.defaults.Camera.Settings.focusGestureStrategy,
                shouldPreferSmoothAutoFocus: Capacitor.defaults.Camera.Settings.shouldPreferSmoothAutoFocus,
            };
            if (settings !== undefined && settings !== null) {
                Object.getOwnPropertyNames(settings).forEach(propertyName => {
                    this[propertyName] = settings[propertyName];
                });
            }
        }
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
        setProperty(name, value) {
            this[name] = value;
        }
        getProperty(name) {
            return this[name];
        }
    }

    const defaultsFromJSON$1 = (json) => {
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
                    DefaultBrush: {
                        fillColor: Color
                            .fromJSON(json.BarcodeCapture.BarcodeCaptureOverlay.DefaultBrush.fillColor),
                        strokeColor: Color
                            .fromJSON(json.BarcodeCapture.BarcodeCaptureOverlay.DefaultBrush.strokeColor),
                        strokeWidth: json.BarcodeCapture.BarcodeCaptureOverlay.DefaultBrush.strokeWidth,
                    },
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
                    DefaultBrush: {
                        fillColor: Color
                            .fromJSON(json.BarcodeTracking.BarcodeTrackingBasicOverlay.DefaultBrush.fillColor),
                        strokeColor: Color
                            .fromJSON(json.BarcodeTracking.BarcodeTrackingBasicOverlay.DefaultBrush.strokeColor),
                        strokeWidth: json.BarcodeTracking.BarcodeTrackingBasicOverlay.DefaultBrush.strokeWidth,
                    },
                },
            },
        };
    };

    var CapacitorFunction$1;
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
    })(CapacitorFunction$1 || (CapacitorFunction$1 = {}));
    const pluginName$1 = 'ScanditBarcodeNative';
    // tslint:disable-next-line:variable-name
    const Capacitor$1 = {
        pluginName: pluginName$1,
        defaults: {},
        exec: (success, error, functionName, args) => capacitorExec(success, error, pluginName$1, functionName, args),
    };
    const getDefaults$1 = new Promise((resolve, reject) => core.Plugins[Capacitor$1.pluginName][CapacitorFunction$1.GetDefaults]().then((defaultsJSON) => {
        const defaults = defaultsFromJSON$1(defaultsJSON);
        Capacitor$1.defaults = defaults;
        resolve(defaults);
    }, reject));
    // To circumvent a circular dependency
    SymbologyDescription.defaults = () => Capacitor$1.defaults;

    class FeedbackProxy {
        static forFeedback(feedback) {
            const proxy = new FeedbackProxy();
            proxy.feedback = feedback;
            return proxy;
        }
        emit() {
            core.Plugins[Capacitor.pluginName][CapacitorFunction.EmitFeedback]({ feedback: this.feedback.toJSON() });
        }
    }

    var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
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
        constructor(type) {
            super();
            this.type = type;
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
    }
    class Sound extends DefaultSerializeable {
        constructor(resource) {
            super();
            this.resource = null;
            this.resource = resource;
        }
        static get defaultSound() {
            return new Sound(null);
        }
    }
    __decorate$3([
        ignoreFromSerializationIfNull
    ], Sound.prototype, "resource", void 0);
    class Feedback extends DefaultSerializeable {
        constructor(vibration, sound) {
            super();
            this._vibration = null;
            this._sound = null;
            this._vibration = vibration;
            this._sound = sound;
            this.initialize();
        }
        static get defaultFeedback() {
            return new Feedback(Vibration.defaultVibration, Sound.defaultSound);
        }
        get vibration() {
            return this._vibration;
        }
        get sound() {
            return this._sound;
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
    __decorate$3([
        ignoreFromSerializationIfNull,
        nameForSerialization('vibration')
    ], Feedback.prototype, "_vibration", void 0);
    __decorate$3([
        ignoreFromSerializationIfNull,
        nameForSerialization('sound')
    ], Feedback.prototype, "_sound", void 0);
    __decorate$3([
        ignoreFromSerialization
    ], Feedback.prototype, "proxy", void 0);

    var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    class Brush extends DefaultSerializeable {
        constructor(fillColor = Capacitor.defaults.Brush.fillColor, strokeColor = Capacitor.defaults.Brush.strokeColor, strokeWidth = Capacitor.defaults.Brush.strokeWidth) {
            super();
            this.fill = { color: fillColor };
            this.stroke = { color: strokeColor, width: strokeWidth };
        }
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
    }
    // tslint:disable-next-line:variable-name
    const NoViewfinder = { type: 'none' };
    class LaserlineViewfinder extends DefaultSerializeable {
        constructor(style) {
            super();
            this.type = 'laserline';
            const viewfinderStyle = style || Capacitor.defaults.LaserlineViewfinder.defaultStyle;
            this._style = Capacitor.defaults.LaserlineViewfinder.styles[viewfinderStyle].style;
            this.width = Capacitor.defaults.LaserlineViewfinder.styles[viewfinderStyle].width;
            this.enabledColor = Capacitor.defaults.LaserlineViewfinder.styles[viewfinderStyle].enabledColor;
            this.disabledColor = Capacitor.defaults.LaserlineViewfinder.styles[viewfinderStyle].disabledColor;
        }
        get style() {
            return this._style;
        }
    }
    __decorate$4([
        nameForSerialization('style')
    ], LaserlineViewfinder.prototype, "_style", void 0);
    class RectangularViewfinder extends DefaultSerializeable {
        constructor(style, lineStyle) {
            super();
            this.type = 'rectangular';
            const viewfinderStyle = style || Capacitor.defaults.RectangularViewfinder.defaultStyle;
            this._style = Capacitor.defaults.RectangularViewfinder.styles[viewfinderStyle].style;
            this._lineStyle = Capacitor.defaults.RectangularViewfinder.styles[viewfinderStyle].lineStyle;
            this._dimming = parseFloat(Capacitor.defaults.RectangularViewfinder.styles[viewfinderStyle].dimming);
            this._animation = Capacitor.defaults.RectangularViewfinder.styles[viewfinderStyle].animation;
            this.color = Capacitor.defaults.RectangularViewfinder.styles[viewfinderStyle].color;
            this._sizeWithUnitAndAspect = Capacitor.defaults.RectangularViewfinder.styles[viewfinderStyle].size;
            if (lineStyle !== undefined) {
                this._lineStyle = lineStyle;
            }
        }
        get sizeWithUnitAndAspect() {
            return this._sizeWithUnitAndAspect;
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
    __decorate$4([
        nameForSerialization('style')
    ], RectangularViewfinder.prototype, "_style", void 0);
    __decorate$4([
        nameForSerialization('lineStyle')
    ], RectangularViewfinder.prototype, "_lineStyle", void 0);
    __decorate$4([
        nameForSerialization('dimming')
    ], RectangularViewfinder.prototype, "_dimming", void 0);
    __decorate$4([
        nameForSerialization('animation'),
        ignoreFromSerialization
    ], RectangularViewfinder.prototype, "_animation", void 0);
    __decorate$4([
        nameForSerialization('size')
    ], RectangularViewfinder.prototype, "_sizeWithUnitAndAspect", void 0);

    var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
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
    class BarcodeCaptureOverlay extends DefaultSerializeable {
        constructor() {
            super();
            this.type = 'barcodeCapture';
            this._shouldShowScanAreaGuides = false;
            this._viewfinder = null;
            this._brush = BarcodeCaptureOverlay.defaultBrush;
        }
        static get defaultBrush() {
            return new Brush(Capacitor$1.defaults.BarcodeCapture.BarcodeCaptureOverlay.DefaultBrush.fillColor, Capacitor$1.defaults.BarcodeCapture.BarcodeCaptureOverlay.DefaultBrush.strokeColor, Capacitor$1.defaults.BarcodeCapture.BarcodeCaptureOverlay.DefaultBrush.strokeWidth);
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
        static withBarcodeCapture(barcodeCapture) {
            return BarcodeCaptureOverlay.withBarcodeCaptureForView(barcodeCapture, null);
        }
        static withBarcodeCaptureForView(barcodeCapture, view) {
            const overlay = new BarcodeCaptureOverlay();
            overlay.barcodeCapture = barcodeCapture;
            if (view) {
                view.addOverlay(overlay);
            }
            return overlay;
        }
    }
    __decorate$5([
        ignoreFromSerialization
    ], BarcodeCaptureOverlay.prototype, "barcodeCapture", void 0);
    __decorate$5([
        nameForSerialization('shouldShowScanAreaGuides')
    ], BarcodeCaptureOverlay.prototype, "_shouldShowScanAreaGuides", void 0);
    __decorate$5([
        serializationDefault(NoViewfinder),
        nameForSerialization('viewfinder')
    ], BarcodeCaptureOverlay.prototype, "_viewfinder", void 0);
    __decorate$5([
        nameForSerialization('brush')
    ], BarcodeCaptureOverlay.prototype, "_brush", void 0);

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
        initialize() {
            this.subscribeListener();
        }
        subscribeListener() {
            core.Plugins[Capacitor$1.pluginName][CapacitorFunction$1.SubscribeBarcodeCaptureListener]();
            core.Plugins[Capacitor$1.pluginName]
                .addListener(BarcodeCaptureListenerEvent.DidScan, this.notifyListeners.bind(this));
            core.Plugins[Capacitor$1.pluginName]
                .addListener(BarcodeCaptureListenerEvent.DidUpdateSession, this.notifyListeners.bind(this));
        }
        notifyListeners(event) {
            const done = () => {
                this.barcodeCapture.isInListenerCallback = false;
                core.Plugins[Capacitor$1.pluginName].finishCallback({
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
                                .fromJSON(JSON.parse(event.session)));
                        }
                        break;
                    case BarcodeCaptureListenerEvent.DidUpdateSession:
                        if (listener.didUpdateSession) {
                            listener.didUpdateSession(this.barcodeCapture, BarcodeCaptureSession
                                .fromJSON(JSON.parse(event.session)));
                        }
                        break;
                }
            });
            return done();
        }
    }
    BarcodeCaptureListenerProxy.capacitorExec = Capacitor$1.exec;

    var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
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
            return new CameraSettings(Capacitor$1.defaults.BarcodeCapture.RecommendedCameraSettings);
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
    ], BarcodeCapture.prototype, "_isEnabled", void 0);
    __decorate$6([
        nameForSerialization('feedback')
    ], BarcodeCapture.prototype, "_feedback", void 0);
    __decorate$6([
        ignoreFromSerialization
    ], BarcodeCapture.prototype, "_context", void 0);
    __decorate$6([
        ignoreFromSerialization
    ], BarcodeCapture.prototype, "listeners", void 0);
    __decorate$6([
        ignoreFromSerialization
    ], BarcodeCapture.prototype, "listenerProxy", void 0);
    __decorate$6([
        ignoreFromSerialization
    ], BarcodeCapture.prototype, "isInListenerCallback", void 0);

    var __decorate$7 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    // tslint:disable-next-line:variable-name
    const NoneLocationSelection = { type: 'none' };
    class RadiusLocationSelection extends DefaultSerializeable {
        constructor(radius) {
            super();
            this.type = 'radius';
            this._radius = radius;
        }
        get radius() {
            return this._radius;
        }
    }
    __decorate$7([
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
    __decorate$7([
        nameForSerialization('size')
    ], RectangularLocationSelection.prototype, "_sizeWithUnitAndAspect", void 0);

    var __decorate$8 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    class BarcodeCaptureSettings extends DefaultSerializeable {
        constructor() {
            super();
            this.codeDuplicateFilter = Capacitor$1.defaults.BarcodeCapture.BarcodeCaptureSettings.codeDuplicateFilter;
            this.locationSelection = null;
            this.enabledCompositeTypes = [];
            this.properties = {};
            this.symbologies = {};
        }
        get compositeTypeDescriptions() {
            return Capacitor$1.defaults.CompositeTypeDescriptions.reduce((descriptions, description) => {
                descriptions[description.types[0]] = description;
                return descriptions;
            }, {});
        }
        get enabledSymbologies() {
            return Object.keys(this.symbologies)
                .filter(symbology => this.symbologies[symbology].isEnabled);
        }
        settingsForSymbology(symbology) {
            if (!this.symbologies[symbology]) {
                const symbologySettings = Capacitor$1.defaults.SymbologySettings[symbology];
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
    __decorate$8([
        serializationDefault(NoneLocationSelection)
    ], BarcodeCaptureSettings.prototype, "locationSelection", void 0);

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
                BarcodeTrackingAdvancedOverlayProxy.capacitorExec(resolve, reject, CapacitorFunction$1.SetViewForTrackedBarcode, {
                    view: view ? view.toJSON() : null,
                    sessionFrameSequenceID: trackedBarcode.sessionFrameSequenceID,
                    trackedBarcodeID: trackedBarcode.identifier,
                });
            });
        }
        setAnchorForTrackedBarcode(anchor, trackedBarcode) {
            return new Promise((resolve, reject) => {
                BarcodeTrackingAdvancedOverlayProxy.capacitorExec(resolve, reject, CapacitorFunction$1.SetAnchorForTrackedBarcode, {
                    anchor,
                    sessionFrameSequenceID: trackedBarcode.sessionFrameSequenceID,
                    trackedBarcodeID: trackedBarcode.identifier,
                });
            });
        }
        setOffsetForTrackedBarcode(offset, trackedBarcode) {
            return new Promise((resolve, reject) => {
                BarcodeTrackingAdvancedOverlayProxy.capacitorExec(resolve, reject, CapacitorFunction$1.SetOffsetForTrackedBarcode, {
                    offset: offset ? JSON.stringify(offset.toJSON()) : null,
                    sessionFrameSequenceID: trackedBarcode.sessionFrameSequenceID,
                    trackedBarcodeID: trackedBarcode.identifier,
                });
            });
        }
        clearTrackedBarcodeViews() {
            return new Promise((resolve, reject) => {
                BarcodeTrackingAdvancedOverlayProxy.capacitorExec(resolve, reject, CapacitorFunction$1.ClearTrackedBarcodeViews, null);
            });
        }
        subscribeListener() {
            core.Plugins[Capacitor$1.pluginName][CapacitorFunction$1.SubscribeBarcodeTrackingAdvancedOverlayListener]();
            core.Plugins[Capacitor$1.pluginName].addListener(BarcodeTrackingAdvancedOverlayListenerEvent.AnchorForTrackedBarcode, this.notifyListeners.bind(this));
            core.Plugins[Capacitor$1.pluginName].addListener(BarcodeTrackingAdvancedOverlayListenerEvent.DidTapViewForTrackedBarcode, this.notifyListeners.bind(this));
            core.Plugins[Capacitor$1.pluginName].addListener(BarcodeTrackingAdvancedOverlayListenerEvent.OffsetForTrackedBarcode, this.notifyListeners.bind(this));
            core.Plugins[Capacitor$1.pluginName].addListener(BarcodeTrackingAdvancedOverlayListenerEvent.ViewForTrackedBarcode, this.notifyListeners.bind(this));
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
    BarcodeTrackingAdvancedOverlayProxy.capacitorExec = Capacitor$1.exec;

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
                BarcodeTrackingBasicOverlayProxy.capacitorExec(resolve, reject, CapacitorFunction$1.SetBrushForTrackedBarcode, {
                    brush: brush ? JSON.stringify(brush.toJSON()) : null,
                    sessionFrameSequenceID: trackedBarcode.sessionFrameSequenceID,
                    trackedBarcodeID: trackedBarcode.identifier,
                });
            });
        }
        clearTrackedBarcodeBrushes() {
            return new Promise((resolve, reject) => {
                BarcodeTrackingBasicOverlayProxy.capacitorExec(resolve, reject, CapacitorFunction$1.ClearTrackedBarcodeBrushes, null);
            });
        }
        subscribeListener() {
            core.Plugins[Capacitor$1.pluginName][CapacitorFunction$1.SubscribeBarcodeTrackingBasicOverlayListener]();
            core.Plugins[Capacitor$1.pluginName]
                .addListener(BarcodeTrackingBasicOverlayListenerEvent.BrushForTrackedBarcode, this.notifyListeners.bind(this));
            core.Plugins[Capacitor$1.pluginName]
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
    BarcodeTrackingBasicOverlayProxy.capacitorExec = Capacitor$1.exec;

    var __decorate$9 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
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
    }
    class BarcodeTrackingBasicOverlay extends DefaultSerializeable {
        constructor() {
            super();
            this.type = 'barcodeTrackingBasic';
            this._defaultBrush = new Brush(Capacitor$1.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.DefaultBrush.fillColor, Capacitor$1.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.DefaultBrush.strokeColor, Capacitor$1.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.DefaultBrush.strokeWidth);
            this._shouldShowScanAreaGuides = false;
            this.listener = null;
        }
        static get defaultBrush() {
            return new Brush(Capacitor$1.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.DefaultBrush.fillColor, Capacitor$1.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.DefaultBrush.strokeColor, Capacitor$1.defaults.BarcodeTracking.BarcodeTrackingBasicOverlay.DefaultBrush.strokeWidth);
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
        static withBarcodeTracking(barcodeTracking) {
            return BarcodeTrackingBasicOverlay.withBarcodeTrackingForView(barcodeTracking, null);
        }
        static withBarcodeTrackingForView(barcodeTracking, view) {
            const overlay = new BarcodeTrackingBasicOverlay();
            overlay.barcodeTracking = barcodeTracking;
            if (view) {
                view.addOverlay(overlay);
            }
            overlay.initialize();
            return overlay;
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
    __decorate$9([
        ignoreFromSerialization
    ], BarcodeTrackingBasicOverlay.prototype, "barcodeTracking", void 0);
    __decorate$9([
        nameForSerialization('defaultBrush')
    ], BarcodeTrackingBasicOverlay.prototype, "_defaultBrush", void 0);
    __decorate$9([
        nameForSerialization('shouldShowScanAreaGuides')
    ], BarcodeTrackingBasicOverlay.prototype, "_shouldShowScanAreaGuides", void 0);
    __decorate$9([
        ignoreFromSerialization
    ], BarcodeTrackingBasicOverlay.prototype, "listener", void 0);
    __decorate$9([
        ignoreFromSerialization
    ], BarcodeTrackingBasicOverlay.prototype, "_proxy", void 0);
    class BarcodeTrackingAdvancedOverlay extends DefaultSerializeable {
        constructor() {
            super();
            this.type = 'barcodeTrackingAdvanced';
            this._shouldShowScanAreaGuides = false;
            this.listener = null;
        }
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
    __decorate$9([
        nameForSerialization('shouldShowScanAreaGuides')
    ], BarcodeTrackingAdvancedOverlay.prototype, "_shouldShowScanAreaGuides", void 0);
    __decorate$9([
        ignoreFromSerialization
    ], BarcodeTrackingAdvancedOverlay.prototype, "barcodeTracking", void 0);
    __decorate$9([
        ignoreFromSerialization
    ], BarcodeTrackingAdvancedOverlay.prototype, "listener", void 0);
    __decorate$9([
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
            core.Plugins[Capacitor$1.pluginName][CapacitorFunction$1.SubscribeBarcodeTrackingListener]();
            core.Plugins[Capacitor$1.pluginName]
                .addListener(BarcodeTrackingListenerEvent.DidUpdateSession, this.notifyListeners.bind(this));
        }
        notifyListeners(event) {
            const done = () => {
                this.barcodeTracking.isInListenerCallback = false;
                core.Plugins[Capacitor$1.pluginName].finishCallback({
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
                                .fromJSON(JSON.parse(event.session)));
                        }
                        break;
                }
            });
            return done();
        }
    }
    BarcodeTrackingListenerProxy.capacitorExec = Capacitor$1.exec;

    var __decorate$a = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
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
            return new CameraSettings(Capacitor$1.defaults.BarcodeTracking.RecommendedCameraSettings);
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
    __decorate$a([
        nameForSerialization('enabled')
    ], BarcodeTracking.prototype, "_isEnabled", void 0);
    __decorate$a([
        ignoreFromSerialization
    ], BarcodeTracking.prototype, "_context", void 0);
    __decorate$a([
        ignoreFromSerialization
    ], BarcodeTracking.prototype, "listeners", void 0);
    __decorate$a([
        ignoreFromSerialization
    ], BarcodeTracking.prototype, "listenerProxy", void 0);

    var BarcodeTrackingScenario;
    (function (BarcodeTrackingScenario) {
        BarcodeTrackingScenario["A"] = "A";
        BarcodeTrackingScenario["B"] = "B";
    })(BarcodeTrackingScenario || (BarcodeTrackingScenario = {}));
    class BarcodeTrackingSettings extends DefaultSerializeable {
        constructor() {
            super();
            this.scenario = null;
            this.properties = {};
            this.symbologies = {};
        }
        get enabledSymbologies() {
            return Object.keys(this.symbologies)
                .filter(symbology => this.symbologies[symbology].isEnabled);
        }
        static forScenario(scenario) {
            const settings = new BarcodeTrackingSettings();
            settings.scenario = scenario;
            return settings;
        }
        settingsForSymbology(symbology) {
            if (!this.symbologies[symbology]) {
                const symbologySettings = Capacitor$1.defaults.SymbologySettings[symbology];
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
        constructor(encodedData, options) {
            super();
            if (options == null) {
                options = { scale: 1 };
            }
            this.data = encodedData;
            this.options = options;
        }
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
    class ScanditBarcodePlugin extends core.WebPlugin {
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
                    BarcodeCaptureFeedback,
                    BarcodeTracking,
                    BarcodeTrackingSession,
                    BarcodeTrackingScenario,
                    BarcodeTrackingSettings,
                    TrackedBarcode,
                    BarcodeTrackingBasicOverlay,
                    BarcodeTrackingAdvancedOverlay,
                    EncodingRange,
                    LocalizedOnlyBarcode,
                    Range,
                    TrackedBarcodeView,
                };
                return new Promise((resolve, reject) => getDefaults$1.then(() => {
                    resolve(api);
                }, reject));
            });
        }
    }
    const scanditBarcode = new ScanditBarcodePlugin();
    core.registerWebPlugin(scanditBarcode);

    exports.ScanditBarcodePlugin = ScanditBarcodePlugin;
    exports.scanditBarcode = scanditBarcode;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}, require('@capacitor/core')));
//# sourceMappingURL=plugin.js.map
