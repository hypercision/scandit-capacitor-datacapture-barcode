import ScanditBarcodeCapture
import ScanditCapacitorDatacaptureCore

// MARK: - Barcode Capture overlays with styles explicitly set.
fileprivate extension BarcodeCaptureOverlay {
    static var defaultStyle: BarcodeCaptureOverlayStyle {
        return BarcodeCaptureOverlayStyle.legacy
    }
}

fileprivate extension BarcodeTrackingBasicOverlay {
    static var defaultStyle: BarcodeTrackingBasicOverlayStyle {
        return BarcodeTrackingBasicOverlayStyle.legacy
    }
}

fileprivate extension BarcodeSelectionBasicOverlay {
    static var defaultStyle: BarcodeSelectionBasicOverlayStyle {
        return BarcodeSelectionBasicOverlayStyle.frame
    }
}

struct ScanditBarcodeCaptureDefaults: Encodable {
    typealias CameraSettingsDefaults = ScanditCaptureCoreDefaults.CameraSettingsDefaults
    
    struct BarcodeCaptureOverlayDefaults: Encodable {
        let defaultStyle: String
        let DefaultBrush: ScanditCaptureCoreDefaults.BrushDefaults
        let styles: [String: [String: ScanditCaptureCoreDefaults.BrushDefaults]]
    }
    
    struct BarcodeTrackingBasicOverlayDefaults: Encodable {
        let defaultStyle: String
        let DefaultBrush: ScanditCaptureCoreDefaults.BrushDefaults
        let styles: [String: [String: ScanditCaptureCoreDefaults.BrushDefaults]]
    }
    
    struct BarcodeSelectionBasicOverlayDefaults: Encodable {
        let defaultStyle: String
        let DefaultTrackedBrush: ScanditCaptureCoreDefaults.BrushDefaults
        let DefaultAimedBrush: ScanditCaptureCoreDefaults.BrushDefaults
        let DefaultSelectedBrush: ScanditCaptureCoreDefaults.BrushDefaults
        let DefaultSelectingBrush: ScanditCaptureCoreDefaults.BrushDefaults
        let styles: [String: [String: ScanditCaptureCoreDefaults.BrushDefaults]]
    }
    
    struct BarcodeCaptureSettingsDefaults: Encodable {
        let codeDuplicateFilter: Int
    }
    
    struct BarcodeSelectionSettingsDefaults: Encodable {
        let codeDuplicateFilter: Int
        let singleBarcodeAutoDetection: Bool
        let selectionType: String
    }
    
    struct BarcodeSelectionTapSelectionDefaults: Encodable {
        let defaultFreezeBehaviour: String
        let defaultTapBehaviour: String
    }
    
    struct BarcodeSelectionAimerSelectionDefaults: Encodable {
        let defaultSelectionStrategy: String
    }
    
    struct BarcodeCaptureDefaultsContainer: Encodable {
        let BarcodeCaptureOverlay: BarcodeCaptureOverlayDefaults
        let BarcodeCaptureSettings: BarcodeCaptureSettingsDefaults
        let RecommendedCameraSettings: CameraSettingsDefaults
    }
    
    struct BarcodeTrackingDefaultsContainer: Encodable {
        let BarcodeTrackingBasicOverlay: BarcodeTrackingBasicOverlayDefaults
        let RecommendedCameraSettings: CameraSettingsDefaults
    }
    
    struct BarcodeSelectionDefaultsContainer: Encodable {
        let RecommendedCameraSettings: CameraSettingsDefaults
        let feedback: String
        let BarcodeSelectionSettings: BarcodeSelectionSettingsDefaults
        let BarcodeSelectionTapSelection: BarcodeSelectionTapSelectionDefaults
        let BarcodeSelectionAimerSelection: BarcodeSelectionAimerSelectionDefaults
        let BarcodeSelectionBasicOverlay: BarcodeSelectionBasicOverlayDefaults
    }
    
    typealias SymbologySettingsDefaults = [String: String]
    typealias SymbologyDescriptionsDefaults = [String]
    typealias CompositeTypeDescriptionsDefaults = [String]
    
    let BarcodeCapture: BarcodeCaptureDefaultsContainer
    let BarcodeTracking: BarcodeTrackingDefaultsContainer
    let BarcodeSelection: BarcodeSelectionDefaultsContainer
    let SymbologySettings: SymbologySettingsDefaults
    let SymbologyDescriptions: SymbologyDescriptionsDefaults
    let CompositeTypeDescriptions: CompositeTypeDescriptionsDefaults
    
    init(barcodeCaptureSettings: BarcodeCaptureSettings, overlay: BarcodeCaptureOverlay,
         basicTrackingOverlay: BarcodeTrackingBasicOverlay) {
        self.BarcodeCapture = BarcodeCaptureDefaultsContainer.from(barcodeCaptureSettings, overlay)
        self.BarcodeTracking = BarcodeTrackingDefaultsContainer.from(basicTrackingOverlay)
        self.BarcodeSelection = BarcodeSelectionDefaultsContainer()
        self.SymbologySettings = SymbologySettingsDefaults.from(barcodeCaptureSettings)
        self.SymbologyDescriptions = SymbologyDescription.all.map { $0.jsonString }
        self.CompositeTypeDescriptions = CompositeTypeDescription.all.map { $0.jsonString }
    }
}

extension ScanditBarcodeCaptureDefaults.BarcodeCaptureDefaultsContainer {
    static func from(_ settings: BarcodeCaptureSettings, _ overlay: BarcodeCaptureOverlay)
    -> ScanditBarcodeCaptureDefaults.BarcodeCaptureDefaultsContainer {
        let barcodeCaptureOverlay = ScanditBarcodeCaptureDefaults.BarcodeCaptureOverlayDefaults.from(overlay)
        let barcodeCaptureSettings = ScanditBarcodeCaptureDefaults.BarcodeCaptureSettingsDefaults.from(settings)
        let cameraSettings = ScanditCaptureCoreDefaults
            .CameraSettingsDefaults.from(BarcodeCapture.recommendedCameraSettings)
        return ScanditBarcodeCaptureDefaults
            .BarcodeCaptureDefaultsContainer(BarcodeCaptureOverlay: barcodeCaptureOverlay,
                                             BarcodeCaptureSettings: barcodeCaptureSettings,
                                             RecommendedCameraSettings: cameraSettings)
    }
}

extension ScanditBarcodeCaptureDefaults.BarcodeTrackingDefaultsContainer {
    static func from(_ basicOverlay: BarcodeTrackingBasicOverlay)
    -> ScanditBarcodeCaptureDefaults.BarcodeTrackingDefaultsContainer {
        let barcodeTrackingOverlay = ScanditBarcodeCaptureDefaults
            .BarcodeTrackingBasicOverlayDefaults.from(basicOverlay)
        let cameraSettings = ScanditCaptureCoreDefaults
            .CameraSettingsDefaults.from(BarcodeTracking.recommendedCameraSettings)
        return ScanditBarcodeCaptureDefaults
            .BarcodeTrackingDefaultsContainer(BarcodeTrackingBasicOverlay: barcodeTrackingOverlay,
                                              RecommendedCameraSettings: cameraSettings)
    }
}

extension ScanditBarcodeCaptureDefaults.BarcodeSelectionDefaultsContainer {
    init() {
        RecommendedCameraSettings = ScanditCaptureCoreDefaults
            .CameraSettingsDefaults.from(BarcodeSelection.recommendedCameraSettings)
        feedback = BarcodeSelectionFeedback.default.jsonString
        BarcodeSelectionSettings = ScanditBarcodeCaptureDefaults.BarcodeSelectionSettingsDefaults.from()
        BarcodeSelectionTapSelection = ScanditBarcodeCaptureDefaults.BarcodeSelectionTapSelectionDefaults.from()
        BarcodeSelectionAimerSelection = ScanditBarcodeCaptureDefaults.BarcodeSelectionAimerSelectionDefaults.from()
        BarcodeSelectionBasicOverlay = ScanditBarcodeCaptureDefaults.BarcodeSelectionBasicOverlayDefaults.from()
    }
}

extension ScanditBarcodeCaptureDefaults.BarcodeCaptureOverlayDefaults {
    static func from(_ overlay: BarcodeCaptureOverlay) -> ScanditBarcodeCaptureDefaults.BarcodeCaptureOverlayDefaults {
        let defaultStyle = BarcodeCaptureOverlay.defaultStyle
        let defaultBrush = BarcodeCaptureOverlay.defaultBrush(forStyle: defaultStyle)
        let brushDefaults = ScanditCaptureCoreDefaults.BrushDefaults.from(defaultBrush)
        return ScanditBarcodeCaptureDefaults.BarcodeCaptureOverlayDefaults(
            defaultStyle: defaultStyle.jsonString,
            DefaultBrush: brushDefaults,
            styles: [
                BarcodeCaptureOverlayStyle.legacy.jsonString: [
                    "DefaultBrush": ScanditCaptureCoreDefaults.BrushDefaults.from(
                        BarcodeCaptureOverlay.defaultBrush(forStyle: BarcodeCaptureOverlayStyle.legacy)
                    )
                ],
                BarcodeCaptureOverlayStyle.frame.jsonString: [
                    "DefaultBrush": ScanditCaptureCoreDefaults.BrushDefaults.from(
                        BarcodeCaptureOverlay.defaultBrush(forStyle: BarcodeCaptureOverlayStyle.frame)
                    )
                ]
            ]
        )
    }
}

extension ScanditBarcodeCaptureDefaults.BarcodeTrackingBasicOverlayDefaults {
    static func from(_ basicOverlay: BarcodeTrackingBasicOverlay)
    -> ScanditBarcodeCaptureDefaults.BarcodeTrackingBasicOverlayDefaults {
        let defaultStyle = BarcodeTrackingBasicOverlay.defaultStyle
        let brush = ScanditCaptureCoreDefaults.BrushDefaults.from(BarcodeTrackingBasicOverlay.defaultBrush(forStyle: defaultStyle))
        return ScanditBarcodeCaptureDefaults.BarcodeTrackingBasicOverlayDefaults(
            defaultStyle: defaultStyle.jsonString,
            DefaultBrush: brush,
            styles: [
                BarcodeTrackingBasicOverlayStyle.legacy.jsonString: [
                    "DefaultBrush": ScanditCaptureCoreDefaults.BrushDefaults.from(
                        BarcodeTrackingBasicOverlay.defaultBrush(forStyle: BarcodeTrackingBasicOverlayStyle.legacy)
                    )
                ],
                BarcodeTrackingBasicOverlayStyle.frame.jsonString: [
                    "DefaultBrush": ScanditCaptureCoreDefaults.BrushDefaults.from(
                        BarcodeTrackingBasicOverlay.defaultBrush(forStyle: BarcodeTrackingBasicOverlayStyle.frame)
                    )
                ],
                BarcodeTrackingBasicOverlayStyle.dot.jsonString: [
                    "DefaultBrush": ScanditCaptureCoreDefaults.BrushDefaults.from(
                        BarcodeTrackingBasicOverlay.defaultBrush(forStyle: BarcodeTrackingBasicOverlayStyle.dot)
                    )
                ]
            ]
        )
    }
}

extension ScanditBarcodeCaptureDefaults.BarcodeSelectionBasicOverlayDefaults {
    static func from()
    -> ScanditBarcodeCaptureDefaults.BarcodeSelectionBasicOverlayDefaults {
        let defaultStyle = BarcodeSelectionBasicOverlay.defaultStyle
        let defaultTrackedBrush = ScanditCaptureCoreDefaults.BrushDefaults.from(BarcodeSelectionBasicOverlay.defaultTrackedBrush(forStyle: defaultStyle))
        let defaultAimedBrush = ScanditCaptureCoreDefaults.BrushDefaults.from(BarcodeSelectionBasicOverlay.defaultAimedBrush(forStyle: defaultStyle))
        let defaultSelectedBrush = ScanditCaptureCoreDefaults.BrushDefaults.from(BarcodeSelectionBasicOverlay.defaultSelectedBrush(forStyle: defaultStyle))
        let defaultSelectingBrush = ScanditCaptureCoreDefaults.BrushDefaults.from(BarcodeSelectionBasicOverlay.defaultSelectingBrush(forStyle: defaultStyle))
        
        return ScanditBarcodeCaptureDefaults.BarcodeSelectionBasicOverlayDefaults(
            defaultStyle: defaultStyle.jsonString,
            DefaultTrackedBrush: defaultTrackedBrush,
            DefaultAimedBrush: defaultAimedBrush,
            DefaultSelectedBrush: defaultSelectedBrush,
            DefaultSelectingBrush: defaultSelectingBrush,
            styles: [
                BarcodeSelectionBasicOverlayStyle.dot.jsonString: [
                    "DefaultTrackedBrush": ScanditCaptureCoreDefaults.BrushDefaults.from(
                        BarcodeSelectionBasicOverlay.defaultTrackedBrush(forStyle: .dot)
                    ),
                    "DefaultAimedBrush": ScanditCaptureCoreDefaults.BrushDefaults.from(
                        BarcodeSelectionBasicOverlay.defaultAimedBrush(forStyle: .dot)
                    ),
                    "DefaultSelectedBrush": ScanditCaptureCoreDefaults.BrushDefaults.from(
                        BarcodeSelectionBasicOverlay.defaultSelectedBrush(forStyle: .dot)
                    ),
                    "DefaultSelectingBrush": ScanditCaptureCoreDefaults.BrushDefaults.from(
                        BarcodeSelectionBasicOverlay.defaultSelectingBrush(forStyle: .dot)
                    ),
                ],
                BarcodeSelectionBasicOverlayStyle.frame.jsonString: [
                    "DefaultTrackedBrush": ScanditCaptureCoreDefaults.BrushDefaults.from(
                        BarcodeSelectionBasicOverlay.defaultTrackedBrush(forStyle: .frame)
                    ),
                    "DefaultAimedBrush": ScanditCaptureCoreDefaults.BrushDefaults.from(
                        BarcodeSelectionBasicOverlay.defaultAimedBrush(forStyle: .frame)
                    ),
                    "DefaultSelectedBrush": ScanditCaptureCoreDefaults.BrushDefaults.from(
                        BarcodeSelectionBasicOverlay.defaultSelectedBrush(forStyle: .frame)
                    ),
                    "DefaultSelectingBrush": ScanditCaptureCoreDefaults.BrushDefaults.from(
                        BarcodeSelectionBasicOverlay.defaultSelectingBrush(forStyle: .frame)
                    ),
                ]
            ]
        )
    }
}

extension ScanditBarcodeCaptureDefaults.BarcodeCaptureSettingsDefaults {
    static func from(_ settings: BarcodeCaptureSettings) ->
    ScanditBarcodeCaptureDefaults.BarcodeCaptureSettingsDefaults {
        return ScanditBarcodeCaptureDefaults
            .BarcodeCaptureSettingsDefaults(codeDuplicateFilter: Int(settings.codeDuplicateFilter * 1000))
    }
}

extension ScanditBarcodeCaptureDefaults.BarcodeSelectionSettingsDefaults {
    static func from() ->
    ScanditBarcodeCaptureDefaults.BarcodeSelectionSettingsDefaults {
        let settings = BarcodeSelectionSettings()
        return ScanditBarcodeCaptureDefaults
            .BarcodeSelectionSettingsDefaults(
                codeDuplicateFilter: Int(settings.codeDuplicateFilter * 1000),
                singleBarcodeAutoDetection: settings.singleBarcodeAutoDetection,
                selectionType: settings.selectionType.jsonString
            )
    }
}

extension ScanditBarcodeCaptureDefaults.BarcodeSelectionTapSelectionDefaults {
    static func from() ->
    ScanditBarcodeCaptureDefaults.BarcodeSelectionTapSelectionDefaults {
        let tapSelection = BarcodeSelectionTapSelection()
        return ScanditBarcodeCaptureDefaults
            .BarcodeSelectionTapSelectionDefaults(
                defaultFreezeBehaviour: tapSelection.freezeBehavior.jsonString,
                defaultTapBehaviour: tapSelection.tapBehavior.jsonString
            )
    }
}

extension ScanditBarcodeCaptureDefaults.BarcodeSelectionAimerSelectionDefaults {
    static func from() ->
    ScanditBarcodeCaptureDefaults.BarcodeSelectionAimerSelectionDefaults {
        return ScanditBarcodeCaptureDefaults
            .BarcodeSelectionAimerSelectionDefaults(
                defaultSelectionStrategy: BarcodeSelectionAimerSelection().selectionStrategy.jsonString
            )
    }
}

extension ScanditBarcodeCaptureDefaults.SymbologySettingsDefaults {
    static func from(_ settings: BarcodeCaptureSettings) -> ScanditBarcodeCaptureDefaults.SymbologySettingsDefaults {
        return SymbologyDescription.all.reduce(
            into: [String: String](), {(result, symbologyDescription) in
                let settings = settings.settings(for: symbologyDescription.symbology)
                result[symbologyDescription.identifier] = settings.jsonString
            })
    }
}
