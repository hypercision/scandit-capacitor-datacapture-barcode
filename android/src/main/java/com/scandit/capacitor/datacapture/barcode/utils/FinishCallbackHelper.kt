/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2019- Scandit AG. All rights reserved.
 */

package com.scandit.capacitor.datacapture.barcode.utils

import com.scandit.capacitor.datacapture.barcode.factories.BarcodeCaptureActionFactory
import com.scandit.capacitor.datacapture.core.data.SerializableCallbackAction
import org.json.JSONObject

class FinishCallbackHelper {

    fun isFinishBarcodeCaptureModeCallback(data: JSONObject): Boolean {
        return checkFinishCallbackIdFieldForValue(
                data, BarcodeCaptureActionFactory.SEND_BARCODE_SCANNED_EVENT
        ) || checkFinishCallbackIdFieldForValue(
                data, BarcodeCaptureActionFactory.SEND_SESSION_UPDATED_EVENT
        )
    }

    fun isFinishBarcodeTrackingModeCallback(data: JSONObject): Boolean {
        return checkFinishCallbackIdFieldForValue(
                data, BarcodeCaptureActionFactory.SEND_TRACKING_SESSION_UPDATED_EVENT
        )
    }

    fun isFinishBarcodeTrackingBasicOverlayCallback(data: JSONObject): Boolean {
        return checkFinishCallbackIdFieldForValue(
                data, BarcodeCaptureActionFactory.SEND_BRUSH_FOR_TRACKED_BARCODE
        )
    }

    fun isFinishBarcodeTrackingAdvancedOverlayViewCallback(data: JSONObject): Boolean {
        return checkFinishCallbackIdFieldForValue(
                data, BarcodeCaptureActionFactory.SEND_VIEW_FOR_TRACKED_BARCODE
        )
    }

    fun isFinishBarcodeTrackingAdvancedOverlayOffsetCallback(data: JSONObject): Boolean {
        return checkFinishCallbackIdFieldForValue(
                data, BarcodeCaptureActionFactory.SEND_OFFSET_FOR_TRACKED_BARCODE
        )
    }

    fun isFinishBarcodeTrackingAdvancedOverlayAnchorCallback(data: JSONObject): Boolean {
        return checkFinishCallbackIdFieldForValue(
            data, BarcodeCaptureActionFactory.SEND_ANCHOR_FOR_TRACKED_BARCODE
        )
    }

    fun isFinishBarcodeTrackingAdvancedOverlayTapCallback(data: JSONObject): Boolean {
        return checkFinishCallbackIdFieldForValue(
            data, BarcodeCaptureActionFactory.SEND_TAP_VIEW_FOR_TRACKED_BARCODE
        )
    }

    private fun checkFinishCallbackIdFieldForValue(data: JSONObject, value: String): Boolean {
        return data.has(SerializableCallbackAction.FIELD_FINISH_CALLBACK_ID) &&
                data[SerializableCallbackAction.FIELD_FINISH_CALLBACK_ID] == value
    }
}
