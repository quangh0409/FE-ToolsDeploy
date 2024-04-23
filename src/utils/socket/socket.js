import { io } from "socket.io-client";

// const socket = io(`http://localhost:6804`, {
//   autoConnect: false,
// });

const socket = io(`http://27.71.26.164:8000`, {
  autoConnect: false,
});


export default socket;
