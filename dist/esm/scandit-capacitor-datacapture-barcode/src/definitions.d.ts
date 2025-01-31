export type Optional<T> = T | null;
export interface SymbologySettingsJSON {
    enabled: boolean;
    colorInvertedEnabled: boolean;
    activeSymbolCounts: number[];
    checksums: string[];
    extensions: string[];
}
export interface RangeJSON {
    minimum: number;
    maximum: number;
    step: number;
}
export interface SymbologyDescriptionJSON {
    identifier: string;
    readableName: string;
    isAvailable: boolean;
    isColorInvertible: boolean;
    activeSymbolCountRange: RangeJSON;
    defaultSymbolCountRange: RangeJSON;
    supportedExtensions: string[];
}
export interface SymbologySettingsDefaults {
    [key: string]: SymbologySettingsJSON;
}
export type SymbologyDescriptions = SymbologyDescriptionJSON[];
export interface ScanditBarcodePluginInterface {
    initialize(coreDefaults: any): Promise<any>;
}
export interface ScanditBarcodeCountNativeInterface {
    finishBarcodeCountListenerOnScan(): Promise<void>;
    createView(data: any): Promise<void>;
    updateView(data: {
        BarcodeCountView: any;
    }): Promise<void>;
    updateMode(data: {
        BarcodeCount: any;
    }): Promise<void>;
    setViewPositionAndSize(data: any): Promise<void>;
    showView(): Promise<void>;
    hideView(): Promise<void>;
    registerBarcodeCountListener(): Promise<void>;
    unregisterBarcodeCountListener(): Promise<void>;
    registerBarcodeCountViewListener(): Promise<void>;
    unregisterBarcodeCountViewListener(): Promise<void>;
    registerBarcodeCountViewUiListener(): Promise<void>;
    unregisterBarcodeCountViewUiListener(): Promise<void>;
    setBarcodeCountCaptureList(data: {
        TargetBarcodes: any[];
    }): Promise<void>;
    resetBarcodeCountSession(): Promise<void>;
    resetBarcodeCount(): Promise<void>;
    startScanningPhase(): Promise<void>;
    endScanningPhase(): Promise<void>;
    clearBarcodeCountViewHighlights(): Promise<void>;
    finishBarcodeCountViewListenerBrushForRecognizedBarcode(data: {
        brush: string | null;
        trackedBarcodeId: number;
    }): Promise<void>;
    finishBarcodeCountViewListenerBrushForRecognizedBarcodeNotInList(data: {
        brush: string | null;
        trackedBarcodeId: number;
    }): Promise<void>;
    finishBarcodeCountViewListenerOnBrushForUnrecognizedBarcode(data: {
        brush: string | null;
        trackedBarcodeId: number;
    }): Promise<void>;
}
declare module Scandit {

export enum Symbology {
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
export enum CompositeType {
    A = "A",
    B = "B",
    C = "C"
}
interface PrivateCompositeTypeDescription {
    types: CompositeType[];
    symbologies: Symbology[];
}
interface PrivateSymbologyDescription {
    defaults: () => {
        SymbologyDescriptions: SymbologyDescription[];
    };
    fromJSON(json: SymbologyDescriptionJSON): SymbologyDescription;
}
export class SymbologyDescription {
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
interface PrivateSymbologySettings {
    fromJSON: (json: any) => SymbologySettings;
    _symbology: Symbology;
}
export class SymbologySettings {
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
export enum Checksum {
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
export class EncodingRange {
    private _ianaName;
    get ianaName(): string;
    private _startIndex;
    get startIndex(): number;
    private _endIndex;
    get endIndex(): number;
    private static fromJSON;
}
export enum CompositeFlag {
    None = "none",
    Unknown = "unknown",
    Linked = "linked",
    GS1TypeA = "gs1TypeA",
    GS1TypeB = "gs1TypeB",
    GS1TypeC = "gs1TypeC"
}
interface PrivateRange {
    _minimum: number;
    _maximum: number;
    _step: number;
}
export class Range {
    private _minimum;
    private _maximum;
    private _step;
    get minimum(): number;
    get maximum(): number;
    get step(): number;
    get isFixed(): boolean;
    private static fromJSON;
}
export class Barcode {
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
    private get selectionIdentifier();
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
interface PrivateBarcode {
    readonly selectionIdentifier: string;
    fromJSON(json: BarcodeJSON): Barcode;
}
export class LocalizedOnlyBarcode {
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
interface PrivateLocalizedOnlyBarcode {
    fromJSON(json: LocalizedOnlyBarcodeJSON): LocalizedOnlyBarcode;
}
export interface TrackedBarcodeJSON {
    deltaTime: number;
    identifier: number;
    barcode: BarcodeJSON;
    predictedLocation: QuadrilateralJSON;
    location: QuadrilateralJSON;
}
interface PrivateTrackedBarcode {
    sessionFrameSequenceID: Optional<string>;
    fromJSON(json: TrackedBarcodeJSON): TrackedBarcode;
}
export class TrackedBarcode {
    private _barcode;
    get barcode(): Barcode;
    private _location;
    get location(): Quadrilateral;
    private _identifier;
    get identifier(): number;
    private sessionFrameSequenceID;
    get shouldAnimateFromPreviousToNextState(): boolean;
    private static fromJSON;
}
export interface TargetBarcodeJSON {
    data: string;
    quantity: number;
}
export class TargetBarcode {
    get data(): string;
    get quantity(): number;
    private _data;
    private _quantity;
    static create(data: string, quantity: number): TargetBarcode;
    private static fromJSON;
    private constructor();
}


export class BarcodeCaptureSession {
    private _newlyRecognizedBarcodes;
    private _newlyLocalizedBarcodes;
    private _frameSequenceID;
    private listenerProxy;
    get newlyRecognizedBarcodes(): Barcode[];
    get newlyLocalizedBarcodes(): LocalizedOnlyBarcode[];
    get frameSequenceID(): number;
    private static fromJSON;
    reset(): Promise<void>;
}
export interface BarcodeCaptureSessionJSON {
    newlyRecognizedBarcodes: BarcodeJSON[];
    newlyLocalizedBarcodes: LocalizedOnlyBarcodeJSON[];
    frameSequenceId: number;
}
interface PrivateBarcodeCaptureSession {
    fromJSON(json: BarcodeCaptureSessionJSON): BarcodeCaptureSession;
}
export interface BarcodeCaptureListener {
    didScan?(barcodeCapture: BarcodeCapture, session: BarcodeCaptureSession, getFrameData: () => Promise<FrameData>): void;
    didUpdateSession?(barcodeCapture: BarcodeCapture, session: BarcodeCaptureSession, getFrameData: () => Promise<FrameData>): void;
}
export class BarcodeCaptureFeedback {
    success: Feedback;
    static get default(): BarcodeCaptureFeedback;
}
export enum BarcodeCaptureOverlayStyle {
    Frame = "frame",
    Legacy = "legacy"
}
export class BarcodeCaptureOverlay implements DataCaptureOverlay {
    private type;
    private barcodeCapture;
    private _shouldShowScanAreaGuides;
    private _viewfinder;
    static get defaultBrush(): Brush;
    private _brush;
    private _style;
    get brush(): Brush;
    set brush(newBrush: Brush);
    get viewfinder(): Optional<Viewfinder>;
    set viewfinder(newViewfinder: Optional<Viewfinder>);
    get shouldShowScanAreaGuides(): boolean;
    set shouldShowScanAreaGuides(shouldShow: boolean);
    get style(): BarcodeCaptureOverlayStyle;
    static withBarcodeCapture(barcodeCapture: BarcodeCapture): BarcodeCaptureOverlay;
    static withBarcodeCaptureForView(barcodeCapture: BarcodeCapture, view: Optional<DataCaptureView>): BarcodeCaptureOverlay;
    static withBarcodeCaptureForViewWithStyle(barcodeCapture: BarcodeCapture, view: DataCaptureView | null, style: BarcodeCaptureOverlayStyle): BarcodeCaptureOverlay;
    private constructor();
}


interface PrivateBarcodeCapture extends PrivateDataCaptureMode {
    _context: Optional<DataCaptureContext>;
    didChange: () => Promise<void>;
}
export class BarcodeCapture implements DataCaptureMode {
    get isEnabled(): boolean;
    set isEnabled(isEnabled: boolean);
    get context(): Optional<DataCaptureContext>;
    get feedback(): BarcodeCaptureFeedback;
    set feedback(feedback: BarcodeCaptureFeedback);
    static get recommendedCameraSettings(): CameraSettings;
    private type;
    private _isEnabled;
    private _feedback;
    private settings;
    private _context;
    private listeners;
    private listenerProxy;
    private isInListenerCallback;
    static forContext(context: Optional<DataCaptureContext>, settings: BarcodeCaptureSettings): BarcodeCapture;
    applySettings(settings: BarcodeCaptureSettings): Promise<void>;
    addListener(listener: BarcodeCaptureListener): void;
    removeListener(listener: BarcodeCaptureListener): void;
    private didChange;
}


export class BarcodeCaptureSettings {
    codeDuplicateFilter: number;
    locationSelection: Optional<LocationSelection>;
    enabledCompositeTypes: CompositeType[];
    private properties;
    private symbologies;
    private get compositeTypeDescriptions();
    get enabledSymbologies(): Symbology[];
    constructor();
    settingsForSymbology(symbology: Symbology): SymbologySettings;
    setProperty(name: string, value: any): void;
    getProperty(name: string): any;
    enableSymbologies(symbologies: Symbology[]): void;
    enableSymbology(symbology: Symbology, enabled: boolean): void;
    enableSymbologiesForCompositeTypes(compositeTypes: CompositeType[]): void;
}


export class BarcodeCountFeedback {
    static get default(): BarcodeCountFeedback;
    success: Feedback;
    failure: Feedback;
    private static fromJSON;
    private constructor();
}
export interface BarcodeCountListener {
    didScan?(barcodeCount: BarcodeCount, session: BarcodeCountSession, getFrameData: () => Promise<FrameData | null>): void;
}
export interface BarcodeCountSessionJSON {
    recognizedBarcodes: string;
    additionalBarcodes: Barcode[];
    frameSequenceId: number;
}
interface PrivateBarcodeCountSession {
    fromJSON(json: BarcodeCountSessionJSON): BarcodeCountSession;
}
export class BarcodeCountSession {
    private _recognizedBarcodes;
    private _additionalBarcodes;
    private _frameSequenceID;
    private static fromJSON;
    get recognizedBarcodes(): {
        [key: number]: TrackedBarcode;
    };
    get additionalBarcodes(): Barcode[];
    get frameSequenceID(): number;
    reset(): Promise<void>;
}
interface PrivateBarcodeCount {
    _context: DataCaptureContext;
    listeners: BarcodeCountListener[];
    isInListenerCallback: boolean;
}


export class BarcodeCount implements DataCaptureMode {
    get isEnabled(): boolean;
    set isEnabled(isEnabled: boolean);
    get context(): DataCaptureContext | null;
    get feedback(): BarcodeCountFeedback;
    set feedback(feedback: BarcodeCountFeedback);
    private type;
    private _feedback;
    private _isEnabled;
    private settings;
    private listeners;
    private _additionalBarcodes;
    private isInListenerCallback;
    private privateContext;
    private get _context();
    private set _context(value);
    private listenerProxy;
    static forContext(context: DataCaptureContext, settings: BarcodeCountSettings): BarcodeCount;
    private constructor();
    applySettings(settings: BarcodeCountSettings): Promise<void>;
    addListener(listener: BarcodeCountListener): void;
    removeListener(listener: BarcodeCountListener): void;
    private checkAndUnsubscribeListeners;
    reset(): Promise<void>;
    startScanningPhase(): void;
    endScanningPhase(): void;
    setBarcodeCountCaptureList(barcodeCountCaptureList: BarcodeCountCaptureList): void;
    setAdditionalBarcodes(barcodes: Barcode[]): Promise<void>;
    clearAdditionalBarcodes(): Promise<void>;
    static get recommendedCameraSettings(): CameraSettings;
    private didChange;
}


export class BarcodeCountCaptureList {
    private listener;
    private targetBarcodes;
    static create(listener: BarcodeCountCaptureListListener, targetBarcodes: TargetBarcode[]): BarcodeCountCaptureList;
    private constructor();
}
interface PrivateBarcodeCountCaptureList {
    targetBarcodes: TargetBarcode[];
    listener: BarcodeCountCaptureListListener;
}
export interface BarcodeCountCaptureListListener {
    didUpdateSession?(barcodeCountCaptureList: BarcodeCountCaptureList, session: BarcodeCountCaptureListSession): void;
}
export interface BarcodeCountCaptureListSessionJSON {
    correctBarcodes: TrackedBarcode[];
    wrongBarcodes: TrackedBarcode[];
    missingBarcodes: TargetBarcode[];
    additionalBarcodes: Barcode[];
}
interface PrivateBarcodeCountCaptureListSession {
    fromJSON(json: BarcodeCountCaptureListSessionJSON): BarcodeCountCaptureListSession;
}
export class BarcodeCountCaptureListSession {
    get correctBarcodes(): TrackedBarcode[];
    get wrongBarcodes(): TrackedBarcode[];
    get missingBarcodes(): TargetBarcode[];
    get additionalBarcodes(): Barcode[];
    private _correctBarcodes;
    private _wrongBarcodes;
    private _missingBarcodes;
    private _additionalBarcodes;
    private static fromJSON;
    private constructor();
}


export class BarcodeCountSettings {
    private symbologies;
    private properties;
    private _filterSettings;
    private _expectsOnlyUniqueBarcodes;
    constructor();
    get expectsOnlyUniqueBarcodes(): boolean;
    get filterSettings(): BarcodeFilterSettings;
    get enabledSymbologies(): Symbology[];
    settingsForSymbology(symbology: Symbology): SymbologySettings;
    enableSymbologies(symbologies: Symbology[]): void;
    enableSymbology(symbology: Symbology, enabled: boolean): void;
    setProperty(name: string, value: any): void;
    getProperty(name: string): any;
}


export interface BarcodeCountViewListener {
    brushForRecognizedBarcode?(view: BarcodeCountView, trackedBarcode: TrackedBarcode): Brush | null;
    brushForUnrecognizedBarcode?(view: BarcodeCountView, trackedBarcode: TrackedBarcode): Brush | null;
    brushForRecognizedBarcodeNotInList?(view: BarcodeCountView, trackedBarcode: TrackedBarcode): Brush | null;
    didTapRecognizedBarcode?(view: BarcodeCountView, trackedBarcode: TrackedBarcode): void;
    didTapUnrecognizedBarcode?(view: BarcodeCountView, trackedBarcode: TrackedBarcode): void;
    didTapFilteredBarcode?(view: BarcodeCountView, filteredBarcode: TrackedBarcode): void;
    didTapRecognizedBarcodeNotInList?(view: BarcodeCountView, trackedBarcode: TrackedBarcode): void;
    didCompleteCaptureList?(view: BarcodeCountView): void;
}
export interface BarcodeCountViewUiListener {
    didTapListButton?(view: BarcodeCountView): void;
    didTapExitButton?(view: BarcodeCountView): void;
    didTapSingleScanButton?(view: BarcodeCountView): void;
}
interface PrivateBarcodeCountView {
    _context: DataCaptureContext;
    _barcodeCount: BarcodeCount;
    toJSON(): object;
}
export class BarcodeCountToolbarSettings {
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


export enum BarcodeCountViewStyle {
    Icon = "icon",
    Dot = "dot"
}
export class BarcodeCountView {
    get uiListener(): BarcodeCountViewUiListener | null;
    set uiListener(listener: BarcodeCountViewUiListener | null);
    get listener(): BarcodeCountViewListener | null;
    set listener(listener: BarcodeCountViewListener | null);
    get shouldShowUserGuidanceView(): boolean;
    set shouldShowUserGuidanceView(newValue: boolean);
    get shouldShowListButton(): boolean;
    set shouldShowListButton(newValue: boolean);
    get shouldShowExitButton(): boolean;
    set shouldShowExitButton(newValue: boolean);
    get shouldShowShutterButton(): boolean;
    set shouldShowShutterButton(newValue: boolean);
    get shouldShowHints(): boolean;
    set shouldShowHints(newValue: boolean);
    get shouldShowClearHighlightsButton(): boolean;
    set shouldShowClearHighlightsButton(newValue: boolean);
    get shouldShowSingleScanButton(): boolean;
    set shouldShowSingleScanButton(newValue: boolean);
    get shouldShowFloatingShutterButton(): boolean;
    set shouldShowFloatingShutterButton(newValue: boolean);
    get shouldShowToolbar(): boolean;
    set shouldShowToolbar(newValue: boolean);
    get shouldShowScanAreaGuides(): boolean;
    set shouldShowScanAreaGuides(newValue: boolean);
    static get defaultRecognizedBrush(): Brush;
    static get defaultUnrecognizedBrush(): Brush;
    static get defaultNotInListBrush(): Brush;
    get recognizedBrush(): Brush | null;
    set recognizedBrush(newValue: Brush | null);
    get unrecognizedBrush(): Brush | null;
    set unrecognizedBrush(newValue: Brush | null);
    get notInListBrush(): Brush | null;
    set notInListBrush(newValue: Brush | null);
    get filterSettings(): BarcodeFilterHighlightSettings | null;
    set filterSettings(newValue: BarcodeFilterHighlightSettings | null);
    get style(): BarcodeCountViewStyle;
    get listButtonAccessibilityHint(): string;
    set listButtonAccessibilityHint(newValue: string);
    get listButtonAccessibilityLabel(): string;
    set listButtonAccessibilityLabel(newValue: string);
    get listButtonContentDescription(): string;
    set listButtonContentDescription(newValue: string);
    get exitButtonAccessibilityHint(): string;
    set exitButtonAccessibilityHint(newValue: string);
    get exitButtonAccessibilityLabel(): string;
    set exitButtonAccessibilityLabel(newValue: string);
    get exitButtonContentDescription(): string;
    set exitButtonContentDescription(newValue: string);
    get shutterButtonAccessibilityHint(): string;
    set shutterButtonAccessibilityHint(newValue: string);
    get shutterButtonAccessibilityLabel(): string;
    set shutterButtonAccessibilityLabel(newValue: string);
    get shutterButtonContentDescription(): string;
    set shutterButtonContentDescription(newValue: string);
    get floatingShutterButtonAccessibilityHint(): string;
    set floatingShutterButtonAccessibilityHint(newValue: string);
    get floatingShutterButtonAccessibilityLabel(): string;
    set floatingShutterButtonAccessibilityLabel(newValue: string);
    get floatingShutterButtonContentDescription(): string;
    set floatingShutterButtonContentDescription(newValue: string);
    get clearHighlightsButtonAccessibilityHint(): string;
    set clearHighlightsButtonAccessibilityHint(newValue: string);
    get clearHighlightsButtonAccessibilityLabel(): string;
    set clearHighlightsButtonAccessibilityLabel(newValue: string);
    get clearHighlightsButtonContentDescription(): string;
    set clearHighlightsButtonContentDescription(newValue: string);
    get singleScanButtonAccessibilityHint(): string;
    set singleScanButtonAccessibilityHint(newValue: string);
    get singleScanButtonAccessibilityLabel(): string;
    set singleScanButtonAccessibilityLabel(newValue: string);
    get singleScanButtonContentDescription(): string;
    set singleScanButtonContentDescription(newValue: string);
    get clearHighlightsButtonText(): string;
    set clearHighlightsButtonText(newValue: string);
    get exitButtonText(): string;
    set exitButtonText(newValue: string);
    get textForTapShutterToScanHint(): string;
    set textForTapShutterToScanHint(newValue: string);
    get textForScanningHint(): string;
    set textForScanningHint(newValue: string);
    get textForMoveCloserAndRescanHint(): string;
    set textForMoveCloserAndRescanHint(newValue: string);
    get textForMoveFurtherAndRescanHint(): string;
    set textForMoveFurtherAndRescanHint(newValue: string);
    get textForUnrecognizedBarcodesDetectedHint(): string;
    set textForUnrecognizedBarcodesDetectedHint(newValue: string);
    private _barcodeCount;
    private _context;
    private viewProxy;
    private _uiListener;
    private _listener;
    private _shouldShowUserGuidanceView;
    private _shouldShowListButton;
    private _shouldShowExitButton;
    private _shouldShowShutterButton;
    private _shouldShowHints;
    private _shouldShowClearHighlightsButton;
    private _shouldShowSingleScanButton;
    private _shouldShowFloatingShutterButton;
    private _shouldShowToolbar;
    private _shouldShowScanAreaGuides;
    private _recognizedBrush;
    private _unrecognizedBrush;
    private _notInListBrush;
    private _filterSettings;
    private _style;
    private _listButtonAccessibilityHint;
    private _listButtonAccessibilityLabel;
    private _listButtonContentDescription;
    private _exitButtonAccessibilityHint;
    private _exitButtonAccessibilityLabel;
    private _exitButtonContentDescription;
    private _shutterButtonAccessibilityHint;
    private _shutterButtonAccessibilityLabel;
    private _shutterButtonContentDescription;
    private _floatingShutterButtonAccessibilityHint;
    private _floatingShutterButtonAccessibilityLabel;
    private _floatingShutterButtonContentDescription;
    private _clearHighlightsButtonAccessibilityHint;
    private _clearHighlightsButtonAccessibilityLabel;
    private _clearHighlightsButtonContentDescription;
    private _singleScanButtonAccessibilityHint;
    private _singleScanButtonAccessibilityLabel;
    private _singleScanButtonContentDescription;
    private _clearHighlightsButtonText;
    private _exitButtonText;
    private _textForTapShutterToScanHint;
    private _textForScanningHint;
    private _textForMoveCloserAndRescanHint;
    private _textForMoveFurtherAndRescanHint;
    private _textForUnrecognizedBarcodesDetectedHint;
    private _toolbarSettings;
    private htmlElement;
    private _htmlElementState;
    private set htmlElementState(value);
    private get htmlElementState();
    private scrollListener;
    private domObserver;
    static forContextWithMode(context: DataCaptureContext, barcodeCount: BarcodeCount): BarcodeCountView;
    static forContextWithModeAndStyle(context: DataCaptureContext, barcodeCount: BarcodeCount, style: BarcodeCountViewStyle): BarcodeCountView;
    constructor({ context, barcodeCount, style }: {
        context: DataCaptureContext;
        barcodeCount: BarcodeCount;
        style: BarcodeCountViewStyle;
    });
    private orientationChangeListener;
    clearHighlights(): Promise<void>;
    setToolbarSettings(settings: BarcodeCountToolbarSettings): void;
    private updateNative;
    connectToElement(element: HTMLElement): void;
    detachFromElement(): void;
    setFrame(frame: Rect, isUnderContent?: boolean): Promise<void>;
    show(): Promise<void>;
    hide(): Promise<void>;
    private subscribeToChangesOnHTMLElement;
    private unsubscribeFromChangesOnHTMLElement;
    private elementDidChange;
    private updatePositionAndSize;
    private _show;
    private _hide;
}


export interface BarcodeFilterSettingsJSON {
    excludeEan13: boolean;
    excludeUpca: boolean;
    excludedCodesRegex: string;
    excludedSymbolCounts: {
        [key in Symbology]?: number[];
    };
    excludedSymbologies: Symbology[];
}
export class BarcodeFilterSettings {
    get excludeEan13(): boolean;
    set excludeEan13(value: boolean);
    get excludeUpca(): boolean;
    set excludeUpca(value: boolean);
    get excludedCodesRegex(): string;
    set excludedCodesRegex(value: string);
    get excludedSymbologies(): Symbology[];
    set excludedSymbologies(values: Symbology[]);
    private _excludeEan13;
    private _excludeUpca;
    private _excludedCodesRegex;
    private _excludedSymbolCounts;
    private _excludedSymbologies;
    private static fromJSON;
    private constructor();
    getExcludedSymbolCountsForSymbology(symbology: Symbology): number[];
    setExcludedSymbolCounts(excludedSymbolCounts: number[], symbology: Symbology): void;
}
export enum BarcodeFilterHighlightType {
    Brush = "brush"
}
interface PrivateBarcodeFilterSettings {
    fromJSON(json: BarcodeFilterSettingsJSON): BarcodeFilterSettings;
}
export interface BarcodeFilterHighlightSettings {
    readonly highlightType: BarcodeFilterHighlightType;
    readonly brush: Brush | null;
}
export class BarcodeFilterHighlightSettingsBrush implements BarcodeFilterHighlightSettings {
    private _highlightType;
    private _brush;
    static create(brush: Brush): BarcodeFilterHighlightSettingsBrush;
    private constructor();
    get highlightType(): BarcodeFilterHighlightType;
    get brush(): Brush | null;
}


interface BarcodeSelectionListenerProxy {
    getCount(barcode: Barcode): Promise<number>;
    reset(): Promise<void>;
}
export class BarcodeSelectionFeedback {
    selection: Feedback;
    static get default(): BarcodeSelectionFeedback;
}
export interface BarcodeSelectionStrategy {
}
class PrivateBarcodeSelectionStrategy {
    static fromJSON(json: {
        type: string;
    }): BarcodeSelectionStrategy;
}
export class BarcodeSelectionAutoSelectionStrategy implements BarcodeSelectionStrategy {
    private type;
    static get autoSelectionStrategy(): BarcodeSelectionAutoSelectionStrategy;
}
export class BarcodeSelectionManualSelectionStrategy implements BarcodeSelectionStrategy {
    private type;
    static get manualSelectionStrategy(): BarcodeSelectionManualSelectionStrategy;
}
export enum BarcodeSelectionFreezeBehavior {
    Manual = "manual",
    ManualAndAutomatic = "manualAndAutomatic"
}
export enum BarcodeSelectionTapBehavior {
    ToggleSelection = "toggleSelection",
    RepeatSelection = "repeatSelection"
}
export interface BarcodeSelectionType {
}
class PrivateBarcodeSelectionType {
    static fromJSON(json: {
        type: string;
    }): BarcodeSelectionType;
}
export class BarcodeSelectionAimerSelection implements BarcodeSelectionType {
    private type;
    selectionStrategy: BarcodeSelectionStrategy;
    static get aimerSelection(): BarcodeSelectionAimerSelection;
    private constructor();
}
export class BarcodeSelectionTapSelection implements BarcodeSelectionType {
    private type;
    freezeBehavior: BarcodeSelectionFreezeBehavior;
    tapBehavior: BarcodeSelectionTapBehavior;
    static get tapSelection(): BarcodeSelectionTapSelection;
    static withFreezeBehaviorAndTapBehavior(freezeBehavior: BarcodeSelectionFreezeBehavior, tapBehavior: BarcodeSelectionTapBehavior): BarcodeSelectionTapSelection;
}
export class BarcodeSelectionSession {
    private _selectedBarcodes;
    private _newlySelectedBarcodes;
    private _newlyUnselectedBarcodes;
    private _frameSequenceID;
    private listenerProxy;
    get selectedBarcodes(): Barcode[];
    get newlySelectedBarcodes(): Barcode[];
    get newlyUnselectedBarcodes(): Barcode[];
    get frameSequenceID(): number;
    private static fromJSON;
    getCount(barcode: Barcode): Promise<number>;
    reset(): Promise<void>;
}
export interface BarcodeSelectionSessionJSON {
    selectedBarcodes: BarcodeJSON[];
    newlySelectedBarcodes: BarcodeJSON[];
    newlyUnselectedBarcodes: BarcodeJSON[];
    frameSequenceId: number;
}
interface PrivateBarcodeSelectionSession {
    listenerProxy: BarcodeSelectionListenerProxy;
    fromJSON(json: BarcodeSelectionSessionJSON): BarcodeSelectionSession;
}
export interface BarcodeSelectionListener {
    didUpdateSelection?(barcodeSelection: BarcodeSelection, session: BarcodeSelectionSession, getFrameData: () => Promise<FrameData>): void;
    didUpdateSession?(barcodeSelection: BarcodeSelection, session: BarcodeSelectionSession, getFrameData: () => Promise<FrameData>): void;
}
interface PrivateBarcodeSelectionBasicOverlay {
    toJSON(): object;
}
export enum BarcodeSelectionBasicOverlayStyle {
    Frame = "frame",
    Dot = "dot"
}
export class BarcodeSelectionBasicOverlay implements DataCaptureOverlay {
    private type;
    private barcodeSelection;
    private _trackedBrush;
    private _aimedBrush;
    private _selectedBrush;
    private _selectingBrush;
    get trackedBrush(): Brush;
    set trackedBrush(newBrush: Brush);
    get aimedBrush(): Brush;
    set aimedBrush(newBrush: Brush);
    get selectedBrush(): Brush;
    set selectedBrush(newBrush: Brush);
    get selectingBrush(): Brush;
    set selectingBrush(newBrush: Brush);
    private _style;
    get style(): BarcodeSelectionBasicOverlayStyle;
    private _shouldShowScanAreaGuides;
    private _shouldShowHints;
    private _viewfinder;
    get viewfinder(): Viewfinder;
    get shouldShowScanAreaGuides(): boolean;
    set shouldShowScanAreaGuides(shouldShow: boolean);
    get shouldShowHints(): boolean;
    set shouldShowHints(shouldShow: boolean);
    static withBarcodeSelection(barcodeSelection: BarcodeSelection): BarcodeSelectionBasicOverlay;
    static withBarcodeSelectionForView(barcodeSelection: BarcodeSelection, view: DataCaptureView | null): BarcodeSelectionBasicOverlay;
    static withBarcodeSelectionForViewWithStyle(barcodeSelection: BarcodeSelection, view: DataCaptureView | null, style: BarcodeSelectionBasicOverlayStyle): BarcodeSelectionBasicOverlay;
    private constructor();
}


interface PrivateBarcodeSelection extends PrivateDataCaptureMode {
    _context: DataCaptureContext | null;
    didChange: () => Promise<void>;
}
export class BarcodeSelection implements DataCaptureMode {
    get isEnabled(): boolean;
    set isEnabled(isEnabled: boolean);
    get context(): DataCaptureContext | null;
    get feedback(): BarcodeSelectionFeedback;
    set feedback(feedback: BarcodeSelectionFeedback);
    get pointOfInterest(): PointWithUnit | null;
    set pointOfInterest(pointOfInterest: PointWithUnit | null);
    static get recommendedCameraSettings(): CameraSettings;
    private type;
    private _isEnabled;
    private _feedback;
    private _pointOfInterest;
    private settings;
    private _context;
    private listeners;
    private listenerProxy;
    private modeProxy;
    private isInListenerCallback;
    static forContext(context: DataCaptureContext | null, settings: BarcodeSelectionSettings): BarcodeSelection;
    applySettings(settings: BarcodeSelectionSettings): Promise<void>;
    addListener(listener: BarcodeSelectionListener): void;
    removeListener(listener: BarcodeSelectionListener): void;
    reset(): Promise<void>;
    unfreezeCamera(): Promise<void>;
    private didChange;
}


export class BarcodeSelectionSettings {
    codeDuplicateFilter: number;
    singleBarcodeAutoDetection: boolean;
    selectionType: BarcodeSelectionType;
    private properties;
    private symbologies;
    get enabledSymbologies(): Symbology[];
    constructor();
    settingsForSymbology(symbology: Symbology): SymbologySettings;
    setProperty(name: string, value: any): void;
    getProperty(name: string): any;
    enableSymbologies(symbologies: Symbology[]): void;
    enableSymbology(symbology: Symbology, enabled: boolean): void;
}


export interface BarcodeTrackingSessionJSON {
    addedTrackedBarcodes: TrackedBarcodeJSON[];
    removedTrackedBarcodes: string[];
    updatedTrackedBarcodes: TrackedBarcodeJSON[];
    trackedBarcodes: {
        [key: string]: TrackedBarcodeJSON;
    };
    frameSequenceId: number;
}
interface PrivateBarcodeTrackingSession {
    fromJSON(json: BarcodeTrackingSessionJSON): BarcodeTrackingSession;
}
export class BarcodeTrackingSession {
    private _addedTrackedBarcodes;
    private _removedTrackedBarcodes;
    private _updatedTrackedBarcodes;
    private _trackedBarcodes;
    private _frameSequenceID;
    private listenerProxy;
    get addedTrackedBarcodes(): TrackedBarcode[];
    get removedTrackedBarcodes(): string[];
    get updatedTrackedBarcodes(): TrackedBarcode[];
    get trackedBarcodes(): {
        [key: string]: TrackedBarcode;
    };
    get frameSequenceID(): number;
    private static fromJSON;
    reset(): Promise<void>;
}
export interface BarcodeTrackingListener {
    didUpdateSession?(barcodeTracking: BarcodeTracking, session: BarcodeTrackingSession, getFrameData: () => Promise<FrameData>): void;
}
export interface BarcodeTrackingBasicOverlayListener {
    brushForTrackedBarcode?(overlay: BarcodeTrackingBasicOverlay, trackedBarcode: TrackedBarcode): Optional<Brush>;
    didTapTrackedBarcode?(overlay: BarcodeTrackingBasicOverlay, trackedBarcode: TrackedBarcode): void;
}
interface PrivateBarcodeTrackingBasicOverlay {
    toJSON(): object;
}
export enum BarcodeTrackingBasicOverlayStyle {
    Frame = "frame",
    Dot = "dot",
    Legacy = "legacy"
}
export class BarcodeTrackingBasicOverlay implements DataCaptureOverlay {
    private type;
    private barcodeTracking;
    static get defaultBrush(): Brush;
    private _defaultBrush;
    get brush(): Optional<Brush>;
    set brush(newBrush: Optional<Brush>);
    private _shouldShowScanAreaGuides;
    listener: Optional<BarcodeTrackingBasicOverlayListener>;
    private _proxy;
    private get proxy();
    get shouldShowScanAreaGuides(): boolean;
    set shouldShowScanAreaGuides(shouldShow: boolean);
    private _style;
    get style(): BarcodeTrackingBasicOverlayStyle;
    static withBarcodeTracking(barcodeTracking: BarcodeTracking): BarcodeTrackingBasicOverlay;
    static withBarcodeTrackingForView(barcodeTracking: BarcodeTracking, view: Optional<DataCaptureView>): BarcodeTrackingBasicOverlay;
    static withBarcodeTrackingForViewWithStyle(barcodeTracking: BarcodeTracking, view: DataCaptureView | null, style: BarcodeTrackingBasicOverlayStyle): BarcodeTrackingBasicOverlay;
    private constructor();
    setBrushForTrackedBarcode(brush: Brush, trackedBarcode: TrackedBarcode): Promise<void>;
    clearTrackedBarcodeBrushes(): Promise<void>;
    private initialize;
}
export interface BarcodeTrackingAdvancedOverlayListener {
    viewForTrackedBarcode?(overlay: BarcodeTrackingAdvancedOverlay, trackedBarcode: TrackedBarcode): Promise<Optional<TrackedBarcodeView>>;
    anchorForTrackedBarcode?(overlay: BarcodeTrackingAdvancedOverlay, trackedBarcode: TrackedBarcode): Anchor;
    offsetForTrackedBarcode?(overlay: BarcodeTrackingAdvancedOverlay, trackedBarcode: TrackedBarcode): PointWithUnit;
    didTapViewForTrackedBarcode?(overlay: BarcodeTrackingAdvancedOverlay, trackedBarcode: TrackedBarcode): void;
}
interface PrivateBarcodeTrackingAdvancedOverlay {
    toJSON(): object;
}
export class BarcodeTrackingAdvancedOverlay implements DataCaptureOverlay {
    private type;
    private _shouldShowScanAreaGuides;
    get shouldShowScanAreaGuides(): boolean;
    set shouldShowScanAreaGuides(shouldShow: boolean);
    private barcodeTracking;
    listener: Optional<BarcodeTrackingAdvancedOverlayListener>;
    private _proxy;
    private get proxy();
    static withBarcodeTrackingForView(barcodeTracking: BarcodeTracking, view: Optional<DataCaptureView>): BarcodeTrackingAdvancedOverlay;
    private constructor();
    setViewForTrackedBarcode(view: Promise<Optional<TrackedBarcodeView>>, trackedBarcode: TrackedBarcode): Promise<void>;
    setAnchorForTrackedBarcode(anchor: Anchor, trackedBarcode: TrackedBarcode): Promise<void>;
    setOffsetForTrackedBarcode(offset: PointWithUnit, trackedBarcode: TrackedBarcode): Promise<void>;
    clearTrackedBarcodeViews(): Promise<void>;
    private initialize;
}


interface PrivateBarcodeTracking extends PrivateDataCaptureMode {
    _context: Optional<DataCaptureContext>;
    didChange: () => Promise<void>;
}
export class BarcodeTracking implements DataCaptureMode {
    get isEnabled(): boolean;
    set isEnabled(isEnabled: boolean);
    get context(): Optional<DataCaptureContext>;
    static get recommendedCameraSettings(): CameraSettings;
    private type;
    private _isEnabled;
    private settings;
    private _context;
    private listeners;
    private listenerProxy;
    private isInListenerCallback;
    static forContext(context: Optional<DataCaptureContext>, settings: BarcodeTrackingSettings): BarcodeTracking;
    applySettings(settings: BarcodeTrackingSettings): Promise<void>;
    addListener(listener: BarcodeTrackingListener): void;
    removeListener(listener: BarcodeTrackingListener): void;
    private didChange;
}


export enum BarcodeTrackingScenario {
    A = "A",
    B = "B"
}
export class BarcodeTrackingSettings {
    private scenario;
    private properties;
    private symbologies;
    get enabledSymbologies(): Symbology[];
    static forScenario(scenario: BarcodeTrackingScenario): BarcodeTrackingSettings;
    constructor();
    settingsForSymbology(symbology: Symbology): SymbologySettings;
    setProperty(name: string, value: any): void;
    getProperty(name: string): any;
    enableSymbologies(symbologies: Symbology[]): void;
    enableSymbology(symbology: Symbology, enabled: boolean): void;
}

 
export class BarcodeCaptureListenerProxy {
    private static capacitorExec;
    private barcodeCapture;
    static forBarcodeCapture(barcodeCapture: BarcodeCapture): BarcodeCaptureListenerProxy;
    private constructor();
    private initialize;
    reset(): Promise<void>;
    addListener(listener: BarcodeCaptureListener): void;
    removeListener(listener: BarcodeCaptureListener): void;
    private subscribeListener;
    private notifyListeners;
}


export class BarcodeCountListenerProxy {
    private barcodeCount;
    private _barcodeCountCaptureList;
    static forBarcodeCount(barcodeCount: BarcodeCount): BarcodeCountListenerProxy;
    constructor();
    private initialize;
    reset(): Promise<void>;
    resetSession(): Promise<void>;
    subscribeListener(): void;
    unsubscribeListener(): void;
    startScanningPhase(): void;
    endScanningPhase(): void;
    setBarcodeCountCaptureList(barcodeCountCaptureList: BarcodeCountCaptureList): void;
    private notifyListeners;
}


export class BarcodeCountViewProxy {
    private view;
    private barcodeCount;
    private isInListenerCallback;
    static forBarcodeCount(view: BarcodeCountView): BarcodeCountViewProxy;
    private constructor();
    update(): Promise<void>;
    private create;
    dispose(): void;
    setUiListener(listener: BarcodeCountViewUiListener | null): void;
    setListener(listener: BarcodeCountViewListener | null): void;
    clearHighlights(): Promise<void>;
    setPositionAndSize(top: number, left: number, width: number, height: number, shouldBeUnderWebView: boolean): Promise<void>;
    show(): Promise<void>;
    hide(): Promise<void>;
    private subscribeListeners;
    private unsubscribeListeners;
    private singleScanButtonTappedHandler;
    private listButtonTappedHandler;
    private exitButtonTappedHandler;
    private filteredBarcodeTappedHandler;
    private recognizedBarcodeNotInListTappedHandler;
    private recognizedBarcodeTappedHandler;
    private unrecognizedBarcodeTappedHandler;
    private captureListCompletedHandler;
    private notifyListeners;
}

 
export class BarcodeSelectionListenerProxy {
    private static exec;
    private barcodeSelection;
    static forBarcodeSelection(barcodeSelection: BarcodeSelection): BarcodeSelectionListenerProxy;
    getCount(barcode: Barcode): Promise<number>;
    reset(): Promise<void>;
    private initialize;
    private subscribeListener;
    private notifyListeners;
}

export class BarcodeSelectionProxy {
    private static exec;
    reset(): Promise<void>;
    unfreezeCamera(): Promise<void>;
}


export class BarcodeTrackingAdvancedOverlayProxy {
    private static capacitorExec;
    private overlay;
    static forOverlay(overlay: BarcodeTrackingAdvancedOverlay): BarcodeTrackingAdvancedOverlayProxy;
    setViewForTrackedBarcode(view: Promise<Optional<TrackedBarcodeView>>, trackedBarcode: TrackedBarcode): Promise<void>;
    private setViewForTrackedBarcodeSync;
    setAnchorForTrackedBarcode(anchor: Anchor, trackedBarcode: TrackedBarcode): Promise<void>;
    setOffsetForTrackedBarcode(offset: PointWithUnit, trackedBarcode: TrackedBarcode): Promise<void>;
    clearTrackedBarcodeViews(): Promise<void>;
    private subscribeListener;
    private notifyListeners;
    private initialize;
}


export class BarcodeTrackingBasicOverlayProxy {
    private static capacitorExec;
    private overlay;
    static forOverlay(overlay: BarcodeTrackingBasicOverlay): BarcodeTrackingBasicOverlayProxy;
    setBrushForTrackedBarcode(brush: Brush, trackedBarcode: TrackedBarcode): Promise<void>;
    clearTrackedBarcodeBrushes(): Promise<void>;
    private subscribeListener;
    private notifyListeners;
    private initialize;
}

 
export class BarcodeTrackingListenerProxy {
    private static capacitorExec;
    private barcodeTracking;
    static forBarcodeTracking(barcodeTracking: BarcodeTracking): BarcodeTrackingListenerProxy;
    private initialize;
    private subscribeListener;
    reset(): Promise<void>;
    private notifyListeners;
}


interface PrivateTrackedBarcodeView {
    data: string;
    toJSON(): string;
    getEncodedImageData(element: HTMLElement): string;
}
export interface TrackedBarcodeViewOptions {
    size?: Size;
    scale?: number;
}
export class TrackedBarcodeView {
    private data;
    private options;
    static withHTMLElement(element: HTMLElement, options: Optional<TrackedBarcodeViewOptions>): Promise<TrackedBarcodeView>;
    static withBase64EncodedData(data: string, options: Optional<TrackedBarcodeViewOptions>): Promise<TrackedBarcodeView>;
    private static getEncodedImageData;
    private static getSize;
    private static getSVGDataForElement;
    private static getCanvasWithSize;
    private static getBase64DataForSVG;
    private constructor();
}


export enum FrameSourceState {
    On = "on",
    Off = "off",
    Starting = "starting",
    Stopping = "stopping",
    Standby = "standby",
    BootingUp = "bootingUp",
    WakingUp = "wakingUp",
    GoingToSleep = "goingToSleep",
    ShuttingDown = "shuttingDown"
}
export enum TorchState {
    On = "on",
    Off = "off",
    Auto = "auto"
}
export enum CameraPosition {
    WorldFacing = "worldFacing",
    UserFacing = "userFacing",
    Unspecified = "unspecified"
}
export enum VideoResolution {
    Auto = "auto",
    HD = "hd",
    FullHD = "fullHd",
    UHD4K = "uhd4k"
}
export enum FocusRange {
    Full = "full",
    Near = "near",
    Far = "far"
}
export enum FocusGestureStrategy {
    None = "none",
    Manual = "manual",
    ManualUntilCapture = "manualUntilCapture",
    AutoOnLocation = "autoOnLocation"
}
export interface FrameSourceListener {
    didChangeState?(frameSource: FrameSource, newState: FrameSourceState): void;
}
export interface FrameSource {
    readonly desiredState: FrameSourceState;
    switchToDesiredState(desiredState: FrameSourceState): Promise<void>;
    getCurrentState(): Promise<FrameSourceState>;
    addListener(listener: FrameSourceListener): void;
    removeListener(listener: FrameSourceListener): void;
}
export interface CameraSettingsJSON {
    preferredResolution: string;
    zoomFactor: number;
    focusRange: string;
    zoomGestureZoomFactor: number;
    focusGestureStrategy: string;
    shouldPreferSmoothAutoFocus: boolean;
    api: number;
}
interface PrivateCameraSettings {
    fromJSON(json: CameraSettingsJSON): CameraSettings;
}
export class CameraSettings {
    preferredResolution: VideoResolution;
    zoomFactor: number;
    zoomGestureZoomFactor: number;
    private api;
    private focus;
    get focusRange(): FocusRange;
    set focusRange(newRange: FocusRange);
    get focusGestureStrategy(): FocusGestureStrategy;
    set focusGestureStrategy(newStrategy: FocusGestureStrategy);
    get shouldPreferSmoothAutoFocus(): boolean;
    set shouldPreferSmoothAutoFocus(newShouldPreferSmoothAutoFocus: boolean);
    private static fromJSON;
    constructor();
    constructor(settings: CameraSettings);
    setProperty(name: string, value: any): void;
    getProperty(name: string): any;
}
export interface FrameDataJSON {
    imageBuffers: ImageBufferJSON[];
    orientation: number;
}
export interface ImageBufferJSON {
    width: number;
    height: number;
    data: string;
}
interface PrivateImageBuffer {
    _width: number;
    _height: number;
    _data: string;
}
export interface FrameData {
    readonly imageBuffers: ImageBuffer[];
    readonly orientation: number;
}
export class ImageBuffer {
    private _width;
    private _height;
    private _data;
    get width(): number;
    get height(): number;
    get data(): string;
}
class PrivateFrameData implements FrameData {
    private _imageBuffers;
    private _orientation;
    get imageBuffers(): ImageBuffer[];
    get orientation(): number;
    static fromJSON(json: FrameDataJSON): FrameData;
}


interface PrivateCamera {
    context: Optional<DataCaptureContext>;
    position: CameraPosition;
    _desiredState: FrameSourceState;
    desiredTorchState: TorchState;
    settings: CameraSettings;
    listeners: FrameSourceListener[];
    _proxy: CameraProxy;
    proxy: CameraProxy;
    initialize: () => void;
    didChange: () => Promise<void>;
}
export class Camera implements FrameSource {
    private type;
    private settings;
    private position;
    private _desiredTorchState;
    private _desiredState;
    private listeners;
    private context;
    private _proxy;
    private get proxy();
    static get default(): Optional<Camera>;
    static atPosition(cameraPosition: CameraPosition): Optional<Camera>;
    get desiredState(): FrameSourceState;
    set desiredTorchState(desiredTorchState: TorchState);
    get desiredTorchState(): TorchState;
    switchToDesiredState(state: FrameSourceState): Promise<void>;
    getCurrentState(): Promise<FrameSourceState>;
    getIsTorchAvailable(): Promise<boolean>;
    addListener(listener: Optional<FrameSourceListener>): void;
    removeListener(listener: Optional<FrameSourceListener>): void;
    applySettings(settings: CameraSettings): Promise<void>;
    private initialize;
    private didChange;
}


 
export class CameraProxy {
    private camera;
    static forCamera(camera: Camera): CameraProxy;
    static getLastFrame(): Promise<FrameData>;
    static getLastFrameOrNull(): Promise<FrameData | null>;
    getCurrentState(): Promise<FrameSourceState>;
    getIsTorchAvailable(): Promise<boolean>;
}

 
export class DataCaptureContextProxy {
    private context;
    static forDataCaptureContext(context: DataCaptureContext): DataCaptureContextProxy;
    updateContextFromJSON(): Promise<void>;
    dispose(): void;
    private initialize;
    private initializeContextFromJSON;
    private subscribeListener;
    private notifyListeners;
}


export class DataCaptureViewProxy {
    private view;
    static forDataCaptureView(view: DataCaptureView): DataCaptureViewProxy;
    setPositionAndSize(top: number, left: number, width: number, height: number, shouldBeUnderWebView: boolean): Promise<void>;
    show(): Promise<void>;
    hide(): Promise<void>;
    viewPointForFramePoint(point: Point): Promise<Point>;
    viewQuadrilateralForFrameQuadrilateral(quadrilateral: Quadrilateral): Promise<Quadrilateral>;
    private subscribeListener;
    private notifyListeners;
    private initialize;
}

 
export class FeedbackProxy {
    private feedback;
    static forFeedback(feedback: Feedback): FeedbackProxy;
    emit(): void;
}


export interface PointJSON {
    x: number;
    y: number;
}
interface PrivatePoint {
    fromJSON(json: PointJSON): Point;
}
export class Point {
    private _x;
    private _y;
    get x(): number;
    get y(): number;
    private static fromJSON;
    constructor(x: number, y: number);
}
export interface QuadrilateralJSON {
    topLeft: PointJSON;
    topRight: PointJSON;
    bottomRight: PointJSON;
    bottomLeft: PointJSON;
}
interface PrivateQuadrilateral {
    fromJSON(json: QuadrilateralJSON): Quadrilateral;
}
export class Quadrilateral {
    private _topLeft;
    private _topRight;
    private _bottomRight;
    private _bottomLeft;
    get topLeft(): Point;
    get topRight(): Point;
    get bottomRight(): Point;
    get bottomLeft(): Point;
    private static fromJSON;
    constructor(topLeft: Point, topRight: Point, bottomRight: Point, bottomLeft: Point);
}
export enum MeasureUnit {
    DIP = "dip",
    Pixel = "pixel",
    Fraction = "fraction"
}
export interface NumberWithUnitJSON {
    value: number;
    unit: string;
}
interface PrivateNumberWithUnit {
    fromJSON(json: NumberWithUnitJSON): NumberWithUnit;
}
export class NumberWithUnit {
    private _value;
    private _unit;
    get value(): number;
    get unit(): MeasureUnit;
    private static fromJSON;
    constructor(value: number, unit: MeasureUnit);
}
export interface PointWithUnitJSON {
    x: NumberWithUnitJSON;
    y: NumberWithUnitJSON;
}
interface PrivatePointWithUnit {
    readonly zero: PointWithUnit;
    fromJSON(json: PointWithUnitJSON): PointWithUnit;
}
export class PointWithUnit {
    private _x;
    private _y;
    get x(): NumberWithUnit;
    get y(): NumberWithUnit;
    private static fromJSON;
    private static get zero();
    constructor(x: NumberWithUnit, y: NumberWithUnit);
}
export class Rect {
    private _origin;
    private _size;
    get origin(): Point;
    get size(): Size;
    constructor(origin: Point, size: Size);
}
export class RectWithUnit {
    private _origin;
    private _size;
    get origin(): PointWithUnit;
    get size(): SizeWithUnit;
    constructor(origin: PointWithUnit, size: SizeWithUnit);
}
export class SizeWithUnit {
    private _width;
    private _height;
    get width(): NumberWithUnit;
    get height(): NumberWithUnit;
    constructor(width: NumberWithUnit, height: NumberWithUnit);
}
export interface SizeJSON {
    width: number;
    height: number;
}
export class Size {
    private _width;
    private _height;
    get width(): number;
    get height(): number;
    private static fromJSON;
    constructor(width: number, height: number);
}
export class SizeWithAspect {
    private _size;
    private _aspect;
    get size(): NumberWithUnit;
    get aspect(): number;
    constructor(size: NumberWithUnit, aspect: number);
}
export enum SizingMode {
    WidthAndHeight = "widthAndHeight",
    WidthAndAspectRatio = "widthAndAspectRatio",
    HeightAndAspectRatio = "heightAndAspectRatio",
    ShorterDimensionAndAspectRatio = "shorterDimensionAndAspectRatio"
}
export interface SizeWithUnitAndAspectJSON {
    width?: NumberWithUnitJSON;
    height?: NumberWithUnitJSON;
    shorterDimension?: NumberWithUnitJSON;
    aspect?: number;
}
interface PrivateSizeWithUnitAndAspect {
    fromJSON(json: SizeWithUnitAndAspectJSON): SizeWithUnitAndAspect;
}
export class SizeWithUnitAndAspect {
    private _widthAndHeight;
    private _widthAndAspectRatio;
    private _heightAndAspectRatio;
    private _shorterDimensionAndAspectRatio;
    get widthAndHeight(): Optional<SizeWithUnit>;
    get widthAndAspectRatio(): Optional<SizeWithAspect>;
    get heightAndAspectRatio(): Optional<SizeWithAspect>;
    get shorterDimensionAndAspectRatio(): SizeWithAspect | null;
    get sizingMode(): SizingMode;
    private static sizeWithWidthAndHeight;
    private static sizeWithWidthAndAspectRatio;
    private static sizeWithHeightAndAspectRatio;
    private static sizeWithShorterDimensionAndAspectRatio;
    private static fromJSON;
    toJSON(): object;
}
export interface MarginsWithUnitJSON {
    left: NumberWithUnitJSON;
    right: NumberWithUnitJSON;
    top: NumberWithUnitJSON;
    bottom: NumberWithUnitJSON;
}
interface PrivateMarginsWithUnit {
    readonly zero: MarginsWithUnit;
    fromJSON(json: MarginsWithUnitJSON): MarginsWithUnit;
}
export class MarginsWithUnit {
    private _left;
    private _right;
    private _top;
    private _bottom;
    get left(): NumberWithUnit;
    get right(): NumberWithUnit;
    get top(): NumberWithUnit;
    get bottom(): NumberWithUnit;
    private static fromJSON;
    private static get zero();
    constructor(left: NumberWithUnit, right: NumberWithUnit, top: NumberWithUnit, bottom: NumberWithUnit);
}
type ColorJSON = string;
interface PrivateColor {
    fromJSON(json: ColorJSON): Color;
}
export class Color {
    private hexadecimalString;
    get redComponent(): string;
    get greenComponent(): string;
    get blueComponent(): string;
    get alphaComponent(): string;
    get red(): number;
    get green(): number;
    get blue(): number;
    get alpha(): number;
    static fromHex(hex: string): Color;
    static fromRGBA(red: number, green: number, blue: number, alpha?: number): Color;
    private static hexToNumber;
    private static fromJSON;
    private static numberToHex;
    private static normalizeHex;
    private static normalizeAlpha;
    private constructor();
    withAlpha(alpha: number): Color;
    toJSON(): string;
}
export enum Orientation {
    Unknown = "unknown",
    Portrait = "portrait",
    PortraitUpsideDown = "portraitUpsideDown",
    LandscapeRight = "landscapeRight",
    LandscapeLeft = "landscapeLeft"
}
export enum Direction {
    None = "none",
    Horizontal = "horizontal",
    LeftToRight = "leftToRight",
    RightToLeft = "rightToLeft",
    Vertical = "vertical",
    TopToBottom = "topToBottom",
    BottomToTop = "bottomToTop"
}


export interface DataCaptureContextListener {
    didChangeStatus?(context: DataCaptureContext, contextStatus: ContextStatus): void;
    didStartObservingContext?(context: DataCaptureContext): void;
}
interface ContextStatusJSON {
    code: number;
    isValid: boolean;
    message: string;
}
interface PrivateContextStatus {
    fromJSON(json: ContextStatusJSON): ContextStatus;
}
export class ContextStatus {
    private _message;
    private _code;
    private _isValid;
    private static fromJSON;
    get message(): string;
    get code(): number;
    get isValid(): boolean;
}


interface PrivateDataCaptureMode {
    _context: Optional<DataCaptureContext>;
}
export interface DataCaptureMode {
    isEnabled: boolean;
    readonly context: Optional<DataCaptureContext>;
}
interface PrivateDataCaptureComponent {
    _context: DataCaptureContext;
}
export interface DataCaptureComponent {
    readonly id: string;
}
interface PrivateDataCaptureContext {
    proxy: DataCaptureContextProxy;
    modes: [DataCaptureMode];
    components: [DataCaptureComponent];
    initialize: () => void;
    update: () => Promise<void>;
    addComponent: (component: DataCaptureComponent) => Promise<void>;
}
export interface DataCaptureContextCreationOptions {
    deviceName?: Optional<string>;
}
export class DataCaptureContextSettings {
    constructor();
    setProperty(name: string, value: any): void;
    getProperty(name: string): any;
}
export class DataCaptureContext {
    private licenseKey;
    private deviceName;
    private framework;
    private frameworkVersion;
    private settings;
    private _frameSource;
    private view;
    private modes;
    private components;
    private proxy;
    private listeners;
    get frameSource(): Optional<FrameSource>;
    static get deviceID(): Optional<string>;
    static forLicenseKey(licenseKey: string): DataCaptureContext;
    static forLicenseKeyWithSettings(licenseKey: string, settings: DataCaptureContextSettings | null): DataCaptureContext;
    static forLicenseKeyWithOptions(licenseKey: string, options: Optional<DataCaptureContextCreationOptions>): DataCaptureContext;
    private constructor();
    setFrameSource(frameSource: Optional<FrameSource>): Promise<void>;
    addListener(listener: DataCaptureContextListener): void;
    removeListener(listener: DataCaptureContextListener): void;
    addMode(mode: DataCaptureMode): void;
    removeMode(mode: DataCaptureMode): void;
    removeAllModes(): void;
    dispose(): void;
    applySettings(settings: DataCaptureContextSettings): Promise<void>;
    private initialize;
    private update;
    private addComponent;
}


export interface FocusGesture {
}
export interface FocusGestureJSON {
    type: string;
}
class PrivateFocusGestureDeserializer {
    static fromJSON(json: FocusGestureJSON | null): FocusGesture | null;
}
export class TapToFocus implements FocusGesture {
    private type;
    constructor();
}
export interface ZoomGesture {
}
export interface ZoomGestureJSON {
    type: string;
}
class PrivateZoomGestureDeserializer {
    static fromJSON(json: ZoomGestureJSON | null): ZoomGesture | null;
}
export class SwipeToZoom implements ZoomGesture {
    private type;
    constructor();
}
export enum LogoStyle {
    Minimal = "minimal",
    Extended = "extended"
}


export interface DataCaptureOverlay {
}
export interface Control {
}
export class TorchSwitchControl implements Control {
    private type;
    private icon;
    private view;
    get torchOffImage(): string | null;
    set torchOffImage(torchOffImage: string | null);
    get torchOffPressedImage(): string | null;
    set torchOffPressedImage(torchOffPressedImage: string | null);
    get torchOnImage(): string | null;
    set torchOnImage(torchOnImage: string | null);
    get torchOnPressedImage(): string | null;
    set torchOnPressedImage(torchOnPressedImage: string | null);
}
export class ZoomSwitchControl implements Control {
    private type;
    private icon;
    private view;
    get zoomedOutImage(): string | null;
    set zoomedOutImage(zoomedOutImage: string | null);
    get zoomedInImage(): string | null;
    set zoomedInImage(zoomedInImage: string | null);
    get zoomedInPressedImage(): string | null;
    set zoomedInPressedImage(zoomedInPressedImage: string | null);
    get zoomedOutPressedImage(): string | null;
    set zoomedOutPressedImage(zoomedOutPressedImage: string | null);
}
export interface DataCaptureViewListener {
    didChangeSize?(view: DataCaptureView, size: Size, orientation: Orientation): void;
}
export enum Anchor {
    TopLeft = "topLeft",
    TopCenter = "topCenter",
    TopRight = "topRight",
    CenterLeft = "centerLeft",
    Center = "center",
    CenterRight = "centerRight",
    BottomLeft = "bottomLeft",
    BottomCenter = "bottomCenter",
    BottomRight = "bottomRight"
}
export class HTMLElementState {
    isShown: boolean;
    position: Optional<{
        top: number;
        left: number;
    }>;
    size: Optional<{
        width: number;
        height: number;
    }>;
    shouldBeUnderContent: boolean;
    get isValid(): boolean;
    didChangeComparedTo(other: HTMLElementState): boolean;
}
interface PrivateDataCaptureView {
    htmlElement: Optional<HTMLElement>;
    _htmlElementState: HTMLElementState;
    htmlElementState: HTMLElementState;
    readonly viewProxy: DataCaptureViewProxy;
    _viewProxy: DataCaptureViewProxy;
    overlays: DataCaptureOverlay[];
    controls: Control[];
    listeners: DataCaptureViewListener[];
    addControl(control: Control): void;
    removeControl(control: Control): void;
    initialize(): void;
    updatePositionAndSize(): void;
    _show(): void;
    _hide(): void;
    elementDidChange(): void;
    subscribeToChangesOnHTMLElement(): void;
    controlUpdated(): void;
}
export class DataCaptureView {
    private _context;
    get context(): Optional<DataCaptureContext>;
    set context(context: Optional<DataCaptureContext>);
    scanAreaMargins: MarginsWithUnit;
    pointOfInterest: PointWithUnit;
    logoAnchor: Anchor;
    logoOffset: PointWithUnit;
    focusGesture: FocusGesture | null;
    zoomGesture: ZoomGesture | null;
    logoStyle: LogoStyle;
    private overlays;
    private controls;
    private _viewProxy;
    private get viewProxy();
    private listeners;
    private htmlElement;
    private _htmlElementState;
    private set htmlElementState(value);
    private get htmlElementState();
    private scrollListener;
    private domObserver;
    private orientationChangeListener;
    /**
     * The current context as a PrivateDataCaptureContext
     */
    private get privateContext();
    static forContext(context: Optional<DataCaptureContext>): DataCaptureView;
    constructor();
    connectToElement(element: HTMLElement): void;
    detachFromElement(): void;
    setFrame(frame: Rect, isUnderContent?: boolean): Promise<void>;
    show(): Promise<void>;
    hide(): Promise<void>;
    addOverlay(overlay: DataCaptureOverlay): void;
    removeOverlay(overlay: DataCaptureOverlay): void;
    addListener(listener: DataCaptureViewListener): void;
    removeListener(listener: DataCaptureViewListener): void;
    viewPointForFramePoint(point: Point): Promise<Point>;
    viewQuadrilateralForFrameQuadrilateral(quadrilateral: Quadrilateral): Promise<Quadrilateral>;
    addControl(control: Control): void;
    removeControl(control: Control): void;
    private controlUpdated;
    private initialize;
    private subscribeToChangesOnHTMLElement;
    private unsubscribeFromChangesOnHTMLElement;
    private elementDidChange;
    private updatePositionAndSize;
    private _show;
    private _hide;
}


export interface VibrationJSON {
    type: string;
}
interface PrivateVibration {
    fromJSON(json: VibrationJSON): Vibration;
}
export class Vibration {
    private type;
    private static fromJSON;
    static get defaultVibration(): Vibration;
    static get selectionHapticFeedback(): Vibration;
    static get successHapticFeedback(): Vibration;
    private constructor();
}
export interface SoundJSON {
    resource: string | null;
}
interface PrivateSound {
    fromJSON(json: SoundJSON): Sound;
}
export class Sound {
    resource: Optional<string>;
    private static fromJSON;
    static get defaultSound(): Sound;
    constructor(resource: Optional<string>);
}
export interface FeedbackJSON {
    vibration: VibrationJSON | null;
    sound: SoundJSON | null;
}
interface PrivateFeedback {
    fromJSON(json: FeedbackJSON): Feedback;
}
export class Feedback {
    static get defaultFeedback(): Feedback;
    private _vibration;
    private _sound;
    private proxy;
    private static fromJSON;
    get vibration(): Optional<Vibration>;
    get sound(): Optional<Sound>;
    constructor(vibration: Optional<Vibration>, sound: Optional<Sound>);
    emit(): void;
    private initialize;
}


export interface LocationSelection {
}
export const NoneLocationSelection: {
    type: string;
};
export class RadiusLocationSelection implements LocationSelection {
    private type;
    private _radius;
    get radius(): NumberWithUnit;
    constructor(radius: NumberWithUnit);
}
export class RectangularLocationSelection implements LocationSelection {
    private type;
    private _sizeWithUnitAndAspect;
    get sizeWithUnitAndAspect(): SizeWithUnitAndAspect;
    static withSize(size: SizeWithUnit): RectangularLocationSelection;
    static withWidthAndAspectRatio(width: NumberWithUnit, heightToWidthAspectRatio: number): RectangularLocationSelection;
    static withHeightAndAspectRatio(height: NumberWithUnit, widthToHeightAspectRatio: number): RectangularLocationSelection;
}

export interface Serializeable {
    toJSON: () => object;
}
export interface StringSerializeable {
    toJSON: () => string;
}
export function ignoreFromSerialization(target: any, propertyName: string): void;
export function nameForSerialization(customName: string): (target: any, propertyName: string) => void;
export function ignoreFromSerializationIfNull(target: any, propertyName: string): void;
export function serializationDefault(defaultValue: any): (target: any, propertyName: string) => void;
export class DefaultSerializeable {
    toJSON(): object;
}


export enum RectangularViewfinderStyle {
    Legacy = "legacy",
    Rounded = "rounded",
    Square = "square"
}
export enum RectangularViewfinderLineStyle {
    Light = "light",
    Bold = "bold"
}
export enum LaserlineViewfinderStyle {
    Legacy = "legacy",
    Animated = "animated"
}
interface RectangularViewfinderAnimationJSON {
    readonly looping: boolean;
}
interface PrivateRectangularViewfinderAnimation {
    fromJSON(json: RectangularViewfinderAnimationJSON): RectangularViewfinderAnimation;
}
export class RectangularViewfinderAnimation {
    private readonly _isLooping;
    private static fromJSON;
    get isLooping(): boolean;
    constructor(isLooping: boolean);
}


interface PrivateBrush {
    toJSON(): BrushJSON;
}
export interface BrushJSON {
    fill: {
        color: Color;
    };
    stroke: {
        color: Color;
        width: number;
    };
}
export class Brush {
    private fill;
    private stroke;
    static get transparent(): Brush;
    get fillColor(): Color;
    get strokeColor(): Color;
    get strokeWidth(): number;
    constructor();
    constructor(fillColor: Color, strokeColor: Color, strokeWidth: number);
}
export interface Viewfinder {
}
export const NoViewfinder: {
    type: string;
};
export class LaserlineViewfinder implements Viewfinder {
    private type;
    private readonly _style;
    width: NumberWithUnit;
    enabledColor: Color;
    disabledColor: Color;
    constructor();
    constructor(style: LaserlineViewfinderStyle);
    get style(): LaserlineViewfinderStyle;
}
export class RectangularViewfinder implements Viewfinder {
    private type;
    private readonly _style;
    private readonly _lineStyle;
    private _dimming;
    private _disabledDimming;
    private _animation;
    private _sizeWithUnitAndAspect;
    color: Color;
    get sizeWithUnitAndAspect(): SizeWithUnitAndAspect;
    constructor();
    constructor(style: RectangularViewfinderStyle);
    constructor(style: RectangularViewfinderStyle, lineStyle: RectangularViewfinderLineStyle);
    get style(): RectangularViewfinderStyle;
    get lineStyle(): RectangularViewfinderLineStyle;
    get dimming(): number;
    set dimming(value: number);
    get disabledDimming(): number;
    set disabledDimming(value: number);
    get animation(): RectangularViewfinderAnimation | null;
    set animation(animation: RectangularViewfinderAnimation | null);
    setSize(size: SizeWithUnit): void;
    setWidthAndAspectRatio(width: NumberWithUnit, heightToWidthAspectRatio: number): void;
    setHeightAndAspectRatio(height: NumberWithUnit, widthToHeightAspectRatio: number): void;
    setShorterDimensionAndAspectRatio(fraction: number, aspectRatio: number): void;
}
export class AimerViewfinder implements Viewfinder {
    private type;
    frameColor: Color;
    dotColor: Color;
    constructor();
}

}
