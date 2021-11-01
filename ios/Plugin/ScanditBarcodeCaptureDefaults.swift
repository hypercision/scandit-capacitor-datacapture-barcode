import ScanditBarcodeCapture
import ScanditCapacitorDatacaptureCore

fileprivate extension BarcodeCaptureOverlay {
    static var defaultStyle: BarcodeCaptureOverlayStyle {
        return BarcodeCaptureOverlay(barcodeCapture:
                                        BarcodeCapture(context: nil, settings: BarcodeCaptureSettings())).style
    }
}

fileprivate extension BarcodeTrackingBasicOverlay {
    static var defaultStyle: BarcodeTrackingBasicOverlayStyle {
        return BarcodeTrackingBasicOverlay(barcodeTracking:
                                            BarcodeTracking(context: nil, settings: BarcodeTrackingSettings())).style
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

    struct BarcodeCaptureSettingsDefaults: Encodable {
        let codeDuplicateFilter: Int
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

    typealias SymbologySettingsDefaults = [String: String]
    typealias SymbologyDescriptionsDefaults = [String]
    typealias CompositeTypeDescriptionsDefaults = [String]

    let BarcodeCapture: BarcodeCaptureDefaultsContainer
    let BarcodeTracking: BarcodeTrackingDefaultsContainer
    let SymbologySettings: SymbologySettingsDefaults
    let SymbologyDescriptions: SymbologyDescriptionsDefaults
    let CompositeTypeDescriptions: CompositeTypeDescriptionsDefaults

    init(barcodeCaptureSettings: BarcodeCaptureSettings, overlay: BarcodeCaptureOverlay,
         basicTrackingOverlay: BarcodeTrackingBasicOverlay) {
        self.BarcodeCapture = BarcodeCaptureDefaultsContainer.from(barcodeCaptureSettings, overlay)
        self.BarcodeTracking = BarcodeTrackingDefaultsContainer.from(basicTrackingOverlay)
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

extension ScanditBarcodeCaptureDefaults.BarcodeCaptureOverlayDefaults {
    static func from(_ overlay: BarcodeCaptureOverlay) -> ScanditBarcodeCaptureDefaults.BarcodeCaptureOverlayDefaults {
        let brush = ScanditCaptureCoreDefaults.BrushDefaults.from(BarcodeCaptureOverlay.defaultBrush)
        let defaultStyle = BarcodeCaptureOverlay.defaultStyle.jsonString

        return ScanditBarcodeCaptureDefaults.BarcodeCaptureOverlayDefaults(
            defaultStyle: defaultStyle,
            DefaultBrush: brush,
            styles: [
                BarcodeCaptureOverlayStyle.legacy.jsonString: [
                    "DefaultBrush": ScanditCaptureCoreDefaults.BrushDefaults.from(
                        BarcodeCaptureOverlay(
                            barcodeCapture: BarcodeCapture(
                            context: nil,
                            settings: BarcodeCaptureSettings()),
                        with: BarcodeCaptureOverlayStyle.legacy
                    ).brush)
                ],
                BarcodeCaptureOverlayStyle.frame.jsonString: [
                    "DefaultBrush": ScanditCaptureCoreDefaults.BrushDefaults.from(
                        BarcodeCaptureOverlay(
                            barcodeCapture: BarcodeCapture(
                            context: nil,
                            settings: BarcodeCaptureSettings()),
                        with: BarcodeCaptureOverlayStyle.frame
                    ).brush)
                ]
            ]
        )
    }
}

extension ScanditBarcodeCaptureDefaults.BarcodeTrackingBasicOverlayDefaults {
    static func from(_ basicOverlay: BarcodeTrackingBasicOverlay)
    -> ScanditBarcodeCaptureDefaults.BarcodeTrackingBasicOverlayDefaults {
        let brush = ScanditCaptureCoreDefaults.BrushDefaults.from(BarcodeTrackingBasicOverlay.defaultBrush)
        let defaultStyle = BarcodeTrackingBasicOverlay.defaultStyle.jsonString
        return ScanditBarcodeCaptureDefaults.BarcodeTrackingBasicOverlayDefaults(
            defaultStyle: defaultStyle,
            DefaultBrush: brush,
            styles: [
                BarcodeTrackingBasicOverlayStyle.legacy.jsonString: [
                    "DefaultBrush": ScanditCaptureCoreDefaults.BrushDefaults.from(
                        BarcodeTrackingBasicOverlay(
                            barcodeTracking: BarcodeTracking(
                            context: nil,
                            settings: BarcodeTrackingSettings()),
                        with: BarcodeTrackingBasicOverlayStyle.legacy
                    ).brush ?? BarcodeTrackingBasicOverlay.defaultBrush)
                ],
                BarcodeTrackingBasicOverlayStyle.frame.jsonString: [
                    "DefaultBrush": ScanditCaptureCoreDefaults.BrushDefaults.from(
                        BarcodeTrackingBasicOverlay(
                            barcodeTracking: BarcodeTracking(
                            context: nil,
                            settings: BarcodeTrackingSettings()),
                        with: BarcodeTrackingBasicOverlayStyle.frame
                    ).brush ?? BarcodeTrackingBasicOverlay.defaultBrush)
                ],
                BarcodeTrackingBasicOverlayStyle.dot.jsonString: [
                    "DefaultBrush": ScanditCaptureCoreDefaults.BrushDefaults.from(
                        BarcodeTrackingBasicOverlay(
                            barcodeTracking: BarcodeTracking(
                            context: nil,
                            settings: BarcodeTrackingSettings()),
                        with: BarcodeTrackingBasicOverlayStyle.dot
                    ).brush ?? BarcodeTrackingBasicOverlay.defaultBrush)
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

extension ScanditBarcodeCaptureDefaults.SymbologySettingsDefaults {
    static func from(_ settings: BarcodeCaptureSettings) -> ScanditBarcodeCaptureDefaults.SymbologySettingsDefaults {
        return SymbologyDescription.all.reduce(
            into: [String: String](), {(result, symbologyDescription) in
                let symbology = SymbologyDescription.symbology(fromIdentifier: symbologyDescription.identifier)
                let settings = settings.settings(for: symbology)
                result[symbologyDescription.identifier] = settings.jsonString
            })
    }
}
