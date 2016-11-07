"use strict";
var index_1 = require("../src/index");
var assert = require('assert');
describe("Basic callback merger", function () {
    it("Has sane defaults", function () {
        var ms = new index_1.CallbackMerger({ merger: index_1.MergerNop, voter: index_1.VoterNever });
        assert.notEqual(ms.items, null);
        assert.equal(ms.items.length, 0);
        assert.notEqual(ms.callback, 0);
    });
    it("Accumulates callback with one parameter", function () {
        var ms = new index_1.CallbackMerger({ merger: index_1.MergerNop, voter: index_1.VoterNever });
        ms.callback(1);
        assert.equal(ms.items.length, 1);
        assert.deepEqual(ms.items[0], [1]);
    });
    it("Accumulates callback with multiple parameters", function () {
        var ms = new index_1.CallbackMerger({ merger: index_1.MergerNop, voter: index_1.VoterNever });
        ms.callback(1, "a");
        assert.equal(ms.items.length, 1);
        assert.deepEqual(ms.items[0], [1, "a"]);
    });
    it("Accumulates successive callbacks", function () {
        var ms = new index_1.CallbackMerger({ merger: index_1.MergerNop, voter: index_1.VoterNever });
        ms.callback(1, "a");
        ms.callback(2, "b");
        assert.equal(ms.items.length, 2);
        assert.deepEqual(ms.items[0], [1, "a"]);
        assert.deepEqual(ms.items[1], [2, "b"]);
    });
    it("Always voter drains the items buffer", function () {
        var ms = new index_1.CallbackMerger({ merger: index_1.MergerNop, voter: index_1.VoterAlways });
        ms.callback(1, "a");
        assert.equal(ms.items.length, 0);
        ms.callback(2, "b");
        assert.equal(ms.items.length, 0);
    });
    it("Calls the merged callback", function () {
        var i = 0;
        var callback = function (args) {
            i = i + 1;
        };
        var ms = new index_1.CallbackMerger({ merger: callback, voter: index_1.VoterAlways });
        ms.callback(1, "a");
        assert.equal(ms.items.length, 0);
        assert.equal(i, 1);
        ms.callback(2, "b");
        assert.equal(ms.items.length, 0);
        assert.equal(i, 2);
    });
    it("Honors explicit merge request", function () {
        var i = 0;
        var totalLength = 0;
        var callback = function (args) {
            i = i + 1;
            totalLength += args.length;
        };
        var ms = new index_1.CallbackMerger({ merger: callback, voter: index_1.VoterNever });
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
//# sourceMappingURL=000-base.test.js.map