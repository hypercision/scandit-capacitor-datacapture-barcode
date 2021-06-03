/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2019- Scandit AG. All rights reserved.
 */

package com.scandit.capacitor.datacapture.barcode.factories

object BarcodeCaptureActionFactory {
    const val SEND_VIEW_FOR_TRACKED_BARCODE = "onViewForTrackedBarcodeEvent"
    const val SEND_OFFSET_FOR_TRACKED_BARCODE = "onOffsetForTrackedBarcodeEvent"
    const val SEND_ANCHOR_FOR_TRACKED_BARCODE = "onAnchorForTrackedBarcodeEvent"
    const val SEND_TAP_VIEW_FOR_TRACKED_BARCODE = "onTapViewForTrackedBarcodeEvent"

    const val SEND_BRUSH_FOR_TRACKED_BARCODE = "onBrushForTrackedBarcodeEvent"
    const val SEND_DID_TAP_TRACKED_BARCODE = "onDidTapTrackedBarcodeEvent"

    const val SEND_SESSION_UPDATED_EVENT = "onSessionUpdateEvent"
    const val SEND_BARCODE_SCANNED_EVENT = "onBarcodeScannedEvent"

    const val ACTION_BARCODE_SCANNED = "didScanInBarcodeCapture"
    const val ACTION_CAPTURE_SESSION_UPDATED = "didUpdateSessionInBarcodeCapture"
    const val ACTION_TRACKING_SESSION_UPDATED = "didUpdateSessionInBarcodeTracking"
    const val ACTION_BRUSH_FOR_TRACKED_BARCODE = "brushForTrackedBarcode"
    const val ACTION_TAP_TRACKED_BARCODE = "didTapTrackedBarcode"
    const val ACTION_VIEW_FOR_TRACKED_BARCODE = "viewForTrackedBarcode"
    const val ACTION_OFFSET_FOR_TRACKED_BARCODE = "offsetForTrackedBarcode"
    const val ACTION_ANCHOR_FOR_TRACKED_BARCODE = "anchorForTrackedBarcode"
    const val ACTION_TAP_VIEW_FOR_TRACKED_BARCODE = "didTapViewForTrackedBarcode"

    const val SEND_TRACKING_SESSION_UPDATED_EVENT = "onTrackingSessionUpdateEvent"
}
