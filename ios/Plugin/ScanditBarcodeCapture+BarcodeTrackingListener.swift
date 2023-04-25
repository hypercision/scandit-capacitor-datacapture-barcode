/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2023- Scandit AG. All rights reserved.
 */

import ScanditBarcodeCapture
import ScanditCapacitorDatacaptureCore

extension ScanditBarcodeCapture: BarcodeTrackingListener {
    func barcodeTracking(_ barcodeTracking: BarcodeTracking,
                         didUpdate session: BarcodeTrackingSession,
                         frameData: FrameData) {
        guard let callback = callbacks.barcodeTrackingListener else {
            return
        }

        lastTrackedBarcodes = session.trackedBarcodes
        lastFrameSequenceId = session.frameSequenceId

        ScanditCaptureCore.lastFrame = frameData
        defer { ScanditCaptureCore.lastFrame = nil }

        barcodeTrackingSession = session

        let listenerEvent = ListenerEvent(name: .didUpdateSessionInBarcodeTracking,
                                  argument: ["session": session.jsonString, "frameData": frameData.toJSON()],
                                  shouldNotifyWhenFinished: true)
        waitForFinished(listenerEvent, callbackId: callback.id)
        finishBlockingCallback(with: barcodeTracking, for: listenerEvent)
    }
}
