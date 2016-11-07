"use strict";
var index_1 = require("../src/index");
var assert = require('assert');
var Promise = require("bluebird");
describe("Delay merger (merge by time passed since last callback)", function () {
    it("Mimics always voter on timeout 0", function () {
        var i = 0;
        var totalLength = 0;
        var callback = function (args) {
            i = i + 1;
            totalLength += args.length;
        };
        var ms = new index_1.CallbackMerger({
            merger: callback,
            voter: index_1.VoterByDelay.of(0)
        });
        return new Promise(function (resolve, reject) {
            resolve(ms.callback("a"));
        })
            .then(function () { return new Promise(function (resolve, reject) {
            setTimeout(function () { return resolve(1); }, 50);
        }); })
            .then(function () { return assert.equal(i, 1); })
            .then(function () { return ms.callback("b"); })
            .then(function () { return new Promise(function (resolve, reject) {
            setTimeout(function () { return resolve(1); }, 50);
        }); })
            .then(function () { return assert.equal(i, 2); });
    });
    it("Calls aggregated callback only after the given delay has passed", function () {
        var i = 0;
        var totalLength = 0;
        var callback = function (args) {
            i = i + 1;
            totalLength += args.length;
        };
        var ms = new index_1.CallbackMerger({
            merger: callback,
            voter: index_1.VoterByDelay.of(50)
        });
        return new Promise(function (resolve, reject) {
            resolve(ms.callback("a"));
        })
            .then(function () { return new Promise(function (resolve, reject) {
            setTimeout(function () { return resolve(1); }, 100);
        }); })
            .then(function () { return assert.equal(i, 1); })
            .then(function () { return ms.callback("b"); })
            .then(function () { return new Promise(function (resolve, reject) {
            setTimeout(function () { return resolve(1); }, 25);
        }); })
            .then(function () { return assert.equal(i, 1); })
            .then(function () { return new Promise(function (resolve, reject) {
            setTimeout(function () { return resolve(1); }, 40);
        }); })
            .then(function () { return assert.equal(i, 2); });
    });
});
//# sourceMappingURL=020-timeMerger.test.js.map