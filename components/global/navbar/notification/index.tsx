import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import React from "react";

type Props = {};

function Notification({}: Props) {
  return (
    <Button className="bg-white rounded-full py-6">
      <Bell color="#4a7dff" fill="#4a7dff" />
    </Button>
  );
}

export default Notification;
