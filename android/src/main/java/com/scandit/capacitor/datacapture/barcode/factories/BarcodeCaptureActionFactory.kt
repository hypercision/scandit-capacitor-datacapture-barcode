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

    const val ACTION_SELECTION_UPDATED = "didUpdateSelectionInBarcodeSelection"
    const val ACTION_SELECTION_SESSION_UPDATED = "didUpdateSessionInBarcodeSelection"

    const val SEND_TRACKING_SESSION_UPDATED_EVENT = "onTrackingSessionUpdateEvent"
}
