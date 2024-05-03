import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user-slice';

const store = configureStore({
    reducer: {
        loggedInUser: userReducer,
    },
});

// Type for the root state
export type RootState = ReturnType<typeof store.getState>;

export default store;
