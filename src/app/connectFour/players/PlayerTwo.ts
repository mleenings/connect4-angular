import { properties } from '../properties/properties';
import { Player } from './Player';

/**
 * Description:
 * Player2 (Human or Computer)
 */
export class PlayerTwo extends Player{
  constructor(name: string){
    super(properties.playerTwo.background, name, properties.playerTwo.wonColor);
  }
}
