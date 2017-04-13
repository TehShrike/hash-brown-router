# 3.0.2

- compatibility: changed `require('events').EventEmitter` to `require('events')` for better Rollup compatibility [#b01c88cd](https://github.com/TehShrike/hash-brown-router/commit/b01c88cd7ad2a915800ed21257bb2a3674b91a50)

# 3.0.1

- Documentation: adding an example to the readme [#16](https://github.com/TehShrike/hash-brown-router/pull/16)

# 3.0.0

- Using a callback instead of emitting an event was a mistake and have repented.  Switched from callback to event emitter, fixing [#11](https://github.com/TehShrike/hash-brown-router/issues/11) again

# 2.0.2

- actually removing the `setDefault` method that I claimed to have dropped in this major version [#907d1689](https://github.com/TehShrike/hash-brown-router/commit/907d16892d6a50c1c0642eee817a9aab1aa90495)

# 2.0.1

- documentation: improved the readme around onNotFound

# 2.0.0

- removed `setDefault`, added an `onNotFound` property to options.  Fixes [#11](https://github.com/TehShrike/hash-brown-router/issues/11), pull request [#12](https://github.com/TehShrike/hash-brown-router/pull/12)

# 1.5.3

- fixed: the `reverse` option wasn't being applied when you called `evaluateCurrent`.  Issue [#8](https://github.com/TehShrike/hash-brown-router/issues/8)

# 1.5.2

- fixed: encoded characters in the url weren't being decoded.  Pull request [#7](https://github.com/TehShrike/hash-brown-router/pull/7)
