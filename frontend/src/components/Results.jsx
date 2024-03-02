import { useEffect, useState } from "react";
import { myContext } from "../context/context";

const Results = () => {
  const { room, leaderboard } = myContext();
  const [results, setResults] = useState(null);

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
            <span>penalty</span>
          </div>
          <div className="list mt-2">
            {leaderboard.map((player, index) => (
              <div
                key={index}
                className="w-full grid grid-cols-8 gap-2 text-center"
              >
                <div>{index + 1}</div>
                <div>{player.name || 1}</div>
                <div>
                  {player.finishTime === Number.MAX_SAFE_INTEGER
                    ? "DNF"
                    : player.finishTime || 1}
                </div>
                <div>{player.speed || 1}</div>
                <div>{player.accuracy || 1}</div>
                <div>{player.errors || 1}</div>
                <div>{player.penalty || 1}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Results;
