import React, { useEffect, useState, useRef } from "react";
import { allAlphabets } from "../assets/data.js";
import { myContext } from "../context/context.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TextComponent = () => {
  const navigate = useNavigate();
  const {
    countDown,
    startCountDown,
    room,
    setRoom,
    myName,
    socket,
    myStats,
    setMyStats,
  } = myContext();

  const [currentTime, setCurrentTime] = useState(63);
  const [flag, setFlag] = useState(false);
  const [text] = useState(room.text);
  const [alphabets] = useState(allAlphabets);
  const [countdownFinished, setCountdownFinished] = useState(false);

  const textArea = useRef(null);
  const time = useRef(null);
  const countDownRef = useRef(null);

  useEffect(() => {
    setMyStats({
      progress: 0,
      charactersTyped: 0,
      finished: false,
      finishTime: -1,
      errors: 0,
      index: 0,
    });
  }, []);

  useEffect(() => {
    if (currentTime === 0) {
      if (myName === room.owner) {
        socket.emit("timeUp", room.roomId);
      }
    }
  }, [currentTime]);

  useEffect(() => {
    if (!room) navigate("/");
    socket.on("gameStarted", (room) => {
      if (!flag) {
        setRoom(room);
        createSpans(text);
        setFlag(true);
        startCountDown(3, () => {});
        startTimer();
      }
    });

    return () => {
      clearInterval(countDownRef.current);
    };
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
      textArea.current.children[0].classList.add("active");
    }
  };

  const startTimer = () => {
    clearInterval(countDownRef.current);
    setCurrentTime(63);
    if (time.current) {
      time.current.textContent = currentTime;
    }

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
      setFlag(true);
      startCountDown(3, () => {});
      startTimer();
    }
  };

  const handleKeyDown = (e) => {
    if (!countdownFinished || (countDown > 0 && countDown != -1)) {
      e.preventDefault();
      return;
    }

    const key = e.key;
    const textAreaChildren = textArea.current.children;
    const spans = Array.from(textAreaChildren);
    const len = spans.length;

    let currentIndex = myStats.index;
    if (currentIndex >= len) {
      return;
    }

    let span = spans[currentIndex];
    let event;

    if (alphabets.includes(key)) {
      if (e.key === "Backspace" && e.ctrlKey) {
        e.preventDefault();
        toast.dismiss();
        toast.error("Ctrl + Backspace is disabled!", {
          autoClose: 1000,
          position: "top-center",
        });
        return;
      }
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
    }

    setMyStats((prev) => {
      return { ...prev, index: currentIndex };
    });
  };

  return (
    <div className="w-[60%] h-full flex flex-col justify-evenly items-center bg-gray-900 text-white p-6 rounded-lg shadow-lg">
      <div className="w-full text-center mb-4">
        <span className="block">Room ID: {room.roomId}</span>
        <span className="block">My Name: {myName}</span>
        <span className="block">Owner: {room.owner}</span>
      </div>
      <div className="rounded-lg p-4 h-80 w-full mt-4 flex flex-col justify-evenly bg-gray-800">
        <div className="w-full flex justify-center mb-4">
          <span className="timer text-2xl font-bold" ref={time}>
            timer
          </span>
        </div>
        <div
          className="text-area f-[50%] border-gray-400 rounded-lg p-3 font-bold tracking-widest bg-gray-700"
          ref={textArea}
        ></div>
        {countdownFinished && (
          <input
            type="text"
            onKeyDown={handleKeyDown}
            placeholder={`${room.text.substring(0, 17)}....`}
            className="rounded h-10 border-white p-4 f-[50%] tracking-widest font-bold mt-4 bg-gray-700 text-white"
            autoFocus
          />
        )}
        {myName === room.owner && (
          <button
            className="bg-blue-500 text-white font-bold rounded-lg p-2 mt-4 hover:bg-blue-600 transition duration-300"
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
