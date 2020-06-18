import { createMachine, interpret, assign } from "xstate";

const elBox = document.querySelector("#box");

const setPoint = (context, event) => {
  elBox.dataset.point = `(${event.clientX}, ${event.clientY})`;
};

const enterDrag = (context, event) => {
  console.log("enter drag, count is ", context.count);
};

const dragMouseUp = (context, event) => {
  console.log("drag mouseUp");
};

const countUp = assign({
  count: (context, event) => context.count + 1,
});

console.log(
  assign({
    name: "rushil",
    count: context => context.count + 1,
  })
);
// const countUp = assign((context, value) => {
//   return {
//     count: context.count + 1,
//   };
// });

const exitDrag = (context, event) => {
  console.log("after drag, the count is ", context.count);
};

const machine = createMachine(
  {
    initial: "idle",
    context: {
      count: 0,
    },
    states: {
      idle: {
        on: {
          mousedown: {
            // Add your action here
            // ...
            actions: [setPoint],
            target: "dragging",
          },
        },
      },
      dragging: {
        entry: enterDrag,
        on: {
          mouseup: {
            target: "idle",
            actions: dragMouseUp,
          },
        },
        exit: [exitDrag, countUp],
        // exit: countUp,
        // exit: assign({
        //   count: (context, event) => context.count + 1,
        // }),
      },
    },
  },
  {
    actions: {
      setPoints: () => {
        // console.log("overriding!");
      },
    },
  }
);

const service = interpret(machine);

service.onTransition(state => {
  console.log(state);

  elBox.dataset.state = state.value;
});

service.start();

elBox.addEventListener("mousedown", event => {
  service.send(event);
});

elBox.addEventListener("mouseup", event => {
  service.send(event);
});
