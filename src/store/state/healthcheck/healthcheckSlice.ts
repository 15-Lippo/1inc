import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { HealthcheckApi } from '../../../api';

export const fetchHealthcheck = createAsyncThunk(
  'tokens/getHealthcheckInfo',
  async (chainId: number | undefined, { rejectWithValue }) => {
    try {
      const JSONApiResponse = await HealthcheckApi(chainId).factoryHealthCheckControllerHealthcheckRaw();
      const response = await JSONApiResponse.raw.json();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export interface HealthcheckState {
  healthcheckInfo: void;
}

export const initialState: HealthcheckState = {
  healthcheckInfo: undefined,
};

const healthcheckSlice = createSlice({
  name: 'healthcheck',
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
