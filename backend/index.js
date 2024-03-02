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

app.get("/results/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  const room = rooms[roomId];
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }
  const results = [];

  room.players.forEach((player) => {
    let time = player.finished ? 60 - player.finishTime : 60;

    let speed;
    if (!player.finished) {
      if (player.charactersTyped === 0) {
        speed = 0;
        time = Number.MAX_SAFE_INTEGER;
      } else {
        speed = player.charactersTyped / player.finishTime;
        const remaining = room.text.length - player.charactersTyped;
        time = remaining / speed;
      }
    } else {
      speed = player.charactersTyped / player.finishTime;
    }
    const wpm = (speed * 60) / 5;

    time += player.errors;

    results.push({
      name: player.name,
      finishTime: time,
      errors: player.errors,
      accuracy: (
        ((player.charactersTyped - player.errors) / player.charactersTyped) *
        100
      ).toFixed(2),
      speed: wpm.toFixed(2),
      penalty: player.errors,
    });
  });

  const winners = results.sort((a, b) => a.finishTime - b.finishTime);
  res.json(winners);
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

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
