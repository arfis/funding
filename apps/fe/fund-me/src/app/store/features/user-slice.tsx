// features/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
    userName: string;
    email: string;
    id: string;
    type: string;
    avatarUrl: string;
    exp: number;
    token: string;
}

interface UserState {
    user: User | null;
}

const initialState: UserState = {
    user: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },
        clearUser(state) {
            state.user = null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
