/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2019- Scandit AG. All rights reserved.
 */

package com.scandit.capacitor.datacapture.barcode.data.defaults

import com.scandit.capacitor.datacapture.core.data.SerializableData
import com.scandit.capacitor.datacapture.core.data.defaults.SerializableBrushDefaults
import com.scandit.datacapture.barcode.capture.BarcodeCapture
import com.scandit.datacapture.barcode.capture.BarcodeCaptureSettings
import com.scandit.datacapture.barcode.ui.overlay.BarcodeCaptureOverlay
import com.scandit.datacapture.barcode.ui.overlay.BarcodeCaptureOverlayStyle
import com.scandit.datacapture.barcode.ui.overlay.toJson
import org.json.JSONObject

class SerializableBarcodeCaptureOverlayDefaults(
    private val brushDefaults: SerializableBrushDefaults,
    private val defaultStyle: String,
    private val styles: Array<BarcodeCaptureOverlayStyle>
) : SerializableData {

    override fun toJson(): JSONObject = JSONObject(
        mapOf(
            FIELD_BRUSH_DEFAULTS to brushDefaults.toJson(),
            FIELD_DEFAULT_STYLE to defaultStyle,
            FIELD_STYLES to stylesMap(styles)
        )
    )

    private fun stylesMap(styles: Array<BarcodeCaptureOverlayStyle>): JSONObject {
        val map = mutableMapOf<String, Map<String, JSONObject>>()

        styles.forEach {
            map[it.toJson()] = mapOf(
                FIELD_BRUSH_DEFAULTS to SerializableBrushDefaults(
                    BarcodeCaptureOverlay.newInstance(
                        BarcodeCapture.forDataCaptureContext(
                            null,
                            BarcodeCaptureSettings()
                        ),
                        null,
                        it
                    ).brush
                ).toJSONObject()
            )
        }

        return JSONObject(map as Map<String, Map<String, JSONObject>>)
    }

    companion object {
        private const val FIELD_BRUSH_DEFAULTS = "DefaultBrush"
        private const val FIELD_DEFAULT_STYLE = "defaultStyle"
        private const val FIELD_STYLES = "styles"
    }
}
