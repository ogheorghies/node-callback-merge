
import mocha = require('mocha');
import {
    CallbackMerger, VoterByCount
} from "../src/index";
import assert = require('assert');

describe("Count merger (merge by number of times the callback was called)", () => {
    it("Mimics always voter on count 1", () => {
        var i = 0;
        var callback = (args: any[][]) => {
            i = i+1;
        };

        var ms = new CallbackMerger({
            merger: callback,
            voter: VoterByCount.of(1)
        });

        ms.callback("a");
        assert.equal(i, 1);

        ms.callback("b");
        assert.equal(i, 2);
    })

    it("Merges every two callbacks on count 2", () => {
        var i = 0;
        var totalLength = 0;
        var callback = (args: any[][]) => {
            i = i+1;
            totalLength += args.length;
        };

        var ms = new CallbackMerger({
            merger: callback,
            voter: VoterByCount.of(2)
        });

        ms.callback("a1");
        assert.equal(i, 0);
        ms.callback("a2");
        assert.equal(i, 1);
        assert.equal(totalLength, 2);

        ms.callback("b1");
        assert.equal(i, 1);
        ms.callback("b2");
        assert.equal(i, 2);
        assert.equal(totalLength, 4);

        ms.callback("c1");
        assert.equal(i, 2);
        assert.equal(totalLength, 4);

        ms.merge();
        assert.equal(i, 3);
        assert.equal(totalLength, 5);
    });
});
