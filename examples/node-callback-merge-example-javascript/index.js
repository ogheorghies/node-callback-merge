const cm = require('callback-merge');

var callbackMerger1 = new cm.CallbackMerger({
    voter: cm.VoterNever,
    merger: function (argsArray) {
        console.log("Merged", JSON.stringify(argsArray));
    }
});

callbackMerger1.callback("a");
callbackMerger1.callback(["b1", "b2"]);

callbackMerger1.merge(); // Merged [["a"],["b1","b2"]]