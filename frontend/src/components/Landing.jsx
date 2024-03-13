import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { myContext } from "../context/context.jsx";
import { io } from "socket.io-client";
const Landing = () => {
  const { myName, setMyName, socket, setSocket, room, setRoom } = myContext();
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    const socket = io("https://multiplayer-typing-game-server.onrender.com");
    setSocket(socket);

    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.on("nameTaken", (msg) => {
      toast.error(msg);
      console.log(msg);
    })

    
    socket.on("roomBusy", (msg) => {
      toast.error(msg);
      console.log(msg);
    })

    socket.on("roomNotFound", (msg) => {
      toast.error(msg);
      console.log(msg);
    })


    socket.on("roomCreated", (room) => {
      console.log("room cerated", room);
      setRoom(room)
      navigate("/home");
    });

    socket.on("roomJoined", (room) => {
      console.log("room joined", room);
      setRoom(room);
      navigate("/home");
    });
  }, []);

  const navigate = useNavigate();

  const joinRoom = () => {
    if (myName === "") {
      toast.error("Please enter your name");
      return;
    }
    if (roomId === "") {
      toast.error("Please enter room id");
      return;
    }

    socket.emit("joinRoom", roomId, myName);

  };
  const createRoom = () => {
    if (myName === "") {
      toast.error("Please enter your name");
      return;
    }
    console.log("create room");

    socket.emit("createRoom", myName);

  };

  return (
    <section className="w-screen flex-col h-screen flex items-center justify-center text-sm ">
      <h1>Welcome {myName}</h1>
      <input
        type="text"
        value={myName}
        onChange={(e) => setMyName(e.target.value)}
        placeholder="Enter your name"
        className="p-2 w-1/4 my-4"
      />

      <div className=" h-[200px] flex flex-col justify-between w-[400px]">
        <button onClick={createRoom}>create Room</button>
        <div className="  flex flex-col justify-evenly h-[140px]  w-full">
          <input
            type="text"
            placeholder="Enter Room ID"
            className="p-2 w-full my4"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      </div>
    </section>
  );
};
export default Landing;
