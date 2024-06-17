import { useEffect } from 'react';

const Commesse = ({ip, onLoadCom, searchValue }) => {

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
            let filteredRecords = []
            if(searchValue!==''){
                filteredRecords = records.filter((item) => {
                    return (item.CNCODCAN.toLowerCase().includes(searchValue.toLowerCase()))
                    });
                onLoadCom(filteredRecords);
            } else {
                onLoadCom(records)
            }
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