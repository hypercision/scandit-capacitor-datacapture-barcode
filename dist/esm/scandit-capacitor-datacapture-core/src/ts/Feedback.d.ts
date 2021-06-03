import { DefaultSerializeable } from './Serializeable';
export declare class Vibration extends DefaultSerializeable {
    private type;
    static get defaultVibration(): Vibration;
    static get selectionHapticFeedback(): Vibration;
    static get successHapticFeedback(): Vibration;
    private constructor();
}
export declare class Sound extends DefaultSerializeable {
    resource: Optional<string>;
    static get defaultSound(): Sound;
    constructor(resource: Optional<string>);
}
export declare class Feedback extends DefaultSerializeable {
    static get defaultFeedback(): Feedback;
    private _vibration;
    private _sound;
    private proxy;
    get vibration(): Optional<Vibration>;
    get sound(): Optional<Sound>;
    constructor(vibration: Optional<Vibration>, sound: Optional<Sound>);
    emit(): void;
    private initialize;
}
