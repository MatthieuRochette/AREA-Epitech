import React from 'react';
import { withRouter } from 'react-router-dom';
import './Login.css';
import FormLogin from '../../components/form_login/form_login.js'

function Login() {
  return(
    <FormLogin />
  )
}

export default withRouter(Login);