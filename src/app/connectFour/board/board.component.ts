import { Component } from '@angular/core';
import { properties } from '../properties/properties';
import { SettingsModel } from '../settings/settings.model';
import { CookieService } from 'ngx-cookie-service';
import { GameLogic } from './gameLogic';
import { Player } from '../players/Player';

/*
 * board indexing:
 * {{(0), (1)},
 * {(2), (3)}}
 * and
 * {{(0,0), (0,1)},
 * {(1,0), (1,1)}}
 * (r,c)
 */
@Component({
  selector: 'app-board',
  templateUrl: 'board.component.html',
  styleUrls: ['board.component.scss']
})
export class BoardComponent {
  public settingsModel: SettingsModel;
  public gameLogic: GameLogic;
  public winner: Player = null;
  public existsWinner:boolean = false;

  constructor(private cookieService: CookieService) {
    this.loadSettings();
    this.gameLogic = new GameLogic(this.settingsModel);
    this.reset();
  }

  loadSettings(){
    const cookie = this.cookieService.get(properties.cookie.names.settings);
    if (cookie.length === 0){
      this.settingsModel = new SettingsModel();
    }else{
      try{
        const savedSettingsModel: SettingsModel = JSON.parse(cookie);
        this.settingsModel = savedSettingsModel;
      } catch (e) {
        // ignore
      }
    }
    if (this.settingsModel === undefined){
      this.settingsModel = new SettingsModel();
    }
  }

  reset(){
    this.gameLogic.reset();
    this.winner = null;
  }

  onClickReset(){
    this.reset();
  }

  onClickTile(index) {
    this.winner = this.gameLogic.clickTile(index);
    this.existsWinner = this.winner !== null;
  }

  getTiles(){
    return this.gameLogic.getTiles();
  }

  getTileStyle(index) {
    return {
      'background-color' : this.gameLogic.getTile(index).background,
      'pointer-events': this.gameLogic.getTile(index).isDisabled ? 'none' : 'pointer',
    };
  }

  getTile(index){
    return this.gameLogic.getTile(index);
  }

  public getPlayerActive(){
    return this.gameLogic.getPlayerActive();
  }

  getPlayerActiveColor(){
    return {
      color: this.gameLogic.getPlayerActive().color,
    };
  }

  getWinnerColor(){
    var winCol = this.winner.color !== null ? this.winner.color : '#000000';
    return {
      color: winCol,
    };
  }

  isStandOff(){
    return this.gameLogic.isStandoff;
  }

  getRowHeight(){
    const offset = 0.38;
    const w = (window.innerHeight / this.settingsModel.numRow) * offset;
    return this.convertPixelsToRem(w) + 'rem';
  }

  convertRemToPixels(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }

  convertPixelsToRem(px) {
    return px / parseFloat(getComputedStyle(document.documentElement).fontSize);
  }

}
