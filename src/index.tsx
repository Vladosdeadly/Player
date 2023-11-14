import React, { memo, useEffect } from "react";
import OvenPlayer from "ovenplayer";

import type { ReactOvenPlayerProps, ReactOvenPlayerState } from "./types";

const ovenPlayerId = "oven-player-id";
const pastOldState = (state: ReactOvenPlayerState | null) => {
  if (state) {
    return {
      ...state,
    };
  } else return {};
};

const ReactOvenPlayer = memo((props: ReactOvenPlayerProps) => {
  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    const onStateChange = props.setState;
    const player = OvenPlayer.create(ovenPlayerId, props.config);

    if (typeof onStateChange === "function") {
      player.on("volumeChanged", (volume) => {
        onStateChange(
          (state) =>
            ({
              ...state,
              volume: volume,
            }) as ReactOvenPlayerState,
        );
      });
      player.on("qualityLevelChanged", (quality) => {
        const selectedQuality = player
          .getQualityLevels()
          .find((elem) => elem.index == quality.currentQuality);
        onStateChange(
          (state) =>
            ({
              ...state,
              quality: selectedQuality,
              isAutoQuality: quality.isAuto,
            }) as ReactOvenPlayerState,
        );
      });

      player.on("stateChanged", (stateObject) => {
        onStateChange(
          (state) =>
            ({
              ...pastOldState(state),
              stateObject,
            }) as ReactOvenPlayerState,
        );
      });

      onStateChange((state) => ({
        ...state,
        instance: player,
        library: OvenPlayer,
        version: player.getVersion(),
      }));
    }

    if (props.isAutoReconnect) {
      player.on("error", () => {
        timeout = setTimeout(() => {
          const player = OvenPlayer.create(ovenPlayerId, props.config);
          onStateChange?.(
            (state) =>
              ({
                ...pastOldState(state),
                instance: player,
              }) as ReactOvenPlayerState,
          );
        }, 1000);
      });
    }

    return () => {
      if (props.isAutoReconnect) {
        player.off("error");
      }
      player.off("stateChanged");
      OvenPlayer.removePlayer(player);
      clearTimeout(timeout);
      onStateChange?.(null);
    };
  }, []);

  return (
    <div
      style={
        props.wrapperStyles || {
          minWidth: 300,
        }
      }
    >
      <div id={ovenPlayerId} />
    </div>
  );
});

export * from "./types";
export default ReactOvenPlayer;
