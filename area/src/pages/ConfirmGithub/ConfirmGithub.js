import React from 'react';
import { withRouter } from 'react-router-dom';
import './ConfirmGithub.css';
import {useLocation} from 'react-router-dom';
import axios from 'axios';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Githubauth() {
    let query = useQuery();
    var codeGithub = query.get("code")
    console.log(codeGithub)
    axios({
      url: `${process.env.REACT_APP_API_HOST}/github`,
      method: 'PUT',
      params: {
          code: codeGithub
        }
  }).then((res) => {
      console.log(res)
      localStorage.setItem('githubLogin', "true")
      localStorage.setItem('token', res.data.web_token)
      setTimeout(() => {
        window.location.href= "/Services"
      }, 1500);
      }).catch((res) => {
      console.error(res)
  });
  setTimeout(() => {
    window.close()
  }, 1500);
}

export default withRouter(Githubauth);