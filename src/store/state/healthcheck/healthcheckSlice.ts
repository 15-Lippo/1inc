import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { HealthcheckApi } from '../../../api';

export const fetchHealthcheck = createAsyncThunk(
  'tokens/getHealthcheckInfo',
  async (_userData, { rejectWithValue }) => {
    try {
      const JSONApiResponse = await HealthcheckApi.factoryHealthCheckControllerHealthcheckRaw();
      const response = await JSONApiResponse.raw.json();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export interface TokensState {
  healthcheckInfo: void;
}

export const initialState: TokensState = {
  healthcheckInfo: undefined,
};

const healthcheckSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {},
  extraReducers: (tokens) => {
    tokens.addCase(fetchHealthcheck.fulfilled, (state, action) => {
      state.healthcheckInfo = action.payload;
    });
  },
});

const { reducer } = healthcheckSlice;

export default reducer;
