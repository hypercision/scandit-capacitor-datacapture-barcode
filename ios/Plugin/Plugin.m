/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2023- Scandit AG. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(ScanditBarcodeCapture, "ScanditBarcodeNative",
           CAP_PLUGIN_METHOD(getDefaults, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(subscribeBarcodeCaptureListener, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(subscribeBarcodeTrackingListener, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(subscribeBarcodeTrackingBasicOverlayListener, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(subscribeBarcodeTrackingAdvancedOverlayListener,
                             CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(finishCallback, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setBrushForTrackedBarcode, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(clearTrackedBarcodeBrushes, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setViewForTrackedBarcode, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setAnchorForTrackedBarcode, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setOffsetForTrackedBarcode, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(clearTrackedBarcodeViews, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(subscribeBarcodeSelectionListener, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(resetBarcodeSelection, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(resetBarcodeCaptureSession, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(resetBarcodeTrackingSession, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(resetBarcodeSelectionSession, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(unfreezeCameraInBarcodeSelection, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getCountForBarcodeInBarcodeSelectionSession, CAPPluginReturnPromise);
           // Barcode count
           CAP_PLUGIN_METHOD(registerBarcodeCountListener, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(registerBarcodeCountViewListener, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(registerBarcodeCountViewUiListener, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(unegisterBarcodeCountListener, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(unregisterBarcodeCountViewListener, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(unregisterBarcodeCountViewUiListener, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setViewPositionAndSize, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(showView, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(hideView, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(createView, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(updateView, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(updateMode, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(resetBarcodeCount, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(resetBarcodeCountSession, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(startScanningPhase, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(endScanningPhase, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(clearBarcodeCountViewHighlights, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setBarcodeCountCaptureList, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(finishBarcodeCountListenerOnScan, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(finishBarcodeCountViewListenerBrushForRecognizedBarcode,
                             CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(finishBarcodeCountViewListenerBrushForRecognizedBarcodeNotInList,
                             CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(finishBarcodeCountViewListenerOnBrushForUnrecognizedBarcode,
                             CAPPluginReturnPromise);)
