Merges a series of callbacks (e.g. in quick succession) into rarer callbacks (taking an array of arguments).

```
var ms = new CallbackMerger({
    voter: VoterByDelay.of(50),
    merger: (args: any[][]) => {
        console.log("After a silence of 50ms, merged", args.length, "callbacks.");
    }
});
```

Working example projects are available in the `examples` directory.