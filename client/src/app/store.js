import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "~/app/api/apiSlice";
import authReducer from "~/features/auth/authSlice";
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
import storage from "redux-persist/lib/storage";

const rootReducers = combineReducers({
	[apiSlice.reducerPath]: apiSlice.reducer,
	auth: authReducer,
});
const persistConfig = {
	key: "root",
	storage,
	version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducers);

const createStore = (options) =>
	configureStore({
		reducer: persistedReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				serializableCheck: {
					ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
				},
			}).concat(apiSlice.middleware),
		...options,
	});
export const store = createStore();
export let persistor = persistStore(store);
