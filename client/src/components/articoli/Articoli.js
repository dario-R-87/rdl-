import React, { useState, useEffect } from 'react';
import { Modal, Button, Card } from 'react-bootstrap';
import LoadSpinner from "../loading/LoadSpinner"

const Articoli = ({ show, handleClose, handleArticoloSelect }) => {
    const [articoli, setArticoli] = useState([]);
    const [loading, setLoading] = useState(false);

    // This method fetches the records from the database.
    const getArticoli = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:5000/articoli");
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const records = await response.json();
            setArticoli(records);
            setLoading(false);
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        getArticoli();
    }, []);

    const selectArticolo = (codart) => {
        const artSelected = articoli.find(art => art.CACODICE === codart);
        handleArticoloSelect(artSelected);
        handleClose();
    };

    return (<>
        <Modal show={show} onHide={handleClose}>

            <Modal.Header closeButton>
                <Modal.Title>Seleziona un Articolo</Modal.Title>
            </Modal.Header>
            <Modal.Body className="row justify-content-center mx-3">
                {loading && <LoadSpinner />}
                {!loading && articoli.map((articolo) => (
                    <Card className="mt-2" key={articolo.CACODICE} onClick={() => selectArticolo(articolo.CACODICE)} style={{ cursor: 'pointer' }}>
                        <Card.Body>
                            <Card.Title>{articolo.CACODICE}</Card.Title>
                            <Card.Text>{articolo.CADESART + articolo.CADESSUP}</Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Chiudi
                </Button>
            </Modal.Footer>
        </Modal></>
    )
}

export default Articoli