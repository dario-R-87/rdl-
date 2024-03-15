import React, { useEffect, useState } from 'react'
import {Button, Form, Container} from 'react-bootstrap';
import Aziende from '../aziende/Aziende';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const navigate = useNavigate();
    //const [aziendaLogin, setAziendaLogin] = useState("");
    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
        azienda: ""
    })
    const [aziende, setAziende] = useState([]);
    const [users, setUsers] = useState([]);
    
    const getUsers = async () => {
        try {
            const response = await fetch(`http://192.168.1.29:5000/users`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const records = await response.json();
            setUsers(records);
        } catch (error) {
            alert(error.message);
        }
    }

    useEffect(()=>{
        getUsers();
    },[]);

    const handleChange = (e) => {
        const {name,value} = e.target;
        setLoginData({
            ...loginData,
            [name]: value,
        });
    }

    const handleAz = (records) => {
        setAziende(records)
    }

    const handleSubmit = () => {
        const azSel = aziende.filter((item) => {
            return (item.AZCODAZI === loginData.azienda)
            });
        const azDescri = azSel[0].AZRAGAZI;

        // AUTENTICAZIONE

        localStorage.setItem("azienda", loginData.azienda);
        localStorage.setItem("az_descri", azDescri);
        localStorage.setItem("username", loginData.username);
        localStorage.setItem("password", loginData.password);

        navigate("/homepage");
    }

    return (
        <Container className='mt-5 d-flex justify-content-center'>
            <Aziende onLoadAz={handleAz} />
            <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
                    <Form.Label className='custom-label mt-3'>Username</Form.Label>
                        <Form.Control required name="username" value={loginData.username} onChange={handleChange}>
                        </Form.Control>
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label className='custom-label mt-3'>Password</Form.Label>
                        <Form.Control required type="password" name="password" value={loginData.password} onChange={handleChange}>
                        </Form.Control>
                </Form.Group>
                <Form.Group controlId="azienda">
                    <Form.Label className='custom-label mt-3'>Azienda</Form.Label>
                        <Form.Control required as="select" name="azienda" value={loginData.azienda} onChange={handleChange}>
                            <option value=""></option>
                            {aziende.map((az)=> <option key={az.AZCODAZI} value={az.AZCODAZI}>{az.AZRAGAZI}</option>)}
                        </Form.Control>
                </Form.Group>
                <Button type="submit" className='mt-3'>Accedi</Button>
            </Form>
        </Container>
    );
}

export default Login