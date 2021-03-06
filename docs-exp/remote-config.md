<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@firebase/remote-config](./remote-config.md)

## remote-config package

## Functions

|  Function | Description |
|  --- | --- |
|  [activate(remoteConfig)](./remote-config.activate.md) | Makes the last fetched config available to the getters. |
|  [ensureInitialized(remoteConfig)](./remote-config.ensureinitialized.md) | Ensures the last activated config are available to the getters. |
|  [fetchAndActivate(remoteConfig)](./remote-config.fetchandactivate.md) | Performs fetch and activate operations, as a convenience. |
|  [fetchConfig(remoteConfig)](./remote-config.fetchconfig.md) | Fetches and caches configuration from the Remote Config service. |
|  [getAll(remoteConfig)](./remote-config.getall.md) | Gets all config. |
|  [getBoolean(remoteConfig, key)](./remote-config.getboolean.md) | Gets the value for the given key as a boolean.<!-- -->Convenience method for calling <code>remoteConfig.getValue(key).asBoolean()</code>. |
|  [getNumber(remoteConfig, key)](./remote-config.getnumber.md) | Gets the value for the given key as a number.<!-- -->Convenience method for calling <code>remoteConfig.getValue(key).asNumber()</code>. |
|  [getRemoteConfig(app)](./remote-config.getremoteconfig.md) |  |
|  [getString(remoteConfig, key)](./remote-config.getstring.md) | Gets the value for the given key as a String. Convenience method for calling <code>remoteConfig.getValue(key).asString()</code>. |
|  [getValue(remoteConfig, key)](./remote-config.getvalue.md) | Gets the  for the given key. |
|  [setLogLevel(remoteConfig, logLevel)](./remote-config.setloglevel.md) | Defines the log level to use. |

## Interfaces

|  Interface | Description |
|  --- | --- |
|  [RemoteConfig](./remote-config.remoteconfig.md) | The Firebase Remote Config service interface. |
|  [Settings](./remote-config.settings.md) | Defines configuration options for the Remote Config SDK. |
|  [Value](./remote-config.value.md) | Wraps a value with metadata and type-safe getters. |

## Type Aliases

|  Type Alias | Description |
|  --- | --- |
|  [FetchStatus](./remote-config.fetchstatus.md) | Summarizes the outcome of the last attempt to fetch config from the Firebase Remote Config server.<ul> <li>"no-fetch-yet" indicates the [RemoteConfig](./remote-config.remoteconfig.md) instance has not yet attempted to fetch config, or that SDK initialization is incomplete.</li> <li>"success" indicates the last attempt succeeded.</li> <li>"failure" indicates the last attempt failed.</li> <li>"throttle" indicates the last attempt was rate-limited.</li> </ul> |
|  [LogLevel](./remote-config.loglevel.md) | Defines levels of Remote Config logging. |
|  [ValueSource](./remote-config.valuesource.md) | Indicates the source of a value.<ul> <li>"static" indicates the value was defined by a static constant.</li> <li>"default" indicates the value was defined by default config.</li> <li>"remote" indicates the value was defined by fetched config.</li> </ul> |

