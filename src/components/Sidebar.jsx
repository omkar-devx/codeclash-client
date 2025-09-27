import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import JoinRoomBox from "./JoinRoomBox";
const Sidebar = ({ currentRoom, currentRoomPending }) => {
  return (
    <Card className="bg-muted w-[23%] h-[90%]">
      <JoinRoomBox
        currentRoom={currentRoom}
        currentRoomPending={currentRoomPending}
      />
    </Card>
  );
};

export default Sidebar;
