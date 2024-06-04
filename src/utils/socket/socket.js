import { io } from "socket.io-client";
const host = process.env.REACT_APP_CA_BE_FE_HOST;
const port = process.env.REACT_APP_CA_BE_FE_PORT;
const socket = io(`https://${host}:8080/`, {
  autoConnect: true,
  // transports: ["websocket"], // Sử dụng WebSocket để giảm thiểu mất kết nối
  reconnection: true, // Tự động kết nối lại
  reconnectionDelay: 1000, // Thời gian chờ giữa các lần kết nối lại (ms)
  reconnectionAttempts: 3,
  secure: true, // Số lần thử kết nối lại tối đa
});

// const socket = io(`http://103.166.185.48:8080`, {
//   autoConnect: true,
// });

export default socket;
