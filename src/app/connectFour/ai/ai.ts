import { Player } from '../players/Player';
import { PlayerDefault } from '../players/PlayerDefault';
import { GameLogic } from './../board/gameLogic';

/* max value for infinity */
const maxValue:number = 1000000;
/* max score */
const maxScore:number = 100;

/**
 * Description:
 * This artificial intelligence uses the alpha–beta pruning.
 * It is a optimized version of the minimax algorithm which is a standard method
 * for search the optimal move for games with two opposing players.
 *
 * More information of the algorithm eg Wikipedia:
 * http://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning and
 * http://en.wikipedia.org/wiki/Minimax#Minimax_algorithm_with_alternate_moves
 */
export class AI {

  /* 0-5; 5 is hard; how deep to search */
  private maxDepth:number = 5;
  private gameLogic:GameLogic;

  constructor(gameLogic: GameLogic){
    this.gameLogic = gameLogic;
  }

  /**
   * calc of the column the right row and occupies this with the color of player
   */
  public move(column: number, player: Player): number {
      var row;
      for (row = this.gameLogic.settingsModel.numRow - 1; row >= 0; row--) {
        var tile = this.gameLogic.getTileByIndex(column, row);
          if (tile.background === this.gameLogic.playerDefault.getColor()){
            tile.background = player.getColor();
            return row;
          }
      }
      return -1;
    }

  /**
   * returns true, if s turn in the column is possible otherwise false
   */
  private canMove(column: number): boolean {
    return this.gameLogic.getTileByIndex(column, 0).background === this.gameLogic.playerDefault.getColor();
  }

  /**
   * move undo
   */
  private undoMove(row: number, column: number){
    this.gameLogic.getTileByIndex(column, row).background = this.gameLogic.playerDefault.getColor();
  }

  /**
   * calc and return the score of the field
   * Pieces in the middle score higher pieces at the edges
   * a example how the positions are scored:
   * +-------------+
   * ¦1¦2¦3¦4¦3¦2¦1¦
   * ¦2¦3¦4¦5¦4¦3¦2¦
   * ¦3¦4¦5¦6¦5¦4¦3¦
   * ¦2¦3¦4¦5¦4¦3¦2¦
   * ¦1¦2¦3¦4¦3¦2¦1¦
   * ¦0¦1¦2¦3¦2¦1¦0¦
   * +-------------+
   */
  private getScore(): number {
    var score = 0;
    var column;
    for (column = 0; column < this.gameLogic.settingsModel.numColumn; column++) {
      var columnscore = (this.gameLogic.settingsModel.numColumn / 2) - column;
      if (columnscore < 0){
          columnscore = -columnscore;
      }
      columnscore = (this.gameLogic.settingsModel.numColumn / 2) - columnscore;

      //Count the number of pieces in each and score accordingly
      var row;
      for (row = this.gameLogic.settingsModel.numRow - 1; row >= 0; row--) {
        var rowscore = (this.gameLogic.settingsModel.numRow / 2) - row;
        if (rowscore < 0) {
          rowscore = -rowscore;
        }
        rowscore = Math.floor(this.gameLogic.settingsModel.numRow / 2) - rowscore;

        var actualFielColor = this.gameLogic.getTileByIndex(column, row).background;
        if (actualFielColor === this.gameLogic.playerOne.color){
            score += columnscore + rowscore;
        }
        else if (actualFielColor === this.gameLogic.playerTwo.color){
            score -= columnscore + rowscore;
        }
      }
    }
    return score;
  }

  /**
   *
   * calc and return the best column for the next turn
   * with the alpha-beta-algorithm
   */
  public calcAlphaBetaMoveColumn(player: Player): number {
    // Go through all possible moves and get the score

    // possible for P1 but here not used
    if (player.getColor() === this.gameLogic.playerOne.getColor()) {
        //It is player P1's (Human) turn, he will try max the score
        var maxScore = -maxValue;
        var maxScoreMove = 0;
        for (var column = 0; column < this.gameLogic.settingsModel.numColumn; column++)
            if (this.canMove(column)) {
                var row = this.move(column, this.gameLogic.playerOne);
                var score = this.alphabeta(this.gameLogic.playerTwo);

                if (score >= maxScore) {
                    maxScore = score;
                    maxScoreMove = column;
                }
                this.undoMove(row,column);
            }
        return maxScoreMove;
    } else if (player.getColor() === this.gameLogic.playerTwo.getColor()) {
        //It is player P2's (Computer) turn, he will try min the score
        var minScore = maxValue;
        var minScoreMove = 0;
        for (var column = 0; column < this.gameLogic.settingsModel.numColumn; column++){
          if (this.canMove(column)){
              var row = this.move(column, this.gameLogic.playerTwo);
              var score = this.alphabeta(this.gameLogic.playerOne);

              if (score < minScore) {
                  minScore = score;
                  minScoreMove = column;
              }
              this.undoMove(row, column);
          }
        }
        return minScoreMove;
    }
    return 0;
  }

  private alphabeta(player: Player): number {
      return this.recAlphabeta(player, -maxValue, maxValue, 0);
  }

  /**
   * recursive method for the alpha-beta-algorithm
   */
  private recAlphabeta(player: Player, alpha: number, beta: number, depth: number): number {
    //Check if there's a current winner
    var winner = this.gameLogic.checkWinner();
    if(winner){
      var winColor = winner.getColor();
      if (this.gameLogic.playerOne.color === winColor) {
        return maxScore;
      }
      if (this.gameLogic.playerTwo.color === winColor){
        return -maxScore;
      }
    }

    if (depth>= this.maxDepth){
          //cannot recurse more, and do not an end to the game
          //Return the score of the current table
          return this.getScore();
    }

    if (player.getColor() === this.gameLogic.playerOne.getColor()){
      for (let column = 0; column < this.gameLogic.settingsModel.numColumn; column++){
          if (this.canMove(column)) {
              var row = this.move(column,this.gameLogic.playerOne);
              var score = this.recAlphabeta(this.gameLogic.playerTwo, alpha, beta, depth+1);
              this.undoMove(row, column);
              if (score > alpha) {
                  alpha = score;
              }
              if (alpha >= beta) {
                  return alpha;
              }
          }
      }
      return alpha;
    } else if (player.getColor() === this.gameLogic.playerTwo.getColor()){
        //It is player P2's (Computer) turn, he will try min the score
        for (let column = 0; column < this.gameLogic.settingsModel.numColumn; column++){
            if (this.canMove(column)) {
                var row = this.move(column, this.gameLogic.playerTwo);
                var score = this.recAlphabeta(this.gameLogic.playerOne, alpha, beta, depth + 1);
                this.undoMove(row, column);
                if (score < beta) {
                    beta = score;
                }
                if (alpha >= beta){
                    return beta;
                }
            }
        }
        return beta;
    } else {
        return 0;
    }
  }

  public setMaxDepth(maxDepth: number){
    this.maxDepth = maxDepth;
  }
}
