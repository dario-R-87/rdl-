import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Articoli from './Articoli';

const ArtModal = ({ show, handleClose, handleArticoloSelect }) => {
    const [articoli, setArticoli] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // This method fetches the records from the database.
    useEffect(() => {
        async function getArticoli() {
            setIsLoading(true);
            const response = await fetch("http://localhost:5000/articoli");
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const records = await response.json();
            setArticoli(records);
            setIsLoading(false);
        }
        getArticoli();
        return;
    }, []);

    const onSelectArticolo = (codart) => {
        const artSelected = articoli.find(art => art.CACODICE === codart);
        handleArticoloSelect(artSelected);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            {isLoading && <div>Loading...</div>}
            <Modal.Header closeButton>
                <Modal.Title>Seleziona un Articolo</Modal.Title>
            </Modal.Header>
            {!isLoading && <Modal.Body><Articoli setIsLoading={setIsLoading} selectArticolo={onSelectArticolo}/></Modal.Body>}
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Chiudi
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ArtModal
