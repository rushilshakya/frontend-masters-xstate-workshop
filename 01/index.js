const elBox = document.querySelector("#box");

// Pure function that returns the next state,
// given the current state and sent event
function transition(state, event) {
  return stateX.states[state].on[event] || state;
}

//object syntax for state
const stateX = {
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
};

// Keep track of your current state
let currentState = stateX.initial;

function send(event) {
  // Determine the next value of `currentState`
  currentState = transition(currentState, event);

  elBox.dataset.state = currentState;
}

elBox.addEventListener("click", () => {
  // send a click event
  send("CLICK");
});
