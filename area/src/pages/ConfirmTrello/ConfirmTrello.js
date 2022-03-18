import React from 'react';
import { withRouter } from 'react-router-dom';
import './ConfirmTrello.css';
import {useLocation} from 'react-router-dom';
import axios from 'axios';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Trelloauth() {
    /* var bodyFormData = new FormData()
    let query = useQuery();
    var oauthToken = query.get("oauth_token")
    var oauthVerifier = query.get("oauth_verifier")
    bodyFormData.append('token_trello', `${oauthToken}+${oauthVerifier}`);
    axios({
        url: `${process.env.REACT_APP_API_HOST}/trello`,
        method: 'POST',
        data: bodyFormData,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then((res) => {
        console.log(res)
        localStorage.setItem('trelloLogin', true)
        window.location.href="/Services"
        return res
    }).catch((res) => {
        console.error(res)
    });       */ 
   /* var url = require('url')
    var query = url.parse(window.location.href, true).query;
    var token = query.oauth_token;
    var tokenSecret = JSON.parse(localStorage.getItem("oauth_secrets"))[token];
    var verifier = query.oauth_verifier;
    (localStorage.getItem('oauth')).getOAuthAccessToken(token, tokenSecret, verifier, function(error, accessToken, accessTokenSecret, results){
        var bodyFormData = new FormData()
        console.log(accessToken + accessTokenSecret + "eeee")
        bodyFormData.append('token_trello', `${accessToken}+${accessTokenSecret}`);*/
 /*       let query = useQuery();
        var token = query.get("oauth_token")    
        var verif = query.get("oauth_verifier")
        var bodyFormData = new FormData()
        bodyFormData.append('token_trello', `${token}${verif}`);
        console.log(`${token}${verif}`)
        axios({
            url: `${process.env.REACT_APP_API_HOST}/trello`,
            method: 'POST',
            data: bodyFormData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            console.log(res)
            localStorage.setItem('trelloLogin', true)
            localStorage.setItem('token', res.data.web_token)
            window.location.href="/Services"
            return res
        }).catch((res) => {
            console.log(bodyFormData)
            console.error(res)
        });
        //window.close()*/
        return (<div>Work in progress</div>)
}

export default withRouter(Trelloauth);