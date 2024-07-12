// import { useEffect, useState } from "react";
// import { myContext } from "../context/context";
// import { useNavigate } from "react-router-dom";

// const Results = () => {
//   const navigate = useNavigate();
//   const { room, leaderboard, socket, setRoom, myName } = myContext();
//   const [results, setResults] = useState(null);

//   const isOwner = room.owner === myName;

//   useEffect(() => {
//     socket.on("readyToStart", async (room) => {
//       await setRoom(room);
//       navigate("/home");
//     });
//   }, []);

//   return (
//     <main className="font-AmaticSC bg-black min-h-screen w-screen flex flex-col justify-center items-center">
//       <section className="container bg-black mx-auto p-4  shadow-lg  border-b-2 border-dashed">
//         <div className="playerslist mt-8 overflow-x-auto">
//           <div className="w-full grid grid-cols-8 gap-2 text-center">
//             <div className="">#</div>
//             <span>Name</span>
//             <span>Final Score</span>
//             <span>Finish Time</span>
//             <span>Speed</span>
//             <span>Accuracy</span>
//             <span>Errors</span>
//             <span>penalty</span>
//           </div>
//           <div className="list mt-2">
//             {leaderboard.map((player, index) => (
//               <div
//                 key={index}
//                 className="w-full grid grid-cols-8 gap-2 text-center"
//               >
//                 <div>{index + 1}</div>
//                 <div>{player.name || 1}</div>
//                 <div>{player.finalScore || 1}</div>
//                 <div>
//                   {player.didNotFinish ? "DNF" : player.finishTime || 1}
//                 </div>
//                 <div>{player.speed || 1}</div>
//                 <div>{player.accuracy || 1}</div>
//                 <div>{player.errors || 1}</div>
//                 <div>{player.penalty || 1}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//       {isOwner && (
//         <section>
//           <div className="flex justify-center mt-8">
//             <button
//               onClick={async () => {
//                 await socket.emit("restartGame", room.roomId);
//               }}
//               className="p-2 bg-gray-800 text-white rounded-lg"
//             >
//               restart
//             </button>
//           </div>
//         </section>
//       )}
//     </main>
//   );
// };

// export default Results;





// import React from "react"
// import { useState } from "react";
// import LinearProgress from "@mui/material/LinearProgress";


// const Line = ({progress}) => {
//   return (
//     <div className="flex flex-col justify-center border w-[100%] h-full">
//         <LinearProgress
//           sx={{ height: "10px", width: '100%', rotate: "270deg" }}
//           variant="determinate"
//           value={progress}
//           className=" "
//         />
//       </div>
//   )
// }
// export default Line


// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { myContext } from "../context/context.jsx";
// import { io } from "socket.io-client";
// const Landing = () => {
//   const { myName, setMyName, socket, setSocket, room, setRoom } = myContext();
//   const [roomId, setRoomId] = useState("");
//   const [connected, setConnected] = useState(false);

//   useEffect(() => {
//     const socket = io("localhost:3000");
//     setSocket(socket);

//     socket.on("connect", () => {
//       console.log("Connected to the server");
//       setConnected(true);
//     });

//     socket.on("nameTaken", (msg) => {
//       toast.error(msg);
//       console.log(msg);
//     });

//     socket.on("roomBusy", (msg) => {
//       toast.error(msg);
//       console.log(msg);
//     });

//     socket.on("roomNotFound", (msg) => {
//       toast.error(msg);
//       console.log(msg);
//     });

//     socket.on("roomCreated", (room) => {
//       console.log("room cerated", room);
//       setRoom(room);
//       navigate("/home");
//     });

//     socket.on("roomJoined", (room) => {
//       console.log("room joined", room);
//       setRoom(room);
//       navigate("/home");
//     });
//   }, []);

//   const navigate = useNavigate();

//   const joinRoom = () => {
//     if (myName === "") {
//       toast.error("Please enter your name");
//       return;
//     }
//     if (roomId === "") {
//       toast.error("Please enter room id");
//       return;
//     }
//     if (!connected) {
//       toast.error("Free tier hosting may result in server sleep. Contact developer to access the app.");
//       return;
//     }

//     socket.emit("joinRoom", roomId, myName);
//   };
//   const createRoom = () => {
//     if (myName === "") {
//       toast.error("Please enter your name");
//       return;
//     }
//     if (!connected) {
//       toast.error("Free tier hosting may result in server sleep. Contact developer to  access the  app.");
//       return;
//     }
//     console.log("create room");

//     socket.emit("createRoom", myName);
//   };

//   return (
//     <section className="w-screen flex-col h-screen flex items-center justify-center text-sm ">
//       <h1>Welcome {myName}</h1>
//       <input
//         type="text"
//         value={myName}
//         onChange={(e) => setMyName(e.target.value)}
//         placeholder="Enter your name"
//         className="p-2 w-1/4 my-4"
//       />

//       <div className=" h-[200px] flex flex-col justify-between w-[400px]">
//         <button onClick={createRoom}>create Room</button>
//         <div className="  flex flex-col justify-evenly h-[140px]  w-full">
//           <input
//             type="text"
//             placeholder="Enter Room ID"
//             className="p-2 w-full my4"
//             value={roomId}
//             onChange={(e) => setRoomId(e.target.value)}
//           />
//           <button onClick={joinRoom}>Join Room</button>
//         </div>
//       </div>
//     </section>
//   );
// };
// export default Landing;




// import { useEffect, useState } from "react";
// import LinearProgress from "@mui/material/LinearProgress";
// import { myContext } from "../context/context";
// import { io } from "socket.io-client";
// // import { useNavigate } from "react-router-dom";

// const cars = () => {
//   // const navigate = useNavigate();
//   const [progress, setProgress] = useState(50);
//   const { room, socket, setRoom } = myContext();

//   useEffect(() => {
//     if (!room) {
//       navigate("/");
//       return null;
//     }
//     socket.on("progressUpdated", (room) => {
//       // console.log("Progress updated", room);
//       setRoom(room);
//     });
//   }, []);

//   const players = room.players;

//   return (
//     <div className="flex flex-col justify-evenly border w-[40%] h-full">
//       {room.players.map((player) => (
//         <div
//           key={player.name}
//           className="flex flex-col justify-evenly items-stretch "
//         >
//           <div className="flex justify-center">
//           <p>{player.name}</p>
//           </div>
//           <LinearProgress
//             sx={{
//               backgroundColor: "white",
//               color: "black",
//               height: "20px",
//               borderRadius: "10px",
//             }}
//             variant="determinate"
//             value={player.progress}
//             className="m-4"
//           />
//         </div>
//       ))}
//     </div>
//   );
// };
// export default cars;




// app.get("/results/:roomId", (req, res) => {
//   const roomId = req.params.roomId;
//   const room = rooms[roomId];
//   if (!room) {
//     return res.status(404).json({ message: "Room not found" });
//   }
//   const results = [];

//   room.players.forEach((player) => {
//     let time = player.finished ? 60 - player.finishTime : 60;

//     let speed;
//     if (!player.finished) {
//       if (player.charactersTyped === 0) {
//         speed = 0;
//         time = Number.MAX_SAFE_INTEGER;
//       } else {
//         speed = player.charactersTyped / player.finishTime;
//         const remaining = room.text.length - player.charactersTyped;
//         time = remaining / speed;
//       }
//     } else {
//       speed = player.charactersTyped / player.finishTime;
//     }
//     const wpm = (speed * 60) / 5;

//     time += player.errors;

//     results.push({
//       name: player.name,
//       finishTime: time,
//       errors: player.errors,
//       accuracy: (
//         ((player.charactersTyped - player.errors) / player.charactersTyped) *
//         100
//       ).toFixed(2),
//       speed: wpm.toFixed(2),
//       penalty: player.errors,
//     });
//   });

//   const winners = results.sort((a, b) => a.finishTime - b.finishTime);
//   res.json(winners);
// });



// import React, { useEffect, useState, useRef } from "react";
// import { allAlphabets } from "../assets/data.js";
// import { myContext } from "../context/context.jsx";
// import { toast } from "react-toastify";
   
// import { useNavigate } from "react-router-dom";
    
// const TextComponent = () => {
//   const navigate = useNavigate();
    
//   const {
//     countDown,
//     startCountDown,
//     room,
//     setRoom,
//     myName,
//     socket,
//     myStats,
//     setMyStats,
//   } = myContext();

//   const [currentTime, setCurrentTime] = useState(63);
//   const [flag, setFlag] = useState(false);
//   const [text] = useState(room.text);
//   const [alphabets] = useState(allAlphabets);
//   const [countdownFinished, setCountdownFinished] = useState(false);

//   const textArea = useRef(null);
//   const time = useRef(null);
//   const countDownRef = useRef(null);
//   const inputRef = useRef(null);

//   useEffect(() => {
//     setMyStats({
//       progress: 0,
//       charactersTyped: 0,
//       finished: false,
//       finishTime: -1,
//       errors: 0,
//       index: 0,
//     });
//   }, []);

//   useEffect(() => {
//     if (currentTime === 0) {
//       if (myName === room.owner) {
//         socket.emit("timeUp", room.roomId); // Emit timeUp event
//       }
//     }
//   }, [currentTime]);

//   useEffect(() => {
//     if (!room) navigate("/");
//     socket.on("gameStarted", (room) => {
//       if (!flag) {
//         setRoom(room);
//         createSpans(text);
//         setFlag(true); // Set flag to prevent multiple game starts
//         startCountDown(3, () => {});
//         startTimer();
//       }
//     });

//     return () => {
//       clearInterval(countDownRef.current); // Clear countdown timer
//     };
//   }, []);

//   const createSpans = (text) => {
//     if (textArea.current) {
//       while (textArea.current.firstChild) {
//         textArea.current.removeChild(textArea.current.firstChild);
//       }

//       text.split("").forEach((char) => {
//         const span = document.createElement("span");
//         span.textContent = char;

//         textArea.current.appendChild(span);
//       });
//       textArea.current.children[0].classList.add("active"); // Add active class to first span
//     }
//   };

//   const startTimer = () => {
//     clearInterval(countDownRef.current);
//     setCurrentTime(63);
//     // time.current.textContent = currentTime;
//     if (time.current) {
//       time.current.textContent = currentTime;
//     }

//     const intervalId = setInterval(() => {
//       setCurrentTime((prev) => {
//         if (prev <= 0) {
//           clearInterval(intervalId);
//           return prev;
//         }
//         time.current.textContent = prev - 1;
//         return prev - 1;
//       });
//     }, 1000);
//     setCountdownFinished(true);
//   };

//   const startGame = () => {
//     if (!flag) {
//       socket.emit("startGame", room.roomId);
//       createSpans(text);
//       setFlag(true); // Set flag to prevent multiple game starts

//       startCountDown(3, () => {});
//       startTimer();
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (!countdownFinished || (countDown > 0 && countDown != -1)) {
//       e.preventDefault();
//       return;
//     } 

//     // if (currentTime <= 0) {
//     //   setGameOver(true);
//     //   return;
//     // }

//     const key = e.key;

//     const textAreaChildren = textArea.current.children;
//     const spans = Array.from(textAreaChildren);
//     const len = spans.length;

//     let currentIndex = myStats.index;
//     if (currentIndex >= len) {
//       console.log("Game Over");
//       return;
//     }

//     let span = spans[currentIndex];
//     let event;

//     if (alphabets.includes(key)) {
//       if (e.key === "Backspace" && e.ctrlKey) {
//         // Prevent the default behavior of the event
//         e.preventDefault();
//         toast.dismiss();
//         toast.error("Ctrl + Backspace is disabled!", {
//           autoClose: 1000,
//           position: "top-center",
//         });
//         return;
//       }
//       if (key === "Backspace") {
//         if (currentIndex === 0) {
//           return;
//         }

//         currentIndex--;

//         if (spans[currentIndex].classList.contains("incorrect")) {
//           setMyStats((prev) => {
//             return { ...prev, errors: prev.errors - 1 };
//           });

//           if (spans[currentIndex].textContent === " ") {
//             spans[currentIndex].classList.remove("bg-red-200", "rounded");
//           }
//           event = "error -1";
//         }

//         if (spans[currentIndex].classList.contains("correct")) {
//           event = "correct -1";
//         }

//         spans[currentIndex].classList.remove("correct", "incorrect");
//         spans[currentIndex].classList.add("active");

//         span.classList.remove("active");
//         setMyStats((prev) => {
//           return { ...prev, charactersTyped: prev.charactersTyped - 1 };
//         });
//       } else if (key === span.textContent) {
//         // console.log("correct");
//         span.classList.remove("active");
//         span.classList.add("correct");

//         setMyStats((prev) => {
//           return { ...prev, charactersTyped: prev.charactersTyped + 1 };
//         });
//         event = "correct +1";

//         currentIndex++;

//         if (currentIndex < len) {
//           spans[currentIndex].classList.add("active");
//         }
//       } else {
//         if (span.textContent === " ") {
//           spans[currentIndex].classList.add("bg-red-200", "rounded");
//         }

//         console.log("incorrect");

//         span.classList.remove("active");
//         span.classList.add("incorrect");

//         setMyStats((prev) => {
//           return {
//             ...prev,
//             errors: prev.errors + 1,
//             charactersTyped: prev.charactersTyped + 1,
//           };
//         });
//         event = "error +1";
//         currentIndex++;

//         if (currentIndex < len) {
//           spans[currentIndex].classList.add("active");
//         }
//       }
//     }

//     socket.emit("updateProgress", room.roomId, myName, currentIndex, event);

//     if (currentIndex === len) {
//       socket.emit("playerFinished", room.roomId, myName, currentTime);
//       // setGameOver(true);
//     }

//     setMyStats((prev) => {
//       return { ...prev, index: currentIndex };
//     });
//   };

//   return (
//     <div
//       // onKeyDown={handleKeyDown}
//       className="w-[60%] h-full flex flex-col justify-evenly items-center"
//     >
//       <span>roomid: {room.roomId}</span>
//       <span>myname: {myName}</span>
//       <span>owner: {room.owner}</span>
//       <div className=" rounded-lg p-4 h-80 w-full mt-4 flex flex-col justify-evenly">
//         <div className="   w-full flex  justify-center">
//           <span className="timer" ref={time}>
//             timer
//           </span>
//         </div>
//         <p
//           className=" f-[50%] border-gray-400 rounded-lg p-3 font-bold tracking-widest"
//           ref={textArea}
//           // onKeyDown={handleKeyDown}
//         ></p>
//         {countdownFinished && (
//           <input
//             type="text"
//             onKeyDown={handleKeyDown}
//             placeholder={`${room.text.substring(0, 17)}....`}
//             className="rounded h-10 border-white p-4 f-[50%] tracking-widest font-bold"
//             // ref={inputRef}
//             autoFocus
//           />
//         )}
//         {myName === room.owner && (
//           <button
//             className="bg-blue-500 text-white font-bold rounded-lg p-2 mt-2"
//             onClick={startGame}
//           >
//             Start Test
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TextComponent;

