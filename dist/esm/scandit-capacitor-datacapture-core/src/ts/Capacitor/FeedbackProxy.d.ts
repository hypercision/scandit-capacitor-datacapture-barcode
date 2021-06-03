declare type Feedback = any;
export declare class FeedbackProxy {
    private feedback;
    static forFeedback(feedback: Feedback): FeedbackProxy;
    emit(): void;
}
export {};
