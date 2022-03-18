import React from 'react';
import './CreateMyActionWidget.css';
import {Card, ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';

export default function MyActionGenerator(props)
{
    function deleteJob(id) {
        var bodyFormData = new FormData()
        bodyFormData.append('id', id);
        axios({
            url: `${process.env.REACT_APP_API_HOST}/jobs`,
            method: 'DELETE',
            data: bodyFormData,
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }).then((res) => {
            window.location.href="/my_actions"
            console.log(res)
            return res
          }).catch((res) => {
            console.error(res)
          });
    }
   return (
        <Card style = {{ width: '18rem' }} className="text-center">
        <Card.Body>
        <Card.Title>{props.currentAction.action.service}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{props.currentAction.action.name}</Card.Subtitle>
            <br />
            <ListGroup variant="flush">
                {(Object.entries(props.currentAction.action.params))[0] ? <Card.Header>Action Parameters</Card.Header> : <div/>}
                {Object.entries(props.currentAction.action.params).map((value, key) => 
                 <ListGroup.Item key={key}>{value[0] + ": " + value[1]}</ListGroup.Item>
                )
            }
            </ListGroup>
            <br />
            <Card.Subtitle>{"Reaction Service: " + props.currentAction.reactions[0].service}</Card.Subtitle>
            <br />
            <Card.Subtitle>{"Reaction Type: " + props.currentAction.reactions[0].name}</Card.Subtitle>
            <br />
            <ListGroup variant="flush">
                {(Object.entries(props.currentAction.reactions[0].params))[0] ? <Card.Header>Reaction Parameters</Card.Header> : <div/>}
                {Object.entries(props.currentAction.reactions[0].params).map((value, key) => 
                 <ListGroup.Item key={key}>{value[0] + ": " + value[1]}</ListGroup.Item>
                )
            }
            </ListGroup>
            <br />
            <Card.Subtitle>{"Trigger Type: " + props.currentAction.trigger._type}</Card.Subtitle>
            <br />
            <ListGroup variant="flush">
                {(Object.entries(props.currentAction.trigger.params))[0] ? <Card.Header>Reaction Parameters</Card.Header> : <div/>}
                {Object.entries(props.currentAction.trigger.params).map((value, key) => 
                 <ListGroup.Item key={key}>{value[0] + ": " + value[1]}</ListGroup.Item>
                )
            }
            </ListGroup>
            <br />
            <Button variant="primary" onClick={((e) => deleteJob(props.currentAction.id))}>Delete job</Button>
        </Card.Body>
    </Card>
    )
}