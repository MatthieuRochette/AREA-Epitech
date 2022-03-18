import React, { useState } from 'react'
import './Action.css'
import ActionGenerator from '../components/CreateActionWidget/CreateActionWidget.js'
import axios from 'axios';
import _ from 'lodash/fp';
import { Container, Row, Col } from 'react-bootstrap';

export default function Action () {
    const [actionsJson, setActionsJson] = useState();
    const [reactionsJson, setReactionsJson] = useState();

    function setJsonState() {
        function getJson() {
            axios({
                method: 'GET',
                url: `${process.env.REACT_APP_API_HOST}/area-params.json`,
            }).then(res =>{
                if (res.status === 201) {
                    console.error("Error")
                }
                else {
                    setActionsJson(_.remove((s) => s.actions.length === 0)(res.data.server.services))
                    setReactionsJson(_.remove((s) => s.reactions.length === 0)(res.data.server.services))
                }
            }).catch(res =>{
                console.error("Error")
            })
        }
        getJson()
    }
    window.onload = setJsonState;
    return (
        <div>
                <Container fluid>
                {
                actionsJson && actionsJson.map((action, index) => (
                    <Row className="justify-content-md-center" key={index}>
                        {
                            action.actions && action.actions.map((individual, index2) => (
                                <Col xs lg="2" className="p-4 col-example text-left" key={index*10+index2}>
                                    <ActionGenerator 
                                        name={action.name}
                                        subtitle={individual.name}
                                        description={individual.description}
                                        params={individual.params}
                                        reactions={reactionsJson}
                                    />
                                </Col>
                            ))
                        }
                    </Row>
                    ))
                }
            </Container>
        </div>
    );
};
