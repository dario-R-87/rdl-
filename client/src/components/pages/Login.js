import React, { useEffect, useState } from 'react'
import { Button, Form, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Importa la libreria md5.js
import md5 from 'crypto-js/md5';



const Login = () => {

    // Funzione per calcolare l'hash MD5 di una stringa
    function calculateMD5(inputString) {
        return md5(inputString).toString();
    }

    // Utilizzo della funzione
    const myString = "Hello, World!";
    const md5Hash = calculateMD5("dario123");
    console.log("MD5 hash:", md5Hash);

    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        user: 0,
        password: "",
        azienda: ""
    })
    const [aziende, setAziende] = useState([]);
    const [users, setUsers] = useState([]);
    const isLogged = localStorage.getItem("isLogged");

    const getAziende = async () => {
        try {
            const response = await fetch(`http://192.168.1.29:5000/aziende`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            let records = await response.json();
            setAziende(records)
        } catch (error) {
            return;
        }
    };

    const getUsers = async () => {
        try {
            const response = await fetch(`http://192.168.1.29:5000/users`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            let records = await response.json();
            setUsers(records)
        } catch (error) {
            return;
        }
    };

    useEffect(() => {
        if (isLogged === "true")
            navigate("/homepage");
        getAziende();
        getUsers();
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value,
        });
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
        localStorage.setItem("isLogged", "true");

        navigate("/homepage");
    }

    return (
        <Container className='pt-5 mt-5 d-flex justify-content-center'>
            {/* <Aziende onLoadAz={handleAz} />
            <Users onLoadUsers={hanldeUsers}/> */}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="user">
                    <Form.Label className='custom-label mt-3'>Username</Form.Label>
                    <Form.Control required as="select" name="user" value={loginData.user} onChange={handleChange}>
                        <option value=""></option>
                        {users.map((user) => <option key={user.CODE} value={user.CODE}>{user.CODE + " - " + user.NAME}</option>)}
                    </Form.Control>
                </Form.Group>
                {/* <Form.Group controlId="password">
                    <Form.Label className='custom-label mt-3'>Password</Form.Label>
                    <Form.Control required type="password" name="password" value={loginData.password} onChange={handleChange}>
                    </Form.Control>
                </Form.Group> */}
                <Form.Group controlId="azienda">
                    <Form.Label className='custom-label mt-3'>Azienda</Form.Label>
                    <Form.Control required as="select" name="azienda" value={loginData.azienda} onChange={handleChange}>
                        <option value=""></option>
                        {aziende.map((az) => <option key={az.AZCODAZI} value={az.AZCODAZI}>{az.AZRAGAZI}</option>)}
                    </Form.Control>
                </Form.Group>
                <Button type="submit" className='mt-3'>Accedi</Button>
            </Form>
        </Container>
    );
}

export default Login