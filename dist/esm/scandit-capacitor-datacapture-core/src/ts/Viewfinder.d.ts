import { Color, NumberWithUnit, SizeWithUnit, SizeWithUnitAndAspect } from './Common';
import { DefaultSerializeable } from './Serializeable';
import { LaserlineViewfinderStyle, RectangularViewfinderAnimation, RectangularViewfinderLineStyle, RectangularViewfinderStyle } from './Viewfinder+Related';
export interface PrivateBrush {
    toJSON(): BrushJSON;
}
export interface BrushJSON {
    fill: {
        color: Color;
    };
    stroke: {
        color: Color;
        width: number;
    };
}
export declare class Brush extends DefaultSerializeable {
    private fill;
    private stroke;
    static get transparent(): Brush;
    get fillColor(): Color;
    get strokeColor(): Color;
    get strokeWidth(): number;
    constructor();
    constructor(fillColor: Color, strokeColor: Color, strokeWidth: number);
}
export interface Viewfinder {
}
export declare const NoViewfinder: {
    type: string;
};
export declare class LaserlineViewfinder extends DefaultSerializeable implements Viewfinder {
    private type;
    private readonly _style;
    width: NumberWithUnit;
    enabledColor: Color;
    disabledColor: Color;
    constructor();
    constructor(style: LaserlineViewfinderStyle);
    get style(): LaserlineViewfinderStyle;
}
export declare class RectangularViewfinder extends DefaultSerializeable implements Viewfinder {
    private type;
    private readonly _style;
    private readonly _lineStyle;
    private _dimming;
    private _disabledDimming;
    private _animation;
    private _sizeWithUnitAndAspect;
    color: Color;
    get sizeWithUnitAndAspect(): SizeWithUnitAndAspect;
    constructor();
    constructor(style: RectangularViewfinderStyle);
    constructor(style: RectangularViewfinderStyle, lineStyle: RectangularViewfinderLineStyle);
    get style(): RectangularViewfinderStyle;
    get lineStyle(): RectangularViewfinderLineStyle;
    get dimming(): number;
    set dimming(value: number);
    get disabledDimming(): number;
    set disabledDimming(value: number);
    get animation(): RectangularViewfinderAnimation | null;
    set animation(animation: RectangularViewfinderAnimation | null);
    setSize(size: SizeWithUnit): void;
    setWidthAndAspectRatio(width: NumberWithUnit, heightToWidthAspectRatio: number): void;
    setHeightAndAspectRatio(height: NumberWithUnit, widthToHeightAspectRatio: number): void;
    setShorterDimensionAndAspectRatio(fraction: number, aspectRatio: number): void;
}
export declare class AimerViewfinder extends DefaultSerializeable implements Viewfinder {
    private type;
    frameColor: Color;
    dotColor: Color;
    constructor();
}
