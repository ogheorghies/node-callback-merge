You may want to use: https://rxjs-dev.firebaseapp.com/api/operators/debounce

Merges a series of callbacks (e.g. in quick succession) into rarer callbacks (taking an array of arguments).

```
var ms = new CallbackMerger({
    voter: VoterByDelay.of(50),
    merger: (args: any[][]) => {
        console.log("After a silence of 50ms,"
            "merged", args.length, "callbacks.");
    }
});
```

In the following example, the development server is restarted (once), 120ms after all the typescript files have been
compiled.
```
var reloadServer = new cm.CallbackMerger({
    voter: cm.VoterByDelay.of(120),
    merger: function(argsArray) {
        console.log("Changed files: ", JSON.stringify(argsArray));
        devServer.changed();
    }
});
gulp.watch( backendFiles ).on( 'change', reloadServer.callback );
```

Other working example projects are available in the `examples` directory.
