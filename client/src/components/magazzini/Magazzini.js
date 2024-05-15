import { useEffect } from 'react';

const Magazzini = ({ip, onLoadMag }) => {

    const azienda = localStorage.getItem("azienda")

    const getMag = async () => {
        try {
            const response = await fetch(`http://${ip}:5000/mag/${azienda}`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            let records = await response.json();
            onLoadMag(records)
        } catch (error) {
            alert(error.message);
        }
    };

    // const getCauCol = async (tipdocu, caumag) => {
    //     try {
    //         const response = await fetch(`http://${ip}:5000/causale_mag/${azienda}/${caumag}`);
    //         if (!response.ok) {
    //             const message = `An error occurred: ${response.statusText}`;
    //             window.alert(message);
    //             return;
    //         }
    //         let records = await response.json();
    //         // onLoadMag(records)
    //     } catch (error) {
    //         alert(error.message);
    //     }
    // };

    useEffect(() => {
        getMag();
    }, []);

    return null;
}

export default Magazzini