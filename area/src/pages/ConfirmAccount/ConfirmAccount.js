import React from 'react';
import { withRouter } from 'react-router-dom';
import './ConfirmAccount.css';
import {useLocation} from 'react-router-dom';
import axios from 'axios';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ConfirmAccount() {
  let query = useQuery();
  var token = query.get("token")
  axios({
    method: 'PUT',
    url: `${process.env.REACT_APP_API_HOST}/user`,
    headers: {Authorization: `Bearer ${token}` }
  }).then(res =>{
      if (res.status === 200) {
          console.log("Succes")
          return (window.location.href='/Login')
      }
      else {
          console.log(res)
          return (<div>{res}</div>)
      }
  }).catch(res =>{
      console.error(res)
      return (<div>{res}</div>)
  })
  return (<div></div>)
}

export default withRouter(ConfirmAccount);