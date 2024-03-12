import { useEffect } from 'react';

const Aziende = ({onLoadAz}) => {
    const getAziende = async () => {
        try {
            const response = await fetch(`http://192.168.1.29:5000/aziende`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            let records = await response.json();
            onLoadAz(records)
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        getAziende();
    }, []);
    return null;
}

export default Aziende
