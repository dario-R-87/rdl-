import Container from 'react-bootstrap/Container';
import {Button} from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import Logout from '../pages/Logout';
import TimerRefresh from '../timerRefresh/TimerRefresh';

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
        localStorage.removeItem("loginTime");             
        localStorage.setItem("isLogged","false");

        navigate("/");
    }

    useEffect(()=>{
        if(isLogged!=="true")
            navigate("/");
    },[])

    return (
        <Container className='my-5 py-3'> 
            <div className='mt-3 p-3 d-flex justify-content-between'>
                <div>
                    <h3>{azienda}</h3>
                    <h4 className='text-success'>{username}</h4>
                </div>
                <div>
                    <a onClick={onLogout} href="">logout</a>
                </div>
            </div>
            <Container className='mt-5 d-flex flex-column align-items-center gap-3'>
                <Link to="/nuovo"><Button>Nuovo Documento</Button></Link>
                <Link to="/documenti"><Button>Visualizza Documenti</Button></Link>
            </Container>
            <Logout />
            <TimerRefresh />
        </Container>
    );
}

export default Main;