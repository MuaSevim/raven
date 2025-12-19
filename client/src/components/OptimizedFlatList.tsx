/**
 * ============================================
 * OPTIMIZED FLAT LIST - Performance-optimized list component
 * ============================================
 * Provides automatic optimization for list rendering
 */

import React, { useMemo } from 'react';
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  Platform,
} from 'react-native';
import { RENDER_OPTIMIZATION } from '../utils/screenHelpers';

interface OptimizedFlatListProps<T> extends Omit<FlatListProps<T>, 'renderItem'> {
  renderItem: ListRenderItem<T>;
  data: T[];
}

/**
 * OptimizedFlatList - Drop-in replacement for FlatList with built-in performance optimizations
 * Automatically configures:
 * - Virtualization for large lists
 * - Batch rendering
 * - Memory optimization
 * - Platform-specific tweaks
 */
export const OptimizedFlatList = React.memo(
  React.forwardRef<FlatList, OptimizedFlatListProps<any>>(
    (
      {
        renderItem,
        data,
        keyExtractor,
        initialNumToRender = RENDER_OPTIMIZATION.listInitialNumToRender,
        maxToRenderPerBatch = RENDER_OPTIMIZATION.listMaxToRenderPerBatch,
        updateCellsBatchingPeriod = RENDER_OPTIMIZATION.listUpdateCellsBatchingPeriod,
        windowSize = RENDER_OPTIMIZATION.listWindowSize,
        removeClippedSubviews = true,
        scrollIndicatorInsets = { right: 1 },
        ...props
      },
      ref
    ) => {
      // Memoize keyExtractor to prevent re-renders
      const memoizedKeyExtractor = useMemo(
        () =>
          keyExtractor ||
          ((item: any, index: number) =>
            typeof item.id === 'string' ? item.id : `item-${index}`),
        [keyExtractor]
      );

      return (
        <FlatList
          ref={ref}
          data={data}
          renderItem={renderItem}
          keyExtractor={memoizedKeyExtractor}
          initialNumToRender={initialNumToRender}
          maxToRenderPerBatch={maxToRenderPerBatch}
          updateCellsBatchingPeriod={updateCellsBatchingPeriod}
          windowSize={windowSize}
          removeClippedSubviews={removeClippedSubviews}
          scrollIndicatorInsets={scrollIndicatorInsets}
          // Platform-specific optimizations
          scrollEventThrottle={Platform.OS === 'ios' ? 16 : 8}
          {...props}
        />
      );
    }
  )
);

OptimizedFlatList.displayName = 'OptimizedFlatList';
