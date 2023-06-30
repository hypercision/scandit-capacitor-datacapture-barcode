package com.scandit.capacitor.datacapture.barcode.count.callbacks

import com.getcapacitor.JSObject
import com.scandit.capacitor.datacapture.barcode.CapacitorPlugin
import com.scandit.capacitor.datacapture.core.utils.Callback
import com.scandit.datacapture.barcode.tracking.data.TrackedBarcode
import com.scandit.datacapture.core.ui.style.Brush
import org.json.JSONObject
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock

class BarcodeCountViewListenerCallback(private val plugin: CapacitorPlugin) : Callback() {
    private val lock = ReentrantLock(true)

    private val brushRequests: MutableMap<String, TrackedBarcode> = mutableMapOf()

    fun brushForRecognizedBarcode(
        trackedBarcode: TrackedBarcode
    ): Brush? {
        if (disposed.get()) return null

        lock.withLock {
            plugin.notify(
                SEND_ON_BRUSH_FOR_RECOGNIZED_BARCODE,
                JSObject.fromJSONObject(
                    JSONObject(
                        mapOf(
                            NAME to SEND_ON_BRUSH_FOR_RECOGNIZED_BARCODE,
                            FIELD_TRACKED_BARCODE to trackedBarcode.toJson()
                        )
                    )
                )
            )
            brushRequests[trackedBarcode.identifier.keyFor(SEND_ON_BRUSH_FOR_RECOGNIZED_BARCODE)] =
                trackedBarcode
            return null
        }
    }

    internal fun getRecognizedBarcode(
        trackedBarcodeId: Int
    ): TrackedBarcode? {
        val key = trackedBarcodeId.keyFor(SEND_ON_BRUSH_FOR_RECOGNIZED_BARCODE)
        val trackedBarcode = brushRequests[key]

        if (trackedBarcode != null) {
            brushRequests.remove(key)
        }

        return trackedBarcode
    }

    fun brushForRecognizedBarcodeNotInList(
        trackedBarcode: TrackedBarcode
    ): Brush? {
        if (disposed.get()) return null

        lock.withLock {
            plugin.notify(
                SEND_ON_BRUSH_FOR_RECOGNIZED_BARCODE_NOT_IN_LIST,
                JSObject.fromJSONObject(
                    JSONObject(
                        mapOf(
                            NAME to SEND_ON_BRUSH_FOR_RECOGNIZED_BARCODE_NOT_IN_LIST,
                            FIELD_TRACKED_BARCODE to trackedBarcode.toJson()
                        )
                    )
                )
            )

            brushRequests[
                trackedBarcode.identifier.keyFor(
                    SEND_ON_BRUSH_FOR_RECOGNIZED_BARCODE_NOT_IN_LIST
                )
            ] = trackedBarcode
            return null
        }
    }

    internal fun getNotInListBarcode(
        trackedBarcodeId: Int
    ): TrackedBarcode? {
        val key = trackedBarcodeId.keyFor(SEND_ON_BRUSH_FOR_RECOGNIZED_BARCODE_NOT_IN_LIST)
        val trackedBarcode = brushRequests[key]

        if (trackedBarcode != null) {
            brushRequests.remove(key)
        }

        return trackedBarcode
    }

    fun brushForUnrecognizedBarcode(
        trackedBarcode: TrackedBarcode
    ): Brush? {
        if (disposed.get()) return null

        lock.withLock {
            plugin.notify(
                SEND_ON_BRUSH_FOR_UNRECOGNIZED_BARCODE,
                JSObject.fromJSONObject(
                    JSONObject(
                        mapOf(
                            NAME to SEND_ON_BRUSH_FOR_UNRECOGNIZED_BARCODE,
                            FIELD_TRACKED_BARCODE to trackedBarcode.toJson()
                        )
                    )
                )
            )
            brushRequests[
                trackedBarcode.identifier.keyFor(
                    SEND_ON_BRUSH_FOR_UNRECOGNIZED_BARCODE
                )
            ] = trackedBarcode
            return null
        }
    }

    internal fun getUnrecognizedBarcode(
        trackedBarcodeId: Int
    ): TrackedBarcode? {
        val key = trackedBarcodeId.keyFor(SEND_ON_BRUSH_FOR_UNRECOGNIZED_BARCODE)
        val trackedBarcode = brushRequests[key]

        if (trackedBarcode != null) {
            brushRequests.remove(key)
        }

        return trackedBarcode
    }

    fun onFilteredBarcodeTapped(filteredBarcode: TrackedBarcode) {
        if (disposed.get()) return
        lock.withLock {
            plugin.notify(
                SEND_ON_FILTERED_BARCODE_TAPPED,
                JSObject.fromJSONObject(
                    JSONObject(filteredBarcode.toJson())
                )
            )
        }
    }

    fun onRecognizedBarcodeNotInListTapped(
        trackedBarcode: TrackedBarcode
    ) {
        if (disposed.get()) return
        lock.withLock {
            plugin.notify(
                SEND_ON_RECOGNIZED_BARCODE_NOT_IN_LIST_TAPPED,
                JSObject.fromJSONObject(
                    JSONObject(trackedBarcode.toJson())
                )
            )
        }
    }

    fun onRecognizedBarcodeTapped(trackedBarcode: TrackedBarcode) {
        if (disposed.get()) return
        lock.withLock {
            plugin.notify(
                SEND_ON_RECOGNIZED_BARCODE_TAPPED,
                JSObject.fromJSONObject(
                    JSONObject(trackedBarcode.toJson())
                )
            )
        }
    }

    fun onUnrecognizedBarcodeTapped(
        trackedBarcode: TrackedBarcode
    ) {
        if (disposed.get()) return
        lock.withLock {
            plugin.notify(
                SEND_ON_UNRECOGNIZED_BARCODE_TAPPED,
                JSObject.fromJSONObject(
                    JSONObject(trackedBarcode.toJson())
                )
            )
        }
    }

    fun onCaptureListCompleted() {
        if (disposed.get()) return
        lock.withLock {
            plugin.notify(
                SEND_ON_CAPTURE_LIST_COMPLETED,
                JSObject.fromJSONObject(
                    JSONObject()
                )
            )
        }
    }

    private fun Int.keyFor(prefix: String): String = "$prefix-$this"

    companion object {
        private const val NAME = "name"
        private const val FIELD_TRACKED_BARCODE = "trackedBarcode"
        private const val SEND_ON_BRUSH_FOR_RECOGNIZED_BARCODE =
            "barcodeCountViewListener-brushForRecognizedBarcode"
        private const val SEND_ON_BRUSH_FOR_RECOGNIZED_BARCODE_NOT_IN_LIST =
            "barcodeCountViewListener-brushForRecognizedBarcodeNotInList"
        private const val SEND_ON_BRUSH_FOR_UNRECOGNIZED_BARCODE =
            "barcodeCountViewListener-brushForUnrecognizedBarcode"
        private const val SEND_ON_FILTERED_BARCODE_TAPPED =
            "barcodeCountViewListener-onFilteredBarcodeTapped"
        private const val SEND_ON_RECOGNIZED_BARCODE_NOT_IN_LIST_TAPPED =
            "barcodeCountViewListener-onRecognizedBarcodeNotInListTapped"
        private const val SEND_ON_RECOGNIZED_BARCODE_TAPPED =
            "barcodeCountViewListener-onRecognizedBarcodeTapped"
        private const val SEND_ON_UNRECOGNIZED_BARCODE_TAPPED =
            "barcodeCountViewListener-onUnrecognizedBarcodeTapped"
        private const val SEND_ON_CAPTURE_LIST_COMPLETED =
            "barcodeCountViewListener-onCaptureListCompleted"
    }
}
