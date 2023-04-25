/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2023- Scandit AG. All rights reserved.
 */

import ScanditBarcodeCapture
import ScanditCapacitorDatacaptureCore

extension ScanditBarcodeCapture: BarcodeCaptureListener {
    func barcodeCapture(_ barcodeCapture: BarcodeCapture,
                        didScanIn session: BarcodeCaptureSession,
                        frameData: FrameData) {
        guard let callback = callbacks.barcodeCaptureListener else {
            return
        }

        ScanditCaptureCore.lastFrame = frameData
        defer { ScanditCaptureCore.lastFrame = nil }

        barcodeCaptureSession = session

        let listenerEvent = ListenerEvent(name: .didScanInBarcodeCapture,
                                  argument: ["session": session.jsonString, "frameData": frameData.toJSON()],
                                  shouldNotifyWhenFinished: true)
        waitForFinished(listenerEvent, callbackId: callback.id)
        finishBlockingCallback(with: barcodeCapture, for: listenerEvent)
    }

    func barcodeCapture(_ barcodeCapture: BarcodeCapture,
                        didUpdate session: BarcodeCaptureSession,
                        frameData: FrameData) {
        guard let callback = callbacks.barcodeCaptureListener else {
            return
        }

        ScanditCaptureCore.lastFrame = frameData
        defer { ScanditCaptureCore.lastFrame = nil }

        barcodeCaptureSession = session

        let listenerEvent = ListenerEvent(name: .didUpdateSessionInBarcodeCapture,
                                  argument: ["session": session.jsonString, "frameData": frameData.toJSON()],
                                  shouldNotifyWhenFinished: true)
        waitForFinished(listenerEvent, callbackId: callback.id)
        finishBlockingCallback(with: barcodeCapture, for: listenerEvent)
    }

    func didStartObserving(_ barcodeCapture: BarcodeCapture) {
        // ignored in Cordova
    }

    func didStopObserving(_ barcodeCapture: BarcodeCapture) {
        // ignored in Cordova
    }
}
