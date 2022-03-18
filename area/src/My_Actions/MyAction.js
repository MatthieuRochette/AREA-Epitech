import React, { useState } from 'react'
import './MyAction.css'
import axios from 'axios';
import _ from 'lodash/fp';
import { Container, Col, Row } from 'react-bootstrap';
import MyActionGenerator from '../components/CreateMyActionWidget/CreateMyActionWidget.js'

export default function MyActions () {
    const [actionsJson, setActionsJson] = useState();

    function setJsonState() {
        function getJson() {
            axios({
                method: 'GET',
                url: `${process.env.REACT_APP_API_HOST}/jobs`,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }      
            }).then(res =>{
                if (res.status === 201) {
                    console.error(res)
                }
                else if (res.status === 401) {
                    window.location.href="/Login"
                    localStorage.setItem('token', "null")            
                }
                else {
                    setActionsJson(res.data.jobs)
                }
            }).catch(res =>{
                console.error(res)
                if (res.response === undefined)
                    window.location.href="/Login"
                else if (res.response.status === 401) {
                    window.location.href="/Login"
                    localStorage.setItem('token', "null")            
                }
            })
        }
        getJson()
    }
    window.onload = setJsonState;
    return (
        <div>
                <Container fluid>
                    <Row xs={4} className="justify-content-md-center">
                {
                actionsJson && actionsJson.map((action, index) => (
                                <Col xs lg="2" className="p-4 col-example text-left" key={index}>
                                    <MyActionGenerator 
                                        currentAction={action}
                                    />
                                </Col>
                            )
                            )
                        }
                        </Row>
            </Container>
        </div>
    );
};
