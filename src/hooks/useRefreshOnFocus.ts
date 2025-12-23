/**
 * Custom hook to refresh data when screen comes into focus
 */

import { useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export function useRefreshOnFocus(refresh: () => void | Promise<void>) {
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );
}
