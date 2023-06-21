import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { ITransaction, IPendingTransaction } from "../interfaces/ITransaction";

const { NEXT_PUBLIC_BACKEND_URL } = process.env;
const ENDPOINT = "/api/v1/transactions";

const addPendingTransactionsForState = (
  pendingTransactions: IPendingTransaction[],
  payload: IPendingTransaction
) => {
  return [payload, ...pendingTransactions];
};

const removePendingTransactionsForState = (
  pendingTransactions: IPendingTransaction[],
  payload: IPendingTransaction
) => {
  return [...pendingTransactions].filter(
    (element) => element.tokenId != payload.tokenId
  );
};
export const fetchTransactions = createAsyncThunk(
  "get/fetchTransactions",
  async (address: string) => {
    const body = JSON.stringify({ address });

    const response: { success: boolean; data: ITransaction[]; error?: any } =
      await fetch(`${NEXT_PUBLIC_BACKEND_URL}${ENDPOINT}` || "", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
      }).then((res) => res.json());

    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    //The fetch() method returns a Promise that resolves regardless of whether the request is successful,
    // unless there's a network error.
    // In other words, the Promise isn't rejected even when the response has an HTTP 400 or 500 status code.
    if (response.error) return Promise.reject(response.error);

    const nextData = response.data.map(
      ({ from, to, transactionHash, category }) => ({
        from,
        to,
        transactionHash,
        category,
      })
    );

    return nextData;
  }
);

type SliceState = {
  error?: null | string;
  loading: boolean;
  data: ITransaction[] | null;
  pendingTransactions: IPendingTransaction[];
};

// First approach: define the initial state using that type
const initialState: SliceState = {
  error: null,
  loading: false,
  data: null,
  pendingTransactions: [],
};

export const TransactionsSlice = createSlice({
  name: "Transactions",
  initialState,
  reducers: {
    clearTransactions: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
    addPendingTransaction: (
      state,
      action: { payload: IPendingTransaction; type: string }
    ) => {
      state.loading = true;

      const nextTransactions = addPendingTransactionsForState(
        state.pendingTransactions,
        action.payload
      );
      state.pendingTransactions = nextTransactions;
    },
    removePendingTransaction: (
      state,
      action: { payload: IPendingTransaction; type: string }
    ) => {
      const nextTransactions = removePendingTransactionsForState(
        state.pendingTransactions,
        action.payload
      );
      state.pendingTransactions = nextTransactions;

      if (!nextTransactions.length) state.loading = false;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetching Transactions after Search
    builder.addCase(fetchTransactions.pending, (state) => {
      // No need to set to null, since this will cause 'flashing' as transactions
      // state.data = null;
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTransactions.fulfilled, (state, action) => {
      if (!state.pendingTransactions.length) state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchTransactions.rejected, (state, action) => {
      // If abortController.abort(), error name will be 'AbortError'
      if (action.error.name !== "AbortError") {
        state.loading = false;
        state.error = action.error.message;
      }
    });
  },
});

export const {
  clearTransactions,
  addPendingTransaction,
  removePendingTransaction,
  setError,
  clearError,
} = TransactionsSlice.actions;

export default TransactionsSlice.reducer;
