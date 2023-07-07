import { configureStore } from '@reduxjs/toolkit';
// reducers
import AuthReducer from './reducers/AuthReducer';
import ThemeReducer from './reducers/ThemeReducer';
import ClientsReducer from './reducers/ClientsReducer';
import ProductReducer from './reducers/ProductReducer';

const store = configureStore({
   reducer: {
      themeReducer: ThemeReducer,
      authReducer: AuthReducer,
      clientsReducer: ClientsReducer,
      productReducer: ProductReducer
   },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {themeReducer: ThemeReducer }
export type AppDispatch = typeof store.dispatch;