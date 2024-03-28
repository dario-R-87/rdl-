import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Logout = () => {

    const navigate = useNavigate();

    const checkLogoutTimeout = () => {
        const loginTime = localStorage.getItem("loginTime");
        if (loginTime) {
            const currentTime = new Date().getTime();
            const elapsedTime = currentTime - parseInt(loginTime);
            const oneHour = 30 * 60 * 1000; // Un'ora in millisecondi
            if (elapsedTime >= oneHour) {
                localStorage.removeItem("azienda");
                localStorage.removeItem("az_descri");
                localStorage.removeItem("user");
                localStorage.removeItem("username");
                localStorage.removeItem("loginTime");             
                localStorage.setItem("isLogged","false");
                alert("E' necessario rieffettuare il login!");
                navigate("/");
            }
        }
    };

    useEffect(()=>{checkLogoutTimeout();},[]);

}

export default Logout
