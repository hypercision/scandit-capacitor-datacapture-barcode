import { Size } from '../../../scandit-capacitor-datacapture-core/src/ts/Common';
import { DefaultSerializeable } from '../../../scandit-capacitor-datacapture-core/src/ts/Serializeable';
export class TrackedBarcodeView extends DefaultSerializeable {
    static withHTMLElement(element, options) {
        return this.getEncodedImageData(element).then(data => new TrackedBarcodeView(data, options));
    }
    static withBase64EncodedData(data, options) {
        return Promise.resolve(new TrackedBarcodeView(data, options));
    }
    static getEncodedImageData(element) {
        return this.getBase64DataForSVG(this.getSVGDataForElement(element));
    }
    static getSize(element) {
        const isInDOM = document.body.contains(element);
        if (!isInDOM) {
            document.body.appendChild(element);
        }
        const size = element.getBoundingClientRect();
        if (!isInDOM) {
            document.body.removeChild(element);
        }
        return new Size(size.width, size.height);
    }
    static getSVGDataForElement(element) {
        const size = this.getSize(element);
        const data = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}px" height="${size.height}px">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml">
            ${element.outerHTML}
          </div>
        </foreignObject>
      </svg>`);
        return { data, size };
    }
    static getCanvasWithSize(size) {
        const canvas = document.createElement('canvas');
        canvas.width = size.width;
        canvas.height = size.height;
        return canvas;
    }
    static getBase64DataForSVG(svgData) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
                const canvas = this.getCanvasWithSize(svgData.size);
                canvas.getContext('2d').drawImage(image, 0, 0);
                resolve(canvas.toDataURL('image/png', 1));
            };
            image.onerror = reject;
            image.src = 'data:image/svg+xml,' + svgData.data;
        });
    }
    constructor(encodedData, options) {
        super();
        if (options == null) {
            options = { scale: 1 };
        }
        this.data = encodedData;
        this.options = options;
    }
}
//# sourceMappingURL=TrackedBarcodeView.js.map