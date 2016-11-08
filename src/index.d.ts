import Timer = NodeJS.Timer;
export declare const MergerNop: (items: any[][]) => void;
export declare const VoterAlways: (callbackMerger: CallbackMerger) => boolean;
export declare const VoterNever: (callbackMerger: CallbackMerger) => boolean;
export declare class VoterByCount {
    private count;
    callsBufferedSoFar: number;
    constructor(count: number);
    static of(count: number): (callbackMerger: CallbackMerger) => boolean;
    private readonly vote;
}
export declare class VoterByDelay {
    private delayMilliseconds;
    lastTimer: Timer;
    callbackMerger: CallbackMerger;
    constructor(delayMilliseconds: number);
    static of(delayMilliseconds: number): (callbackMerger: CallbackMerger) => boolean;
    private readonly timeoutPassedCallback;
    private readonly vote;
}
export declare class CallbackMerger {
    private config;
    readonly items: any[][];
    constructor(config: {
        merger: (items: any[][]) => any;
        voter: (callbackMerger: CallbackMerger) => boolean;
    });
    readonly callback: (...arg: any[]) => any;
    protected accept(arg: any[]): any;
    merge(): void;
    protected maybeMerge(): void;
}
