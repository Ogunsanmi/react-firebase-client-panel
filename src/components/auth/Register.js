import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { compose } from "redux";
import { firebaseConnect } from "react-redux-firebase"; //firebase connect is used for authentication whilst our data is stored in firestore connect

import { notifyUser } from "../../actions/notifyActions";
import Alert from "../layout/Alert";


class Login extends Component {
  state = {
    email: "",
    password: ""
  }

  componentWillMount() {
    const { allowRegistration } = this.props.settings

    if (!allowRegistration) {
        this.props.history.push('/')
    }
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value })

  onSubmit = e => {
    e.preventDefault()

    const { firebase, notifyUser,  } = this.props
    const { email, password } = this.state

    firebase
    .createUser({
        email,
        password
    })
    .catch( err => notifyUser('User already exists', "error"))
  }
  

  render() {
    const { message, messageType } = this.props.notify

    return (
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card">
            <div className="card-body">
              {message ? (
                <Alert message= { message } messageType= { messageType } />
              ) : null}

              <h1 className="text-center pb-4 pt-3">
                <span className="text-primary">
                  <i className="fas fa-user-plus"> {" "}
                  Register
                  </i>
                </span>
              </h1>

              <form onSubmit= { this.onSubmit }>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    className= "form-control"
                    required
                    value= { this.state.email }
                    onChange= { this.onChange }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input 
                    type="password" 
                    name="password" 
                    className= "form-control"
                    required
                    value= { this.state.password }
                    onChange= { this.onChange }
                  />
                </div>

                <input 
                  type="submit"
                  value= "Register"
                  className= "btn btn-primary btn-block"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Login.propTypes = {
  firebase: PropTypes.object.isRequired,
  notify: PropTypes.object.isRequired,
  notifyUser: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired
}

export default compose(
  firebaseConnect(),
  connect(
      (state, props) => ({
          notify: state.notify,
          settings: state.settings
    }), 
    { notifyUser }
 )
)(Login)