/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2019- Scandit AG. All rights reserved.
 */

package com.scandit.capacitor.datacapture.barcode.tracking.callbacks

import com.getcapacitor.JSObject
import com.scandit.capacitor.datacapture.barcode.CapacitorPlugin
import com.scandit.capacitor.datacapture.barcode.factories.BarcodeCaptureActionFactory
import com.scandit.capacitor.datacapture.core.data.SerializableFinishModeCallbackData
import com.scandit.capacitor.datacapture.core.utils.Callback
import com.scandit.datacapture.barcode.tracking.capture.BarcodeTracking
import com.scandit.datacapture.barcode.tracking.capture.BarcodeTrackingSession
import com.scandit.datacapture.barcode.tracking.data.TrackedBarcode
import com.scandit.datacapture.core.data.FrameData
import org.json.JSONObject
import java.util.concurrent.atomic.AtomicReference
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock

class BarcodeTrackingCallback(private val plugin: CapacitorPlugin) : Callback() {

    private val lock = ReentrantLock(true)
    private val condition = lock.newCondition()

    private val latestSession: AtomicReference<BarcodeTrackingSession?> = AtomicReference()
    private val latestStateData = AtomicReference<SerializableFinishModeCallbackData?>(null)

    fun onSessionUpdated(
        barcodeTracking: BarcodeTracking,
        session: BarcodeTrackingSession,
        @Suppress("UNUSED_PARAMETER") frameData: FrameData
    ) {
        if (disposed.get()) return

        lock.withLock {
            plugin.notify(
                BarcodeCaptureActionFactory.SEND_TRACKING_SESSION_UPDATED_EVENT,
                JSObject.fromJSONObject(
                    JSONObject(
                        mapOf(
                            NAME to BarcodeCaptureActionFactory.SEND_TRACKING_SESSION_UPDATED_EVENT,
                            FIELD_SESSION to session.toJson(),
                            // TODO [SDC-2001] -> add frame data serialization
                            FIELD_FRAME_DATA to JSONObject()
                        )
                    )
                )
            )
            latestSession.set(session)
            lockAndWait()
            onUnlock(barcodeTracking)
        }
    }

    private fun onUnlock(barcodeTracking: BarcodeTracking) {
        latestStateData.get()?.let { latestData ->
            barcodeTracking.isEnabled = latestData.enabled
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

    fun getTrackedBarcodeFromLatestSession(
        barcodeId: Int,
        frameSequenceId: Long?
    ): TrackedBarcode? {
        val session = latestSession.get() ?: return null
        return if (frameSequenceId == null || session.frameSequenceId == frameSequenceId) {
            session.trackedBarcodes[barcodeId]
        } else null
    }

    private fun unlock() {
        lock.withLock {
            condition.signal()
        }
    }

    override fun dispose() {
        super.dispose()
        forceRelease()
    }

    companion object {
        const val NAME = "name"
        const val FIELD_SESSION = "session"
        const val FIELD_FRAME_DATA = "frameData"
    }
}
