import { createMachine, interpret } from "xstate";

const elBox = document.querySelector("#box");

const machine = createMachine({
  // Add your object machine definition here
  initial: "inactive",
  states: {
    inactive: {
      on: {
        CLICK: "active",
      },
    },
    active: {
      on: {
        CLICK: "inactive",
      },
    },
  },
});

// Change this to the initial state
let currentState = machine.initialState;

const thisService = interpret(machine);

thisService.onTransition(state => console.log(state.value));

thisService.start();

function send(event) {
  // Determine and update the `currentState`
  // currentState = machine.transition(currentState, event);

  elBox.dataset.state = thisService.send(event).value;
}

elBox.addEventListener("click", () => {
  // Send a click event
  send("CLICK");
});
