import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PlayerMenuButton } from "./PlayerMenuButton";
import { Icon } from "@/components/icons";

export interface PlayerMenuProps {
  onPlay: () => void;
  onHowToPlay: () => void;
}

export const PlayerMenu: React.FC<PlayerMenuProps> = ({
  onPlay,
  onHowToPlay,
}) => (
  <Card className="bottom-0 left-0 right-0 bg-slate-900 p-0 m-0">
    <CardContent className="flex flex-row justify-center space-x-4 py-4">
      <PlayerMenuButton
        label={<><Icon name="LuPlay" size={24} /> Jogar</>}
        onClick={onPlay}
      />
      <PlayerMenuButton
        label={<><Icon name="LuInfo" size={24} /> Aprender</>}
        onClick={onHowToPlay}
      />
    </CardContent>
  </Card>
);

export default PlayerMenu;
