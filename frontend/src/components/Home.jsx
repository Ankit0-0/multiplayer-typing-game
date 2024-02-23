import TextComponent from "./TextComponent.jsx";
import Cars from "./Cars.jsx";
import PopUP from "./PopUP.jsx";
import Results from "./Results.jsx";

import { myContext } from "../context/context.jsx";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  const {
    countDown,
    room,
    setRoom,
    socket,
    gameOver,
    setGameOver,
    leaderBoard,
  
    setLeaderboard
  } = myContext();

  useEffect(() => {
    if (gameOver && leaderBoard) {
      navigate("/results");
    }
  }, [gameOver, leaderBoard]);

  useEffect(() => { // not working, need to fix
    if (!room) {
      navigate("/landing");
    }
  }, [navigate, room]);

  useEffect(() => {
    socket.on("userJoined", (room) => {
      setRoom(room);
      console.log("A new user joined this room", room);
    });

    const fetchResults = async () => {
      const res = await fetch(`http://localhost:3000/results/${room.roomId}`);
      const data = await res.json();
      setLeaderboard(data);
    }


    socket.on("allFinished", (room) => {
      setRoom(room);
      console.log("All players finished", room);
      fetchResults();
      navigate("/results");
      // setGameOver(true);
    });

    socket.on("gameOver", (room) => {
      setRoom(room);
      console.log("Game over via time ", room);
      fetchResults(); 
      navigate("/results");

      // setGameOver(true);
    });

    socket.on("playerFinished", (room, player) => {
      setRoom(room);
      console.log(`${player} finished the game!`);
    });

    // Clean up socket listeners on component unmount
    return () => {
      // socket.off("userJoined");
      // socket.off("allFinished");
      // socket.off("gameOver");
      // socket.off("playerFinished");
    };
  }, []);

  return (
    <div className="w-screen h-screen relative">
      {/* Conditional rendering of PopUP */}
      {countDown >= 1 && countDown <= 3 && (
        <div className="absolute inset-0 flex justify-center items-center backdrop-filter backdrop-blur-[1px]">
          <div className="w-64 h-40 p-4 rounded-lg">
            <PopUP />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="w-screen h-screen flex items-center justify-center text-sm">
        <Cars />
        <TextComponent />
      </div>
    </div>
  );
};

export default Home;
