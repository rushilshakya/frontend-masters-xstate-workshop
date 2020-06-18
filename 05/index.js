import { createMachine, assign, interpret } from "xstate";

const elBox = document.querySelector("#box");
const elBody = document.body;

const machine = createMachine({
  initial: "idle",
  // Set the initial context
  context: {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    px: 0,
    py: 0,
  },
  states: {
    idle: {
      on: {
        mousedown: {
          // Assign the point
          // ...
          target: "dragging",
          actions: assign({
            px: (context, event) => event.clientX,
            py: (context, event) => event.clientY,
          }),
        },
      },
    },
    dragging: {
      on: {
        mousemove: {
          actions: assign({
            dx: (context, event) => event.clientX - context.px,
            dy: (context, event) => event.clientY - context.py,
          }),
        },
        mouseup: {
          // Assign the position
          actions: assign({
            dx: 0,
            dy: 0,
            px: 0,
            py: 0,
            x: context => context.x + context.dx,
            y: context => context.y + context.dy,
          }),
          target: "idle",
        },
        "keyup.escape": {
          target: "idle",
          actions: assign({
            dx: 0,
            dy: 0,
            px: 0,
            py: 0,
          }),
        },
      },
    },
  },
});

const service = interpret(machine);

service.onTransition(state => {
  if (state.changed) {
    console.log(state.context);

    elBox.dataset.state = state.value;

    elBox.style.setProperty("--dx", state.context.dx);
    elBox.style.setProperty("--dy", state.context.dy);
    elBox.style.setProperty("--x", state.context.x);
    elBox.style.setProperty("--y", state.context.y);
  }
});

service.start();

// Add event listeners for:
// - mousedown on elBox
elBox.addEventListener("mousedown", service.send);
// - mousemove on elBody
elBody.addEventListener("mousemove", service.send);
// - mouseup on elBody
elBody.addEventListener("mouseup", service.send);

elBody.addEventListener("keyup", e => {
  if (e.key === "Escape") service.send("keyup.escape");
});
