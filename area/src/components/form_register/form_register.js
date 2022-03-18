import React, { Component, useState } from 'react';
import Button from 'react-bootstrap/Button'
import './form_register.css';
import axios from 'axios';



function FormRegister() {

    const [toggleError, setToggleError] = useState(false)

    const sendRegister = () => {
        var bodyFormData = new FormData()
        bodyFormData.append('name', document.getElementById("name").value)
        bodyFormData.append('email', document.getElementById("mail").value)
        bodyFormData.append('password', document.getElementById("pass").value)
        bodyFormData.append('confirm_pw', document.getElementById("pass_c").value)
        axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_HOST}/user`,
            data: bodyFormData,
            headers: {'Content-Type': 'multipart/form-data' }
        }).then(res =>{
            if (res.status === 201) {
                console.log("Succes")
                window.location.href='/Login'
            }
            else {
                console.log(res.json().message)
            }
        }).catch(res =>{
            setToggleError(true)
            console.error(res)
        })
    };

    const login = () => {
        window.location.href='/Login'
    };

        return(
            <div className="register-block">
                <h2>Sign Up&nbsp;<i style={{cursor: 'pointer'}} className="fas fa-arrow-right"></i></h2>
                <div className="input-rounded">
                    <input type="text" id="name" className="input-rounded" placeholder="Name"/>
                    <input type="text" id="mail" className="input-rounded" placeholder="Mail Adress" />
                    <input type="password" id="pass" className="input-rounded" placeholder="Password (minimum lenght 8)"/>
                    <input type="password" id="pass_c" className="input-rounded" placeholder="Confirm Password"/>
                    { toggleError && (
                        <p className='errorText'>Error with some input</p>
                    )}

                    <Button variant="info" size="lg" block onClick={sendRegister}>
                        Sign Up<i className="fas fa-chevron-right" style={{float:'right', paddingTop: '0.15cm'}}></i>
                    </Button>
                    <br/>
                    <div style={{paddingLeft: '4rem', paddingRight: '4rem'}} >
                        <Button variant="secondary" size="sm" block onClick={login}>
                            Sign In<i className="fas fa-chevron-right" style={{float:'right', paddingTop: '0.15cm'}}></i>
                        </Button>
                    </div>
                    <br></br>
                </div>
            </div>
        )
    }


export default FormRegister;