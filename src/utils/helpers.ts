import { Dimensions } from 'react-native';
import { CELL_SIZE } from './constants';

const { width, height } = Dimensions.get('window');

export function getRandomPosition() {
  const maxX = Math.floor(width / CELL_SIZE) - 1;
  const maxY = Math.floor(height / CELL_SIZE) - 1;
  return {
    x: Math.floor(Math.random() * maxX),
    y: Math.floor(Math.random() * maxY),
  };
}

type Position = { x: number; y: number };

export function checkCollision(head: Position, snake: Position[]) {
  const maxX = Math.floor(width / CELL_SIZE);
  const maxY = Math.floor(height / CELL_SIZE);

  if (head.x < 0 || head.y < 0 || head.x >= maxX || head.y >= maxY) return true;

  return snake.some((segment, idx) => idx !== 0 && segment.x === head.x && segment.y === head.y);
}
