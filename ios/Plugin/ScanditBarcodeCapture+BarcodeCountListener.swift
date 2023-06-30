/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2023- Scandit AG. All rights reserved.
 */

import ScanditCapacitorDatacaptureCore

extension ScanditBarcodeCapture: BarcodeCountListener {
    func barcodeCount(_ barcodeCount: BarcodeCount,
                      didScanIn session: BarcodeCountSession,
                      frameData: FrameData) {
        guard let callback = callbacks.barcodeCountListener else { return }

        ScanditCaptureCore.lastFrame = frameData
        defer { ScanditCaptureCore.lastFrame = nil }

        barcodeCountSession = session

        let listenerEvent = ListenerEvent(name: .didScanInBarcodeCount,
                                          argument: ["session": session.jsonString,
                                                     "frameData": frameData.toJSON()],
                                          shouldNotifyWhenFinished: true)
        waitForFinished(listenerEvent, callbackId: callback.id)
        finishBlockingCallback(with: barcodeCount, for: listenerEvent)
    }
}

extension ScanditBarcodeCapture: BarcodeCountCaptureListListener {
    func captureList(_ captureList: BarcodeCountCaptureList,
                     didUpdate session: BarcodeCountCaptureListSession) {
        let listenerEvent = ListenerEvent(name: .captureListUpdated,
                                          argument: ["session": session.jsonString])
        notifyListeners(listenerEvent.name.rawValue,
                        data: ["data": listenerEvent.resultMessage])
    }

    func captureList(_ captureList: BarcodeCountCaptureList,
                     didCompleteWith session: BarcodeCountCaptureListSession) {
        let listenerEvent = ListenerEvent(name: .captureListCompleted,
                                          argument: ["session": session.jsonString])
        notifyListeners(listenerEvent.name.rawValue, data: ["data": listenerEvent.resultMessage])
    }
}
