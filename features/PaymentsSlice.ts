import { createSlice } from "@reduxjs/toolkit";

type SliceState = {
  hasClaimed: boolean;
  pastClaimed: number;
  merkleRoot: string | null;
  walletBalance: number | null;
  period: number | null;
  milestone: number | null;
  error?: null | string;
  loading: boolean;
  data: { outcome: boolean } | null;
};

// First approach: define the initial state using that type
const initialState: SliceState = {
  hasClaimed: false,
  pastClaimed: 0,
  merkleRoot: null,
  walletBalance: null,
  period: null,
  milestone: null,
  error: null,
  loading: false,
  data: null,
};

export const PaymentsSlice = createSlice({
  name: "Payments",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setHasClaimed: (state, action) => {
      state.hasClaimed = action.payload;
    },
    setPastClaimed: (state, action) => {
      state.pastClaimed = action.payload;
    },
    setMerkleRoot: (state, action) => {
      state.merkleRoot = action.payload;
    },
    setPeriod: (state, action) => {
      state.period = action.payload;
    },
    setMilestone: (state, action) => {
      state.milestone = action.payload;
    },
    setWalletBalance: (state, action) => {
      state.walletBalance = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const {
  clearError,
  setHasClaimed,
  setPastClaimed,
  setMerkleRoot,
  setPeriod,
  setMilestone,
  setWalletBalance,
} = PaymentsSlice.actions;

export default PaymentsSlice.reducer;
