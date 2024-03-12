import { useEffect } from 'react';

const DocType = ({ onLoadDocType }) => {
    const getDocType = async () => {
        try {
            const response = await fetch(`http://192.168.1.29:5000/doctype`);
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
