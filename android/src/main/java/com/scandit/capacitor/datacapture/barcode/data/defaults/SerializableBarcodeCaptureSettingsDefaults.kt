/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2019- Scandit AG. All rights reserved.
 */

package com.scandit.capacitor.datacapture.barcode.data.defaults

import com.scandit.capacitor.datacapture.core.data.SerializableData
import org.json.JSONObject

data class SerializableBarcodeCaptureSettingsDefaults(
    private val codeDuplicateFilter: Long
) : SerializableData {

    override fun toJson(): JSONObject = JSONObject(
            mapOf(
                    FIELD_CODE_DUPLICATE_FILTER to codeDuplicateFilter
            )
    )

    companion object {
        private const val FIELD_CODE_DUPLICATE_FILTER = "codeDuplicateFilter"
    }
}
