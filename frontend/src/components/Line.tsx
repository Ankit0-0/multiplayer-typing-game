import React from "react";
import LinearProgress from "@mui/material/LinearProgress";

const Line = ({ progress }) => {
  return (
    <div className="flex flex-col justify-center w-full h-full border bg-gray-800 rounded-lg p-2 shadow-md">
      <LinearProgress
        sx={{ height: "10px", width: "100%", rotate: "270deg" }}
        variant="determinate"
        value={progress}
        className="bg-gray-700"
      />
    </div>
  );
};

export default Line;
