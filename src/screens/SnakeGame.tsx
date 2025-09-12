import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import SnakeSegment3D from '../components/SnakeSegment3D';
import Food from '../components/Food';
import { INITIAL_SNAKE, INITIAL_DIRECTION } from '../utils/constants';
import { getRandomPosition, checkCollision } from '../utils/helpers';
import { LightTheme, DarkTheme, SnakeColors } from '../themes/colors';

const { width, height } = Dimensions.get('window');

import type { StackNavigationProp } from '@react-navigation/stack';

type SnakeGameProps = {
  navigation: StackNavigationProp<any>;
};

const SnakeGame = ({ navigation }: SnakeGameProps) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(getRandomPosition());
  const [score, setScore] = useState(0);
  const [color, setColor] = useState(SnakeColors[0]);
  const [gameOver, setGameOver] = useState(false);
  const [isBackgroundDark, setIsBackgroundDark] = useState(false);
  const [foodScale] = useState(new Animated.Value(1));
  const [maxScore, setMaxScore] = useState(0);

  const snakeRef = useRef(snake);
  const directionRef = useRef(direction);

  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { directionRef.current = direction; }, [direction]);

  const theme = isBackgroundDark ? DarkTheme : LightTheme;
  const background = theme.background;
  const textColor = theme.text;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      const { dx, dy } = gesture;
      const dir = directionRef.current;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && dir.x !== -1) setDirection({ x: 1, y: 0 });
        else if (dx < 0 && dir.x !== 1) setDirection({ x: -1, y: 0 });
      } else {
        if (dy > 0 && dir.y !== -1) setDirection({ x: 0, y: 1 });
        else if (dy < 0 && dir.y !== 1) setDirection({ x: 0, y: -1 });
      }
    },
  });

  useEffect(() => {
    const interval = setInterval(() => moveSnake(), 150);
    return () => clearInterval(interval);
  }, [snake, direction]);

  const moveSnake = () => {
    if (gameOver) return;

    const head = snakeRef.current[0];
    const dir = directionRef.current;
    const newHead = { x: head.x + dir.x, y: head.y + dir.y };

    if (checkCollision(newHead, snakeRef.current)) {
      setGameOver(true);
      if (score > maxScore) setMaxScore(score);
      return;
    }

    const ateFood = newHead.x === food.x && newHead.y === food.y;

    setSnake(prev => {
      const newSnake = [newHead, ...prev];
      if (!ateFood) newSnake.pop();
      return newSnake;
    });

    if (ateFood) {
      setFood(getRandomPosition());
      setScore(prev => prev + 1);
      setColor(SnakeColors[Math.floor(Math.random() * SnakeColors.length)]);
      setIsBackgroundDark(prev => !prev);

      foodScale.setValue(0.5);
      Animated.spring(foodScale, { toValue: 1, useNativeDriver: true, friction: 4 }).start();
    }
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(getRandomPosition());
    setScore(0);
    setColor(SnakeColors[0]);
    setGameOver(false);
    setIsBackgroundDark(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]} {...panResponder.panHandlers}>
      {snake.map((segment, idx) => {
        let type: 'head' | 'body' | 'tail' = 'body';
        if (idx === 0) type = 'head';
        else if (idx === snake.length - 1) type = 'tail';
        return (
          <SnakeSegment3D
            key={idx}
            x={segment.x}
            y={segment.y}
            type={type}
            index={idx}
            total={snake.length}
          />
        );
      })}

      <Animated.View style={{ transform: [{ scale: foodScale }] }}>
        <Food x={food.x} y={food.y} />
      </Animated.View>

      {!gameOver && (
        <View style={styles.scoreContainer}>
          <Text style={[styles.score, { color: textColor }]}>Puntos: {score}</Text>
        </View>
      )}

      {gameOver && (
        <View style={styles.overlay}>
          <Text style={styles.gameOverText}>¡Game Over!</Text>
          <Text style={styles.scoreGameOver}>Puntos: {score}</Text>
          <Text style={styles.scoreGameOver}>Récord: {maxScore}</Text>
          {score >= maxScore && <Text style={styles.newRecord}>¡Nuevo Récord!</Text>}
          <TouchableOpacity style={styles.button} onPress={resetGame}>
            <Text style={styles.buttonText}>Reiniciar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Volver al menú</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scoreContainer: { position: 'absolute', top: 40, left: 0, right: 0, alignItems: 'center' },
  score: { fontSize: 28, fontWeight: 'bold' },
  overlay: { position: 'absolute', top: 0, left: 0, width, height, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
  gameOverText: { fontSize: 42, color: '#fff', fontWeight: 'bold', marginBottom: 20 },
  scoreGameOver: { fontSize: 24, color: '#fff', marginBottom: 5 },
  newRecord: { fontSize: 26, color: 'yellow', fontWeight: 'bold', marginBottom: 20 },
  button: { backgroundColor: '#4CAF50', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10, marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
});

export default SnakeGame;
