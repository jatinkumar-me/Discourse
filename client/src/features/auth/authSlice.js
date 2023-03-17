import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	user: null,
	token: null,
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setCredentials: (state, action) => {
			const { user, token } = action.payload;
			state.user = user;
			state.token = token;
		},
		setProfilePicture: (state, action) => {
			const { picture } = action.payload;
			state.user.picture = picture;
		},
		logout: () => initialState
	},
});

export const { setCredentials, setProfilePicture, logout } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
