/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2023- Scandit AG. All rights reserved.
 */

import ScanditBarcodeCapture

extension Dictionary where Key == NSNumber, Value == TrackedBarcode {
    func trackedBarcode(withID id: String) -> TrackedBarcode? {
        guard let trackedBarcodeID = Int(id),
              // swiftlint:disable:next compiler_protocol_init
              let trackedBarcode = self[NSNumber(integerLiteral: trackedBarcodeID)] else {
            return nil
        }

        return trackedBarcode
    }
}
