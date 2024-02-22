import React from "react"
import { useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";


const Line = ({progress}) => {
  return (
    <div className="flex flex-col justify-center border w-[100%] h-full">
        <LinearProgress
          sx={{ height: "10px", width: '100%', rotate: "270deg" }}
          variant="determinate"
          value={progress}
          className=" "
        />
      </div>
  )
}
export default Line