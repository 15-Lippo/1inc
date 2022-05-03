import { useCallback } from 'react';

import { useAppDispatch } from '../hooks';
import { updateUserDarkMode } from './actions';

export function useDarkModeManager(): [boolean, () => void] {
  const dispatch = useAppDispatch();
  const darkMode = false;

  const toggleSetDarkMode = useCallback(() => {
    dispatch(updateUserDarkMode({ userDarkMode: !darkMode }));
  }, [darkMode, dispatch]);

  return [darkMode, toggleSetDarkMode];
}
