package com.scandit.capacitor.datacapture.barcode.count.callbacks

import com.getcapacitor.JSObject
import com.scandit.capacitor.datacapture.barcode.CapacitorPlugin
import com.scandit.capacitor.datacapture.core.utils.Callback
import com.scandit.datacapture.barcode.count.capture.BarcodeCountSession
import org.json.JSONObject
import java.util.concurrent.atomic.AtomicReference
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock

class BarcodeCountListenerCallback(private val plugin: CapacitorPlugin) : Callback() {
    private val lock = ReentrantLock(true)
    private val condition = lock.newCondition()

    private val latestSession: AtomicReference<BarcodeCountSession?> = AtomicReference()
    private val latestStateData = AtomicReference<Boolean?>(false)

    fun latestSession() = latestSession.get()

    fun onScan(
        session: BarcodeCountSession
    ) {
        if (disposed.get()) return

        lock.withLock {
            plugin.notify(
                ACTION_BARCODE_COUNT_ON_SCAN,
                JSObject.fromJSONObject(
                    JSONObject(
                        mapOf(
                            NAME to ACTION_BARCODE_COUNT_ON_SCAN,
                            FIELD_SESSION to session.toJson(),
                            FIELD_FRAME_DATA to JSONObject()
                        )
                    )
                )
            )
            latestSession.set(session)
            lockAndWait()
            onUnlock()
        }
    }

    private fun onUnlock() {
        latestStateData.set(null)
    }

    private fun lockAndWait() {
        condition.await()
    }

    fun finishOnScanCallback() {
        latestStateData.set(true)
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

    override fun dispose() {
        super.dispose()
        forceRelease()
    }

    companion object {
        private const val NAME = "name"
        private const val FIELD_SESSION = "session"
        private const val FIELD_FRAME_DATA = "frameData"

        private const val ACTION_BARCODE_COUNT_ON_SCAN = "barcodeCountListener-scan"
    }
}
