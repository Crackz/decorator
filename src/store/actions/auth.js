import * as ActionTypes from '../reducers/actionTypes';
import axios from 'axios';
import { setUserToStorage } from './shared';

function cleanUpAuth() {
	localStorage.removeItem('token');
	localStorage.removeItem('user');
}

function setTokenToStorage(token) {
	localStorage.setItem('token', token);
}

export function register(registerData, history) {
	return async (dispatch) => {
		try {
			dispatch({ type: ActionTypes.AUTH_START });

			const res = await axios({
				method: 'post',
				url: `${process.env.REACT_APP_API_URL}/auth/register`,
				data: registerData,
				headers: { 'Content-Type': 'multipart/form-data' }
			});

			dispatch({ type: ActionTypes.AUTH_SUCCESS, payload: { user: res.data.user } });
			setTokenToStorage(res.data.accessToken);
			setUserToStorage(res.data.user);
			history.push({ pathname: '/dashboard/index', state: { authenticatedUser: res.data.user } });
		} catch (error) {
			let apiErrors = [];

			if (error.response) {
				apiErrors = apiErrors.concat(error.response.data.error.errors);
			} else {
				apiErrors.push({ message: 'تاكد من الانترنت وحاول مرة اخري', param: 'tryAgain' });
			}

			dispatch({
				type: ActionTypes.AUTH_FAIL,
				payload: apiErrors
			});
		}
	};
}

export function login(loginData, history) {
	return async (dispatch) => {
		try {
			dispatch({ type: ActionTypes.AUTH_START });

			const res = await axios({
				method: 'post',
				url: `${process.env.REACT_APP_API_URL}/auth/login`,
				data: loginData
			});

			dispatch({ type: ActionTypes.AUTH_SUCCESS, payload: { user: res.data.user } });
			setTokenToStorage(res.data.accessToken);
			setUserToStorage(res.data.user);
			history.push({ pathname: '/dashboard/index', state: { authenticatedUser: res.data.user } });
		} catch (error) {
			let apiErrors = [];

			if (error.response) {
				apiErrors = apiErrors.concat(error.response.data.error.errors);
			} else {
				apiErrors.push({ message: 'تاكد من الانترنت وحاول مرة اخري', param: 'tryAgain' });
			}

			dispatch({
				type: ActionTypes.AUTH_FAIL,
				payload: apiErrors
			});
		}
	};
}

export const signout = (history) => {
	cleanUpAuth();
	history.push('/auth/login');
	return (dispatch) => {
		dispatch({ type: ActionTypes.AUTH_SIGN_OUT });
	};
};


export function fetchUser(userId) {
	return async (dispatch) => {
		try {
			dispatch({ type: ActionTypes.AUTH_REFETCHING });

			const res = await axios({
				method: 'get',
				url: `${process.env.REACT_APP_API_URL}/users/${userId}`,
				headers: {
					"Authorization": `Bearer ${localStorage.getItem('token')}`
				}
			});

			setUserToStorage(res.data);
			dispatch({ type: ActionTypes.AUTH_REFETCHING_SUCCESS, payload: { user: res.data } });
		} catch (error) {
			let apiErrors = [];

			if (error.response) {
				apiErrors = apiErrors.concat(error.response.data.error.errors);
			} else {
				apiErrors.push({ message: 'تاكد من الانترنت وحاول مرة اخري', param: 'tryAgain' });
			}

			dispatch({
				type: ActionTypes.AUTH_REFETCHING_FAIL,
				payload: apiErrors
			});
		}
	};
}


export const clearErrors = () => {
	return (dispatch) => {
		dispatch({ type: ActionTypes.AUTH_CLEAR_ERRORS });
	};
};