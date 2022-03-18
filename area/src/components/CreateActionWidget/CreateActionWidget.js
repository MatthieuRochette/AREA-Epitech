import React, { useState, useRef} from 'react';
import './CreateActionWidget.css';
import {Card, Button, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import { nanoid } from 'nanoid'
import axios from 'axios';

var triggers = {
    "triggers": [
        {
            "name": "cron",
            "description": "Trigger the reaction after time passed",
            "params": {
                "hour": "Number of hours",
                "minute": "Number of minutes",
            }
        },
        {
            "name": "date",
            "description": "Date which trigger the reaction",
            "params": {
                "date": "The date"
            }
        },
        {
            "name": "interval",
            "description": "Trigger the reaction after every time period",
            "params": {
                "hours": "Number of hours",
                "minutes": "Number of minutes",
                "seconds": "Number of seconds"
            }
        }
    ]
}



export default function ActionGenerator(props)
{ 
    const ActionValue = useRef([])
    const UpdateActionValue = (index,inside) => {
        const valuess = [...ActionValue.current]
        valuess[index] = inside
        ActionValue.current = valuess
    }
    const ReactionValue = useRef([])
    const UpdateReactionValue = (index,inside) => {
        const values = [...ReactionValue.current]
        values[index] = inside
        ReactionValue.current = values
    }
    const TriggerValue = useRef([])
    const UpdateTriggerValue = (index,inside) => {
        const valuess = [...TriggerValue.current]
        valuess[index] = inside
        TriggerValue.current = valuess
    }
    const reactionKey = useRef();
    const triggerKey = useRef();
    function ReactionForm(props)
    {
        var returnValue;
        props.reactions && props.reactions.map((value, keys) =>
        value.reactions && value.reactions.map((react, key2) =>
        {
            switch(parseInt(props.numid)) {
                case keys*10+key2:
                    returnValue = (
                        <div><Form.Group>
                            {
                        Object.entries(react.params).map((param, keyx) =>
                        <Form.Control size="sm" type="text" key={keys*100+key2*10+keyx} placeholder={param[0] + ": " + param[1]} onChange={(value) => UpdateReactionValue(keyx, value.target.value)} />
                        )}
                    </Form.Group></div>
                )
                break;
            default:
                return (<div>{keys*10+key2}</div>)
                }
        }
        ))
        return (<div><br />{returnValue}</div>)
    }

    function TriggerForm(props)
    {
        var returnValue;
        triggers && triggers.triggers.map((value, keys) =>
        {
            switch(parseInt(props.numid)) {
                case keys:
                    returnValue = (
                        <div><Form.Group>
                            {
                        Object.entries(value.params).map((param, key2) =>
                        <Form.Control size="sm" type="text" key={keys*10+key2} placeholder={param[0] + ": " + param[1]} onChange={(value) => UpdateTriggerValue(key2, value.target.value)} />
                        )}
                    </Form.Group></div>
                )
                break;
            default:
                return (<div>{keys}</div>)
                }
        }
        )
        return (<div><br />{returnValue}</div>)
    }

    function HandleSendJob(actionParams, reactions, serviceName, actionName) {
        if (triggerKey.current === undefined || reactionKey.current === undefined)
            return(<div></div>)
        var actionParamUpdate = actionParams.actionParams
        console.log(reactionKey.current)
        console.log(reactionKey.current >= 10 ? Math.floor(reactionKey.current / 10) : 0)
        console.log(reactionKey.current >= 10 ? reactionKey.current % 10 : reactionKey.current)
        var reactionsParamUpdate = reactions.reactions[reactionKey.current >= 10 ? Math.floor(reactionKey.current / 10) : 0].reactions[reactionKey.current >= 10 ? reactionKey.current % 10 : reactionKey.current].params
        if (triggerKey.current !== undefined)
            var triggerParamUpdate = triggers.triggers[triggerKey.current].params
        if (actionParamUpdate !== undefined)
            Object.keys(actionParamUpdate).map((value, num) => 
                actionParamUpdate[value] = ActionValue.current[num]
            )
        else
            actionParamUpdate = {}
        if (reactionsParamUpdate !== undefined)
            Object.keys(reactionsParamUpdate).map((value, num) => 
                reactionsParamUpdate[value] = ReactionValue.current[num]
            )
        else
            reactionsParamUpdate = {}
        if (triggerParamUpdate !== undefined)
            Object.keys(triggerParamUpdate).map((value, num) => 
            triggerParamUpdate[value] = parseInt(TriggerValue.current[num])
            )
        else
            triggerParamUpdate = {}
        var job = {
            id: nanoid(),
            action: {
              service: serviceName.serviceName,
              name: actionName.actionName,
              params: actionParamUpdate
            },
            reactions: [{
                service: reactions.reactions[reactionKey.current >= 10 ? Math.floor(reactionKey.current / 10) : 0].name,
                name: reactions.reactions[reactionKey.current >= 10 ? Math.floor(reactionKey.current / 10) : 0].reactions[reactionKey.current >= 10 ? reactionKey.current % 10 : reactionKey.current].name,
                params: reactionsParamUpdate
            }],
            trigger: {
                _type: triggers.triggers[triggerKey.current].name,
                params: triggerParamUpdate
            }
        }
        axios({
            url: `${process.env.REACT_APP_API_HOST}/jobs`,
            method: 'POST',
            data: job,
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }).then((res) => {
            if (res.status === 200)            
              window.location.href="/Actions"
            console.log(res)
          }).catch((res) => {
            console.error(res)
          });
    }

    
    function CardWidget(props) {
        const [triggerShow, setTriggerShow] = useState(<ReactionForm numid={triggerKey.current} triggers={props.reactions}/>);
        const [reactionShow, setReactionShow] = useState(<ReactionForm numid={reactionKey.current} reactions={props.reactions}/>);
        const handleReactionSelect = (e) => {
            reactionKey.current = e;
            setReactionShow(<ReactionForm numid={e} reactions={props.reactions}/>);
        }    
        const handleTriggerSelect = (e) => {
            triggerKey.current = e;
            setTriggerShow(<TriggerForm numid={e} triggers={props.trigger}/>);
        }
        return (
            <Card style = {{ width: '18rem' }} className="text-center">
            <Card.Body>
                <Card.Title>{props.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{props.subtitle}</Card.Subtitle>
                <Card.Text>{props.description}</Card.Text>
                {
                    Object.keys(props.params).length !== 0 && (Object.entries(props.params).map((value, Key) =>
                    <Form.Group>
                    <Form.Control size="sm" type="text" key={Key} placeholder={value[0] + ": " + value[1]} onChange={(value) => UpdateActionValue(Key, value.target.value)} />
                    </Form.Group>
                    ))
                }
                <br />
                <DropdownButton title="Reactions" onSelect={handleReactionSelect}>
                    {
                        props.reactions && props.reactions.map((value, Key) =>
                            value.reactions && value.reactions.map((react, key2) =>
                            <Dropdown.Item eventKey={Key*10+key2} key={Key*10+key2}>{react.name + ": " + react.description}</Dropdown.Item>
                        )
                    )
                    }
                </DropdownButton>
                {reactionShow}
                <DropdownButton title="Triggers" onSelect={handleTriggerSelect}>
                    {
                        triggers && triggers.triggers.map((trigg, keys) =>
                            <Dropdown.Item eventKey={keys} key={keys}>{trigg.name + ": " + trigg.description}</Dropdown.Item>
                        )
                    }
                </DropdownButton>
                {triggerShow}
                <Button variant="primary" onClick={((e) => HandleSendJob(   {actionParams:props.params},
                                                                            {reactions:props.reactions}, 
                                                                            {serviceName: props.name}, 
                                                                            {actionName:props.subtitle}))} 
                                                                            >Submit</Button>
            </Card.Body>
        </Card>
        )
    }

    return (<CardWidget 
        name={props.name}
        subtitle={props.subtitle}
        description={props.description}
        params={props.params}
        reactions={props.reactions}
    />)
}