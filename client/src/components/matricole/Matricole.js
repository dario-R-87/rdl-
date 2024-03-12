import  { useEffect } from 'react';


const Matricole = ({serial, onLoadMat}) => {

    const azienda = localStorage.getItem("azienda")

    const getMatricole = async () => {
        if(serial!==""){
            try {
                const response = await fetch(`http://192.168.1.29:5000/matricole/${azienda}/${serial.trim()}`);
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
