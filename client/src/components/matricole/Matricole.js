import  { useEffect } from 'react';


const Matricole = ({ip, serial, onLoadMat}) => {

    const azienda = localStorage.getItem("azienda")

    const getMatricole = async () => {
        if(serial!==""){
            try {
                const response = await fetch(`http://${ip}:5000/matricole/${azienda}/${serial.trim()}`);
                if (!response.ok) {
                    const message = `An error occurred: ${response.statusText}`;
                    window.alert(message);
                    return;
                }
                let records = await response.json();
                onLoadMat(records)
            } catch (error) {
                alert(error.message);
            }
        }   
    };

    useEffect(() => {
        getMatricole();
    }, [serial]);

    return null;
}

export default Matricole
