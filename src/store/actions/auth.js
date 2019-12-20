import * as ActionTypes from '../reducers/actionTypes';
import axios from 'axios';

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

			dispatch({ type: ActionTypes.AUTH_SUCCESS, payload: res.data.user });
			setTokenToStorage(res.data.accessToken);
			history.push('/dashboard');
		} catch (error) {
			let apiErrors = [];

			if (error.response) {
				apiErrors = apiErrors.concat(error.response.data.error.errors);
			} else {
				apiErrors.push({ message: 'try again', param: 'tryAgain' });
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

			dispatch({ type: ActionTypes.AUTH_SUCCESS, payload: res.data.user });
			setTokenToStorage(res.data.accessToken);
			history.push('/dashboard');
		} catch (error) {
			let apiErrors = [];

			if (error.response) {
				apiErrors = apiErrors.concat(error.response.data.error.errors);
			} else {
				apiErrors.push({ message: 'try again', param: 'tryAgain' });
			}

			dispatch({
				type: ActionTypes.AUTH_FAIL,
				payload: apiErrors
			});
		}
	};
}

export function clearErrors() {
	return async (dispatch) => {
		dispatch({ type: ActionTypes.AUTH_CLEAR_ERRORS });
	};
}

// export const signout = () => {
//   localStorage.removeItem('token');

//   return {
//     type: AUTH_USER,
//     payload: ''
//   };
// };
