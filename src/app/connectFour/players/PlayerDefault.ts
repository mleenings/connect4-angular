import { properties } from '../properties/properties';
import { Player } from './Player';

/**
 * Description:
 * PlayerDefault
 */
export class PlayerDefault extends Player{
  constructor(){
    super(properties.playerDefault.background, 'default', properties.playerDefault.background);
  }
}
