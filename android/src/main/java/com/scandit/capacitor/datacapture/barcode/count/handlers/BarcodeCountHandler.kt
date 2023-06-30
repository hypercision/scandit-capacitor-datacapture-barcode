package com.scandit.capacitor.datacapture.barcode.count.handlers

import com.scandit.datacapture.barcode.count.capture.BarcodeCount
import com.scandit.datacapture.barcode.count.capture.BarcodeCountListener

class BarcodeCountHandler(
    private val barcodeCountListener: BarcodeCountListener
) {
    var barcodeCount: BarcodeCount? = null
        private set

    fun attachBarcodeCount(barcodeCount: BarcodeCount) {
        if (this.barcodeCount != barcodeCount) {
            disposeCurrent()
            barcodeCount.addListener(barcodeCountListener)
            this.barcodeCount = barcodeCount
        }
    }

    fun disposeCurrent() {
        barcodeCount?.apply {
            removeListener(barcodeCountListener)
        }
        barcodeCount = null
    }
}
