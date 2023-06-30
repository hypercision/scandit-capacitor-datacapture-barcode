import { DefaultSerializeable } from '../../../scandit-capacitor-datacapture-core/src/ts/Serializeable';
import { Capacitor } from './Capacitor/Capacitor';
export var BarcodeTrackingScenario;
(function (BarcodeTrackingScenario) {
    BarcodeTrackingScenario["A"] = "A";
    BarcodeTrackingScenario["B"] = "B";
})(BarcodeTrackingScenario || (BarcodeTrackingScenario = {}));
export class BarcodeTrackingSettings extends DefaultSerializeable {
    get enabledSymbologies() {
        return Object.keys(this.symbologies)
            .filter(symbology => this.symbologies[symbology].isEnabled);
    }
    static forScenario(scenario) {
        const settings = new BarcodeTrackingSettings();
        settings.scenario = scenario;
        return settings;
    }
    constructor() {
        super();
        this.scenario = null;
        this.properties = {};
        this.symbologies = {};
    }
    settingsForSymbology(symbology) {
        if (!this.symbologies[symbology]) {
            const symbologySettings = Capacitor.defaults.SymbologySettings[symbology];
            symbologySettings._symbology = symbology;
            this.symbologies[symbology] = symbologySettings;
        }
        return this.symbologies[symbology];
    }
    setProperty(name, value) {
        this.properties[name] = value;
    }
    getProperty(name) {
        return this.properties[name];
    }
    enableSymbologies(symbologies) {
        symbologies.forEach(symbology => this.enableSymbology(symbology, true));
    }
    enableSymbology(symbology, enabled) {
        this.settingsForSymbology(symbology).isEnabled = enabled;
    }
}
//# sourceMappingURL=BarcodeTrackingSettings.js.map