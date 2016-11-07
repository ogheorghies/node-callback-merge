
import mocha = require('mocha');
import {
    CallbackMerger, MergerNop, VoterNever, VoterAlways
} from "../src/index";

import assert = require('assert');

describe("Basic callback merger", () => {
    it("Has sane defaults", () => {
        var ms = new CallbackMerger({merger: MergerNop, voter: VoterNever});

        assert.notEqual(ms.items, null);
        assert.equal(ms.items.length, 0);
        assert.notEqual(ms.callback, 0);
    });

    it("Accumulates callback with one parameter", () => {
        var ms = new CallbackMerger({merger: MergerNop, voter: VoterNever});

        ms.callback(1);
        assert.equal(ms.items.length, 1);
        assert.deepEqual(ms.items[0], [1]);
    });

    it("Accumulates callback with multiple parameters", () => {
        var ms = new CallbackMerger({merger: MergerNop, voter: VoterNever});

        ms.callback(1, "a");
        assert.equal(ms.items.length, 1);
        assert.deepEqual(ms.items[0], [1, "a"]);
    });

    it("Accumulates successive callbacks", () => {
        var ms = new CallbackMerger({merger: MergerNop, voter: VoterNever});

        ms.callback(1, "a");
        ms.callback(2, "b");

        assert.equal(ms.items.length, 2);
        assert.deepEqual(ms.items[0], [1, "a"]);
        assert.deepEqual(ms.items[1], [2, "b"]);
    });

    it("Always voter drains the items buffer", () => {
        var ms = new CallbackMerger({merger: MergerNop, voter: VoterAlways});

        ms.callback(1, "a");
        assert.equal(ms.items.length, 0);

        ms.callback(2, "b");
        assert.equal(ms.items.length, 0);
    });

    it("Calls the merged callback", () => {
        var i = 0;
        var callback = (args: any[][]) => {
            i = i+1;
        };

        var ms = new CallbackMerger({merger: callback, voter: VoterAlways});
        ms.callback(1, "a");
        assert.equal(ms.items.length, 0);
        assert.equal(i, 1);

        ms.callback(2, "b");
        assert.equal(ms.items.length, 0);
        assert.equal(i, 2);
    });

    it("Honors explicit merge request", () => {
        var i = 0;
        var totalLength = 0;
        var callback = (args: any[][]) => {
            i = i+1;
            totalLength += args.length;
        };

        var ms = new CallbackMerger({merger: callback, voter: VoterNever});

        ms.callback(1, "a");
        ms.callback(2, "b");

        assert.equal(i, 0);
        assert.equal(ms.items.length, 2);
        ms.merge();
        assert.equal(i, 1);
        assert.equal(ms.items.length, 0);
        assert.equal(totalLength, 2);
    });
});
