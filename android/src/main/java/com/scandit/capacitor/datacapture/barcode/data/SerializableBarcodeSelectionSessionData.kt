/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2021- Scandit AG. All rights reserved.
 */

package com.scandit.capacitor.datacapture.barcode.data

import org.json.JSONObject

class SerializableBarcodeSelectionSessionData(
    val json: JSONObject
) {
    val selectionIdentifier: String
        get() = json.optString("selectionIdentifier", "")
}
