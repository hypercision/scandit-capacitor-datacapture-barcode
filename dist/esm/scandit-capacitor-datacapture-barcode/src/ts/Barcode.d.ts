import { Quadrilateral, QuadrilateralJSON } from '../../../scandit-capacitor-datacapture-core/src/ts/Common';
import { DefaultSerializeable } from '../../../scandit-capacitor-datacapture-core/src/ts/Serializeable';
export declare enum Symbology {
    EAN13UPCA = "ean13Upca",
    UPCE = "upce",
    EAN8 = "ean8",
    Code39 = "code39",
    Code93 = "code93",
    Code128 = "code128",
    Code11 = "code11",
    Code25 = "code25",
    Codabar = "codabar",
    InterleavedTwoOfFive = "interleavedTwoOfFive",
    MSIPlessey = "msiPlessey",
    QR = "qr",
    DataMatrix = "dataMatrix",
    Aztec = "aztec",
    MaxiCode = "maxicode",
    DotCode = "dotcode",
    KIX = "kix",
    RM4SCC = "rm4scc",
    GS1Databar = "databar",
    GS1DatabarExpanded = "databarExpanded",
    GS1DatabarLimited = "databarLimited",
    PDF417 = "pdf417",
    MicroPDF417 = "microPdf417",
    MicroQR = "microQr",
    Code32 = "code32",
    Lapa4SC = "lapa4sc",
    IATATwoOfFive = "iata2of5",
    MatrixTwoOfFive = "matrix2of5",
    USPSIntelligentMail = "uspsIntelligentMail"
}
export declare enum CompositeType {
    A = "A",
    B = "B",
    C = "C"
}
export interface PrivateCompositeTypeDescription {
    types: CompositeType[];
    symbologies: Symbology[];
}
export interface PrivateSymbologyDescription {
    defaults: () => {
        SymbologyDescriptions: SymbologyDescription[];
    };
    fromJSON(json: SymbologyDescriptionJSON): SymbologyDescription;
}
export declare class SymbologyDescription {
    private static defaults;
    static get all(): SymbologyDescription[];
    private _identifier;
    get identifier(): string;
    get symbology(): Symbology;
    private _readableName;
    get readableName(): string;
    private _isAvailable;
    get isAvailable(): boolean;
    private _isColorInvertible;
    get isColorInvertible(): boolean;
    private _activeSymbolCountRange;
    get activeSymbolCountRange(): Range;
    private _defaultSymbolCountRange;
    get defaultSymbolCountRange(): Range;
    private _supportedExtensions;
    get supportedExtensions(): string[];
    private static fromJSON;
    static forIdentifier(identifier: string): SymbologyDescription | null;
    constructor(symbology: Symbology);
    constructor();
}
export interface PrivateSymbologySettings {
    fromJSON: (json: any) => SymbologySettings;
    _symbology: Symbology;
}
export declare class SymbologySettings extends DefaultSerializeable {
    private _symbology;
    private extensions;
    isEnabled: boolean;
    isColorInvertedEnabled: boolean;
    checksums: Checksum[];
    activeSymbolCounts: number[];
    get symbology(): Symbology;
    get enabledExtensions(): string[];
    private static fromJSON;
    setExtensionEnabled(extension: string, enabled: boolean): void;
}
export declare enum Checksum {
    Mod10 = "mod10",
    Mod11 = "mod11",
    Mod16 = "mod16",
    Mod43 = "mod43",
    Mod47 = "mod47",
    Mod103 = "mod103",
    Mod10AndMod11 = "mod1110",
    Mod10AndMod10 = "mod1010"
}
interface EncodingRangeJSON {
    ianaName: string;
    startIndex: number;
    endIndex: number;
}
export declare class EncodingRange {
    private _ianaName;
    get ianaName(): string;
    private _startIndex;
    get startIndex(): number;
    private _endIndex;
    get endIndex(): number;
    private static fromJSON;
}
export declare enum CompositeFlag {
    None = "none",
    Unknown = "unknown",
    Linked = "linked",
    GS1TypeA = "gs1TypeA",
    GS1TypeB = "gs1TypeB",
    GS1TypeC = "gs1TypeC"
}
export interface PrivateRange {
    _minimum: number;
    _maximum: number;
    _step: number;
}
export declare class Range {
    private _minimum;
    private _maximum;
    private _step;
    get minimum(): number;
    get maximum(): number;
    get step(): number;
    get isFixed(): boolean;
    private static fromJSON;
}
export declare class Barcode {
    private _symbology;
    get symbology(): Symbology;
    private _data;
    get data(): Optional<string>;
    private _rawData;
    get rawData(): string;
    private _compositeData;
    get compositeData(): Optional<string>;
    private _compositeRawData;
    get compositeRawData(): string;
    private _addOnData;
    get addOnData(): Optional<string>;
    private _encodingRanges;
    get encodingRanges(): EncodingRange[];
    private _location;
    get location(): Quadrilateral;
    private _isGS1DataCarrier;
    get isGS1DataCarrier(): boolean;
    private _compositeFlag;
    get compositeFlag(): CompositeFlag;
    private _isColorInverted;
    get isColorInverted(): boolean;
    private _symbolCount;
    get symbolCount(): number;
    private _frameID;
    get frameID(): number;
    private static fromJSON;
}
export interface BarcodeJSON {
    symbology: string;
    data: Optional<string>;
    rawData: string;
    addOnData: Optional<string>;
    compositeData: Optional<string>;
    compositeRawData: string;
    isGS1DataCarrier: boolean;
    compositeFlag: string;
    isColorInverted: boolean;
    symbolCount: number;
    frameId: number;
    encodingRanges: EncodingRangeJSON[];
    location: QuadrilateralJSON;
}
export interface PrivateBarcode {
    fromJSON(json: BarcodeJSON): Barcode;
}
export declare class LocalizedOnlyBarcode {
    private _location;
    private _frameID;
    get location(): Quadrilateral;
    get frameID(): number;
    private static fromJSON;
}
export interface LocalizedOnlyBarcodeJSON {
    location: QuadrilateralJSON;
    frameId: number;
}
export interface PrivateLocalizedOnlyBarcode {
    fromJSON(json: LocalizedOnlyBarcodeJSON): LocalizedOnlyBarcode;
}
export interface TrackedBarcodeJSON {
    deltaTime: number;
    identifier: number;
    shouldAnimateFromPreviousToNextState: boolean;
    barcode: BarcodeJSON;
    predictedLocation: QuadrilateralJSON;
    location: QuadrilateralJSON;
}
export interface PrivateTrackedBarcode {
    sessionFrameSequenceID: Optional<string>;
    fromJSON(json: TrackedBarcodeJSON): TrackedBarcode;
}
export declare class TrackedBarcode {
    private _barcode;
    get barcode(): Barcode;
    private _location;
    get location(): Quadrilateral;
    private _identifier;
    get identifier(): number;
    private sessionFrameSequenceID;
    private _shouldAnimateFromPreviousToNextState;
    get shouldAnimateFromPreviousToNextState(): boolean;
    private static fromJSON;
}
export {};
