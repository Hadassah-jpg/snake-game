import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const CELL_SIZE = 20;
export const INITIAL_SNAKE = [{ x: 5, y: 5 }];
export const INITIAL_DIRECTION = { x: 1, y: 0 };
