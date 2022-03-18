import React from 'react';
import { withRouter } from 'react-router-dom';
import './Register.css';
import RegisterForm from '../../components/form_register/form_register.js'


function Register() {
  return(
    <RegisterForm />
  )
}

export default withRouter(Register);