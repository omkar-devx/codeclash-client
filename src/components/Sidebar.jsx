import React from "react";
import { Card } from "@/components/ui/card";
import JoinRoomBoxComponent from "./JoinRoomBox";

const Sidebar = ({
  currentRoom,
  currentRoomPending,
  toggleCreateRoomConfig,
  setToggleCreateRoomConfig,
}) => {
  return (
    <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800 w-full min-h-full h-auto p-4 shadow-lg border">
      <JoinRoomBoxComponent
        currentRoom={currentRoom}
        currentRoomPending={currentRoomPending}
        toggleCreateRoomConfig={toggleCreateRoomConfig}
        setToggleCreateRoomConfig={setToggleCreateRoomConfig}
      />
    </Card>
  );
};

export default Sidebar;
