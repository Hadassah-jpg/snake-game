import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CELL_SIZE } from '../utils/constants';

type FoodProps = {
  x: number;
  y: number;
};

const Food = ({ x, y }: FoodProps) => (
  <View style={[styles.food, { left: x * CELL_SIZE, top: y * CELL_SIZE }]} />
);

const styles = StyleSheet.create({
  food: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: 'yellow',
    borderRadius: CELL_SIZE / 2,
    borderWidth: 2,
    borderColor: '#434704ff',
  },
});

export default Food;
