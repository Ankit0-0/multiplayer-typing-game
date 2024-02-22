const allAlphabets = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',  
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'Backspace', ' ', ',', ';', '.', "'", ':', '?', '/', '!', '|', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '!', '@', '#', '$',
    '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', '<', '>', '`', '~', '"'
  ]

const content = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempo"

export { allAlphabets, content };


// import React, { useEffect, useState, useRef } from "react";
// import { allAlphabets, content } from "../assets/data";

// const TextComponent = () => {
//   const [startTime, setStartTime] = useState(1);
//   const [currentTime, setCurrentTime] = useState(60);
//   const [index, setIndex] = useState(0);
//   const [flag, setFlag] = useState(false);
//   const [errorsCount, setErrorsCount] = useState(0);
//   const [correctCount, setCorrectCount] = useState(0);
//   const [totalChars, setTotalChars] = useState(0);
//   const [totalCharsTyped, setTotalCharsTyped] = useState(0);
//   const [totalErrors, setTotalErrors] = useState(0);
//   const [text] = useState(content);
//   const [alphabets] = useState(allAlphabets);
//   const [countdownFinished, setCountdownFinished] = useState(false);

//   const textArea = useRef(null);
//   const time = useRef(null);
//   const countDownRef = useRef(null);
//   const speedRef = useRef(null);
//   const accuracyRef = useRef(null);

//   useEffect(() => {
//     return () => {
//       clearInterval(countDownRef.current); // Clear countdown timer
//     };
//   }, []);

//   const updateScores = (accuracy, speed, errors, netSpeed) => {
//     console.log({ correctCount, errorsCount, totalChars, totalErrors });
//     speedRef.current.textContent = `speed: ${speed} rpm`;
//     accuracyRef.current.textContent = `accuracy: ${accuracy}%`;
//   };

//   const calculateScore = () => {
//     const accuracy = ((correctCount / totalCharsTyped) * 100).toFixed(2);
//     // const speed = (totalCharsTyped / 5 / 60).toFixed(2);
//     const speed = (totalCharsTyped / 5 / 60).toFixed(2);

//     const errors = totalCharsTyped - correctCount;
//     const netSpeed = speed - errors;
//     console.log({ accuracy, speed, errors, netSpeed });
//     updateScores(accuracy, speed, errors, netSpeed);
//   };

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
//     // Countdown from 3 to 1
//     let count = 1; // set to 3 after debugging
//     time.current.textContent = count;
//     countDownRef.current = setInterval(() => {
//       count--;
//       if (count === 0) {
//         clearInterval(countDownRef.current);



//         // Start the actual timer at 60
//         setCurrentTime(60);
//         time.current.textContent = currentTime;
//         const intervalId = setInterval(() => {
//           setCurrentTime((prev) => {
//             if (prev <= 0) {
//               clearInterval(intervalId);
//               return prev;
//             }
//             time.current.textContent = prev - 1;
//             return prev - 1;
//           });
//         }, 1000);
//         setCountdownFinished(true);
//       } else {
//         time.current.textContent = count;
//       }
//     }, 1000);
//   };

//   const starGame = () => {
//     if (!flag) {
//       setFlag(true);
//       createSpans(text);
//       startTimer();
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (!countdownFinished) return;

//     const key = e.key;

//     const textAreaChildren = textArea.current.children;
//     const spans = Array.from(textAreaChildren);
//     const len = spans.length;

//     let currentIndex = index; // Use the latest value of index
//     // console.log({ index, correctCount, errorsCount, totalChars, totalErrors });

//     if (currentIndex >= len) {
//       console.log("Game Over");
//       return;
//     }

//     let span = spans[currentIndex];

//     if (alphabets.includes(key)) {
//       if (key === "Backspace") {
//         if (currentIndex === 0) {
//           return currentIndex;
//         }

//         currentIndex--;

//         if (spans[currentIndex].classList.contains("incorrect")) {
//           setErrorsCount((prev) => prev - 1);
//         }

//         if (spans[currentIndex].textContent === " ") {
//           spans[currentIndex].classList.remove("bg-red-200", "rounded");
//         }

//         if (spans[currentIndex].classList.contains("correct")) {
//           setCorrectCount((prev) => prev - 1);
//         }

//         spans[currentIndex].classList.remove("correct", "incorrect");
//         spans[currentIndex].classList.add("active");

//         span.classList.remove("active");
//         setTotalCharsTyped((prev) => prev - 1);
//       } else if (key === span.textContent) {
//         console.log("correct");
//         span.classList.remove("active");
//         span.classList.add("correct");

//         setCorrectCount((prev) => prev + 1);
//         setTotalCharsTyped((prev) => prev + 1);

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

//         setErrorsCount((prev) => prev + 1);
//         setTotalCharsTyped((prev) => prev + 1);
//         currentIndex++;

//         if (currentIndex < len) {
//           spans[currentIndex].classList.add("active");
//         }
//       }
//     }

//     if (currentIndex === len) {
//       calculateScore();
//     }

//     setIndex(currentIndex);
//   };

//   return (
//     <div
//       onKeyDown={handleKeyDown}
//       className="w-[60%] h-full flex flex-col justify-evenly items-center"
//     >
//       <div className="border border-gray-500 rounded-lg p-4 h-80 w-full mt-4 flex flex-col justify-evenly">
//         <div className=" border h-[25%] w-full flex  justify-evenly">
//           <span className="timer" ref={time}>
//             -1
//           </span>
//           <span ref={speedRef}>speed 40 wpm</span>

//           <span ref={accuracyRef}>accuracy</span>
//         </div>
//         <p
//           className="border f-[50%] border-gray-400 rounded-lg p-3 font-bold tracking-widest "
//           ref={textArea}
//           onKeyDown={handleKeyDown}
//         ></p>
//         <button
//           className="bg-blue-500 text-white font-bold rounded-lg p-2 mt-2"
//           onClick={starGame}
//         >
//           Start Test
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TextComponent;








