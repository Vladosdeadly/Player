"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __exportStar =
  (this && this.__exportStar) ||
  function (m, exports) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p))
        __createBinding(exports, m, p);
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const ovenplayer_1 = __importDefault(require("ovenplayer"));
const ovenPlayerId = "oven-player-id";
const pastOldState = (state) => {
  if (state) {
    return Object.assign({}, state);
  } else return {};
};
const ReactOvenPlayer = (0, react_1.memo)((props) => {
  (0, react_1.useEffect)(() => {
    let timeout;
    const onStateChange = props.setState;
    const player = ovenplayer_1.default.create(ovenPlayerId, props.config);
    if (typeof onStateChange === "function") {
      player.on("volumeChanged", (volume) => {
        onStateChange((state) =>
          Object.assign(Object.assign({}, state), { volume: volume }),
        );
      });
      player.on("qualityLevelChanged", (quality) => {
        const selectedQuality = player
          .getQualityLevels()
          .find((elem) => elem.index == quality.currentQuality);
        onStateChange((state) =>
          Object.assign(Object.assign({}, state), {
            quality: selectedQuality,
            isAutoQuality: quality.isAuto,
          }),
        );
      });
      player.on("stateChanged", (stateObject) => {
        onStateChange((state) =>
          Object.assign(Object.assign({}, pastOldState(state)), {
            stateObject,
          }),
        );
      });
      onStateChange((state) =>
        Object.assign(Object.assign({}, state), {
          instance: player,
          library: ovenplayer_1.default,
          version: player.getVersion(),
        }),
      );
    }
    if (props.isAutoReconnect) {
      player.on("error", () => {
        timeout = setTimeout(() => {
          const player = ovenplayer_1.default.create(
            ovenPlayerId,
            props.config,
          );
          onStateChange === null || onStateChange === void 0
            ? void 0
            : onStateChange((state) =>
                Object.assign(Object.assign({}, pastOldState(state)), {
                  instance: player,
                }),
              );
        }, 1000);
      });
    }
    return () => {
      if (props.isAutoReconnect) {
        player.off("error");
      }
      player.off("stateChanged");
      ovenplayer_1.default.removePlayer(player);
      clearTimeout(timeout);
      onStateChange === null || onStateChange === void 0
        ? void 0
        : onStateChange(null);
    };
  }, []);
  return react_1.default.createElement(
    "div",
    {
      style: props.wrapperStyles || {
        minWidth: 300,
      },
    },
    react_1.default.createElement("div", { id: ovenPlayerId }),
  );
});
__exportStar(require("./types"), exports);
exports.default = ReactOvenPlayer;
