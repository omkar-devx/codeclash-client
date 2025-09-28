import React from "react";
import LeaveRoom from "./LeaveRoom";

const RoomControler = () => {
  return (
    <div className="flex flex-row gap-10">
      <div>Copy Id</div>
      <div>
        <LeaveRoom />
      </div>
    </div>
  );
};

export default RoomControler;
