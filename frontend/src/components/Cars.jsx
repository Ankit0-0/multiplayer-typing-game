import React, { useEffect, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { myContext } from "../context/context";

const Cars = () => {
  const { room, socket, setRoom } = myContext();

  useEffect(() => {
    if (!room) {
      navigate("/");
      return null;
    }
    socket.on("progressUpdated", (room) => {
      setRoom(room);
    });
  }, []);

  return (
    <div className="flex flex-col justify-evenly w-full max-w-xl p-6 mx-auto bg-gray-900 text-white rounded-lg shadow-xl border border-gray-700">
      {room.players.map((player) => (
        <div key={player.name} className="mb-6">
          <div className="flex justify-center mb-2">
            <p className="text-lg font-bold">{player.name}</p>
          </div>
          <LinearProgress
            sx={{
              backgroundColor: "white",
              color: "black",
              height: "20px",
              borderRadius: "10px",
            }}
            variant="determinate"
            value={player.progress}
            className="m-4"
          />
        </div>
      ))}
    </div>
  );
};

export default Cars;
