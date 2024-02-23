// import { useEffect, useState } from "react";
// import { myContext } from "../context/context";

// const Results = () => {
//   const { room } = myContext();
//   const [results, setResults] = useState();

//   useEffect(() => {
//     const fetchResults = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:3000/results/${room.roomId}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         if (response.ok) {
//           const data = await response.json();
//           console.log("Fetched results:", data);
//           setResults(data.results);
//         } else {
//           throw new Error("Failed to fetch results");
//         }
//       } catch (error) {
//         console.error("Error fetching results:", error);
//       }
//     };

//     fetchResults();
//   }, [room.roomId]); // Add room.roomId as a dependency

//   console.log("Results state:", results);

//   if (!results) {
//     return <div>Loading...</div>; // You can replace this with a loading spinner or message
//   }

//   if (!Array.isArray(results)) {
//     console.error("Results is not an array:", results);
//     return <div>Error loading results</div>; // Handle unexpected data format
//   }

//   return (
//     <main className="font-AmaticSC bg-black min-h-screen w-screen flex justify-center items-center">
//       <section className="container bg-black mx-auto p-4 rounded-lg shadow-lg">
//         <div className="playerslist mt-8 overflow-x-auto">
//           <div className="w-full grid grid-cols-8 gap-2 text-center">
//             <div className="">#</div>
//             <span>Name</span>
//             <span>Finish Time</span>
//             <span>Speed</span>
//             <span>Accuracy</span>
//             <span>Errors</span>
//           </div>
//           <div className="list mt-2">
//             {results.map((player, index) => (
//               <div
//                 key={index}
//                 className="w-full grid grid-cols-8 gap-2 text-center"
//               >
//                 <div>{index + 1}</div>
//                 <div>{player.name || 1}</div>
//                 <div>{player.finishTime || 1}</div>
//                 <div>{player.speed || 1}</div>
//                 <div>{player.accuracy || 1}</div>
//                 <div>{player.errors || 1}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// };

// export default Results;

import { useEffect, useState } from "react";
import { myContext } from "../context/context";

const Results = () => {
  const { room } = myContext();
  const [results, setResults] = useState(null); // Initialize results state with null

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/results/${room.roomId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched results:", data);
          setResults(data.results);
        } else {
          throw new Error("Failed to fetch results");
        }
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    fetchResults();
  }, [room.roomId]); // Add room.roomId as a dependency

  // console.log("Results state:", results);

  if (!results) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!Array.isArray(results)) {
    console.error("Results is not an array:", results);
    return <div>Error loading results</div>; // Handle unexpected data format
  }

  return (
    <main className="font-AmaticSC bg-black min-h-screen w-screen flex justify-center items-center">
      <section className="container bg-black mx-auto p-4 rounded-lg shadow-lg">
        <div className="playerslist mt-8 overflow-x-auto">
          <div className="w-full grid grid-cols-8 gap-2 text-center">
            <div className="">#</div>
            <span>Name</span>
            <span>Finish Time</span>
            <span>Speed</span>
            <span>Accuracy</span>
            <span>Errors</span>
          </div>
          <div className="list mt-2">
            {results.map((player, index) => (
              <div
                key={index}
                className="w-full grid grid-cols-8 gap-2 text-center"
              >
                <div>{index + 1}</div>
                <div>{player.name || 1}</div>
                <div>{player.finishTime || 1}</div>
                <div>{player.speed || 1}</div>
                <div>{player.accuracy || 1}</div>
                <div>{player.errors || 1}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Results;
