/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2019- Scandit AG. All rights reserved.
 */
package com.scandit.capacitor.datacapture.barcode

import android.util.Log
import android.view.View
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.scandit.capacitor.datacapture.barcode.callbacks.BarcodeCallbackContainer
import com.scandit.capacitor.datacapture.barcode.callbacks.BarcodeCaptureCallback
import com.scandit.capacitor.datacapture.barcode.callbacks.BarcodeSelectionCallback
import com.scandit.capacitor.datacapture.barcode.data.SerializableAdvancedOverlayAnchorActionData
import com.scandit.capacitor.datacapture.barcode.data.SerializableAdvancedOverlayOffsetActionData
import com.scandit.capacitor.datacapture.barcode.data.SerializableAdvancedOverlayViewActionData
import com.scandit.capacitor.datacapture.barcode.data.SerializableBarcodeSelectionSessionData
import com.scandit.capacitor.datacapture.barcode.data.SerializableBrushAndTrackedBarcode
import com.scandit.capacitor.datacapture.barcode.data.SerializableFinishAdvancedOverlayAnchorData
import com.scandit.capacitor.datacapture.barcode.data.SerializableFinishAdvancedOverlayOffsetData
import com.scandit.capacitor.datacapture.barcode.data.SerializableFinishAdvancedOverlayViewData
import com.scandit.capacitor.datacapture.barcode.data.SerializableFinishBasicOverlayCallbackData
import com.scandit.capacitor.datacapture.barcode.data.defaults.SerializableBarcodeCaptureDefaults
import com.scandit.capacitor.datacapture.barcode.data.defaults.SerializableBarcodeCaptureOverlayDefaults
import com.scandit.capacitor.datacapture.barcode.data.defaults.SerializableBarcodeCaptureSettingsDefaults
import com.scandit.capacitor.datacapture.barcode.data.defaults.SerializableBarcodeDefaults
import com.scandit.capacitor.datacapture.barcode.data.defaults.SerializableBarcodeSelectionDefaults
import com.scandit.capacitor.datacapture.barcode.data.defaults.SerializableBarcodeTrackingDefaults
import com.scandit.capacitor.datacapture.barcode.data.defaults.SerializableSymbologySettingsDefaults
import com.scandit.capacitor.datacapture.barcode.data.defaults.SerializableTrackingBasicOverlayDefaults
import com.scandit.capacitor.datacapture.barcode.errors.ErrorTrackedBarcodeNotFound
import com.scandit.capacitor.datacapture.barcode.handlers.ActionFinishHandler
import com.scandit.capacitor.datacapture.barcode.handlers.BarcodeCaptureHandler
import com.scandit.capacitor.datacapture.barcode.handlers.BarcodeSelectionHandler
import com.scandit.capacitor.datacapture.barcode.tracking.callbacks.BarcodeTrackingAdvancedOverlayCallback
import com.scandit.capacitor.datacapture.barcode.tracking.callbacks.BarcodeTrackingBasicOverlayCallback
import com.scandit.capacitor.datacapture.barcode.tracking.callbacks.BarcodeTrackingCallback
import com.scandit.capacitor.datacapture.barcode.tracking.handlers.BarcodeTrackingAdvancedOverlayHandler
import com.scandit.capacitor.datacapture.barcode.tracking.handlers.BarcodeTrackingBasicOverlayHandler
import com.scandit.capacitor.datacapture.barcode.tracking.handlers.BarcodeTrackingHandler
import com.scandit.capacitor.datacapture.barcode.utils.AdvancedOverlayViewPool
import com.scandit.capacitor.datacapture.barcode.utils.FinishCallbackHelper
import com.scandit.capacitor.datacapture.core.ScanditCaptureCoreNative
import com.scandit.capacitor.datacapture.core.communication.ModeDeserializersProvider
import com.scandit.capacitor.datacapture.core.data.SerializableFinishModeCallbackData
import com.scandit.capacitor.datacapture.core.data.defaults.SerializableBrushDefaults
import com.scandit.capacitor.datacapture.core.data.defaults.SerializableCameraSettingsDefault
import com.scandit.capacitor.datacapture.core.errors.JsonParseError
import com.scandit.capacitor.datacapture.core.workers.UiWorker
import com.scandit.datacapture.barcode.capture.BarcodeCapture
import com.scandit.datacapture.barcode.capture.BarcodeCaptureDeserializer
import com.scandit.datacapture.barcode.capture.BarcodeCaptureDeserializerListener
import com.scandit.datacapture.barcode.capture.BarcodeCaptureListener
import com.scandit.datacapture.barcode.capture.BarcodeCaptureSession
import com.scandit.datacapture.barcode.capture.BarcodeCaptureSettings
import com.scandit.datacapture.barcode.data.CompositeTypeDescription
import com.scandit.datacapture.barcode.data.SymbologyDescription
import com.scandit.datacapture.barcode.selection.capture.BarcodeSelection
import com.scandit.datacapture.barcode.selection.capture.BarcodeSelectionDeserializer
import com.scandit.datacapture.barcode.selection.capture.BarcodeSelectionDeserializerListener
import com.scandit.datacapture.barcode.selection.capture.BarcodeSelectionListener
import com.scandit.datacapture.barcode.selection.capture.BarcodeSelectionSession
import com.scandit.datacapture.barcode.tracking.capture.BarcodeTracking
import com.scandit.datacapture.barcode.tracking.capture.BarcodeTrackingDeserializer
import com.scandit.datacapture.barcode.tracking.capture.BarcodeTrackingDeserializerListener
import com.scandit.datacapture.barcode.tracking.capture.BarcodeTrackingListener
import com.scandit.datacapture.barcode.tracking.capture.BarcodeTrackingSession
import com.scandit.datacapture.barcode.tracking.capture.BarcodeTrackingSettings
import com.scandit.datacapture.barcode.tracking.data.TrackedBarcode
import com.scandit.datacapture.barcode.tracking.ui.overlay.BarcodeTrackingAdvancedOverlay
import com.scandit.datacapture.barcode.tracking.ui.overlay.BarcodeTrackingAdvancedOverlayListener
import com.scandit.datacapture.barcode.tracking.ui.overlay.BarcodeTrackingBasicOverlay
import com.scandit.datacapture.barcode.tracking.ui.overlay.BarcodeTrackingBasicOverlayListener
import com.scandit.datacapture.barcode.tracking.ui.overlay.BarcodeTrackingBasicOverlayStyle
import com.scandit.datacapture.barcode.tracking.ui.overlay.toJson
import com.scandit.datacapture.barcode.ui.overlay.BarcodeCaptureOverlay
import com.scandit.datacapture.barcode.ui.overlay.BarcodeCaptureOverlayStyle
import com.scandit.datacapture.barcode.ui.overlay.toJson
import com.scandit.datacapture.core.capture.serialization.DataCaptureModeDeserializer
import com.scandit.datacapture.core.common.geometry.Anchor
import com.scandit.datacapture.core.common.geometry.MeasureUnit
import com.scandit.datacapture.core.common.geometry.PointWithUnit
import com.scandit.datacapture.core.data.FrameData
import com.scandit.datacapture.core.json.JsonValue
import com.scandit.datacapture.core.ui.style.Brush
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject

@CapacitorPlugin(
    name = "ScanditBarcodeNative"
)
class ScanditBarcodeNative :
    Plugin(),
    com.scandit.capacitor.datacapture.barcode.CapacitorPlugin,
    ActionFinishHandler,
    BarcodeCaptureListener,
    BarcodeTrackingListener,
    BarcodeSelectionListener,
    BarcodeTrackingBasicOverlayListener,
    BarcodeTrackingAdvancedOverlayListener,
    BarcodeCaptureDeserializerListener,
    BarcodeTrackingDeserializerListener,
    BarcodeSelectionDeserializerListener,
    ModeDeserializersProvider {

    companion object {
        private const val FIELD_RESULT = "result"
        private const val CORE_PLUGIN_NAME = "ScanditCaptureCoreNative"
    }

    private val barcodeCallbacks: BarcodeCallbackContainer = BarcodeCallbackContainer()
    private val barcodeCaptureHandler: BarcodeCaptureHandler = BarcodeCaptureHandler(this)
    private val barcodeTrackingHandler: BarcodeTrackingHandler = BarcodeTrackingHandler(this)
    private val barcodeSelectionHandler: BarcodeSelectionHandler = BarcodeSelectionHandler(this)
    private val barcodeTrackingBasicOverlayHandler = BarcodeTrackingBasicOverlayHandler(this)
    private val barcodeTrackingAdvancedOverlayHandler = BarcodeTrackingAdvancedOverlayHandler(this)

    private val uiWorker = UiWorker()

    private val finnishCallbackHelper = FinishCallbackHelper()

    override fun load() {
        super.load()

        // We need to register the plugin with its Core dependency for serializers to load.
        val corePlugin = bridge.getPlugin(CORE_PLUGIN_NAME)
        if (corePlugin != null) {
            (corePlugin.instance as ScanditCaptureCoreNative)
                .registerPluginInstance(pluginHandle.instance)
        } else {
            Log.e("Registering:", "Core not found")
        }
    }

    //region BarcodeCaptureListener
    override fun onSessionUpdated(
        barcodeCapture: BarcodeCapture,
        session: BarcodeCaptureSession,
        data: FrameData
    ) {
        barcodeCallbacks.barcodeCaptureCallback?.onSessionUpdated(barcodeCapture, session, data)
    }

    override fun onBarcodeScanned(
        barcodeCapture: BarcodeCapture,
        session: BarcodeCaptureSession,
        data: FrameData
    ) {
        barcodeCallbacks.barcodeCaptureCallback?.onBarcodeScanned(barcodeCapture, session, data)
    }
    //endregion

    //region BarcodeTrackingListener
    override fun onSessionUpdated(
        mode: BarcodeTracking,
        session: BarcodeTrackingSession,
        data: FrameData
    ) {
        barcodeCallbacks.barcodeTrackingCallback?.onSessionUpdated(mode, session, data)
    }
    //endregion

    //region BarcodeTrackingBasicOverlayListener
    override fun brushForTrackedBarcode(
        overlay: BarcodeTrackingBasicOverlay,
        trackedBarcode: TrackedBarcode
    ): Brush? {
        return barcodeCallbacks.barcodeTrackingBasicOverlayCallback?.brushForTrackedBarcode(
            overlay, trackedBarcode, switchToOverlayWorker = true
        )
    }

    override fun onTrackedBarcodeTapped(
        overlay: BarcodeTrackingBasicOverlay,
        trackedBarcode: TrackedBarcode
    ) {
        barcodeCallbacks.barcodeTrackingBasicOverlayCallback?.onTrackedBarcodeTapped(
            overlay, trackedBarcode, switchToOverlayWorker = true
        )
    }
    //endregion

    //region BarcodeTrackingAdvancedOverlayListener
    override fun viewForTrackedBarcode(
        overlay: BarcodeTrackingAdvancedOverlay,
        trackedBarcode: TrackedBarcode
    ): View? {
        return barcodeCallbacks.barcodeTrackingAdvancedOverlayCallback?.viewForTrackedBarcode(
            overlay, trackedBarcode, switchToOverlayWorker = true
        )
    }

    override fun offsetForTrackedBarcode(
        overlay: BarcodeTrackingAdvancedOverlay,
        trackedBarcode: TrackedBarcode,
        view: View
    ): PointWithUnit {
        return barcodeCallbacks.barcodeTrackingAdvancedOverlayCallback?.offsetForTrackedBarcode(
            overlay, trackedBarcode, switchToOverlayWorker = true
        ) ?: PointWithUnit(0f, 0f, MeasureUnit.PIXEL)
    }

    override fun anchorForTrackedBarcode(
        overlay: BarcodeTrackingAdvancedOverlay,
        trackedBarcode: TrackedBarcode
    ): Anchor {
        return barcodeCallbacks.barcodeTrackingAdvancedOverlayCallback?.anchorForTrackedBarcode(
            overlay, trackedBarcode, switchToOverlayWorker = true
        ) ?: Anchor.CENTER
    }
    //endregion

    //region ModeDeserializersProvider
    override fun provideModeDeserializers(): List<DataCaptureModeDeserializer> = listOf(
        BarcodeCaptureDeserializer().also {
            it.listener = this
        },
        BarcodeTrackingDeserializer().also {
            it.listener = this
        },
        BarcodeSelectionDeserializer().also {
            it.listener = this
        }
    )
    //endregion

    //region BarcodeCaptureDeserializerListener
    override fun onModeDeserializationFinished(
        deserializer: BarcodeCaptureDeserializer,
        mode: BarcodeCapture,
        json: JsonValue
    ) {
        barcodeCaptureHandler.attachBarcodeCapture(mode)
    }
    //endregion

    //region BarcodeTrackingDeserializerListener
    override fun onModeDeserializationFinished(
        deserializer: BarcodeTrackingDeserializer,
        mode: BarcodeTracking,
        json: JsonValue
    ) {
        if (json.contains("enabled")) {
            mode.isEnabled = json.requireByKeyAsBoolean("enabled")
        }
        barcodeTrackingHandler.attachBarcodeTracking(mode)
    }

    //region BarcodeSelectionDeserializerListener
    override fun onModeDeserializationFinished(
        deserializer: BarcodeSelectionDeserializer,
        mode: BarcodeSelection,
        json: JsonValue
    ) {
        if (json.contains("enabled")) {
            mode.isEnabled = json.requireByKeyAsBoolean("enabled")
        }
        barcodeSelectionHandler.attachBarcodeSelection(mode)
    }

    override fun onBasicOverlayDeserializationStarted(
        deserializer: BarcodeTrackingDeserializer,
        overlay: BarcodeTrackingBasicOverlay,
        json: JsonValue
    ) {
        barcodeTrackingBasicOverlayHandler.attachOverlay(overlay)
    }

    override fun onAdvancedOverlayDeserializationStarted(
        deserializer: BarcodeTrackingDeserializer,
        overlay: BarcodeTrackingAdvancedOverlay,
        json: JsonValue
    ) {
        barcodeTrackingAdvancedOverlayHandler.attachOverlay(overlay)
    }
    //endregion

    //region BarcodeSelectionListener
    override fun onSelectionUpdated(
        barcodeSelection: BarcodeSelection,
        session: BarcodeSelectionSession,
        frameData: FrameData?
    ) {
        barcodeCallbacks.barcodeSelectionCallback?.onSelectionUpdated(barcodeSelection, session)
    }

    override fun onSessionUpdated(
        barcodeSelection: BarcodeSelection,
        session: BarcodeSelectionSession,
        frameData: FrameData?
    ) {
        barcodeCallbacks.barcodeSelectionCallback?.onSessionUpdated(barcodeSelection, session)
    }
    //endregion

    @PluginMethod
    fun finishCallback(call: PluginCall) {
        try {
            val data = call.data
            // We need the "result" field to exist ( null is also allowed )
            if (!data.has(FIELD_RESULT)) {
                throw JSONException("Missing $FIELD_RESULT field in response json")
            }
            val result: JSONObject = data.optJSONObject(FIELD_RESULT) ?: JSONObject()
            when {
                finnishCallbackHelper.isFinishBarcodeCaptureModeCallback(result) ->
                    onFinishBarcodeCaptureMode(
                        SerializableFinishModeCallbackData.fromJson(result), call
                    )

                finnishCallbackHelper.isFinishBarcodeTrackingModeCallback(result) ->
                    onFinishBarcodeTrackingMode(
                        SerializableFinishModeCallbackData.fromJson(result), call
                    )

                finnishCallbackHelper.isFinishBarcodeSelectionModeCallback(result) ->
                    onFinishBarcodeSelectionMode(
                        SerializableFinishModeCallbackData.fromJson(result), call
                    )

                finnishCallbackHelper.isFinishBarcodeTrackingBasicOverlayCallback(result) ->
                    onFinishBasicOverlay(
                        SerializableFinishBasicOverlayCallbackData.fromJson(result),
                        call
                    )

                finnishCallbackHelper.isFinishBarcodeTrackingAdvancedOverlayViewCallback(result) ->
                    onFinishAdvancedOverlayView(
                        SerializableFinishAdvancedOverlayViewData.fromJson(result),
                        call
                    )

                finnishCallbackHelper.isFinishBarcodeTrackingAdvancedOverlayOffsetCallback(
                    result
                ) ->
                    onFinishAdvancedOverlayOffset(
                        SerializableFinishAdvancedOverlayOffsetData.fromJson(result),
                        call
                    )

                finnishCallbackHelper.isFinishBarcodeTrackingAdvancedOverlayAnchorCallback(
                    result
                ) ->
                    onFinishAdvancedOverlayAnchor(
                        SerializableFinishAdvancedOverlayAnchorData.fromJson(result),
                        call
                    )

                finnishCallbackHelper.isFinishBarcodeTrackingAdvancedOverlayTapCallback(result) ->
                    onFinishAdvancedOverlayTap(call)

                else -> throw JSONException(
                    "Cannot recognise finish callback action with result $result"
                )
            }
        } catch (e: JSONException) {
            onJsonParseError(e, call)
        } catch (e: RuntimeException) { // TODO [SDC-1851] - fine-catch deserializer exceptions
            onJsonParseError(e, call)
        }
    }

    //region ActionInjectDefaults.ResultListener
    @PluginMethod
    fun getDefaults(call: PluginCall) {
        try {
            val captureSettings = BarcodeCaptureSettings()
            val capture = BarcodeCapture.forDataCaptureContext(null, captureSettings)
            val defaultCaptureOverlayStyle = BarcodeCaptureOverlay.newInstance(capture, null).style
            val brush = BarcodeCaptureOverlay.defaultBrush(defaultCaptureOverlayStyle)
            val symbologyDescriptions = SymbologyDescription.all()
            val captureCameraSettings = BarcodeCapture.createRecommendedCameraSettings()

            val tracking = BarcodeTracking.forDataCaptureContext(null, BarcodeTrackingSettings())
            val defaultTrackingBasicOverlayStyle = BarcodeTrackingBasicOverlay.newInstance(
                tracking,
                null
            ).style

            val trackingCameraSettings = BarcodeTracking.createRecommendedCameraSettings()

            val defaults = SerializableBarcodeDefaults(
                barcodeCaptureDefaults = SerializableBarcodeCaptureDefaults(
                    barcodeCaptureOverlayDefaults = SerializableBarcodeCaptureOverlayDefaults(
                        brushDefaults = SerializableBrushDefaults(brush = brush),
                        defaultStyle = defaultCaptureOverlayStyle.toJson(),
                        styles = BarcodeCaptureOverlayStyle.values()
                    ),
                    barcodeCaptureSettingsDefaults = SerializableBarcodeCaptureSettingsDefaults(
                        codeDuplicateFilter = captureSettings.codeDuplicateFilter.asMillis()
                    ),
                    recommendedCameraSettings = SerializableCameraSettingsDefault(
                        settings = captureCameraSettings
                    )
                ),
                symbologySettingsDefaults = SerializableSymbologySettingsDefaults(
                    barcodeCaptureSettings = captureSettings
                ),
                symbologyDescriptionsDefaults = JSONArray(
                    symbologyDescriptions.map { it.toJson() }
                ),
                barcodeTrackingDefaults = SerializableBarcodeTrackingDefaults(
                    recommendedCameraSettings = SerializableCameraSettingsDefault(
                        settings = trackingCameraSettings
                    ),
                    trackingBasicOverlayDefaults = SerializableTrackingBasicOverlayDefaults(
                        defaultBrush = SerializableBrushDefaults(
                            brush = BarcodeTrackingBasicOverlay.defaultBrush(
                                defaultTrackingBasicOverlayStyle
                            )
                        ),
                        defaultStyle = defaultTrackingBasicOverlayStyle.toJson(),
                        styles = BarcodeTrackingBasicOverlayStyle.values()
                    )
                ),
                barcodeSelectionDefaults = SerializableBarcodeSelectionDefaults.create(),
                compositeTypeDescriptions = JSONArray(
                    CompositeTypeDescription.all().map { it.toJson() }
                )
            )
            call.resolve(JSObject.fromJSONObject(defaults.toJson()))
        } catch (e: JSONException) {
            call.reject(JsonParseError(e.message).toString())
        }
    }
    //endregion

    //region ActionSubscribeBarcodeCapture.ResultListener
    @PluginMethod
    fun subscribeBarcodeCaptureListener(call: PluginCall) {
        barcodeCallbacks.setBarcodeCaptureCallback(BarcodeCaptureCallback(this))
        call.resolve()
    }
    //endregion

    //region ActionSubscribeBarcodeTracking.ResultListener
    @PluginMethod
    fun subscribeBarcodeTrackingListener(call: PluginCall) {
        barcodeCallbacks.setBarcodeTrackingCallback(BarcodeTrackingCallback(this))
        call.resolve()
    }
    //endregion

    //region ActionSubscribeBasicOverlay.ResultListener
    @PluginMethod
    fun subscribeBarcodeTrackingBasicOverlayListener(call: PluginCall) {
        barcodeCallbacks.setBarcodeTrackingBasicOverlayCallback(
            BarcodeTrackingBasicOverlayCallback(this)
        )
        call.resolve()
    }
    //endregion

    // region ActionSubscribeBarcodeSelection.ResultListener
    @PluginMethod
    fun subscribeBarcodeSelectionListener(call: PluginCall) {
        barcodeCallbacks.setBarcodeSelectionCallback(
            BarcodeSelectionCallback(this)
        )
        call.resolve()
    }
    //endregion

    //region ActionClearTrackedBarcodeBrushes.ResultListener
    @PluginMethod
    fun clearTrackedBarcodeBrushes(call: PluginCall) {
        val barcodeTrackingBasicOverlayCallback =
            barcodeCallbacks.barcodeTrackingBasicOverlayCallback
                ?: return call.resolve()
        val overlay = barcodeTrackingBasicOverlayHandler.barcodeTrackingBasicOverlay
            ?: return call.resolve()

        barcodeTrackingBasicOverlayCallback.clearBrushes(overlay, switchToOverlayWorker = true)
        call.resolve()
    }
    //endregion

    //region ActionSetBrushForTrackedBarcode.ResultListener
    @PluginMethod
    fun setBrushForTrackedBarcode(call: PluginCall) {
        try {
            val data = SerializableBrushAndTrackedBarcode(
                JSONObject(call.data.toString())
            )
            val overlay = barcodeTrackingBasicOverlayHandler.barcodeTrackingBasicOverlay
                ?: return call.resolve()
            val barcodeTrackingCallback = barcodeCallbacks.barcodeTrackingCallback
                ?: return call.resolve()
            val barcodeTrackingBasicOverlayCallback =
                barcodeCallbacks.barcodeTrackingBasicOverlayCallback
                    ?: return call.resolve()

            val trackedBarcode = barcodeTrackingCallback.getTrackedBarcodeFromLatestSession(
                data.trackedBarcodeId, data.sessionFrameSequenceId
            )
            if (trackedBarcode == null) {
                call.reject(ErrorTrackedBarcodeNotFound().toString())
            } else {
                barcodeTrackingBasicOverlayCallback.setBrushForTrackedBarcode(
                    trackedBarcode, data.brush, overlay, switchToOverlayWorker = true
                )
                call.resolve()
            }
        } catch (e: JSONException) {
            call.reject(JsonParseError(e.message).toString())
        } catch (e: RuntimeException) { // TODO [SDC-1851] - fine-catch deserializer exceptions
            call.reject(JsonParseError(e.message).toString())
        }
    }
    //endregion

    //region ActionSubscribeAdvancedOverlay.ResultListener
    @PluginMethod
    fun subscribeBarcodeTrackingAdvancedOverlayListener(call: PluginCall) {
        barcodeCallbacks.setBarcodeTrackingAdvancedOverlayCallback(
            BarcodeTrackingAdvancedOverlayCallback(
                this,
                AdvancedOverlayViewPool(bridge.context),
                uiWorker
            )
        )
        call.resolve()
    }
    //endregion

    //region ActionSetViewForTrackedBarcode.ResultListener
    @PluginMethod
    fun setViewForTrackedBarcode(call: PluginCall) {
        try {
            val data = SerializableAdvancedOverlayViewActionData(
                JSONObject(call.data.toString())
            )

            val doneData = getAdvancedOverlayActionDoneData()

            doneData?.let { (overlay, trackingCallback, overlayCallback) ->
                val trackedBarcode = trackingCallback.getTrackedBarcodeFromLatestSession(
                    data.trackedBarcodeId, data.sessionFrameSequenceId
                ) ?: return call.reject(ErrorTrackedBarcodeNotFound().toString())

                overlayCallback.setViewForTrackedBarcode(
                    trackedBarcode, data.view, overlay, switchToOverlayWorker = true
                )
            }
        } catch (e: JSONException) {
            call.reject(JsonParseError(e.message).toString())
        } catch (e: RuntimeException) { // TODO [SDC-1851] - fine-catch deserializer exceptions
            call.reject(JsonParseError(e.message).toString())
        }

        call.resolve()
    }
    //endregion

    //region ActionSetOffsetForTrackedBarcode.ResultListener
    @PluginMethod
    fun setOffsetForTrackedBarcode(call: PluginCall) {
        try {
            // TODO: check how data is called to retrieve it from the call
            val data = SerializableAdvancedOverlayOffsetActionData(
                JSONObject(call.data.toString())
            )
            val doneData = getAdvancedOverlayActionDoneData()
            doneData?.let { (overlay, trackingCallback, overlayCallback) ->
                val trackedBarcode = trackingCallback.getTrackedBarcodeFromLatestSession(
                    data.trackedBarcodeId, data.sessionFrameSequenceId
                ) ?: return call.reject(ErrorTrackedBarcodeNotFound().toString())

                overlayCallback.setOffsetForTrackedBarcode(
                    trackedBarcode, data.offset, overlay, switchToOverlayWorker = true
                )
            }
        } catch (e: JSONException) {
            call.reject(JsonParseError(e.message).toString())
        } catch (e: RuntimeException) { // TODO [SDC-1851] - fine-catch deserializer exceptions
            call.reject(JsonParseError(e.message).toString())
        }

        call.resolve()
    }
    //endregion

    //region ActionSetAnchorForTrackedBarcode.ResultListener
    @PluginMethod
    fun setAnchorForTrackedBarcode(call: PluginCall) {
        try {
            val data = SerializableAdvancedOverlayAnchorActionData(
                JSONObject(call.data.toString())
            )
            val doneData = getAdvancedOverlayActionDoneData()
            doneData?.let { (overlay, trackingCallback, overlayCallback) ->
                val trackedBarcode = trackingCallback.getTrackedBarcodeFromLatestSession(
                    data.trackedBarcodeId, data.sessionFrameSequenceId
                ) ?: return call.reject(ErrorTrackedBarcodeNotFound().toString())

                overlayCallback.setAnchorForTrackedBarcode(
                    trackedBarcode, data.anchor, overlay, switchToOverlayWorker = true
                )
            }
        } catch (e: JSONException) {
            call.reject(JsonParseError(e.message).toString())
        } catch (e: RuntimeException) { // TODO [SDC-1851] - fine-catch deserializer exceptions
            call.reject(JsonParseError(e.message).toString())
        }

        call.resolve()
    }
    //endregion

    //region ActionClearTrackedBarcodeViews.ResultListener
    @PluginMethod
    fun clearTrackedBarcodeViews(call: PluginCall) {
        getAdvancedOverlayActionDoneData()?.let { (overlay, _, overlayCallback) ->
            overlayCallback.clearViews(overlay, switchToOverlayWorker = true)
        }
        call.resolve()
    }
    //endregion

    @PluginMethod
    fun getCountForBarcodeInBarcodeSelectionSession(call: PluginCall) {
        try {
            val parsedData = SerializableBarcodeSelectionSessionData(
                call.data
            )
            onGetCountForBarcodeInBarcodeSelectionSession(parsedData, call)
        } catch (e: JSONException) {
            println(e)
            onJsonParseError(e, call)
        } catch (e: RuntimeException) {
            println(e)
            onJsonParseError(e, call)
        }
    }

    @PluginMethod
    fun resetBarcodeCaptureSession(call: PluginCall) {
        try {
            onResetBarcodeCaptureSession(call)
        } catch (e: JSONException) {
            println(e)
            onJsonParseError(e, call)
        } catch (e: RuntimeException) {
            println(e)
            onJsonParseError(e, call)
        }
    }

    @PluginMethod
    fun resetBarcodeTrackingSession(call: PluginCall) {
        try {
            onResetBarcodeTrackingSession(call)
        } catch (e: JSONException) {
            println(e)
            onJsonParseError(e, call)
        } catch (e: RuntimeException) {
            println(e)
            onJsonParseError(e, call)
        }
    }

    @PluginMethod
    fun resetBarcodeSelectionSession(call: PluginCall) {
        try {
            onResetBarcodeSelectionSession(call)
        } catch (e: JSONException) {
            println(e)
            onJsonParseError(e, call)
        } catch (e: RuntimeException) {
            println(e)
            onJsonParseError(e, call)
        }
    }

    @PluginMethod
    fun resetBarcodeSelection(call: PluginCall) {
        try {
            onResetBarcodeSelection(call)
        } catch (e: JSONException) {
            println(e)
            onJsonParseError(e, call)
        } catch (e: RuntimeException) {
            println(e)
            onJsonParseError(e, call)
        }
    }

    @PluginMethod
    fun unfreezeCameraInBarcodeSelection(call: PluginCall) {
        try {
            onUnfreezeCameraInBarcodeSelection(call)
        } catch (e: JSONException) {
            println(e)
            onJsonParseError(e, call)
        } catch (e: RuntimeException) {
            println(e)
            onJsonParseError(e, call)
        }
    }

    fun onGetCountForBarcodeInBarcodeSelectionSession(
        data: SerializableBarcodeSelectionSessionData,
        call: PluginCall
    ) {
        call.resolve(
            JSObject.fromJSONObject(
                JSONObject(
                    mapOf(
                        FIELD_RESULT to (
                            barcodeCallbacks.barcodeSelectionCallback?.getBarcodeCount(
                                data.selectionIdentifier
                            ) ?: 0
                            )
                    )
                )
            )

        )
    }

    fun onUnfreezeCameraInBarcodeSelection(call: PluginCall) {
        barcodeSelectionHandler.barcodeSelection?.unfreezeCamera()
        call.resolve()
    }

    fun onResetBarcodeSelection(call: PluginCall) {
        barcodeSelectionHandler.barcodeSelection?.reset()
        call.resolve()
    }

    fun onResetBarcodeCaptureSession(call: PluginCall) {
        barcodeCallbacks.barcodeCaptureCallback?.latestSession()?.reset()
        call.resolve()
    }

    fun onResetBarcodeTrackingSession(call: PluginCall) {
        barcodeCallbacks.barcodeTrackingCallback?.latestSession()?.reset()
        call.resolve()
    }

    fun onResetBarcodeSelectionSession(call: PluginCall) {
        barcodeCallbacks.barcodeSelectionCallback?.latestSession()?.reset()
        call.resolve()
    }

    private fun getAdvancedOverlayActionDoneData(): Triple<
        BarcodeTrackingAdvancedOverlay,
        BarcodeTrackingCallback,
        BarcodeTrackingAdvancedOverlayCallback>? {
        val overlay = barcodeTrackingAdvancedOverlayHandler.barcodeTrackingAdvancedOverlay
            ?: return null
        val barcodeTrackingCallback = barcodeCallbacks.barcodeTrackingCallback ?: return null
        val overlayCallback = barcodeCallbacks.barcodeTrackingAdvancedOverlayCallback ?: return null

        return Triple(overlay, barcodeTrackingCallback, overlayCallback)
    }

    override fun notify(name: String, data: JSObject) {
        notifyListeners(name, data)
    }

    //region ActionFinishCallback.ResultListener
    override fun onFinishBarcodeCaptureMode(
        finishData: SerializableFinishModeCallbackData?,
        call: PluginCall
    ) {
        barcodeCallbacks.onFinishBarcodeCaptureAction(finishData)
    }

    override fun onFinishBarcodeTrackingMode(
        finishData: SerializableFinishModeCallbackData?,
        call: PluginCall
    ) {
        barcodeCallbacks.onFinishBarcodeTrackingAction(finishData)
    }

    override fun onFinishBarcodeSelectionMode(
        finishData: SerializableFinishModeCallbackData?,
        call: PluginCall
    ) {
        barcodeCallbacks.onFinishBarcodeSelectionAction(finishData)
    }

    override fun onFinishBasicOverlay(
        finishData: SerializableFinishBasicOverlayCallbackData?,
        call: PluginCall
    ) {
        barcodeCallbacks.onFinishBasicOverlayAction(finishData)
    }

    override fun onFinishAdvancedOverlayView(
        finishData: SerializableFinishAdvancedOverlayViewData?,
        call: PluginCall
    ) {
        barcodeCallbacks.onFinishAdvancedOverlayViewAction(finishData)
    }

    override fun onFinishAdvancedOverlayOffset(
        finishData: SerializableFinishAdvancedOverlayOffsetData?,
        call: PluginCall
    ) {
        barcodeCallbacks.onFinishAdvancedOverlayOffsetAction(finishData)
    }

    override fun onFinishAdvancedOverlayAnchor(
        finishData: SerializableFinishAdvancedOverlayAnchorData?,
        call: PluginCall
    ) {
        barcodeCallbacks.onFinishAdvancedOverlayAnchorAction(finishData)
    }

    override fun onFinishAdvancedOverlayTap(
        call: PluginCall
    ) {
        barcodeCallbacks.onFinishAdvancedOverlayTapAction()
    }

    override fun onJsonParseError(error: Throwable, call: PluginCall) {
        error.printStackTrace()
        call.reject(JsonParseError(error.message).toString())
    }
    //endregion
}

interface CapacitorPlugin {
    fun notify(name: String, data: JSObject)
}
