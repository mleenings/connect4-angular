export class Tile {
  background: string;
  isDisabled: boolean;
  column: number;
  row: number;
  constructor(private defaultBackground: string){
    this.background = defaultBackground;
    this.isDisabled = false;
  }
}
