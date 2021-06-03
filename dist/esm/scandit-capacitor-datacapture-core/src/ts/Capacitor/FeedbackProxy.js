import { Plugins } from '@capacitor/core';
import { Capacitor, CapacitorFunction } from './Capacitor';
export class FeedbackProxy {
    static forFeedback(feedback) {
        const proxy = new FeedbackProxy();
        proxy.feedback = feedback;
        return proxy;
    }
    emit() {
        Plugins[Capacitor.pluginName][CapacitorFunction.EmitFeedback]({ feedback: this.feedback.toJSON() });
    }
}
//# sourceMappingURL=FeedbackProxy.js.map