import React, { useEffect, useState, useRef } from "react";
import { allAlphabets } from "../assets/data.js";
import { myContext } from "../context/context.jsx";
// import { io } from "socket.io-client";

import { useNavigate } from "react-router-dom";

const TextComponent = () => {

  const navigate = useNavigate();

  const { startCountDown, room, setRoom, myName, socket, myStats, setMyStats } =
    myContext();

  const [currentTime, setCurrentTime] = useState(60);
  const [flag, setFlag] = useState(false);
  const [text] = useState(room.text);
  const [alphabets] = useState(allAlphabets);
  const [countdownFinished, setCountdownFinished] = useState(false);
  const textArea = useRef(null);
  const time = useRef(null);
  const countDownRef = useRef(null);

  useEffect(() => {
    setMyStats(() => {
      return {
        progress: 0,
        charactersTyped: 0,
        finished: false,
        finishTime: -1,
        errors: 0,
        index: 0,
      };
    });
  }, []);

  useEffect(() => {
    if (currentTime === 0) { 
      if (myName === room.owner) { 
        socket.emit("timeUp", room.roomId); // Emit timeUp event
      }
    }
  }, [currentTime]);

  useEffect(() => {
    if (!room) navigate("/");
    socket.on("gameStarted", (room) => {
      if (!flag) {
        setRoom(room);
        createSpans(text);
        startCountDown(1, () => {
          startTimer();
          setFlag(true);
        });
      }
    });

    // return () => {
    //   clearInterval(countDownRef.current); // Clear countdown timer
    // };
  }, []);

  const createSpans = (text) => {
    if (textArea.current) {
      while (textArea.current.firstChild) {
        textArea.current.removeChild(textArea.current.firstChild);
      }

      text.split("").forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char;

        textArea.current.appendChild(span);
      });
      textArea.current.children[0].classList.add("active"); // Add active class to first span
    }
  };

  const startTimer = () => {
    clearInterval(countDownRef.current);
    setCurrentTime(10);
    time.current.textContent = currentTime;
    const intervalId = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev <= 0) {
          clearInterval(intervalId);
          return prev;
        }
        time.current.textContent = prev - 1;
        return prev - 1;
      });
    }, 1000);
    setCountdownFinished(true);
  };

  const startGame = () => {
    if (!flag) {
      socket.emit("startGame", room.roomId);
      createSpans(text);
      startCountDown(1, () => {
        startTimer();
        setFlag(true);
      });
    }
  };

  const handleKeyDown = (e) => {
    if (!countdownFinished) return;

    if (currentTime <= 0) {
      setGameOver(true);

      return;
    }

    const key = e.key;

    const textAreaChildren = textArea.current.children;
    const spans = Array.from(textAreaChildren);
    const len = spans.length;

    let currentIndex = myStats.index;
    if (currentIndex >= len) {
      console.log("Game Over");
      return;
    }

    let span = spans[currentIndex];
    let event;

    if (alphabets.includes(key)) {
      if (key === "Backspace") {
        if (currentIndex === 0) {
          return;
        }

        currentIndex--;

        if (spans[currentIndex].classList.contains("incorrect")) {
          setMyStats((prev) => {
            return { ...prev, errors: prev.errors - 1 };
          });

          if (spans[currentIndex].textContent === " ") {
            spans[currentIndex].classList.remove("bg-red-200", "rounded");
          }
          event = "error -1";
        }

        if (spans[currentIndex].classList.contains("correct")) {
          event = "correct -1";
        }

        spans[currentIndex].classList.remove("correct", "incorrect");
        spans[currentIndex].classList.add("active");

        span.classList.remove("active");
        setMyStats((prev) => {
          return { ...prev, charactersTyped: prev.charactersTyped - 1 };
        });
      } else if (key === span.textContent) {
        console.log("correct");
        span.classList.remove("active");
        span.classList.add("correct");

        setMyStats((prev) => {
          return { ...prev, charactersTyped: prev.charactersTyped + 1 };
        });
        event = "correct +1";

        currentIndex++;

        if (currentIndex < len) {
          spans[currentIndex].classList.add("active");
        }
      } else {
        if (span.textContent === " ") {
          spans[currentIndex].classList.add("bg-red-200", "rounded");
        }

        console.log("incorrect");

        span.classList.remove("active");
        span.classList.add("incorrect");

        setMyStats((prev) => {
          return {
            ...prev,
            errors: prev.errors + 1,
            charactersTyped: prev.charactersTyped + 1,
          };
        });
        event = "error +1";
        currentIndex++;

        if (currentIndex < len) {
          spans[currentIndex].classList.add("active");
        }
      }
    }

    socket.emit("updateProgress", room.roomId, myName, currentIndex, event);

    if (currentIndex === len) {
      socket.emit("playerFinished", room.roomId, myName, currentTime);
      setGameOver(true);
    }

    setMyStats((prev) => {
      return { ...prev, index: currentIndex };
    });
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      className="w-[60%] h-full flex flex-col justify-evenly items-center"
    >
      <span>roomid: {room.roomId}</span>
      <span>myname: {myName}</span>
      <span>owner: {room.owner}</span>
      <div className="border border-gray-500 rounded-lg p-4 h-80 w-full mt-4 flex flex-col justify-evenly">
        <div className=" border h-[25%] w-full flex  justify-evenly">
          <span className="timer" ref={time}>
            timer
          </span>
          {/* <span ref={speedRef}>speed 40 wpm</span> */}

          {/* <span ref={accuracyRef}>accuracy</span> */}
        </div>
        <p
          className="border f-[50%] border-gray-400 rounded-lg p-3 font-bold tracking-widest "
          ref={textArea}
          onKeyDown={handleKeyDown}
        ></p>
        {myName === room.owner && (
          <button
            className="bg-blue-500 text-white font-bold rounded-lg p-2 mt-2"
            onClick={startGame}
          >
            Start Test
          </button>
        )}
      </div>
    </div>
  );
};

export default TextComponent;