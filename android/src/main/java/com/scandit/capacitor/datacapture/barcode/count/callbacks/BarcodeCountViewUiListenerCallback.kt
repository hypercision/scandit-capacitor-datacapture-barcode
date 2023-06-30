package com.scandit.capacitor.datacapture.barcode.count.callbacks

import com.getcapacitor.JSObject
import com.scandit.capacitor.datacapture.barcode.CapacitorPlugin
import com.scandit.capacitor.datacapture.core.utils.Callback
import org.json.JSONObject
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock

class BarcodeCountViewUiListenerCallback(private val plugin: CapacitorPlugin) : Callback() {
    private val lock = ReentrantLock(true)

    fun onExitButtonTapped() {
        if (disposed.get()) return
        lock.withLock {
            plugin.notify(
                EXIT_BUTTON_BUTTON_TAP_EVENT_NAME, JSObject.fromJSONObject(JSONObject())
            )
        }
    }

    fun onListButtonTapped() {
        if (disposed.get()) return
        lock.withLock {
            plugin.notify(
                LIST_BUTTON_TAP_EVENT_NAME, JSObject.fromJSONObject(JSONObject())
            )
        }
    }

    fun onSingleScanButtonTapped() {
        if (disposed.get()) return
        lock.withLock {
            plugin.notify(
                SINGLE_SCAN_BUTTON_TAP_EVENT_NAME, JSObject.fromJSONObject(JSONObject())
            )
        }
    }

    companion object {
        private const val EXIT_BUTTON_BUTTON_TAP_EVENT_NAME =
            "barcodeCountViewUiListener-onExitButtonTapped"
        private const val LIST_BUTTON_TAP_EVENT_NAME =
            "barcodeCountViewUiListener-onListButtonTapped"
        private const val SINGLE_SCAN_BUTTON_TAP_EVENT_NAME =
            "barcodeCountViewUiListener-onSingleScanButtonTapped"
    }
}
