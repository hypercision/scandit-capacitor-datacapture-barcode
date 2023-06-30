package com.scandit.capacitor.datacapture.barcode.count.callbacks

import com.getcapacitor.JSObject
import com.scandit.capacitor.datacapture.barcode.CapacitorPlugin
import com.scandit.capacitor.datacapture.core.utils.Callback
import com.scandit.datacapture.barcode.count.capture.list.BarcodeCountCaptureListSession
import org.json.JSONObject
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock

class BarcodeCountCaptureListCallback(private val plugin: CapacitorPlugin) : Callback() {
    private val lock = ReentrantLock(true)

    fun onCaptureListSessionUpdated(
        session: BarcodeCountCaptureListSession
    ) {
        lock.withLock {
            plugin.notify(
                ON_CAPTURE_LIST_SESSION_UPDATED_EVENT_NAME,
                JSObject.fromJSONObject(
                    JSONObject(
                        mapOf(
                            NAME to ON_CAPTURE_LIST_SESSION_UPDATED_EVENT_NAME,
                            FIELD_SESSION to session.toJson()
                        )
                    )
                )
            )
        }
    }

    companion object {
        private const val NAME = "name"
        private const val ON_CAPTURE_LIST_SESSION_UPDATED_EVENT_NAME =
            "barcodeCountCaptureListListener-onCaptureListSessionUpdated"

        private const val FIELD_SESSION = "session"
    }
}
