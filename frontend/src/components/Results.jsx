import { useEffect, useState } from "react";
import { myContext } from "../context/context";
import { useNavigate } from "react-router-dom";

const Results = () => {
  const navigate = useNavigate();
  const { room, leaderboard, socket, setRoom, myName } = myContext();
  const [results, setResults] = useState(null);

  const isOwner = room.owner === myName;

  useEffect(() => {
    socket.on("readyToStart", async (room) => {
      await setRoom(room);
      navigate("/home");
    });
  }, []);

  return (
    <main className="font-AmaticSC bg-black min-h-screen w-screen flex flex-col justify-center items-center">
      <section className="container bg-black mx-auto p-4  shadow-lg  border-b-2 border-dashed">
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
      {isOwner && (
        <section>
          <div className="flex justify-center mt-8">
            <button
              onClick={async () => {
                await socket.emit("restartGame", room.roomId);
              }}
              className="p-2 bg-gray-800 text-white rounded-lg"
            >
              restart
            </button>
          </div>
        </section>
      )}
    </main>
  );
};

export default Results;

// add conditional rendering to the restart button
