import * as ActionTypes from './actionTypes';

const initialState = {
	isAuthenticated: false,
	isAuthenticating: false,
	currentUser: null,
	apiErrors: null
};

export const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case ActionTypes.AUTH_START:
			return {
				...state,
				isAuthenticating: true
			};
		case ActionTypes.AUTH_SUCCESS:
			return {
				...state,
				isAuthenticated: true,
				isAuthenticating: false,
				currentUser: action.payload.user
			};
		case ActionTypes.AUTH_FAIL:
			return {
				...state,
				isAuthenticated: false,
				isAuthenticating: false,
				apiErrors: action.payload
			};
		case ActionTypes.AUTH_CLEAR_ERRORS:
			return {
				...state,
				apiErrors: null
			};
		default:
			return state;
	}
};

export default authReducer;
