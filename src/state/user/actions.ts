import { createAction } from '@reduxjs/toolkit';

export const updateUserDarkMode = createAction<{ userDarkMode: boolean }>(
  'user/updateUserDarkMode'
);
