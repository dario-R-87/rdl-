import { useEffect } from 'react';

const Users = ({ onLoadUsers }) => {

    const ip="192.168.1.122";
    // const ip="192.168.5.87";
    
    const getUsers = async () => {
        try {
            const response = await fetch(`http://${ip}:5000/users`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            let records = await response.json();
            onLoadUsers(records)
        } catch (error) {
            return;
        }
    };

    useEffect(() => {
        getUsers();
    }, []);
    return null;
}

export default Users
