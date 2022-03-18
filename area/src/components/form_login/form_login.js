import React, { useState } from 'react';
import Button from 'react-bootstrap/Button'
import './form_login.css';
import axios from 'axios';


function FormLogin() {

    const [toggleError, setToggleError] = useState(false);
    const [webToken, setWebToken] = useState("");

    const sendIdentification = () => {
        var bodyFormData = new FormData()
        bodyFormData.append('email', document.getElementById("mail").value)
        bodyFormData.append('password', document.getElementById("pass").value)
        bodyFormData.append('mobile', false)
        axios({
            method: 'link',
            url: `${process.env.REACT_APP_API_HOST}/user`,
            data: bodyFormData,
            headers: {'Content-Type': 'multipart/form-data' }
        }).then(res =>{
            console.log(res.statusText)
            if (res.status === 202) {
                setWebToken(res.data.web_token)
                localStorage.setItem('token', res.data.web_token)
                console.log(webToken)
                window.location.href="/Actions"
            }
        }).catch(res =>{
            setToggleError(true)
            console.error(res)
        })
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            sendIdentification()
        }
    }

    const register = () => {
        window.location.href='/Register'
    };

    const GithubLogin = () => {
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
        setTimeout(() => {
            window.location.href= "/Actions"
          }, 3500);    
    }

    return(
        <div>
            <h1>Welcome on AREA a tirer</h1>
            <div className="login-block">
                    <h2>Sign In&nbsp;<i style={{cursor: 'pointer'}} className="fas fa-arrow-right"></i></h2>
                <div className="input-rounded">
                    <input type="text" id="mail" className="input-rounded" placeholder="Email Address"/>
                    <input type="password" id="pass" onKeyPress={handleKeyPress} className="input-rounded" placeholder="Password"/>
                    <Button variant="info" size="lg" block onClick={sendIdentification} className="buttonLogin">
                        CONTINUE<i className="fas fa-chevron-right" style={{float:'right', paddingTop: '0.15cm'}}></i>
                    </Button>
                    <br/>
                    <div style={{paddingLeft: '4rem', paddingRight: '4rem'}} >
                        <Button variant="secondary" size="sm" block onClick={register}>
                            Sign Up<i className="fas fa-chevron-right" style={{float:'right', paddingTop: '0.15cm'}}></i>
                        </Button>
                    </div>
                    {toggleError && (
                        <p className='errorText'>Error with the password or the email</p>

                    )}
                    <div className="connectionSocial">
                        <span>or Connect with Social Media:</span>
                        <Button variant="secondary" size="sm" onClick={GithubLogin}>
                            <i className="fab fa-github" aria-hidden="true"></i>
                        </Button>
                        <Button variant="secondary" size="sm">
                            <i className="fab fa-trello" aria-hidden="true"></i>
                        </Button>
                        {/* <button onClick={((e) => GithubLoginFromLoginButton())} style={{borderRadius: '10rem', marginLeft: '2rem'}}><i className="fab fa-github" aria-hidden="true"></i></button> */}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default FormLogin;