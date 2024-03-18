import { useEffect } from 'react';

const Users = ({ onLoadUsers }) => {
    const getUsers = async () => {
        try {
            const response = await fetch(`http://192.168.1.29:5000/users`);
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
