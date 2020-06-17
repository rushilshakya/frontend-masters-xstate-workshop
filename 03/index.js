import { createMachine, interpret } from "xstate";

const elBox = document.querySelector("#box");

const machine = createMachine({
  // Create your state machine here
  initial: "inactive",
  states: {
    active: {
      on: {
        mouseup: "inactive",
      },
    },
    inactive: {
      on: {
        mousedown: "active",
      },
    },
  },
  // ...
});

// Create a service using interpret(...)
const service = interpret(machine);

// Listen to state transitions and set
// `elBox.dataset.state` to the state value as before.
// ...
service.onTransition(state => (elBox.dataset.state = state.value));

// Start the service.
// ...
service.start();
window.setTimeout(service.stop.bind(service), 5000);

elBox.addEventListener("mousedown", event => {
  // Send a mousedown event
  service.send(event);

  // ...
});

elBox.addEventListener("mouseup", event => {
  // Send a mouseup event
  service.send(event);

  // ...
});
