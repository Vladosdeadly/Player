[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/dygy/ReactOvenPlayer/blob/master/LICENSE) 
[![npm version](https://img.shields.io/npm/v/react.svg?style=flat)](https://www.npmjs.com/package/react-ovenplayer) 
# 📋 Getting Started with ReactOvenPlayer
## 🪜 Setup
```bash
npm i react-ovenplayer
```
## 📖 Usage
```typescript jsx
import React, {useEffect, useState} from "react";
import ReactOvenPlayer, {ReactOvenPlayerState} from "react-ovenplayer"

export const Player = () => {
    const [state, setState] = useState<ReactOvenPlayerState | null>(null)

    useEffect(()=>{
        state?.instance.pause()
    }, [state])

    return (
      <div>
          <ReactOvenPlayer
              wrapperStyles={{
                  minWidth: 500
              }}
              setState={setState}
              config={{
                  autoStart: true,
                  autoFallback: true,
                  controls: true,
                  showBigPlayButton: false,
                  mute: true,
                  webrtcConfig: {
                      timeoutMaxRetry: 5, 
                      connectionTimeout: 10000,
                  }, 
                  sources: [
                      {
                          label: 'ap-webrtc', 
                          type: 'webrtc',
                          file: `wss://url/webrtc`,
                      }, 
                      {
                          label: 'eu-webrtc', 
                          type: 'webrtc', 
                          file: `wss://url2/webrtc`,
                      },
                  ],
              }
          }
          />
      </div>
    )
}
```
### 🚀 Props
```wrapperStyles?: React.CSSProperties;```

styles of player wrapper

```isAutoReconnect?: boolean;```

enable feature to auto reconnect player

```config: OvenPlayerConfig;```

OvenPlayer configurator. Just as in OvenPlayer

```  
  state?: ReactOvenPlayerState | null;
  setState?: React.Dispatch<React.SetStateAction<ReactOvenPlayerState>>;
```
properties to check and control state of the player

it will give you back
```typescript
export type ReactOvenPlayerState = {
    library: OvenPlayer;
    instance: OvenPlayerInstance;
    version: string;
    stateObject?: OvenPlayerEvents["stateChanged"];
    quality?: OvenPlayerQuality;
    isAutoQuality?: boolean;
    volume?: number;
};
```
1. library of ovenplayer
2. player instance (not reactive, from ovenplayer)
3. version of ovenplayer
4. state object, what is current state and what is last state
5. current quality as object. Bitrate, label, index, etc.
6. is current quality are auto
7. volume level in number %

## 📄 License

React OvenPlayer is MIT licensed, as found in the [LICENSE][l] file.

[l]: https://github.com/dygy/ReactOvenPlayer/blob/master/LICENSE
