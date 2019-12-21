import 'assets/scss/argon-dashboard-react.scss';
import 'assets/vendor/@fortawesome/fontawesome-free/css/all.min.css';
import 'assets/vendor/nucleo/css/nucleo.css';
import AdminLayout from 'layouts/Admin.jsx';
import AuthLayout from 'layouts/Auth.jsx';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { store } from './store/configure-store';

ReactDOM.render(
	<Provider store={store}>
		<Router>
			<Switch>
				<Route path="/dashboard" render={(props) => <AdminLayout {...props} />} />
				<Route path="/auth" render={(props) => <AuthLayout {...props} />} />
				<Redirect from="/" to="/dashboard/index" />
			</Switch>
		</Router>
	</Provider>,
	document.getElementById('root')
);
