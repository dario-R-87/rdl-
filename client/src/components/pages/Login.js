import React from 'react'
import Container from 'react-bootstrap/Container';
import {Button} from 'react-bootstrap';
import { Link } from "react-router-dom";


const Login = () => {
    return (
        <Container className='mt-5 d-flex justify-content-center'>
            <Link to="/homepage"><Button>Accedi</Button></Link>
        </Container>
    );
}

export default Login
