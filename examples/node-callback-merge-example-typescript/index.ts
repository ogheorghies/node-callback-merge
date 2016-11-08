import cm = require('callback-merge');

var callbackMerger1 = new cm.CallbackMerger({
    voter: cm.VoterNever,
    merger: (args: any[][]) => {
        console.log("Merged", JSON.stringify(args));
    }
});

callbackMerger1.callback("a");
callbackMerger1.callback("b1", "b2");

callbackMerger1.merge(); // Merged [["a"],["b1","b2"]]