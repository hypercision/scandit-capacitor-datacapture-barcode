import { Capacitor, CapacitorFunction } from './Capacitor';
export class BarcodeSelectionProxy {
    reset() {
        return new Promise((resolve, reject) => {
            BarcodeSelectionProxy.exec(resolve, reject, CapacitorFunction.ResetBarcodeSelection, null);
        });
    }
    unfreezeCamera() {
        return new Promise((resolve, reject) => {
            BarcodeSelectionProxy.exec(resolve, reject, CapacitorFunction.UnfreezeCameraInBarcodeSelection, null);
        });
    }
}
BarcodeSelectionProxy.exec = Capacitor.exec;
//# sourceMappingURL=BarcodeSelectionProxy.js.map