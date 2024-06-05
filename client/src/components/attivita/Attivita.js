import { useEffect } from 'react';

const Attivita = ({ip, onLoadAtt, commessa }) => {

    const azienda = localStorage.getItem("azienda")

    const getAtt = async () => {
        try {
            const response = await fetch(`http://${ip}:5000/attivita/${azienda}/${commessa}`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            let records = await response.json();
            onLoadAtt(records)
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        if(commessa.trim()!=='')
            getAtt();
    }, []);

    return null;
}

export default Attivita;