import React, { createContext, createRef, useContext, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
// Create a context
const MyContextProvider = createContext();

// Export a custom hook to use the context value
export const myContext = () => useContext(MyContextProvider);

// Create a provider component
export const ContextProvider = ({ children }) => {

  const [myName, setMyName] = useState(""); // Set the default value
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState();
  const [countDown, setCountDown] = useState(-1);
  const [players, setPlayers] = useState([{}]);
  const [myStats, setMyStats] = useState({});// Set the default value
  const [gameOver, setGameOver] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  const startCountDown = (seconds, callback) => {
    setCountDown(seconds);
    const countDownRef = setInterval(() => {
      setCountDown((prev) => {
        const newCount = prev - 1;
        if (newCount <= 0) {
          clearInterval(countDownRef);
          callback(); // Call the callback function after countdown finishes
          return 0;
        }
        return newCount;
      });
    }, 1000);
  };
  
  return (
    <MyContextProvider.Provider
      value={{
        myName,
        setMyName,
        socket,
        setSocket,
        room,
        setRoom,
        countDown,
        setCountDown,
        startCountDown,
        players,
        setPlayers,
        myStats,
        setMyStats,
        gameOver,
        setGameOver,
        leaderboard,
        setLeaderboard
      }}
    >
      {children}
    </MyContextProvider.Provider>
  );
};
