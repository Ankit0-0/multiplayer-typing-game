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
        <div key={player.name}>
          <p>{player.name}</p>
          <LinearProgress
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

{
  /* <LinearProgress sx={{height: '20px', transform: 'rotate(-90deg) translateX(-50%)'}} variant="determinate" value={progress} className="m-4" /> */
}
