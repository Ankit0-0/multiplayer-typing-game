import { useEffect, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { myContext } from "../context/context";
import { io } from "socket.io-client";
// import { useNavigate } from "react-router-dom";

const cars = () => {
  // const navigate = useNavigate();
  const [progress, setProgress] = useState(50);
  const { room, socket, setRoom } = myContext();

  useEffect(() => {
    if (!room) {
      navigate("/");
      return null;
    }
    socket.on("progressUpdated", (room) => {
      // console.log("Progress updated", room);
      setRoom(room);
    });
  }, []);

  const players = room.players;

  return (
    <div className="flex flex-col justify-evenly border w-[40%] h-full">
      {room.players.map((player) => (
        <div
          key={player.name}
          className="flex flex-col justify-evenly items-stretch "
        >
          <div className="flex justify-center">
          <p>{player.name}</p>
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
export default cars;
