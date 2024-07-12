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
      <section className="container bg-gray-800 mx-auto p-8 rounded-lg shadow-lg border-b-4 border-dashed border-gray-600">
        <div className="text-center mb-6">
          <h1 className="text-4xl text-white">Leaderboard</h1>
        </div>
        <div className="playerslist overflow-x-auto">
          <div className="w-full grid grid-cols-8 gap-4 text-center bg-gray-700 text-white py-2 rounded-t-lg">
            <div>#</div>
            <div>Name</div>
            <div>Final Score</div>
            <div>Finish Time</div>
            <div>Speed</div>
            <div>Accuracy</div>
            <div>Errors</div>
            <div>Penalty</div>
          </div>
          <div className="list mt-2">
            {leaderboard.map((player, index) => (
              <div
                key={index}
                className={`w-full grid grid-cols-8 gap-4 text-center py-2 ${
                  index % 2 === 0 ? "bg-gray-600" : "bg-gray-700"
                } text-white rounded-lg mb-2`}
              >
                <div>{index + 1}</div>
                <div>{player.name}</div>
                <div>{player.finalScore}</div>
                <div>{player.didNotFinish ? "DNF" : player.finishTime}</div>
                <div>{player.speed}</div>
                <div>{player.accuracy}</div>
                <div>{player.errors}</div>
                <div>{player.penalty}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {isOwner && (
        <section className="mt-8">
          <div className="flex justify-center">
            <button
              onClick={async () => {
                await socket.emit("restartGame", room.roomId);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
            >
              Restart
            </button>
          </div>
        </section>
      )}
    </main>
  );
};

export default Results;
