import { useEffect } from 'react';

const DocType = ({ ip, onLoadDocType }) => {

    const azienda = localStorage.getItem("azienda")

    const getDocType = async () => {
        try {
            const response = await fetch(`http://${ip}:5000/doctype/${azienda}`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            let records = await response.json();
            onLoadDocType(records)
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        getDocType();
    }, []);
    return null;
}

export default DocType
