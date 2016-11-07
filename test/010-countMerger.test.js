"use strict";
var index_1 = require("../src/index");
var assert = require('assert');
describe("Count merger (merge by number of times the callback was called)", function () {
    it("Mimics always voter on count 1", function () {
        var i = 0;
        var callback = function (args) {
            i = i + 1;
        };
        var ms = new index_1.CallbackMerger({
            merger: callback,
            voter: index_1.VoterByCount.of(1)
        });
        ms.callback("a");
        assert.equal(i, 1);
        ms.callback("b");
        assert.equal(i, 2);
    });
    it("Merges every two callbacks on count 2", function () {
        var i = 0;
        var totalLength = 0;
        var callback = function (args) {
            i = i + 1;
            totalLength += args.length;
        };
        var ms = new index_1.CallbackMerger({
            merger: callback,
            voter: index_1.VoterByCount.of(2)
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
//# sourceMappingURL=010-countMerger.test.js.map