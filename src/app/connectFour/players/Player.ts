import { runInThisContext } from 'node:vm';

/**
 * Description:
 * Base class with basic functionalities for the players
 */
export class Player {
  public color: string;
  public name: string;
  public wonRounds: number;
  public wonColor: string;

  constructor(color: string, name: string, wonColor: string){
    this.color = color;
    this.name = name;
    this.wonColor = wonColor;
    this.wonRounds = 0;
  }

  getColor(){
    return this.color;
  }

  getWonColor(){
    return this.wonColor;
  }
}
