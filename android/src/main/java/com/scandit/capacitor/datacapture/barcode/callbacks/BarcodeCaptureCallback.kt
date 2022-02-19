/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2019- Scandit AG. All rights reserved.
 */

package com.scandit.capacitor.datacapture.barcode.callbacks

import com.getcapacitor.JSObject
import com.scandit.capacitor.datacapture.barcode.CapacitorPlugin
import com.scandit.capacitor.datacapture.barcode.factories.BarcodeCaptureActionFactory
import com.scandit.capacitor.datacapture.core.data.SerializableFinishModeCallbackData
import com.scandit.capacitor.datacapture.core.utils.Callback
import com.scandit.datacapture.barcode.capture.BarcodeCapture
import com.scandit.datacapture.barcode.capture.BarcodeCaptureSession
import com.scandit.datacapture.core.data.FrameData
import org.json.JSONObject
import java.util.concurrent.atomic.AtomicReference
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock

class BarcodeCaptureCallback(private val plugin: CapacitorPlugin) : Callback() {

    private val lock = ReentrantLock(true)
    private val condition = lock.newCondition()

    private val latestStateData = AtomicReference<SerializableFinishModeCallbackData?>(null)

    fun onSessionUpdated(
        barcodeCapture: BarcodeCapture,
        session: BarcodeCaptureSession,
        @Suppress("UNUSED_PARAMETER") frameData: FrameData
    ) {
        if (disposed.get()) return

        lock.withLock {
            plugin.notify(
                BarcodeCaptureActionFactory.SEND_SESSION_UPDATED_EVENT,
                JSObject.fromJSONObject(
                    JSONObject(
                        mapOf(
                            NAME to BarcodeCaptureActionFactory.SEND_SESSION_UPDATED_EVENT,
                            FIELD_SESSION to session.toJson(),
                            FIELD_FRAME_DATA to serializeFrameData().toString()
                        )
                    )
                )
            )
            lockAndWait()
            onUnlock(barcodeCapture)
        }
    }

    fun onBarcodeScanned(
        barcodeCapture: BarcodeCapture,
        session: BarcodeCaptureSession,
        @Suppress("UNUSED_PARAMETER") frameData: FrameData
    ) {
        if (disposed.get()) return

        lock.withLock {
            plugin.notify(
                BarcodeCaptureActionFactory.SEND_BARCODE_SCANNED_EVENT,
                JSObject.fromJSONObject(
                    JSONObject(
                        mapOf(
                            NAME to BarcodeCaptureActionFactory.SEND_BARCODE_SCANNED_EVENT,
                            FIELD_SESSION to session.toJson(),
                            // TODO [SDC-2001] -> add frame data serialization
                            FIELD_FRAME_DATA to
                                serializeFrameData().toString()
                        )
                    )
                )
            )
            lockAndWait()
            onUnlock(barcodeCapture)
        }
    }

    private fun onUnlock(barcodeCapture: BarcodeCapture) {
        latestStateData.get()?.let { latestData ->
            barcodeCapture.isEnabled = latestData.enabled
            latestStateData.set(null)
        }
        // If we don't have the latestData, it means no listener is set from js, so we do nothing.
    }

    private fun lockAndWait() {
        condition.await()
    }

    fun onFinishCallback(finishModeCallbackData: SerializableFinishModeCallbackData?) {
        latestStateData.set(finishModeCallbackData)
        unlock()
    }

    fun forceRelease() {
        lock.withLock {
            condition.signalAll()
        }
    }

    private fun unlock() {
        lock.withLock {
            condition.signal()
        }
    }

    private fun serializeFrameData(): JSONObject = JSONObject(
        mapOf(
            FIELD_FRAME_DATA to JSONObject()
        )
    )

    override fun dispose() {
        super.dispose()
        forceRelease()
    }

    companion object {
        private const val NAME = "name"
        private const val FIELD_SESSION = "session"
        private const val FIELD_FRAME_DATA = "frameData"
    }
}
