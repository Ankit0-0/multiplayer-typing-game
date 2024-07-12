import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { generateRoomId, generateRandomString } from "./utils/utils.js";

const port = 3000;
const app = express();
const server = createServer(app);

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const rooms = {};

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
app.get("/results/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  const room = rooms[roomId];
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }
  const results = [];

  // Define weights for each parameter
  const weightSpeed = 0.2;
  const weightAccuracy = 0.8;
  const weightFinishTime = 0.2;
  const weightPenalty = 0.1;

  room.players.forEach((player) => {
    let finishTime = player.finished ? player.finishTime : 60; // Time in seconds
    let charactersTyped = player.charactersTyped;
    let errors = player.errors;
    let accuracy = ((charactersTyped - errors) / charactersTyped) * 100;
    let speed = (charactersTyped / 5) / (finishTime / 60); // WPM

    // if (!player.finished) {
    //   // Apply a penalty for not finishing
    //   finishTime = 60 + (60 - player.finishTime);
    // }

    // Penalty for errors
    let penalty = errors * 2;

    finishTime = Math.abs(60 - finishTime);

    // Calculate the final score
    let finalScore = 
      (weightSpeed * speed) +
      (weightAccuracy * accuracy) -
      (weightFinishTime * finishTime) -
      (weightPenalty * penalty);

    results.push({
      name: player.name,
      finishTime: finishTime,
      errors: errors,
      accuracy: accuracy.toFixed(2),
      speed: speed.toFixed(2),
      penalty: penalty,
      finalScore: finalScore.toFixed(2),
      didNotFinish: !player.finished
    });
  });

  // Sort results by finalScore (descending order)
  results.sort((a, b) => b.finalScore - a.finalScore);
  console.log(results);
  res.json(results);
});


const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store the room information

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("startGame", (roomId) => {
    console.log("Starting game in room", roomId);
    rooms[roomId].gameStarted = true;
    socket.to(roomId).emit("gameStarted", rooms[roomId]);
  });

  // Create a new room
  socket.on("createRoom", (playerName) => {
    const roomId = generateRoomId();
    const str = generateRandomString();
    // const playerName = pName;

    const room = {
      roomId: roomId,
      owner: playerName,
      gameStarted: false,
      players: [
        {
          name: playerName,
          progress: 0,
          charactersTyped: 0,
          finished: false,
          finishTime: 999,
          errors: 0,
        },
      ],

      text: str,
    };
    // Add the room to the rooms object
    rooms[roomId] = room;
    // Join the room
    socket.join(roomId);
    // Emit the room ID and count to the client
    console.log("Room created", roomId, "by", playerName);
    socket.emit("roomCreated", room);
  });

  // Join an existing room
  socket.on("joinRoom", (roomId, playerName) => {
    // Check if the room exists
    if (rooms[roomId]) {
      if (rooms[roomId].gameStarted == true) {
        console.log("someone tried to join a busy room");
        socket.emit("roomBusy", "Game already started in this room");
        return;
      }

      if (rooms[roomId].players.length >= 4) {
        console.log("someone tried to join a full room");
        socket.emit("roomBusy", "Room is full");
        return;
      }
      // Join the room
      socket.join(roomId);

      // Check if the player name is already taken
      if (rooms[roomId].players.some((player) => player.name === playerName)) {
        // console.log("Player name is already taken");
        socket.emit("nameTaken", "Name taken. Pick another.");
        return;
      }

      // const playerName = pName;
      rooms[roomId].players.push({
        name: playerName,
        progress: 0,
        charactersTyped: 0,
        finished: false,
        finishTime: -1,
        errors: 0,
      });
      console.log(playerName, "joined room", roomId);
      // send the info back to the joinee
      // socket.emit("roomJoined", rooms[roomId], playerName, rooms[roomId].users);
      socket.emit("roomJoined", rooms[roomId]);
      // Emit to other players in the room that a new user joined
      socket.broadcast.to(roomId).emit("userJoined", rooms[roomId]);
    } else {
      // Emit an error message if the room doesn't exist
      socket.emit("roomNotFound", "Room not found");
    }
  });

  socket.on("timeUp", (roomId) => {
    if (rooms[roomId]) {
      rooms[roomId].gameStarted = false;
      console.log("Game over in room", roomId);
      rooms[roomId].players.forEach((player) => {
        if (player.finished == false) {
          player.finishTime = 0;
        }
      });
      // console.log(rooms[roomId].players);
      io.to(roomId).emit("gameOver", rooms[roomId]);
    }
  });

  socket.on("playerFinished", (roomId, user, finishTime) => {
    if (rooms[roomId]) {
      rooms[roomId].players.forEach((player) => {
        if (player.name === user) {
          player.finished = true;
          player.finishTime = finishTime;
        }
      });

      io.to(roomId).emit("playerFinished", rooms[roomId], user);
      const allFinished = rooms[roomId].players.every(
        (player) => player.finished
      );
      if (allFinished) {
        io.to(roomId).emit("allFinished", rooms[roomId]);
      }
    }
  });

  // Update the live count in a room
  socket.on("updateProgress", (roomId, user, index, event) => {
    // console.log("Updating progress");
    // Check if the room exists
      
    if (rooms[roomId]) {
      const progress = (index / rooms[roomId].text.length) * 100;
      rooms[roomId].players.forEach((player) => {
        if (player.name === user) {
          player.progress = progress;
          if (event === "error -1") {
            player.errors--;
            player.charactersTyped--;
          } else if (event === "error +1") {
            player.errors++;
            player.charactersTyped++;
          } else if (event === "correct +1") {
            player.charactersTyped++;
          } else if (event === "correct -1") {
            player.charactersTyped--;
          }
        }
      });
       
      // Emit the updated count to all users in the room
      io.to(roomId).emit("progressUpdated", rooms[roomId]);
    }
  });

  socket.on('restartGame', (roomId) => {
    if (rooms[roomId]) {
      rooms[roomId].gameStarted = false;
      rooms[roomId].players.forEach((player) => {
        player.progress = 0;
        player.charactersTyped = 0;
        player.finished = false;
        player.finishTime = -1;
        player.errors = 0;
      });
      io.to(roomId).emit('readyToStart', rooms[roomId]);
    }
  });

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
