import { createMachine, interpret } from "xstate";

const elApp = document.querySelector("#app");
const elOffButton = document.querySelector("#offButton");
const elOnButton = document.querySelector("#onButton");
const elModeButton = document.querySelector("#modeButton");

const displayMachine = createMachine({
  initial: "hidden",
  states: {
    hidden: {
      on: {
        TURN_ON: "visible.mode.hist",
      },
    },
    visible: {
      // Add parallel states here for:
      type: "parallel",
      on: {
        TURN_OFF: "hidden",
      },
      // - mode (light or dark)
      states: {
        mode: {
          initial: "light",
          states: {
            light: {
              on: {
                SWITCH: "dark",
              },
            },
            dark: {
              on: {
                SWITCH: "light",
              },
            },
            hist: {
              type: "history",
            },
          },
        },
        // - brightness (bright or dim)
        brightness: {
          initial: "bright",
          states: {
            bright: {
              after: {
                2000: "dim",
              },
            },
            dim: {
              on: {
                SWITCH: "bright",
              },
            },
          },
        },
        hist: {
          type: "history",
          history: "deep",
        },
      },
      // See the README for how the child states of each of those
      // parallel states should transition between each other.
    },
  },
});

const displayService = interpret(displayMachine)
  .onTransition(state => {
    elApp.dataset.state = state.toStrings().join(" ");
  })
  .start();

elOnButton.addEventListener("click", () => {
  displayService.send("TURN_ON");
});

elOffButton.addEventListener("click", () => {
  displayService.send("TURN_OFF");
});

elModeButton.addEventListener("click", () => {
  displayService.send("SWITCH");
});
