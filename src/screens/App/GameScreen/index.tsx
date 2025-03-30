import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Board from './components/Board';
import { colors } from '../../../theme/colors';
import { useGameActions } from '../../../store/game/useGameActions';
import { useAppSelector } from '../../../store';
import Icon from 'react-native-vector-icons/Feather';
import { BlurView } from 'expo-blur';
import BackgroundImage from '../../../components/BackgroundImage';
import GameResultModal from './components/GameResultModal';
import TurnSelectionModal from './components/TurnSelectionModal';

const GameScreen: React.FC = () => {
  const { makeMove } = useGameActions();

  const { sessionId, board, winner, currentPlayer } = useAppSelector((state) => state.game);

  const [showTurnSelectionModal, setShowTurnSelectionModal] = React.useState(false);

  const handleCellPress = (index: number) => {
    if (!sessionId) {
      return startGame();
    }
    const row = Math.floor(index / 3);
    const col = index % 3;
    if (winner || !!board[row][col]) {
      return;
    }
    const newBoard = board.map((r, rowIndex) =>
      r.map((cell, colIndex) => (rowIndex === row && colIndex === col ? -1 : cell))
    );

    makeMove({
      board: newBoard,
      sessionId: sessionId,
    });
  };

  const startGame = () => {
    setShowTurnSelectionModal(true);
  };

  return (
    <View style={styles.container}>
      <BackgroundImage />
      <Board board={board.flat(1)} onCellPress={handleCellPress} />
      <TouchableOpacity onPress={startGame}>
        <BlurView tint={'light'} intensity={80} style={styles.gameAction}>
          <Icon
            name={sessionId && !winner ? 'rotate-cw' : 'play-circle'}
            size={50}
            color={colors.primary}
          />
        </BlurView>
      </TouchableOpacity>
      <GameResultModal />
      <TurnSelectionModal
        visible={showTurnSelectionModal}
        onClose={() => setShowTurnSelectionModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  title: {
    marginBottom: 24,
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 24,
  },
  status: {
    marginBottom: 24,
    color: colors.text.secondary,
  },
  gameAction: {
    marginTop: 24,
    color: colors.primary,
    padding: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default GameScreen;
