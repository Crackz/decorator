import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/auth';

const middlewares = [ thunk ];

const rootReducer = combineReducers({
	auth: authReducer
});

let composeEnhancers = compose;

export const store = createStore(
	rootReducer,
	{
		auth: {
			isAuthenticated: localStorage.getItem('token') ? true : false,
			currentUser: JSON.parse(localStorage.getItem('user') || "null")
		}
	},
	composeEnhancers(applyMiddleware(...middlewares))
);
