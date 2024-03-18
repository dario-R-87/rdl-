import Container from 'react-bootstrap/Container';
import {Button} from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from 'react';

const Main = () => {
    const navigate = useNavigate();
    const azienda = localStorage.getItem("az_descri")
    const username = localStorage.getItem("username")
    const isLogged = localStorage.getItem("isLogged");

    const onLogout = () => {
        localStorage.removeItem("azienda");
        localStorage.removeItem("az_descri");
        localStorage.removeItem("user");
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        localStorage.setItem("isLogged","false");
        navigate("/");
    }

    useEffect(()=>{
        if(isLogged!=="true")
            navigate("/");
    },[])

    return (
        <> 
            <div className='p-3 d-flex justify-content-between'>
                <div>
                    <h3>{azienda}</h3>
                    <h4 className='text-success'>{username}</h4>
                </div>
                <div>
                    <a onClick={onLogout} href="">logout</a>
                </div>
            </div>
            <Container className='mt-5 d-flex justify-content-center'>
                <Link to="/nuovo"><Button>Nuovo Documento</Button></Link>
            </Container>
        </>
    );
}

export default Main;