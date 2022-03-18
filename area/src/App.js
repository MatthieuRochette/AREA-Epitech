import React, { Component, useState, useRef } from 'react';
import Register from './pages/Register/Register.js';
import Login from './pages/Login/Login.js';
import ConfirmAccount from './pages/ConfirmAccount/ConfirmAccount.js'
import Githubauth from './pages/ConfirmGithub/ConfirmGithub.js'
import Trelloauth from './pages/ConfirmTrello/ConfirmTrello.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import Header from './Header'
import Services from './Services/Services'
import Action from './Actions/Action'
import MyAction from './My_Actions/MyAction'
import Navbar from './Navbar/Navbar'
import './App.css'
import { Switch, Route, BrowserRouter as Router, Redirect, useLocation} from 'react-router-dom';

function App(props) 
  {
    return (
      <div className="App">
        {!localStorage.getItem('token') && (
          localStorage.setItem('token', "null")
        )}
        <Header></Header>
        <div className="linear-gradient">
          <Router>
            <Switch>
            <Route exact path="/Login">
              {localStorage.getItem('token') === "null" ? <Login></Login> : <Redirect to="/Actions" />}
            </Route>
            <Route exact path="/Register">
              {localStorage.getItem('token') === "null" ? <Register></Register> : <Redirect to="/Actions" />}
            </Route>
              <Route exact path="/Services">
                <Navbar></Navbar>
                {localStorage.getItem('token') === "null" ? <Redirect to="Login" /> : <Services></Services>}
              </Route>
              <Route exact path="/Actions">
                <Navbar></Navbar>
                {localStorage.getItem('token') === "null" ? <Redirect to="Login" /> : <Action></Action>}
              </Route>
              <Route exact path="/my_actions">
                <Navbar></Navbar>
                {localStorage.getItem('token') === "null" ? <Redirect to="Login" /> : <MyAction></MyAction>}
              </Route>
              <Route path="/confirm_account">
                <ConfirmAccount></ConfirmAccount>
              </Route>
              <Route path="/githubauth">
                <Githubauth></Githubauth>
              </Route>
              <Route path="/trelloauth">
                <Trelloauth></Trelloauth>
              </Route>
              <Route path="*">
                {localStorage.getItem('token') === "null" ? <Redirect to="/Login" /> : <Redirect to="/Actions" />}
              </Route>
            </Switch>
          </Router>
        </div>
      </div>
    );
  }

export default App;
