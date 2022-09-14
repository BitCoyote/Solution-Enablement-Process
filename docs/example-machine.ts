// import { createMachine, assign } from 'xstate';

// interface Context {
//   retries: number;
// }

// const fetchMachine = createMachine<Context>({
//   id: 'fetch',
//   initial: 'Are you cool?',
//   context: {
//     retries: 0
//   },
//   states: {
//     "Are you cool?": {
//       on: {
//         YES: {target: 'Are you awesome?', actions: [{type: 'Add task A', exec: () =>{console.log('add Task A')}}]},
//         NO: {target: 'Are you awesome?'}
//       }
//     },
//     "Are you awesome?":{
//       on: {
//         YES: {target: 'Done', actions: [{type: 'Add task B', exec: () =>{console.log('add Task B')}}]},
//         NO: {target: 'Done'},
//         'I dunno': {target: 'Are you cute?'}
//       }
//     },
//     "Are you cute?": {
//       on: {
//         YES: {target: 'Done', actions: [{type: 'Add task C & D', exec: () =>{console.log('add Task C & D')}}]},
//         NO: {target: 'Done', actions: [{type: 'Add task E', exec: () =>{console.log('add Task E')}}]},
//       }
//     },
//     "Done": {
//       type: 'final'
//     }
//   }
// });