import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { myContext } from "../context/context.jsx";
import { io } from "socket.io-client";

const Landing = () => {
  const { myName, setMyName, socket, setSocket, room, setRoom } = myContext();
  const [roomId, setRoomId] = useState("");
  const [connected, setConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io("https://multiplayer-typing-game-server.onrender.com");
    setSocket(socket);

    socket.on("connect", () => {
      console.log("Connected to the server");
      setConnected(true);
    });

    socket.on("nameTaken", (msg) => {
      toast.error(msg);
      console.log(msg);
    });

    socket.on("roomBusy", (msg) => {
      toast.error(msg);
      console.log(msg);
    });

    socket.on("roomNotFound", (msg) => {
      toast.error(msg);
      console.log(msg);
    });

    socket.on("roomCreated", (room) => {
      console.log("room created", room);
      setRoom(room);
      navigate("/home");
    });

    socket.on("roomJoined", (room) => {
      console.log("room joined", room);
      setRoom(room);
      navigate("/home");
    });
  }, [navigate, setRoom, setSocket]);

  const joinRoom = () => {
    if (myName === "") {
      toast.error("Please enter your name");
      return;
    }
    if (roomId === "") {
      toast.error("Please enter room ID");
      return;
    }
    if (!connected) {
      toast.error("Server may be down. Please try again later.");
      return;
    }

    socket.emit("joinRoom", roomId, myName);
  };

  const createRoom = () => {
    if (myName === "") {
      toast.error("Please enter your name");
      return;
    }
    if (!connected) {
      toast.error("Server may be down. Please try again later.");
      return;
    }

    socket.emit("createRoom", myName);
  };

  return (
    <section className="flex flex-col items-center justify-center h-screen w-screen p-6 bg-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-6">Welcome, {myName || "Guest"}</h1>
      <input
        type="text"
        value={myName}
        onChange={(e) => setMyName(e.target.value)}
        placeholder="Enter your name"
        className="p-3 w-full max-w-xs mb-6 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:border-blue-500"
      />

      <div className="flex flex-col items-center w-full max-w-md bg-gray-700 p-6 rounded-lg shadow-lg">
        <button
          onClick={createRoom}
          className="w-full p-3 mb-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Room
        </button>
        <div className="w-full flex flex-col items-center">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="p-3 w-full mb-4 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={joinRoom}
            className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Join Room
          </button>
        </div>
      </div>
    </section>
  );
};

export default Landing;
