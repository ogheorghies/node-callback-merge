"use strict";
var timers_1 = require("timers");
exports.MergerNop = function (items) { };
exports.VoterAlways = function (callbackMerger) { return true; };
exports.VoterNever = function (callbackMerger) { return false; };
var VoterByCount = (function () {
    function VoterByCount(count) {
        var _this = this;
        this.count = count;
        this.callsBufferedSoFar = 0;
        this.vote = function (callbackMerger) {
            _this.callsBufferedSoFar++;
            if (_this.callsBufferedSoFar == _this.count) {
                _this.callsBufferedSoFar = 0;
                return true;
            }
            return false;
        };
    }
    VoterByCount.of = function (count) {
        return new VoterByCount(count).vote;
    };
    return VoterByCount;
}());
exports.VoterByCount = VoterByCount;
var VoterByDelay = (function () {
    function VoterByDelay(delayMilliseconds) {
        var _this = this;
        this.delayMilliseconds = delayMilliseconds;
        this.lastTimer = null;
        this.callbackMerger = null;
        this.timeoutPassedCallback = function () {
            _this.callbackMerger.merge();
            _this.lastTimer = null;
        };
        this.vote = function (callbackMerger) {
            _this.callbackMerger = callbackMerger;
            if (_this.lastTimer != null) {
                timers_1.clearTimeout(_this.lastTimer);
            }
            _this.lastTimer = setTimeout(_this.timeoutPassedCallback, _this.delayMilliseconds);
            return false;
        };
    }
    VoterByDelay.of = function (delayMilliseconds) {
        return new VoterByDelay(delayMilliseconds).vote;
    };
    return VoterByDelay;
}());
exports.VoterByDelay = VoterByDelay;
var CallbackMerger = (function () {
    function CallbackMerger(config) {
        this.config = config;
        this.items = [];
        this.callback = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i - 0] = arguments[_i];
            }
            this.accept(arg);
        };
    }
    ;
    CallbackMerger.prototype.accept = function (arg) {
        this.items.push(arg);
        this.maybeMerge();
    };
    CallbackMerger.prototype.merge = function () {
        this.config.merger(this.items);
        this.items.length = 0;
    };
    CallbackMerger.prototype.maybeMerge = function () {
        if (this.config.voter(this)) {
            this.merge();
        }
    };
    return CallbackMerger;
}());
exports.CallbackMerger = CallbackMerger;
//# sourceMappingURL=index.js.map