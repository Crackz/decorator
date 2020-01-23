import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


export default function (ComposedComponent) {
    class Authentication extends Component {
        componentWillMount() {
            if (!this.props.isAuthenticated) {
                this.props.history.push('/auth/login');
            }
        }
        componentWillUpdate(nextProps) {
            if (!nextProps.isAuthenticated) {
                this.props.history.push('/auth/login');
            }
        }
        PropTypes = {
            router: PropTypes.object,
        }
        render() {
            return this.props.isAuthenticated && <ComposedComponent {...this.props} />;
        }
    }

    
    function mapStateToProps(state) {
        return { isAuthenticated: state.auth.isAuthenticated };
    }
    return connect(mapStateToProps)(Authentication);
}