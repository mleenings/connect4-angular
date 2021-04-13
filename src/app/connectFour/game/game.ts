import { Tile } from "../board/tile";
import { Player } from "../players/Player";
import { SettingsModel } from "../settings/settings.model";

export abstract class Game {
  constructor(){}
  abstract getTiles(): Tile[];
  abstract setTiles(tiles:Tile[]);
  abstract getSettingsModel(): SettingsModel;
  abstract setSettingsModel(settingsModel: SettingsModel);
  abstract setPlayerOneActive(isPlayerOneActive: boolean);
  abstract getPlayerOneActive(): boolean;
  abstract getPlayerActive(): Player;
  abstract setStandOff(isStandOff:boolean);
  abstract getStandOff(): boolean;
  abstract reset();
  abstract clickTile(index: number): Player;
  abstract getTile(index: number);
}
