import { Component, OnDestroy } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { properties } from '../properties/properties';
import { SettingsModel } from '../settings/settings.model';
import { CookieService } from 'ngx-cookie-service';
import { GameLogic } from './gameLogic';
import { Player } from '../players/Player';
import { OnInit } from '@angular/core';
import { Tile } from './tile';

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
export class BoardComponent implements OnInit, OnDestroy {
  public settingsModel: SettingsModel;
  public gameLogic: GameLogic;
  public winner: Player = null;
  public existsWinner:boolean = false;

  constructor(private cookieService: CookieService, public loadingController: LoadingController) {
    this.loadSettings();
    this.gameLogic = new GameLogic(this.settingsModel);
    this.reset();
  }

  ngOnInit() {
    try {
      const savedTiles: Tile[] = this.loadTilesFromCookie();
      if(savedTiles.length > 0){
        this.gameLogic.tiles = savedTiles;
      }
      this.gameLogic.setPlayerOneActive(this.cookieService.get('cookie.connect4.isPlayerOneActive') === "true");
    } catch(e) {
      // ignore
    }
    window.onbeforeunload = () => this.ngOnDestroy();
  }

  loadTilesFromCookie(): Tile[]{
    var tiles: Tile[] = [];
    var i = 0;
    var isNotEnd = true;
    while(isNotEnd){
      try{
        var key = properties.cookie.names.tiles + '_' + i;
        var cookieTile = this.cookieService.get(key);
        const savedTile: Tile = JSON.parse(cookieTile);
        tiles.push(savedTile);
        i++;
        this.cookieService.delete(key);
      }catch(e){
        isNotEnd = false;
      }
    }
    return tiles;
  }

  ngOnDestroy(){
    var tiles: Tile[] = this.gameLogic.tiles;
    for (let i = 0; i < tiles.length; i++){
      this.cookieService.set(properties.cookie.names.tiles + '_' + i, JSON.stringify(tiles[i]));
    }
    this.cookieService.set(properties.cookie.names.isPlayerOneActive, '' + this.gameLogic.isPlayerOneActive);
  }

  loadSettings(){
    const cookieSettings = this.cookieService.get(properties.cookie.names.settings);
    if (cookieSettings.length === 0){
      this.settingsModel = new SettingsModel();
    }else{
      try{
        const savedSettingsModel: SettingsModel = JSON.parse(cookieSettings);
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
    this.existsWinner = false;
  }

  onClickReset(){
    this.reset();
  }

  async onClickTile(index) {
    const loading = await this.loadingController.create();
    await loading.present();
    this.winner = this.gameLogic.clickTile(index);
    this.existsWinner = this.winner !== null && this.winner !== undefined;
    await loading.dismiss();
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
    var winCol = this.winner ? this.winner.color : '#000000';
    return {
      color: winCol,
    };
  }

  getWinnerName(){
    return this.winner ? this.winner.getName(): '';
  }

  isStandOff(){
    return this.gameLogic.isStandoff;
  }

  isActivePlayerTextVisible(){
    return !this.existsWinner && !this.isStandOff();
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
