import React from "react";
import { Route, redirect as Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const routeUser = (auth, Component, props) => {
  if (auth) {
    if (auth.registered) {
      return <Component {...props} />;
    }
    return <Redirect to="/register_user" />;
  }
  return <Redirect to="/" />;
};

export const PrivateRoute = ({ auth, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      return routeUser(auth, Component, props);
    }}
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
};

const mapStateToProps = (auth) => ({
  auth,
});

export default connect(mapStateToProps)(PrivateRoute);
