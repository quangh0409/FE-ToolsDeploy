import { io } from "socket.io-client";

// const socket = io(`http://localhost:6804`, {
//   autoConnect: true,
// });

const socket = io(`http://103.166.185.48:8080`, {
  autoConnect: true,
});

export default socket;
