import React, { useState, useRef} from 'react';
import './CreateServiceWidget.css';
import {Card, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

export default function ServiceGenerator()
{
    function TrelloLogout() 
    {
        axios({
            url: `${process.env.REACT_APP_API_HOST}/trello`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            console.log(res)
            localStorage.setItem('trelloLogin', false)
            window.location.href="/Services"
            return res
        }).catch((res) => {
            console.error(res)
        });
    }

    function TrelloLogin()
    {
       var oauth_secrets = {};
        var OAuth = require('oauth').OAuth
        const oauth = new OAuth(
            "https://trello.com/1/OAuthGetRequestToken",
            "https://trello.com/1/OAuthGetAccessToken",
            process.env.REACT_APP_TRELLO_CLIENT,
            process.env.REACT_APP_TRELLO_SECRET,
            "1.0A",
            process.env.REACT_APP_TRELLO_REDIRECT_URL,
            "HMAC-SHA1");
        
        oauth.getOAuthRequestToken(function(error, token, tokenSecret, results){
        oauth_secrets[token] = tokenSecret;
        /*localStorage.setItem('oauth_secret_trello', oauth_secret)
        localStorage.setItem('oauth_token_trello', token)*/
        window.open(`https://trello.com/1/OAuthAuthorizeToken?oauth_token=${token}&name=Area&scope=read&expiration=1hour&return_url=${process.env.REACT_APP_TRELLO_REDIRECT_URL}`);
          });
        }

    function GithubLogout() 
    {
        axios({
            url: `${process.env.REACT_APP_API_HOST}/github`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            console.log(res)
            localStorage.setItem('githubLogin', "false")
            window.location.href="/Services"
            return res
        }).catch((res) => {
            console.error(res)
        });
    }

    function GithubLogin()
    {
        var ClientOAuth2 = require('client-oauth2')
 
        var githubAuth = new ClientOAuth2({
            redirectUrl: process.env.REACT_APP_GITHUB_REDIRECT_URL,
            clientId: process.env.REACT_APP_GITHUB_CLIENT,
            clientSecret: process.env.REACT_APP_GITHUB_SECRET,
            scopes:['identity', 'admin:repo_hook', 'admin:org', 'admin:public_key', 'admin:org_hook', 'gist', 'notifications', 'user', 'delete_repo', 'admin:gpg_key', 'workflow', 'repo', 'repo_deployment', 'public_repo', 'repo:invite'],
            accessTokenUri: 'https://github.com/login/oauth/access_token',
            authorizationUri: 'https://github.com/login/oauth/authorize',
        })
                     
          // Open the page in a new window, then redirect back to a page that calls our global `oauth2Callback` function.*/
        window.open(githubAuth.token.getUri())
        return (<div />)
    }
    
    function FreeLogout() 
    {
        axios({
            url: `${process.env.REACT_APP_API_HOST}/free`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            console.log(res)
            localStorage.setItem('freeLogin', false)
            window.location.href="/Services"
            return res
        }).catch((res) => {
            console.error(res)
        });
    }

    function FreeLogin(login, password)
    {
        var bodyFormData = new FormData()
        bodyFormData.append('user', login);
        bodyFormData.append('_pass', password);
        axios({
            url: `${process.env.REACT_APP_API_HOST}/free`,
            method: 'POST',
            data: bodyFormData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            console.log(res)
            localStorage.setItem('freeLogin', true)
            window.location.href="/Services"
            return res
        }).catch((res) => {
            console.error(res)
        });
    }
    
    const [Login, setLogin] = useState("")
    const [Password, setPassword] = useState("")
    var freeCase;
    if (localStorage.getItem('freeLogin') !== true) {
    freeCase =         <Card style = {{ width: '18rem' }} className="text-center">
                            <Card.Body>
                                <Card.Title>Free</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Login</Card.Subtitle>
                                <br />
                                <Form.Group>
                                    <Form.Control size="sm" type="text" placeholder="Login" onChange={(value) => setLogin(value.target.value)} />
                                    <Form.Control size="sm" type="password" placeholder="Password" onChange={(value) => setPassword(value.target.value)} />
                                </Form.Group>
                                <Button variant="primary" onClick={((e) => FreeLogin(Login, Password))}>Login</Button>
                            </Card.Body>
                        </Card>
    } else {
        freeCase =         <Card style = {{ width: '18rem' }} className="text-center">
                                <Card.Body>
                                    <Card.Title>Free</Card.Title>
                                    <Button variant="primary" onClick={((e) => FreeLogout())}>Login</Button>
                                </Card.Body>
                            </Card>
    }
    var githubCase = <Card style = {{ width: '18rem' }} className="text-center">
                        <Card.Body>
                            <Card.Title>Github</Card.Title>
                            {localStorage.getItem('githubLogin') !== "true" ? <Card.Subtitle className="mb-2 text-muted">Login</Card.Subtitle> : <div />}
                            <br />
                            {localStorage.getItem('githubLogin') !== "true" ?
                            <Button variant="primary" onClick={((e) => GithubLogin())}>Login</Button> :
                            <Button variant="primary" onClick={((e) => GithubLogout())}>Logout</Button>
                            }
                        </Card.Body>
                    </Card>
    
    var trelloCase = <Card style = {{ width: '18rem' }} className="text-center">
                        <Card.Body>
                            <Card.Title>Trello</Card.Title>
                            {localStorage.getItem('trelloLogin') !== "true" ? <Card.Subtitle className="mb-2 text-muted">Login</Card.Subtitle> : <div />}
                            <br />
                            {localStorage.getItem('trelloLogin') !== "true" ?
                            <Button variant="primary" onClick={((e) => TrelloLogin())}>Login</Button> :
                            <Button variant="primary" onClick={((e) => TrelloLogout())}>Logout</Button>
                            }
                        </Card.Body>
</Card>

    return (
        <div>
            <br />
            <Row className="justify-content-md-center">
                <Col xs lg="2" className="p-4 col-example text-left"> {freeCase} </Col>
                <Col xs lg="2" className="p-4 col-example text-left"> {trelloCase} </Col>
                <Col xs lg="2" className="p-4 col-example text-left"> {githubCase} </Col>
            </Row>
        </div>
    )
}