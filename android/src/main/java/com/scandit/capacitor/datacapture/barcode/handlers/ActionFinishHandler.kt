/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2019- Scandit AG. All rights reserved.
 */

package com.scandit.capacitor.datacapture.barcode.handlers

import com.getcapacitor.PluginCall
import com.scandit.capacitor.datacapture.barcode.data.SerializableFinishAdvancedOverlayAnchorData
import com.scandit.capacitor.datacapture.barcode.data.SerializableFinishAdvancedOverlayOffsetData
import com.scandit.capacitor.datacapture.barcode.data.SerializableFinishAdvancedOverlayViewData
import com.scandit.capacitor.datacapture.barcode.data.SerializableFinishBasicOverlayCallbackData
import com.scandit.capacitor.datacapture.core.data.SerializableFinishModeCallbackData

interface ActionFinishHandler {
    fun onFinishBarcodeTrackingMode(
        finishData: SerializableFinishModeCallbackData?,
        call: PluginCall
    )

    fun onFinishBarcodeCaptureMode(
        finishData: SerializableFinishModeCallbackData?,
        call: PluginCall
    )

    fun onFinishBasicOverlay(
        finishData: SerializableFinishBasicOverlayCallbackData?,
        call: PluginCall
    )

    fun onFinishAdvancedOverlayView(
        finishData: SerializableFinishAdvancedOverlayViewData?,
        call: PluginCall
    )

    fun onFinishAdvancedOverlayOffset(
        finishData: SerializableFinishAdvancedOverlayOffsetData?,
        call: PluginCall
    )

    fun onFinishAdvancedOverlayAnchor(
        finishData: SerializableFinishAdvancedOverlayAnchorData?,
        call: PluginCall
    )

    fun onFinishAdvancedOverlayTap(call: PluginCall)
    fun onJsonParseError(error: Throwable, call: PluginCall)
}
