import { configureStore } from "@reduxjs/toolkit";

import transactionsReducer from "./features/TransactionsSlice";
import paymentsReducer from "./features/PaymentsSlice";

const store = configureStore({
  reducer: { transactions: transactionsReducer, payments: paymentsReducer },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
