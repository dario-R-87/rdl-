import { useEffect } from 'react';

const Aziende = ({onLoadAz}) => {

    const ip="192.168.1.122";
    // const ip="192.168.5.87";
    
    const getAziende = async () => {
        try {
            const response = await fetch(`http://${ip}:5000/aziende`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            let records = await response.json();
            onLoadAz(records)
        } catch (error) {
            return;
        }
    };

    useEffect(() => {
        getAziende();
    }, []);
    return null;
}

export default Aziende
