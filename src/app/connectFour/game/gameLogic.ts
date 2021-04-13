import { SettingsModel } from '../settings/settings.model';
import { properties } from '../properties/properties';
import { Tile } from '../board/tile';
import { Player } from '../players/Player';
import { PlayerOne } from '../players/PlayerOne';
import { PlayerTwo } from '../players/PlayerTwo';
import { PlayerDefault } from '../players/PlayerDefault';
import { AI } from '../ai/ai';
import { Game } from './game';

export class GameLogic implements Game{
  public settingsModel: SettingsModel;
  public tiles: Tile[];
  public playerOne: Player = new PlayerOne('Player 1');
  public playerTwo: Player = new PlayerTwo('Player 2');
  public playerDefault: Player = new PlayerDefault();
  public ai: AI;
  public playerActive: Player;
  public isPlayerOneActive = true;
  public activePlayerName: string = properties.playerOne.name;
  public wonTiles: Array<Tile> = [];
  private actualMoves:number;
  public isStandoff:boolean = false;
  private maxMoves: number;

  constructor(settingsModel: SettingsModel) {
    this.settingsModel = settingsModel;
    this.tiles = new Array(this.settingsModel.numColumn * this.settingsModel.numRow);
    this.maxMoves = this.tiles.length;
    this.reset();
    this.ai = new AI(this);
    if(this.settingsModel.isHumanVsAI){
      this.playerTwo.name = "AI";
    }else{
      this.playerTwo.name = this.settingsModel.playerTwoName;
    }
  }
  setTiles(tiles: Tile[]) {
    this.tiles = tiles;
  }
  getSettingsModel(): SettingsModel {
    return this.settingsModel;
  }
  setSettingsModel(settingsModel: SettingsModel) {
    this.settingsModel = settingsModel;
  }

  getPlayerOneActive(): boolean{
    return this.isPlayerOneActive;
  }

  getStandOff(): boolean {
    return this.isStandoff;
  }

  setStandOff(isStandOff: boolean){
    this.isStandoff = isStandOff;
  }

  public setPlayerOneActive(isPlayerOneActive: boolean){
    this.isPlayerOneActive = isPlayerOneActive;
    this.playerActive = this.isPlayerOneActive ? this.playerOne : this.playerTwo;
  }

  public getPlayerActive(){
    return this.playerActive;
  }

  public getTile(index: number){
    return this.tiles[index];
  }

  public getTiles(){
    return this.tiles;
  }

  getColumn(index){
    return (index % this.settingsModel.numColumn);
  }

  getRow(index){
    return (Math.floor(index / this.settingsModel.numColumn));
  }

  public reset() {
    for (let i = 0; i < this.settingsModel.numColumn * this.settingsModel.numRow; i++){
      this.tiles[i] = new Tile(properties.playerDefault.background);
      this.tiles[i].column = this.getColumn(i);
      this.tiles[i].row = this.getRow(i);
    }
    // two resets? always the counts of wonRounds will be deleted...
    this.playerOne.wonRounds = 0;
    this.playerTwo.wonRounds = 0;
    this.playerActive = this.playerOne;
    this.actualMoves = 0;
    this.playerOne.name = this.settingsModel.playerOneName ? this.settingsModel.playerOneName : this.playerOne.name;
    this.playerTwo.name = this.settingsModel.playerTwoName ? this.settingsModel.playerTwoName : this.playerTwo.name;
    this.setPlayerOneActive(true);
  }

  public clickTile(index: number): Player {
    this.markField(index);
    this.incrementActualMove();
    var winner = this.selectWinner();
    if(!winner){
      this.switchPlayer();
      if(this.settingsModel.isHumanVsAI){
        winner = this.moveAI();
        this.incrementActualMove();
      }
    }
    return winner;
  }

  disableAllTiles(){
    for (let i = 0; i < this.tiles.length; i++){
      this.tiles[i].isDisabled = true;
    }
  }

  enableAllTiles(){
    for (let i = 0; i < this.tiles.length; i++){
      if(this.tiles[i].background === properties.playerDefault.background){
        this.tiles[i].isDisabled = false;
      }
    }
  }

  private selectWinner(): Player {
    const winner = this.checkWinner();
    if (winner){
      this.disableAllTiles();
      this.markWonFileds(winner);
      if(winner.color === this.playerOne.color){
        this.playerOne.wonRounds = this.playerOne.wonRounds + 1;
      } else if(winner.color === this.playerTwo.color){
        this.playerTwo.wonRounds = this.playerTwo.wonRounds + 1;
      }
    }
    return winner;
  }

  /**
   * make a turn of the ai
   */
  public moveAI(): Player{
    this.disableAllTiles();
    var column = this.ai.calcAlphaBetaMoveColumn(this.playerTwo);
    this.ai.move(column, this.playerTwo);
    this.incrementActualMove();
    this.enableAllTiles();
    var winner = this.selectWinner();
    if(!winner){
      this.switchPlayer();
    }
    return winner;
  }

  public setDifficult(maxDepth: number){
    this.ai.setMaxDepth(maxDepth);
  }

  markWonFileds(winner: Player){
    for (let i = 0; i < this.tiles.length; i++){
      if (this.isWonField(this.tiles[i])){
        this.tiles[i].background = winner.wonColor;
      }
    }
  }

  isWonField(tile: Tile): boolean{
    for (let i = 0; i < this.wonTiles.length; i++){
      if (this.wonTiles[i].row === tile.row && this.wonTiles[i].column === tile.column){
        return true;
      }
    }
    return false;
  }

  markField(index: number){
    const col = this.getColumn(index);
    const row = this.calcRow(col);
    const tile = this.getTileByIndex(col, row);
    if(tile !== undefined){
      tile.background = this.playerActive.getColor();
      tile.isDisabled = true;
    }
  }

  switchPlayer(){
    this.isPlayerOneActive = !this.isPlayerOneActive;
    this.activePlayerName = this.isPlayerOneActive ? this.playerOne.name : this.playerTwo.name;
    this.playerActive = this.playerActive instanceof PlayerOne ? this.playerTwo : this.playerOne;
  }

  /**
   * calc and return the free row of a column
   * @param col - the column
   */
  calcRow(col: number){
    let row = -1;
    for (let r = this.settingsModel.numRow - 1; r >= 0; r--){
        var tile = this.getTileByIndex(col, r);
        if (tile.background !== this.playerOne.color && tile.background !== this.playerTwo.color){
            row = r;
            break;
        }
    }
    return row;
  }

  incrementActualMove(){
    this.actualMoves = this.actualMoves + 1;
    if(this.actualMoves === this.maxMoves){
      this.isStandoff = true;
    }
  }

  /**
   *
   * @param column - column
   * @param row - row
   * @returns matched tile
   */
  public getTileByIndex(column: number, row: number): Tile{
    let tile: Tile;
    this.tiles.forEach(e => {
      if (e.column === column && e.row === row){
        tile = e;
        return e;
      }
    } );
    return tile;
  }

  checkWinner(): Player{
    return this.checkWinHorizontal() ?? this.checkWinVertical() ?? this.checkWinDiagonalAscending() ?? this.checkWinDiagonalDecreasing();;
  }

  /*
   * check win horizontal like this: x x x
   */
  private checkWinHorizontal(): Player {
    let sum = 1;
    let oldRow = this.settingsModel.numRow;
    for (let i = 0; i < this.settingsModel.numColumn * this.settingsModel.numRow; i++){
      const col = this.getColumn(i);
      const row = this.getRow(i);
      if (row > oldRow){
        sum = 1;
      }
      const act = this.getTileByIndex(col, row);
      const next = this.getTileByIndex(col + 1, row);
      if (next === undefined){
        continue;
      }
      if (act.background !== this.playerDefault.color
        && (act.background === this.playerOne.color && next.background === this.playerOne.color)
        || (act.background === this.playerTwo.color && next.background === this.playerTwo.color)){
          sum = sum + 1;
          this.wonTiles.push(act);
          if (sum >= 4){
            this.wonTiles.push(next);
            if (act.background === this.playerOne.color){
              return this.playerOne;
            }
            if (act.background === this.playerTwo.color){
              return this.playerTwo;
            }
            return null;
          }
      } else {
        sum = 1;
        this.wonTiles = [];
      }
      oldRow = row;
    }
    return null;
  }

   /*
    *                               x
    * check win vertical like this: x
    *                               x
    */
    private checkWinVertical(): Player {
      for(let c = 0; c < this.settingsModel.numColumn; c++){
        let sum = 1;
        for (let r = 0; r < this.settingsModel.numRow - 1; r++){
          const act = this.getTileByIndex(c, r);
          const next = this.getTileByIndex(c, r + 1);
          if (act.background !== this.playerDefault.color
            && (act.background === this.playerOne.color && next.background === this.playerOne.color)
            || (act.background === this.playerTwo.color && next.background === this.playerTwo.color)){
              sum = sum + 1;
              this.wonTiles.push(act);
              if (sum >= 4){
                this.wonTiles.push(next);
                if (act.background === this.playerOne.color){
                  return this.playerOne;
                }
                if (act.background === this.playerTwo.color){
                  return this.playerTwo;
                }
                return null;
              }
          } else {
            sum = 1;
            this.wonTiles = [];
          }
        }
      }
      return null;
    }

    // check win diagonal decreasing     x
    // (top left to bottom right)          x
    //                                       x
    private checkWinDiagonalDecreasing(): Player{
      for (let r = 0; r <= this.settingsModel.numRow - 4; r++){
        let sum = 1;
        for (let c = 0; c <= this.settingsModel.numColumn - 4; c++) {
          for (let k = 0; k <= 4; k++) {
            const act = this.getTileByIndex(c + k, r + k);
            const next = this.getTileByIndex(c + k + 1, r + k + 1);
            if (act.background !== this.playerDefault.color
              && (act.background === this.playerOne.color && next.background === this.playerOne.color)
              || (act.background === this.playerTwo.color && next.background === this.playerTwo.color)){
                sum = sum + 1;
                this.wonTiles.push(act);
                if (sum >= 4) {
                  this.wonTiles.push(next);
                  if (act.background === this.playerOne.color){
                    return this.playerOne;
                  }
                  if (act.background === this.playerTwo.color){
                    return this.playerTwo;
                  }
                  return null;
                }
            } else {
                sum = 1;
                this.wonTiles = [];
                break;
            }
          }
        }
      }
      return null;
    }

    // check win diagonal decreasing       x
    // (top right to bottom left)        x
    //                                 x
    private checkWinDiagonalAscending(): Player {
      for (let row = this.settingsModel.numRow - 1; row >= 4; row--){
        let sum = 1;
        for (let column = 0; column <= this.settingsModel.numColumn - 4; column++) {
          for (let k = 0; k <= 4; k++) {
            const act = this.getTileByIndex(column + k, row - k, );
            const next = this.getTileByIndex(column + k + 1, row - k - 1);
            if (act.background !== this.playerDefault.color
              && (act.background === this.playerOne.color && next.background === this.playerOne.color)
              || (act.background === this.playerTwo.color && next.background === this.playerTwo.color)){
                sum = sum + 1;
                this.wonTiles.push(act);
                if (sum >= 4) {
                  this.wonTiles.push(next);
                  if (act.background === this.playerOne.color){
                    return this.playerOne;
                  }
                  if (act.background === this.playerTwo.color){
                    return this.playerTwo;
                  }
                  return null;
                }
              } else {
                  sum = 1;
                  this.wonTiles = [];
                  break;
              }
          }
        }
      }
      return null;
    }
}
