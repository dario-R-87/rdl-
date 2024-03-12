import React, { useState } from 'react'
import {Button, Form, Container} from 'react-bootstrap';
import Aziende from '../aziende/Aziende';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const navigate = useNavigate();
    const [aziendaLogin, setAziendaLogin] = useState("");
    const [aziende, setAziende] = useState([]);

    const handleChange = (e) => {
        const value = e.target.value;
        setAziendaLogin(value);
    }

    const handleAz = (records) => {
        setAziende(records)
    }

    const handleSubmit = () => {
        const azSel = aziende.filter((item) => {
            return (item.AZCODAZI === aziendaLogin)
            });
        const azDescri = azSel[0].AZRAGAZI;
        localStorage.setItem("azienda", aziendaLogin);
        localStorage.setItem("az_descri", azDescri);

        navigate("/homepage");
    }

    return (
        <Container className='mt-5 d-flex justify-content-center'>
            <Aziende onLoadAz={handleAz} />
            <Form onSubmit={handleSubmit}>
            <Form.Group controlId="azienda">
                <Form.Label className='custom-label mt-3'>Azienda</Form.Label>
                    <Form.Control required as="select" name="azienda" value={aziendaLogin} onChange={handleChange}>
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
