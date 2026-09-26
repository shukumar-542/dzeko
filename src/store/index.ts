import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import { authApi, ordersApi, productsApi, shippingApi } from "@/store/apis";
import storage from "./persistStorage";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import uiReducer from "./slices/uiSlice";
import { blogApi } from "./apis/blogApi";

// Auth ("user", "token", "isAuthenticated") persist kora hocche.
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token", "isAuthenticated"],
};

// Cart persist: "items" ebong "buyNowItem" persist kora hocche jate
// checkout ba cart page-e reload dile item gulo na hariye jay.
const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["items", "buyNowItem"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  ui: uiReducer,
  cart: persistReducer(cartPersistConfig, cartReducer),
  [authApi.reducerPath]: authApi.reducer,
  [productsApi.reducerPath]: productsApi.reducer,
  [shippingApi.reducerPath]: shippingApi.reducer,
  [ordersApi.reducerPath]: ordersApi.reducer,
  [blogApi.reducerPath]: blogApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware,
      productsApi.middleware,
      shippingApi.middleware,
      ordersApi.middleware,
      blogApi.middleware
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;