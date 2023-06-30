package com.scandit.capacitor.datacapture.barcode.count.handlers

import android.graphics.Color
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AppCompatActivity
import com.scandit.capacitor.datacapture.core.data.ResizeAndMoveInfo
import com.scandit.capacitor.datacapture.core.utils.pxFromDp
import com.scandit.capacitor.datacapture.core.utils.removeFromParent
import com.scandit.capacitor.datacapture.core.workers.Worker
import com.scandit.datacapture.barcode.count.ui.view.BarcodeCountView
import com.scandit.datacapture.barcode.count.ui.view.BarcodeCountViewListener
import com.scandit.datacapture.barcode.count.ui.view.BarcodeCountViewUiListener
import java.lang.ref.WeakReference

class BarcodeCountViewHandler(
    private val barcodeCountViewListener: BarcodeCountViewListener,
    private val barcodeCountViewUiListener: BarcodeCountViewUiListener,
    private val uiWorker: Worker
) {
    private var latestInfo: ResizeAndMoveInfo = ResizeAndMoveInfo(0, 0, 600, 600, false)
    private var isVisible: Boolean = true
    private var barcodeCountViewReference: WeakReference<BarcodeCountView>? = null
    private var webViewReference: WeakReference<View>? = null

    val barcodeCountView: BarcodeCountView?
        get() = barcodeCountViewReference?.get()

    private val webView: View?
        get() = webViewReference?.get()

    fun attachBarcodeCountView(barcodeCountView: BarcodeCountView, activity: AppCompatActivity) {
        if (this.barcodeCountView != barcodeCountView) {
            disposeCurrentView()
            addBarcodeCountView(barcodeCountView, activity)
        }
    }

    fun attachWebView(webView: View, @Suppress("UNUSED_PARAMETER") activity: AppCompatActivity) {
        if (this.webView != webView) {
            webViewReference = WeakReference(webView)
            uiWorker.post {
                webView.bringToFront()
                webView.setBackgroundColor(Color.TRANSPARENT)
            }
        }
    }

    fun setVisible() {
        isVisible = true
        render()
    }

    fun setInvisible() {
        isVisible = false
        render()
    }

    fun setResizeAndMoveInfo(info: ResizeAndMoveInfo) {
        latestInfo = info
        render()
    }

    fun disposeCurrent() {
        disposeCurrentView()
        disposeCurrentWebView()
    }

    private fun disposeCurrentView() {
        val view = barcodeCountView ?: return
        removeBarcodeCountView(view)
    }

    private fun disposeCurrentWebView() {
        webViewReference = null
    }

    private fun addBarcodeCountView(
        barcodeCountView: BarcodeCountView,
        activity: AppCompatActivity
    ) {
        barcodeCountViewReference = WeakReference(barcodeCountView)
        barcodeCountView.listener = barcodeCountViewListener
        barcodeCountView.uiListener = barcodeCountViewUiListener

        uiWorker.post {
            activity.addContentView(
                barcodeCountView,
                ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )
            )
            render()
        }
    }

    private fun removeBarcodeCountView(barcodeCountView: BarcodeCountView) {
        barcodeCountViewReference = null
        removeView(barcodeCountView) {
            barcodeCountView.listener = null
            barcodeCountView.uiListener = null
        }
    }

    private fun removeView(view: View, uiBlock: (() -> Unit)? = null) {
        uiWorker.post {
            view.removeFromParent()
            uiBlock?.invoke()
        }
    }

    // Update the view visibility, position and size.
    fun render() {
        val view = barcodeCountView ?: return
        renderNoAnimate(view)
    }

    private fun renderNoAnimate(barcodeCountView: BarcodeCountView) {
        barcodeCountView.post {
            barcodeCountView.visibility = if (isVisible) View.VISIBLE else View.GONE
            barcodeCountView.x = latestInfo.left.pxFromDp()
            barcodeCountView.y = latestInfo.top.pxFromDp()
            barcodeCountView.layoutParams.apply {
                width = ViewGroup.LayoutParams.MATCH_PARENT
                height = ViewGroup.LayoutParams.MATCH_PARENT
            }
            if (latestInfo.shouldBeUnderWebView) {
                webView?.bringToFront()
                (webView?.parent as View).translationZ = 1F
            } else {
                barcodeCountView.bringToFront()
                (webView?.parent as View).translationZ = -1F
            }
            barcodeCountView.requestLayout()
        }
    }
}
