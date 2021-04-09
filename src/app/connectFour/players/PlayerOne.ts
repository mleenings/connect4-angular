import { properties } from '../properties/properties';
import { Player } from './Player';

/**
 * Description:
 * Player1 (Human)
 */
export class PlayerOne extends Player{
  constructor(name: string){
    super(properties.playerOne.background, name, properties.playerOne.wonColor);
  }
}
