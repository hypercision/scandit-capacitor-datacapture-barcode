/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2023- Scandit AG. All rights reserved.
 */

import Capacitor
import ScanditBarcodeCapture
import ScanditCapacitorDatacaptureCore

// TODO: serialize frame data as argument (https://jira.scandit.com/browse/SDC-1014)
extension FrameData {
    func toJSON() -> CommandError.JSONMessage {
        return [:]
    }
}

class BarcodeCaptureCallbacks {
    var barcodeCaptureListener: Callback?
    var barcodeTrackingListener: Callback?
    var barcodeTrackingBasicOverlayListener: Callback?
    var barcodeTrackingAdvancedOverlayListener: Callback?
    var barcodeSelectionListener: Callback?
    var barcodeCountListener: Callback?
    var barcodeCountViewListener: Callback?
    var barcodeCountViewUIListener: Callback?

    func reset() {
        barcodeCaptureListener = nil
        barcodeTrackingListener = nil
        barcodeSelectionListener = nil
        barcodeTrackingBasicOverlayListener = nil
        barcodeTrackingAdvancedOverlayListener = nil
        barcodeCountListener = nil
        barcodeCountViewListener = nil
        barcodeCountViewUIListener = nil
    }
}

extension Barcode {
    var selectionIdentifier: String {
        return (data ?? "") + SymbologyDescription(symbology: symbology).identifier
    }
}

extension BarcodeSelectionSession {
    var barcodes: [Barcode] {
        return selectedBarcodes + newlyUnselectedBarcodes
    }

    func count(for selectionIdentifier: String) -> Int {
        guard let barcode = barcodes.first(where: { $0.selectionIdentifier == selectionIdentifier }) else {
            return 0
        }
        return count(for: barcode)
    }
}

@objc(ScanditBarcodeCapture)
class ScanditBarcodeCapture: CAPPlugin, DataCapturePlugin {
    lazy var modeDeserializers: [DataCaptureModeDeserializer] = {
        let barcodeCaptureDeserializer = BarcodeCaptureDeserializer()
        barcodeCaptureDeserializer.delegate = self
        let barcodeTrackingDeserializer = BarcodeTrackingDeserializer()
        barcodeTrackingDeserializer.delegate = self
        let barcodeSelectionDeserializer = BarcodeSelectionDeserializer()
        barcodeSelectionDeserializer.delegate = self
        return [barcodeCaptureDeserializer, barcodeTrackingDeserializer, barcodeSelectionDeserializer]
    }()

    lazy var componentDeserializers: [DataCaptureComponentDeserializer] = []
    lazy var components: [DataCaptureComponent] = []

    lazy var callbacks = BarcodeCaptureCallbacks()
    lazy var callbackLocks = CallbackLocks()

    lazy var barcodeCountDeserializer = BarcodeCountDeserializer()
    lazy var barcodeCountViewDeserializer = BarcodeCountViewDeserializer()
    lazy var barcodeCountViewHandler: BarcodeCountViewHandler = {
        let handler = BarcodeCountViewHandler(relativeTo: webView!)
        handler.barcodeCountViewDelegate = self
        handler.barcodeCountViewUIDelegate = self
        return handler
    }()
    var barcodeCountBrushRequests: [String: TrackedBarcode] = [:]

    lazy var basicOverlayListenerQueue = DispatchQueue(label: "basicOverlayListenerQueue")
    lazy var advancedOverlayListenerQueue = DispatchQueue(label: "advancedOverlayListenerQueue")
    lazy var barcodeCountViewListenerQueue = DispatchQueue(label: "barcodeCountViewListenerQueue")
    lazy var barcodeCountViewUIListenerQueue = DispatchQueue(label: "barcodeCountViewUIListenerQueue")
    var barcodeTrackingBasicOverlay: BarcodeTrackingBasicOverlay?
    var barcodeTrackingAdvancedOverlay: BarcodeTrackingAdvancedOverlay?
    var lastTrackedBarcodes: [NSNumber: TrackedBarcode]?
    var lastFrameSequenceId: Int?

    var context: DataCaptureContext?
    var captureList: BarcodeCountCaptureList?

    var barcodeSelection: BarcodeSelection?
    var barcodeSelectionSession: BarcodeSelectionSession?
    var barcodeCaptureSession: BarcodeCaptureSession?
    var barcodeTrackingSession: BarcodeTrackingSession?
    var barcodeSelectionBasicOverlay: BarcodeSelectionBasicOverlay?
    var barcodeCount: BarcodeCount? {
        willSet {
            barcodeCount?.remove(self)
        }
        didSet {
            barcodeCount?.add(self)
        }
    }
    var barcodeCountSession: BarcodeCountSession?

    var offset: [Int: PointWithUnit] = [:]

    override func load() {
        ScanditCaptureCore.dataCapturePlugins.append(self as DataCapturePlugin)
        ScanditCaptureCore.registerContextChangeListener(listener: self)
    }

    func onReset() {
        callbacks.reset()

        lastTrackedBarcodes = nil
        lastFrameSequenceId = nil

        ScanditCaptureCore.unregisterContextChangeListener(listener: self)
    }

    @objc(getDefaults:)
    func getDefaults(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            let settings = BarcodeCaptureSettings()
            let barcodeCapture = BarcodeCapture(context: nil, settings: settings)
            let barcodeTracking = BarcodeTracking(context: nil, settings: BarcodeTrackingSettings())
            let overlay = BarcodeCaptureOverlay(barcodeCapture: barcodeCapture)
            let basicTrackingOverlay = BarcodeTrackingBasicOverlay(barcodeTracking: barcodeTracking)

            let defaults = ScanditBarcodeCaptureDefaults(barcodeCaptureSettings: settings,
                                                         overlay: overlay,
                                                         basicTrackingOverlay: basicTrackingOverlay)

            var defaultsDictionary: [String: Any]? {
                    guard let data = try? JSONEncoder().encode(defaults) else { return nil }
                    guard let json = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] else {
                        return nil
                    }
                    return json
                }

            call.resolve(defaultsDictionary ?? [:])
        }
    }

    // MARK: Listeners

    func hasListener(eventName: String) -> Bool {
        return hasListeners(eventName)
    }

    @objc(subscribeBarcodeCaptureListener:)
    func subscribeBarcodeCaptureListener(_ call: CAPPluginCall) {
        callbacks.barcodeCaptureListener = Callback(id: call.callbackId)
        call.resolve()
    }

    @objc(subscribeBarcodeTrackingListener:)
    func subscribeBarcodeTrackingListener(_ call: CAPPluginCall) {
        callbacks.barcodeTrackingListener = Callback(id: call.callbackId)

        lastTrackedBarcodes = nil
        lastFrameSequenceId = nil

        call.resolve()
    }

    @objc(subscribeBarcodeTrackingBasicOverlayListener:)
    func subscribeBarcodeTrackingBasicOverlayListener(_ call: CAPPluginCall) {
        callbacks.barcodeTrackingBasicOverlayListener = Callback(id: call.callbackId)
        call.resolve()
    }

    @objc(subscribeBarcodeTrackingAdvancedOverlayListener:)
    func subscribeBarcodeTrackingAdvancedOverlayListener(_ call: CAPPluginCall) {
        callbacks.barcodeTrackingAdvancedOverlayListener = Callback(id: call.callbackId)
        call.resolve()
    }

    @objc(finishCallback:)
    func finishCallback(_ call: CAPPluginCall) {
        guard let resultObject = call.getObject("result") else {
            call.reject(CommandError.invalidJSON.toJSONString())
            return
        }
        guard let finishCallbackId = resultObject["finishCallbackID"] else {
            call.reject(CommandError.invalidJSON.toJSONString())
            return
        }
        guard let result = BarcodeCaptureCallbackResult.from(([
            "finishCallbackID": finishCallbackId,
            "result": resultObject] as NSDictionary).jsonString) else {
            call.reject(CommandError.invalidJSON.toJSONString())
            return
        }
        callbackLocks.setResult(result, for: result.finishCallbackID)
        callbackLocks.release(for: result.finishCallbackID)
        call.resolve()
    }

    @objc(setBrushForTrackedBarcode:)
    func setBrushForTrackedBarcode(_ call: CAPPluginCall) {
        guard let json = try? BrushAndTrackedBarcodeJSON.fromJSONObject(call.options!) else {
            call.reject(CommandError.invalidJSON.toJSONString())
            return
        }

        guard let trackedBarcode = trackedBarcode(withID: json.trackedBarcodeID,
                                                  inSession: json.sessionFrameSequenceID) else {
                                                    call.reject(CommandError.trackedBarcodeNotFound.toJSONString())
                                                    return
        }

        self.barcodeTrackingBasicOverlay?.setBrush(json.brush, for: trackedBarcode)
        call.resolve()
    }

    @objc(clearTrackedBarcodeBrushes:)
    func clearTrackedBarcodeBrushes(_ call: CAPPluginCall) {
        self.barcodeTrackingBasicOverlay?.clearTrackedBarcodeBrushes()
        call.resolve()
    }

    @objc(setViewForTrackedBarcode:)
    func setViewForTrackedBarcode(_ call: CAPPluginCall) {
        guard let json = try? ViewAndTrackedBarcodeJSON.fromJSONObject(call.options!) else {
            call.reject(CommandError.invalidJSON.toJSONString())
            return
        }

        guard let trackedBarcode = trackedBarcode(withID: json.trackedBarcodeID,
                                                  inSession: json.sessionFrameSequenceID) else {
                                                    call.reject(CommandError.trackedBarcodeNotFound.toJSONString())
                                                    return
        }

        DispatchQueue.main.async {
            var trackedBarcodeView: TrackedBarcodeView?
            if let viewJSON = json.view {
                trackedBarcodeView = TrackedBarcodeView(json: viewJSON)
                trackedBarcodeView?.didTap = { [weak self] in
                    self?.didTapViewTrackedBarcode(trackedBarcode: trackedBarcode)
                }
            }

            self.barcodeTrackingAdvancedOverlay?.setView(trackedBarcodeView, for: trackedBarcode)

            call.resolve()
        }
    }

    @objc(setAnchorForTrackedBarcode:)
    func setAnchorForTrackedBarcode(_ call: CAPPluginCall) {
        guard let json = try? AnchorAndTrackedBarcodeJSON.fromJSONObject(call.options!) else {
            call.reject(CommandError.invalidJSON.toJSONString())
            return
        }

        guard let trackedBarcode = trackedBarcode(withID: json.trackedBarcodeID,
                                                  inSession: json.sessionFrameSequenceID) else {
                                                    call.reject(CommandError.trackedBarcodeNotFound.toJSONString())
                                                    return
        }

        guard let anchorString = json.anchor, let anchor = Anchor(JSONString: anchorString) else {
            call.reject(CommandError.invalidJSON.toJSONString())
            return
        }

        self.barcodeTrackingAdvancedOverlay?.setAnchor(anchor, for: trackedBarcode)

        call.resolve()
    }

    @objc(setOffsetForTrackedBarcode:)
    func setOffsetForTrackedBarcode(_ call: CAPPluginCall) {
        guard let json = try? OffsetAndTrackedBarcodeJSON.fromJSONObject(call.options!) else {
            call.reject(CommandError.invalidJSON.toJSONString())
            return
        }

        guard let trackedBarcode = trackedBarcode(withID: json.trackedBarcodeID,
                                                  inSession: json.sessionFrameSequenceID) else {
                                                    call.reject(CommandError.trackedBarcodeNotFound.toJSONString())
                                                    return
        }

        guard let offsetString = json.offset, let offset = PointWithUnit(JSONString: offsetString) else {
            call.reject(CommandError.invalidJSON.toJSONString())
            self.offset[trackedBarcode.identifier] = PointWithUnit.zero
            return
        }

        self.barcodeTrackingAdvancedOverlay?.setOffset(offset, for: trackedBarcode)
        self.offset[trackedBarcode.identifier] = offset
        call.resolve()
    }

    @objc(clearTrackedBarcodeViews:)
    func clearTrackedBarcodeViews(_ call: CAPPluginCall) {
        self.barcodeTrackingAdvancedOverlay?.clearTrackedBarcodeViews()
        call.resolve()
    }

    @objc(subscribeBarcodeSelectionListener:)
    func subscribeBarcodeSelectionListener(_ call: CAPPluginCall) {
        callbacks.barcodeSelectionListener = Callback(id: call.callbackId)
        call.resolve()
    }

    @objc(resetBarcodeSelection:)
    func resetBarcodeSelection(_ call: CAPPluginCall) {
        guard let barcodeSelection = self.barcodeSelection else {
            call.reject(CommandError.noBarcodeSelection.toJSONString())
            return
        }
        barcodeSelection.reset()
        call.resolve()
    }

    @objc(unfreezeCameraInBarcodeSelection:)
    func unfreezeCameraInBarcodeSelection(_ call: CAPPluginCall) {
        guard let barcodeSelection = self.barcodeSelection else {
            call.reject(CommandError.noBarcodeSelection.toJSONString())
            return
        }
        barcodeSelection.unfreezeCamera()
        call.resolve()
    }

    @objc(registerBarcodeCountListener:)
    func registerBarcodeCountListener(_ call: CAPPluginCall) {
        callbacks.barcodeCountListener = Callback(id: call.callbackId)
        call.resolve()
    }

    @objc(registerBarcodeCountViewListener:)
    func registerBarcodeCountViewListener(_ call: CAPPluginCall) {
        callbacks.barcodeCountViewListener = Callback(id: call.callbackId)
        call.resolve()
    }

    @objc(registerBarcodeCountViewUiListener:)
    func registerBarcodeCountViewUIListener(_ call: CAPPluginCall) {
        callbacks.barcodeCountViewUIListener = Callback(id: call.callbackId)
        call.resolve()
    }

    @objc(unregisterBarcodeCountListener:)
    func unregisterBarcodeCountListener(_ call: CAPPluginCall) {
        callbacks.barcodeCountListener = nil
        call.resolve()
    }

    @objc(unregisterBarcodeCountViewListener:)
    func unregisterBarcodeCountViewListener(_ call: CAPPluginCall) {
        callbacks.barcodeCountViewListener = nil
        call.resolve()
    }

    @objc(unregisterBarcodeCountViewUiListener:)
    func unregisterBarcodeCountViewUIListener(_ call: CAPPluginCall) {
        callbacks.barcodeCountViewUIListener = nil
        call.resolve()
    }

    @objc(setViewPositionAndSize:)
    func setViewPosiztionAndSize(_ call: CAPPluginCall) {
        DispatchQueue.main.sync {
            let jsonObject = call.getObject("position")
            guard let viewPositionAndSizeJSON = try? ViewPositionAndSizeJSON.fromJSONObject(jsonObject as Any) else {
                call.reject(CommandError.invalidJSON.toJSONString())
                return
            }

            self.barcodeCountViewHandler.updatePositionAndSize(fromJSON: viewPositionAndSizeJSON)

            if viewPositionAndSizeJSON.shouldBeUnderWebView {
                // Make the WebView transparent, so we can see views behind
                self.webView?.isOpaque = false
                self.webView?.backgroundColor = .clear
                self.webView?.scrollView.backgroundColor = .clear
            } else {
                self.webView?.isOpaque = true
                self.webView?.backgroundColor = nil
                self.webView?.scrollView.backgroundColor = nil
            }

            call.resolve()
        }
    }

    @objc(showView:)
    func show(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard let barcodeCountView = self.barcodeCountViewHandler.barcodeCountView else {
                call.reject(CommandError.noViewToBeShown.toJSONString())
                return
            }

            barcodeCountView.isHidden = false

            call.resolve()
        }
    }

    @objc(hideView:)
    func hideView(_ call: CAPPluginCall) {
        DispatchQueue.main.sync {
            guard let barcodeCountView = barcodeCountViewHandler.barcodeCountView else {
                call.reject(CommandError.noViewToBeHidden.toJSONString())
                return
            }

            barcodeCountView.isHidden = true

            call.resolve()
        }
    }

    @objc(resetBarcodeCount:)
    func resetBarcodeCount(_ call: CAPPluginCall) {
        guard let barcodeCount = barcodeCount else {
            call.reject(CommandError.noBarcodeCount.toJSONString())
            return
        }
        barcodeCount.reset()
        call.resolve()
    }

    @objc(getCountForBarcodeInBarcodeSelectionSession:)
    func getCountForBarcodeInBarcodeSelectionSession(_ call: CAPPluginCall) {
        guard let barcodeSelectionSession = self.barcodeSelectionSession else {
            call.reject(CommandError.noBarcodeSelectionSession.toJSONString())
            return
        }
        guard let json = try? SelectionIdentifierBarcodeJSON.fromJSONObject(call.options!) else {
            call.reject(CommandError.invalidJSON.toJSONString())
            return
        }
        call.resolve([
            "result": barcodeSelectionSession.count(for: json.selectionIdentifier)
        ])
    }

    @objc(resetBarcodeCaptureSession:)
    func resetBarcodeCaptureSession(_ call: CAPPluginCall) {
        guard let barcodeCaptureSession = self.barcodeCaptureSession else {
            call.reject(CommandError.noBarcodeCaptureSession.toJSONString())
            return
        }
        barcodeCaptureSession.reset()
        call.resolve()
    }

    @objc(resetBarcodeTrackingSession:)
    func resetBarcodeTrackingSession(_ call: CAPPluginCall) {
        guard let barcodeTrackingSession = self.barcodeTrackingSession else {
            call.reject(CommandError.noBarcodeTrackingSession.toJSONString())
            return
        }
        barcodeTrackingSession.reset()
        call.resolve()
    }

    @objc(resetBarcodeSelectionSession:)
    func resetBarcodeSelectionSession(_ call: CAPPluginCall) {
        guard let barcodeSelectionSession = self.barcodeSelectionSession else {
            call.reject(CommandError.noBarcodeSelectionSession.toJSONString())
            return
        }
        barcodeSelectionSession.reset()
        call.resolve()
    }

    @objc(createView:)
    func createView(_ call: CAPPluginCall) {
        guard let context = context else {
            call.reject(CommandError.noContext.toJSONString())
            return
        }
        guard let barcodeCountJson = call.options["BarcodeCount"] as? String else {
            call.reject(CommandError.invalidJSON.toJSONString())
            return
        }
        var barcodeCount: BarcodeCount
        do {
            barcodeCount = try barcodeCountDeserializer.mode(fromJSONString: barcodeCountJson,
                                                             context: context)
            self.barcodeCount = barcodeCount
        } catch let error as NSError {
            call.reject(CommandError.barcodeCountDeserializationError(message: error.localizedDescription).toJSONString())
            return
        }
        if let captureList = captureList {
            barcodeCount.setCaptureList(captureList)
        }
        guard let barcodeCountViewJson = call.options["BarcodeCountView"] as? String else {
            call.reject(CommandError.invalidJSON.toJSONString())
            return
        }
        do {
            try DispatchQueue.main.sync {
                let barcodeCountView = try barcodeCountViewDeserializer.view(fromJSONString: barcodeCountViewJson,
                                                                             barcodeCount: barcodeCount,
                                                                             context: context)
                self.barcodeCountViewHandler.barcodeCountView = barcodeCountView
            }
        } catch {
            call.reject(CommandError.barcodeCountViewDeserializationError(message: error.localizedDescription).toJSONString())
            return
        }
        call.resolve()
    }

    @objc(updateView:)
    func updateView(_ call: CAPPluginCall) {
        guard let view = barcodeCountViewHandler.barcodeCountView else {
            call.reject(CommandError.noBarcodeCountView.toJSONString())
            return
        }
        guard let barcodeCountViewDictionary = call.options["BarcodeCountView"] as? [String: Any],
              let barcodeCountViewData = try? JSONSerialization.data(withJSONObject: barcodeCountViewDictionary),
              let barcodeCountViewJson = String(data: barcodeCountViewData, encoding: .utf8) else {
            call.reject(CommandError.invalidJSON.toJSONString())
            return
        }
        do {
            try barcodeCountViewDeserializer.update(view, fromJSONString: barcodeCountViewJson)
        } catch {
            call.reject(CommandError.barcodeCountViewDeserializationError(message: error.localizedDescription).toJSONString())
            return
        }
        call.resolve()
    }

    @objc(updateMode:)
    func updateMode(_ call: CAPPluginCall) {
        guard let mode = barcodeCount else {
            call.reject(CommandError.noBarcodeCount.toJSONString())
            return
        }
        guard let barcodeCountDictionary = call.options["BarcodeCount"] as? [String: Any],
              let barcodeCountData = try? JSONSerialization.data(withJSONObject: barcodeCountDictionary),
              let barcodeCountJson = String(data: barcodeCountData, encoding: .utf8) else {
            call.reject(CommandError.invalidJSON.toJSONString())
            return
        }
        do {
            try barcodeCountDeserializer.updateMode(mode, fromJSONString: barcodeCountJson)
        } catch {
            call.reject(CommandError.barcodeCountDeserializationError(message: error.localizedDescription).toJSONString())
            return
        }
        call.resolve()
    }

    @objc(resetBarcodeCountSession:)
    func resetBarcodeCountSession(_ call: CAPPluginCall) {
        if let session = barcodeCountSession {
            session.reset()
        }
        call.resolve()
    }

    @objc(startScanningPhase:)
    func startScanningPhase(_ call: CAPPluginCall) {
        if let mode = barcodeCount {
            mode.startScanningPhase()
        }
        call.resolve()
    }

    @objc(endScanningPhase:)
    func endScanningPhase(_ call: CAPPluginCall) {
        if let mode = barcodeCount {
            mode.endScanningPhase()
        }
        call.resolve()
    }

    @objc(clearBarcodeCountViewHighlights:)
    func clearBarcodeCountViewHighlights(_ call: CAPPluginCall) {
        if let view = barcodeCountViewHandler.barcodeCountView {
            view.clearHighlights()
        }
        call.resolve()
    }

    @objc(setBarcodeCountCaptureList:)
    func setBarcodeCountCaptureList(_ call: CAPPluginCall) {
        guard let barcodeCount = barcodeCount else {
            call.reject(CommandError.noBarcodeCount.toJSONString())
            return
        }
        guard let barcodesArray = call.options["TargetBarcodes"] as? [[String: Any]],
              let barcodesData = try? JSONSerialization.data(withJSONObject: barcodesArray),
              let barcodes = String(data: barcodesData, encoding: .utf8) else {
            call.reject(CommandError.invalidJSON.toJSONString())
            return
        }
        let jsonArray = JSONValue(string: barcodes).asArray()
        let targetBarcodes = Set((0...jsonArray.count() - 1).map { jsonArray.atIndex($0).asObject() }.map {
            TargetBarcode(data: $0.string(forKey: "data"),
                          quantity: $0.integer(forKey: "quantity"))
        })
        barcodeCount.setCaptureList(BarcodeCountCaptureList(listener: self, targetBarcodes: targetBarcodes))
        call.resolve()
    }

    @objc(finishBarcodeCountListenerOnScan:)
    func finishBarcodeCountListenerOnScan(_ call: CAPPluginCall) {
        callbackLocks.release(for: .didScanInBarcodeCount)
        call.resolve()
    }

    @objc(finishBarcodeCountViewListenerBrushForRecognizedBarcode:)
    func finishBarcodeCountViewListenerBrushForRecognizedBarcode(_ call: CAPPluginCall) {
        guard let brushJson = call.options["brush"] as? String else { call.reject("Invalid brush json received."); return }
        guard let trackedBarcodeIdString = call.options["trackedBarcodeId"] as? String,
              let trackedBarcodeId = Int(trackedBarcodeIdString)
        else { call.reject("Invalid tracked barcode id received."); return }

        let brush = Brush(jsonString: brushJson)
        let key = trackedBarcodeId.barcodeCountBrushKeyFor(prefix: ListenerEvent.Name.barcodeCountViewBrushForRecognizedBarcode.rawValue)
        guard let trackedBarcode = barcodeCountBrushRequests[key] else {
            call.resolve()
            return
        }
        barcodeCountBrushRequests.removeValue(forKey: key)
        barcodeCountViewHandler.barcodeCountView?.setBrush(brush, forRecognizedBarcode: trackedBarcode)
        call.resolve()
    }

    @objc(finishBarcodeCountViewListenerBrushForRecognizedBarcodeNotInList:)
    func finishBarcodeCountViewListenerBrushForRecognizedBarcodeNotInList(_ call: CAPPluginCall) {
        guard let brushJson = call.options["brush"] as? String else { call.reject("Invalid brush json received."); return }
        guard let trackedBarcodeIdString = call.options["trackedBarcodeId"] as? String,
              let trackedBarcodeId = Int(trackedBarcodeIdString)
        else { call.reject("Invalid tracked barcode id received."); return }

        let brush = Brush(jsonString: brushJson)
        let key = trackedBarcodeId.barcodeCountBrushKeyFor(prefix: ListenerEvent.Name.barcodeCountViewBrushForRecognizedBarcodeNotInList.rawValue)
        guard let trackedBarcode = barcodeCountBrushRequests[key] else {
            call.resolve()
            return
        }
        barcodeCountBrushRequests.removeValue(forKey: key)
        barcodeCountViewHandler.barcodeCountView?.setBrush(brush, forRecognizedBarcodeNotInList: trackedBarcode)
        call.resolve()
    }

    @objc(finishBarcodeCountViewListenerOnBrushForUnrecognizedBarcode:)
    func finishBarcodeCountViewListenerOnBrushForUnrecognizedBarcode(_ call: CAPPluginCall) {
        guard let brushJson = call.options["brush"] as? String else { call.reject("Invalid brush json received."); return }
        guard let trackedBarcodeIdString = call.options["trackedBarcodeId"] as? String,
              let trackedBarcodeId = Int(trackedBarcodeIdString)
        else { call.reject("Invalid tracked barcode id received."); return }

        let brush = Brush(jsonString: brushJson)
        let key = trackedBarcodeId.barcodeCountBrushKeyFor(prefix: ListenerEvent.Name.barcodeCountViewBrushForUnrecognizedBarcode.rawValue)
        guard let trackedBarcode = barcodeCountBrushRequests[key] else {
            call.resolve()
            return
        }
        barcodeCountBrushRequests.removeValue(forKey: key)
        barcodeCountViewHandler.barcodeCountView?.setBrush(brush, forUnrecognizedBarcode: trackedBarcode)
        call.resolve()
    }

    func waitForFinished(_ listenerEvent: ListenerEvent, callbackId: String) {
        callbackLocks.wait(for: listenerEvent.name, afterDoing: {
            self.notifyListeners(listenerEvent.name.rawValue, data: listenerEvent.resultMessage as? [String: Any])
        })
    }

    func finishBlockingCallback(with mode: DataCaptureMode, for listenerEvent: ListenerEvent) {
        defer {
            callbackLocks.clearResult(for: listenerEvent.name)
        }

        guard let result = callbackLocks.getResult(for: listenerEvent.name) as? BarcodeCaptureCallbackResult,
            let enabled = result.enabled else {
            return
        }

        if enabled != mode.isEnabled {
            mode.isEnabled = enabled
        }
    }

    func finishBlockingCallback(with overlay: BarcodeTrackingBasicOverlay,
                                and trackedBarcode: TrackedBarcode,
                                for listenerEvent: ListenerEvent) {
        defer {
            callbackLocks.clearResult(for: listenerEvent.name)
        }

        /// No listener set.
        let callbackLockResult = callbackLocks.getResult(for: listenerEvent.name)
        guard let callbackResult = callbackLockResult as? BarcodeCaptureCallbackResult else {
            overlay.setBrush(overlay.brush, for: trackedBarcode)
            return
        }

        if callbackResult.isForListenerEvent(.brushForTrackedBarcode) {
            /// Listener didn't return a brush, e.g. set listener didn't implement the function.
            if callbackResult.result == nil {
                overlay.setBrush(overlay.brush, for: trackedBarcode)
                return
            }

            guard let brush = callbackResult.brush else {
                overlay.setBrush(overlay.brush, for: trackedBarcode)
                return
            }

            /// Listener returned a brush to be set.
            overlay.setBrush(brush, for: trackedBarcode)
        }

    }

    func finishBlockingCallback(with overlay: BarcodeTrackingAdvancedOverlay,
                                and trackedBarcode: TrackedBarcode,
                                for listenerEvent: ListenerEvent) {
        defer {
            callbackLocks.clearResult(for: listenerEvent.name)
        }

        /// No listener set.
        let callbackLockResult = callbackLocks.getResult(for: listenerEvent.name)
        guard let callbackResult = callbackLockResult as? BarcodeCaptureCallbackResult else {
            return
        }

        switch callbackResult.finishCallbackID {
        case .viewForTrackedBarcode:
            guard callbackResult.view != nil else {
                /// The JS listener didn't return a result, e.g. it didn't implement the relevant listener function
                /// **Note**: a `nil` view is different than no result:
                /// `nil` means the intention of setting no view, while the absense of a result means that
                /// there's no intention to set anything, e.g. views
                /// are set through `setView` instead of through the listener.
                return
            }
            DispatchQueue.main.async {
                callbackResult.view?.didTap = {
                    self.didTapViewTrackedBarcode(trackedBarcode: trackedBarcode)
                }
                overlay.setView(callbackResult.view, for: trackedBarcode)
            }
        case .anchorForTrackedBarcode:
            guard let anchor = callbackResult.anchor else {
                /// The JS listener didn't return a valid anchor,
                /// e.g. it didn't implement the relevant listener function.
                return
            }
            overlay.setAnchor(anchor, for: trackedBarcode)
        case .offsetForTrackedBarcode:
            guard let offset = callbackResult.offset ?? self.offset[trackedBarcode.identifier] else {
                /// The JS listener didn't return a valid offset,
                /// e.g. it didn't implement the relevant listener function.
                return
            }
            self.offset.removeValue(forKey: trackedBarcode.identifier)
            overlay.setOffset(offset, for: trackedBarcode)
        default:
            return
        }
    }

    private func trackedBarcode(withID trackedBarcodeId: String,
                                inSession sessionFrameSequenceId: String?) -> TrackedBarcode? {
        guard let lastTrackedBarcodes = lastTrackedBarcodes, !lastTrackedBarcodes.isEmpty else {
            return nil
        }

        if let sessionId = sessionFrameSequenceId, lastFrameSequenceId != Int(sessionId) {
            return nil
        }

        guard let trackedBarcode = lastTrackedBarcodes.trackedBarcode(withID: trackedBarcodeId) else {
            return nil
        }

        return trackedBarcode
    }
}

extension ScanditBarcodeCapture: ContextChangeListener {
    func context(didChange context: DataCaptureContext?) {
        self.context = context
    }
}

extension Int {
    func barcodeCountBrushKeyFor(prefix: String) -> String {
        return  "\(prefix)-\(self)"
    }
}
