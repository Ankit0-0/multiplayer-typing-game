import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";


// export default createRoom  ;

// const [myName, setMyName] = useState("you");
// const [myScore, setMyScore] = useState(0);

// const [roomId, setRoomId] = useState("");
// const [socket, setSocket] = useState(null);
// const [opponents, setOpponents] = useState([]);
// const participants = useRef(null);

// useEffect(() => {
//   const socket = io("http://localhost:3000");
//   setSocket(socket);

//   socket.on("connect", () => {
//     console.log("Connected to the server");
//   });

//   socket.on("roomCreated", (playerName, room) => {
//     console.log(`Room created. ID: ${room.roomId}`);
//     setRoomId(room.roomId);
//     setMyName(playerName);
//     setOpponents(room.users);
//   });

//   socket.on("userJoined", (users) => {
//     console.log("A new user joined this room");
//     setOpponents(users);
//   });

//   socket.on("roomJoined", (room, playerName, users) => {
//     console.log("Room joined", room);
//     setRoomId(room.roomId);
//     setMyName(playerName);
//     setOpponents(users);
//   });

//   socket.on("roomNotFound", (message) => {
//     console.log(message);
//   });

//   socket.on("scoreUpdated", (users) => {
//     console.log("Score updated", users);
//     setOpponents(users);
//   });

//   return () => {
//     socket.disconnect();
//   };
// }, []);

// const joinRoom = () => {
//   if (roomId) {
//     socket.emit("joinRoom", roomId);
//     console.log(`Joining room ${roomId}`);
//   } else {
//     console.log("Room ID is required");
//   }
// };

// const createRoom = () => {
//   socket.emit("createRoom", myName);
//   console.log("creating room");
// };

// const updateScore = () => {
//   setMyScore((prev) => prev + 1);

//   setOpponents((prev) => {
//     return prev.map((opponent) => {
//       if (opponent.name === myName) {
//         return { ...opponent, score: opponent.score + 1 };
//       }
//       return opponent;
//     });
//   });
//   socket.emit("updateScore", roomId, myName, myScore + 1);
// };
