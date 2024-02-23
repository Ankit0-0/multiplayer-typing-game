import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
const alphabet = "abcdefghijklmnopqrstuvwxyz";

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
  console.log('fetching');
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }
 
  const results = room.players.map((player) => {
    let finishTime = 60 - player.finishTime;
    let errors = player.errors;
    finishTime += errors;
    const accuracy = ((player.charactersTyped / player.errors) * 100).toFixed(2);
    const speed = (player.charactersTyped / 5 / 60).toFixed(2);
    const name = player.name;

    return { 
      name,
      finishTime,
      speed,
      accuracy,
      errors
     };
  });

  // Sort the results by finish time in ascending order
  results.sort((a, b) => a.finishTime - b.finishTime);

  // Send the results back to the frontend
  res.json( results );
});

const generateRoomId = () => {
  const startIndex = Math.floor(Math.random() * (alphabet.length - 3)); // Ensure room id length is 4
  return alphabet.substring(startIndex, startIndex + 4);
};

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
  socket.on("createRoom", (pName) => {
    const roomId = generateRoomId();

    const playerName = pName;

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
          finishTime: -1,
          errors: 0,
        },
      ],
      // text: "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempoLorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec velit nec nulla fermentum congue. Cras eleifend tortor sed justo sollicitudin, nec tempus lorem commodo. Vivamus nec velit non eros dapibus eleifend.",
      text: "lorem commodo. Vivamus nec velit non eros dapibus eleifend.",
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
  socket.on("joinRoom", (roomId, pName) => {
    // Check if the room exists
    if (rooms[roomId]) {
      if (rooms[roomId].gameStarted == true) {
        console.log("someone tried to join a room that already started a game");
        socket.emit("roomBusy", "Game already started in this room");
        return;
      }
      // Join the room
      socket.join(roomId);

      const playerName = pName;
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
      console.log(rooms[roomId].players);
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

      const allFinished = rooms[roomId].players.every(
        (player) => player.finished
      );
      if (allFinished) {
        io.to(roomId).emit("allFinished", rooms[roomId]);
      }

      io.to(roomId).emit("playerFinished", rooms[roomId], user);
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
          if(event === "error -1"){
            player.errors--;
            player.charactersTyped--;
          }
          else if(event === "error +1"){
            player.errors++;
            player.charactersTyped++;
          }
          else if(event === "correct +1"){
            player.charactersTyped++;
          }
          else if(event === "correct -1"){
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
