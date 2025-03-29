import { AppDispatch } from '../../types';
import { gameService } from '../../../services/api';
import { MakeMoveRequest } from '../../../types';
import { gameSlice } from '../index';
import { makePCMove } from './makePCMove';

type MakeMove = (payload: MakeMoveRequest) => (dispatch: AppDispatch) => Promise<void>;

export const makeMove: MakeMove = (payload) => {
  return async (dispatch) => {
    try {
      const data = await gameService.makeMove(payload);
      console.error('makeMove', data);
      const gameState = await gameService.getGameState(payload.sessionId);
      dispatch(gameSlice.actions.setGameState(gameState));
      console.error('gameState', gameState);
      const engineMove = await gameService.pcMove({
        board: gameState.board,
        sessionId: payload.sessionId,
      });
      dispatch(gameSlice.actions.setBoard(engineMove.board));
      dispatch(gameSlice.actions.setGameStatus(engineMove.gameStatus));
      dispatch(makePCMove());
      console.error('pcMoveState', engineMove);
    } catch (error) {
      console.error(error, error.data, error.response.data);
    }
  };
};
