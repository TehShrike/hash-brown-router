# 3.3.0

- Added tests and fixes so that routes should not be fired when the user attempts to navigate to the current route. [#18](https://github.com/TehShrike/hash-brown-router/pull/18)

# 3.2.1

- Added a test for when the back button is pressed [#a5cd13](https://github.com/TehShrike/hash-brown-router/commit/a5cd13180aab41e6369036f3d090f60ded28eb18)

# 3.2.0

- Switched from dependencies on node core modules to ones on npm, and dropped a huge `Array.prototype.find` polyfill. [#880f3db1](https://github.com/TehShrike/hash-brown-router/commit/880f3db14cd67018f748baca198dab19dcf23a9d) and [#de7f8c39](https://github.com/TehShrike/hash-brown-router/commit/de7f8c39c25e1fab70d76e0a172d36a4a739bb0b)

# 3.1.0

- behavior change: `/` routes are now considered equivalent to empty routes.  This makes it so that when the sausage-router returns `/` when the page first loads, it behaves like you would expect. [#08f93795](https://github.com/TehShrike/hash-brown-router/commit/08f93795356fd6fd258960bbe83585e05e59900a)

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
