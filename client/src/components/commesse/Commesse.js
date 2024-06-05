import { useEffect } from 'react';

const Commesse = ({ip, onLoadCom }) => {

    const azienda = localStorage.getItem("azienda")

    const getComs = async () => {
        try {
            const response = await fetch(`http://${ip}:5000/commesse/${azienda}`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            let records = await response.json();
            onLoadCom(records)
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        getComs();
    }, []);

    return null;
}

export default Commesse