import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { CELL_SIZE } from '../utils/constants';

type SnakeSegment3DProps = {
  x: number;
  y: number;
  type: 'head' | 'body' | 'tail';
  index: number;
  total: number;
};

const SnakeSegment3D = ({ x, y, type, index, total }: SnakeSegment3DProps) => {
  const posX = useRef(new Animated.Value(x * CELL_SIZE)).current;
  const posY = useRef(new Animated.Value(y * CELL_SIZE)).current;

  useEffect(() => {
    Animated.timing(posX, { toValue: x * CELL_SIZE, duration: 120, useNativeDriver: false }).start();
    Animated.timing(posY, { toValue: y * CELL_SIZE, duration: 120, useNativeDriver: false }).start();
  }, [x, y]);

  const scaleFactor = type === 'head' ? 1.4 : 1 - index * 0.02;
  const segmentWidth = CELL_SIZE * scaleFactor * 1.2;
  const segmentHeight = CELL_SIZE * scaleFactor;

  let backgroundColor = '#4CAF50';
  if (type === 'head') backgroundColor = '#2E7D32';
  if (type === 'tail') backgroundColor = '#1B5E20';

  return (
    <Animated.View
      style={[
        styles.segment,
        {
          left: posX,
          top: posY,
          width: segmentWidth,
          height: segmentHeight,
          backgroundColor,
          borderRadius: segmentHeight / 2,
        },
      ]}
    >
      {type === 'head' && (
        <View style={styles.eyesContainer}>
          <View style={styles.eye} />
          <View style={styles.eye} />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  segment: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  eyesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 3,
  },
  eye: {
    width: 6,
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 3,
  },
});

export default SnakeSegment3D;
