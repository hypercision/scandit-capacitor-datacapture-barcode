/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2023- Scandit AG. All rights reserved.
 */

import ScanditCaptureCore
import ScanditCapacitorDatacaptureCore

struct BrushAndTrackedBarcodeJSON: CommandJSONArgument {
    enum CodingKeys: String, CodingKey {
        case trackedBarcodeID
        case sessionFrameSequenceID
        case brushJSONString = "brush"
    }

    let brushJSONString: String?
    let trackedBarcodeID: String
    let sessionFrameSequenceID: String?

    var brush: Brush? {
        guard let jsonString = brushJSONString else {
            return nil
        }

        return Brush(jsonString: jsonString)
    }
}

struct ViewAndTrackedBarcodeJSON: CommandJSONArgument {
    let view: TrackedBarcodeView.JSON?
    let trackedBarcodeID: String
    let sessionFrameSequenceID: String?
}

struct AnchorAndTrackedBarcodeJSON: CommandJSONArgument {
    let anchor: String?
    let trackedBarcodeID: String
    let sessionFrameSequenceID: String?
}

struct OffsetAndTrackedBarcodeJSON: CommandJSONArgument {
    let offset: String?
    let trackedBarcodeID: String
    let sessionFrameSequenceID: String?
}

struct SelectionIdentifierBarcodeJSON: CommandJSONArgument {
    let selectionIdentifier: String
}
