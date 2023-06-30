/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2023- Scandit AG. All rights reserved.
 */

import ScanditCapacitorDatacaptureCore

extension ScanditBarcodeCapture: BarcodeCountViewDelegate {
    func barcodeCountView(_ view: BarcodeCountView, brushForRecognizedBarcode trackedBarcode: TrackedBarcode) -> Brush? {
        let listenerEvent = ListenerEvent(name: .barcodeCountViewBrushForRecognizedBarcode,
                                          argument: ["trackedBarcode": trackedBarcode.jsonString],
                                          shouldNotifyWhenFinished: true)
        barcodeCountViewListenerQueue.async { [weak self] in
            guard let self = self else { return }
            self.notifyListeners(listenerEvent.name.rawValue, data: listenerEvent.resultMessage as? [String: Any])
            self.barcodeCountBrushRequests[trackedBarcode.identifier.barcodeCountBrushKeyFor(prefix: listenerEvent.name.rawValue)] = trackedBarcode
        }
        return nil
    }

    func barcodeCountView(_ view: BarcodeCountView, brushForUnrecognizedBarcode trackedBarcode: TrackedBarcode) -> Brush? {
        let listenerEvent = ListenerEvent(name: .barcodeCountViewBrushForUnrecognizedBarcode,
                                          argument: ["trackedBarcode": trackedBarcode.jsonString],
                                          shouldNotifyWhenFinished: true)
        barcodeCountViewListenerQueue.async { [weak self] in
            guard let self = self else { return }
            self.notifyListeners(listenerEvent.name.rawValue, data: listenerEvent.resultMessage as? [String: Any])
            self.barcodeCountBrushRequests[trackedBarcode.identifier.barcodeCountBrushKeyFor(prefix: listenerEvent.name.rawValue)] = trackedBarcode
        }
        return nil
    }

    func barcodeCountView(_ view: BarcodeCountView, brushForRecognizedBarcodeNotInList trackedBarcode: TrackedBarcode) -> Brush? {
        let listenerEvent = ListenerEvent(name: .barcodeCountViewBrushForRecognizedBarcodeNotInList,
                                          argument: ["trackedBarcode": trackedBarcode.jsonString],
                                          shouldNotifyWhenFinished: true)
        barcodeCountViewListenerQueue.async { [weak self] in
            guard let self = self else { return }
            self.notifyListeners(listenerEvent.name.rawValue, data: listenerEvent.resultMessage as? [String: Any])
            self.barcodeCountBrushRequests[trackedBarcode.identifier.barcodeCountBrushKeyFor(prefix: listenerEvent.name.rawValue)] = trackedBarcode
        }
        return nil
    }

    func barcodeCountView(_ view: BarcodeCountView, didTapRecognizedBarcode trackedBarcode: TrackedBarcode) {
        let listenerEvent = ListenerEvent(name: .barcodeCountViewDidTapRecognizedBarcode,
                                          argument: ["trackedBarcode": trackedBarcode.jsonString])
        self.notifyListeners(listenerEvent.name.rawValue, data: ["data": listenerEvent.resultMessage])
    }

    func barcodeCountView(_ view: BarcodeCountView, didTapUnrecognizedBarcode trackedBarcode: TrackedBarcode) {
        let listenerEvent = ListenerEvent(name: .barcodeCountViewDidTapUnrecognizedBarcode,
                                          argument: ["trackedBarcode": trackedBarcode.jsonString])
        self.notifyListeners(listenerEvent.name.rawValue, data: ["data": listenerEvent.resultMessage])
    }

    func barcodeCountView(_ view: BarcodeCountView, didTapRecognizedBarcodeNotInList trackedBarcode: TrackedBarcode) {
        let listenerEvent = ListenerEvent(name: .barcodeCountViewDidTapRecognizedBarcodeNotInList,
                                          argument: ["trackedBarcode": trackedBarcode.jsonString])
        self.notifyListeners(listenerEvent.name.rawValue, data: ["data": listenerEvent.resultMessage])
    }

    func barcodeCountView(_ view: BarcodeCountView, didTapFilteredBarcode trackedBarcode: TrackedBarcode) {
        let listenerEvent = ListenerEvent(name: .barcodeCountViewDidTapFilteredBarcode,
                                          argument: ["trackedBarcode": trackedBarcode.jsonString])
        self.notifyListeners(listenerEvent.name.rawValue, data: ["data": listenerEvent.resultMessage])
    }
}

extension ScanditBarcodeCapture: BarcodeCountViewUIDelegate {
    func listButtonTapped(for view: BarcodeCountView) {
        let listenerEvent = ListenerEvent(name: .barcodeCountViewListButtonTapped)
        self.notifyListeners(listenerEvent.name.rawValue, data: [:])
    }

    func exitButtonTapped(for view: BarcodeCountView) {
        let listenerEvent = ListenerEvent(name: .barcodeCountViewExitButtonTapped)
        self.notifyListeners(listenerEvent.name.rawValue, data: [:])
    }

    func singleScanButtonTapped(for view: BarcodeCountView) {
        let listenerEvent = ListenerEvent(name: .barcodeCountViewSingleScanButtonTapped)
        self.notifyListeners(listenerEvent.name.rawValue, data: [:])
    }
}
