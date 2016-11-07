import Timer = NodeJS.Timer;
import {clearTimeout} from "timers";

export const MergerNop = (items:any[][])=>{};
export const VoterAlways = (callbackMerger: CallbackMerger) => true;
export const VoterNever = (callbackMerger: CallbackMerger) => false;

export class VoterByCount {
    callsBufferedSoFar: number = 0;
    constructor (private count: number) {}

    public static of(count: number) {
        return new VoterByCount(count).vote;
    }

    private readonly vote = (callbackMerger: CallbackMerger) => {
        this.callsBufferedSoFar++;
        if (this.callsBufferedSoFar == this.count) {
            // console.log("About to vote true", this.callsBufferedSoFar, this.count);
            this.callsBufferedSoFar = 0;
            return true;
        }
        // console.log("About to vote false", this.callsBufferedSoFar, this.count);
        return false;
    }
}

export class VoterByDelay {
    lastTimer: Timer = null;
    callbackMerger: CallbackMerger = null;

    constructor (private delayMilliseconds: number) {}

    public static of(delayMilliseconds: number) {
        return new VoterByDelay(delayMilliseconds).vote;
    }

    private readonly timeoutPassedCallback = () => {
        this.callbackMerger.merge();
        this.lastTimer = null;
    };

    private readonly vote = (callbackMerger: CallbackMerger) => {
        this.callbackMerger = callbackMerger;

        if (this.lastTimer != null) {
            clearTimeout(this.lastTimer);
        }

        this.lastTimer = setTimeout(this.timeoutPassedCallback, this.delayMilliseconds);
        return false;
    }
}

export class CallbackMerger {
    public readonly items: any[][] = [];

    constructor(private config: {
            merger: (items: any[][]) => any,
            voter: (callbackMerger: CallbackMerger) => boolean
        }) {
    };

    public readonly callback: (...arg: any[]) => any = function (...arg: any[]) : any {
        this.accept(arg);
    };

    protected accept(arg: any[]): any {
        this.items.push(arg);

        this.maybeMerge();
    }

    public merge() {
        this.config.merger(this.items);
        this.items.length = 0;
    }

    protected maybeMerge() {
        if (this.config.voter(this)) {
            this.merge();
        }
    }
}
