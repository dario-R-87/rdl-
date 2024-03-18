import React, { useEffect, useState } from 'react'
import {Button, Form, Container} from 'react-bootstrap';
import Aziende from '../aziende/Aziende';
import { useNavigate } from 'react-router-dom';
import Users from '../users/Users';


const Login = () => {
    const navigate = useNavigate();
    //const [aziendaLogin, setAziendaLogin] = useState("");
    const [loginData, setLoginData] = useState({
        user: 0,
        password: "",
        azienda: ""
    })
    const [aziende, setAziende] = useState([]);
    const [users, setUsers] = useState([]);

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

        const utSel = users.filter((item) => {
            return (item.CODE == loginData.user)
            });
        const username = utSel[0].NAME;   

        // AUTENTICAZIONE

        localStorage.setItem("azienda", loginData.azienda);
        localStorage.setItem("az_descri", azDescri);
        localStorage.setItem("user", loginData.user);
        localStorage.setItem("username", username);
        localStorage.setItem("password", loginData.password);

        navigate("/homepage");
    }

    const hanldeUsers = (users)=>{
        setUsers(users);
    }

    return (
        <Container className='mt-5 d-flex justify-content-center'>
            <Aziende onLoadAz={handleAz} />
            <Users onLoadUsers={hanldeUsers}/>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="user">
                    <Form.Label className='custom-label mt-3'>Username</Form.Label>
                        <Form.Control required as="select" name="user" value={loginData.user} onChange={handleChange}>
                            <option value=""></option>
                            {users.map((user)=> <option key={user.CODE} value={user.CODE}>{user.CODE+" - "+user.NAME}</option>)}
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