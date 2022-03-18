import React, { useState } from 'react'
import './Services.css'
import axios from 'axios';
import _ from 'lodash/fp';
import { Container, Row, Col } from 'react-bootstrap';
import ServiceGenerator from '../components/CreateServiceWidget/CreateServiceWidget.js'


export default function Services () {
    return (<ServiceGenerator></ServiceGenerator>)
};

