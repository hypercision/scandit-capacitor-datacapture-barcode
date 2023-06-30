/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2023- Scandit AG. All rights reserved.
 */

import ScanditBarcodeCapture
import ScanditCapacitorDatacaptureCore
import WebKit

class BarcodeCountViewHandler {
    let webView: WKWebView

    var barcodeCountView: BarcodeCountView? {
        willSet {
            barcodeCountView?.delegate = nil
            barcodeCountView?.uiDelegate = nil
            barcodeCountView?.removeFromSuperview()
        }
        didSet {
            guard let barcodeCountView = barcodeCountView else { return }
            barcodeCountView.translatesAutoresizingMaskIntoConstraints = false
            barcodeCountView.delegate = barcodeCountViewDelegate
            barcodeCountView.uiDelegate = barcodeCountViewUIDelegate
            webView.addSubview(barcodeCountView)
            resetConstraints()
            update()
        }
    }

    weak var barcodeCountViewDelegate: BarcodeCountViewDelegate?
    weak var barcodeCountViewUIDelegate: BarcodeCountViewUIDelegate?

    private var top: NSLayoutConstraint?
    private var left: NSLayoutConstraint?
    private var width: NSLayoutConstraint?
    private var height: NSLayoutConstraint?

    private var position = CGPoint.zero
    private var size = CGSize.zero
    private var shouldBeUnderWebView = false

    private var constraints: [NSLayoutConstraint] {
        return [top, left, width, height].compactMap({ $0 })
    }

    init(relativeTo webView: WKWebView) {
        self.webView = webView
    }

    /// Update the constraints that set the position and size of the capture view,
    /// based on a JSON passed in as the argument to a Cordova command.
    ///
    /// If the view does not exist yet, the position and size are stored and will be applied to the view
    /// when it's created (and the constraints object is updated with the new view).
    ///
    /// - Parameter positionAndSizeJSON: The JSON passed to the Cordova command
    func updatePositionAndSize(fromJSON positionAndSizeJSON: ViewPositionAndSizeJSON) {
        position = positionAndSizeJSON.position
        size = positionAndSizeJSON.size
        shouldBeUnderWebView = positionAndSizeJSON.shouldBeUnderWebView
        update()
    }

    private func update() {
        updateConstraints()
        updatePosition()
    }

    private func activate() {
        NSLayoutConstraint.activate(constraints)
    }

    private func resetConstraints() {
        top = nil
        left = nil
        width = nil
        height = nil
    }

    private func updateConstraints() {
        guard let barcodeCountView = barcodeCountView else {
            return
        }

        let topConstant = position.y + webView.adjustedContentInset.top
        let leftConstant = position.x + webView.adjustedContentInset.left

        if let top = top {
            top.constant = topConstant
        } else {
            top = barcodeCountView.topAnchor.constraint(equalTo: webView.topAnchor, constant: topConstant)
            top?.isActive = true
        }

        if let left = left {
            left.constant = leftConstant
        } else {
            left = barcodeCountView.leadingAnchor.constraint(equalTo: webView.leadingAnchor, constant: leftConstant)
            left?.isActive = true
        }

        if let width = width {
            width.constant = size.width
        } else {
            width = barcodeCountView.widthAnchor.constraint(equalToConstant: size.width)
            width?.isActive = true
        }

        if let height = height {
            height.constant = size.height
        } else {
            height = barcodeCountView.heightAnchor.constraint(equalToConstant: size.height)
            height?.isActive = true
        }

        barcodeCountView.superview?.layoutIfNeeded()
    }

    private func updatePosition() {
        guard let barcodeCountView = barcodeCountView else {
            return
        }

        if shouldBeUnderWebView {
            barcodeCountView.superview?.sendSubviewToBack(barcodeCountView)
        } else {
            barcodeCountView.superview?.bringSubviewToFront(barcodeCountView)
        }
    }
}
