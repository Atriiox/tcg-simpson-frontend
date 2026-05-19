"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { Provider, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // Utilise le localStorage par défaut
import userReducer, { ThemeMode } from "../reducers/user";

const rootReducer = combineReducers({
  user: userReducer,
});

const persistConfig = {
  key: "tcg_simpson",
  storage,
  whitelist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

function ThemeContainer({ children }: { children: React.ReactNode }) {
  const userTheme = useSelector((state: RootState) => state.user.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen opacity-0">{children}</div>;
  }

  return (
    <div className={userTheme === ThemeMode.DARK ? "dark" : ""}>{children}</div>
  );
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeContainer>{children}</ThemeContainer>
    </Provider>
  );
}
