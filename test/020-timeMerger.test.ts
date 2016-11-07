
import mocha = require('mocha');
import {
    CallbackMerger, VoterByDelay
} from "../src/index";
import assert = require('assert');
import Promise = require("bluebird");

describe("Delay merger (merge by time passed since last callback)", () => {
    it("Mimics always voter on timeout 0", () => {
        var i = 0;
        var totalLength = 0;
        var callback = (args: any[][]) => {
            i = i+1;
            totalLength += args.length;
        };

        var ms = new CallbackMerger({
            merger: callback,
            voter: VoterByDelay.of(0)
        });

        return new Promise<void>((resolve, reject) => {
            resolve(ms.callback("a"))
        })
        .then(()=>new Promise<number>((resolve, reject) => {
            setTimeout(()=>resolve(1), 50);
        }))
        .then(()=>assert.equal(i, 1))
        .then(()=>ms.callback("b"))
        .then(()=>new Promise<number>((resolve, reject) => {
            setTimeout(()=>resolve(1), 50);
        }))
        .then(()=>assert.equal(i, 2));
    });

    it("Calls aggregated callback only after the given delay has passed", () => {
        var i = 0;
        var totalLength = 0;
        var callback = (args: any[][]) => {
            i = i+1;
            totalLength += args.length;
        };

        var ms = new CallbackMerger({
            merger: callback,
            voter: VoterByDelay.of(50)
        });

        return new Promise<void>((resolve, reject) => {
            resolve(ms.callback("a"))
        })
            .then(()=>new Promise<number>((resolve, reject) => {
                setTimeout(()=>resolve(1), 100);
            }))
            .then(()=>assert.equal(i, 1))
            .then(()=>ms.callback("b"))
            .then(()=>new Promise<number>((resolve, reject) => {
                // The aggregated callback must not be called before the desired delay (25 < 50).
                setTimeout(()=>resolve(1), 25);
            }))
            .then(()=>assert.equal(i, 1))
            .then(()=>new Promise<number>((resolve, reject) => {
                // The aggregated callback will have been called after additional 40ms (25 + 40 > 50).
                setTimeout(()=>resolve(1), 40);
            }))
            .then(()=>assert.equal(i, 2));
    });
});
