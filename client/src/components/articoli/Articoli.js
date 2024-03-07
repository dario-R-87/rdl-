import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Form } from 'react-bootstrap';
import LoadSpinner from "../loading/LoadSpinner";


const Articoli = ({ show, handleClose, handleArticoloSelect, searchValue }) => {
    const [articoli, setArticoli] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterValue, setFilterValue] = useState(searchValue);
    const [artsFiltered, setArtsFiltered] = useState([]);

    const handleChange = (e) => {
        const newValue = e.target.value
        setFilterValue(newValue)
    }

    const filterArt = () => {
        // console.log("filter art "+filterValue);
        // console.log(articoli)
        const arts = articoli.filter((item) => {
            return item.CADESART.toLowerCase().includes(filterValue.toLowerCase())
        });
        setArtsFiltered(arts);
    }

    useEffect(() => {
        //if(filterValue.length>4 || filterValue.length===0)
        filterArt();
    }, [filterValue]);

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
            let records = await response.json();
            if (filterValue.length > 0) {
                const filteredRecords = records.filter((item) => {
                    return item.CADESART.toLowerCase().includes(filterValue.toLowerCase())
                });
                setArtsFiltered(filteredRecords)
            }
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
        const artSelected = articoli.find(art => art.CACODART === codart);
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
                {!loading &&
                    <Form>
                        <Form.Group controlId="codart">
                            <Form.Label className='custom-label mt-3'></Form.Label>
                            <div className='d-flex'>
                                <Form.Control placeholder="Cerca..." type="text" name="search" value={filterValue} onChange={handleChange} />
                            </div>
                        </Form.Group>
                        {/* <div className='d-flex justify-content-between'>
                            {!update.updating && <Button className="mt-3" variant="primary" type="submit">
                                Aggiungi Riga
                            </Button>}
                        </div> */}
                    </Form>}
                {!loading && artsFiltered.length>0 && artsFiltered.map((articolo) => (
                    <Card className="mt-2" key={articolo.CACODICE} onClick={() => selectArticolo(articolo.CACODART)} style={{ cursor: 'pointer' }}>
                        <Card.Body>
                            <Card.Title>{articolo.CACODICE}</Card.Title>
                            <Card.Text>{articolo.CADESART + articolo.CADESSUP}</Card.Text>
                        </Card.Body>
                    </Card>
                ))}
                {!loading && artsFiltered.length===0 && articoli.map((articolo) => (
                    <Card className="mt-2" key={articolo.CACODICE} onClick={() => selectArticolo(articolo.CACODART)} style={{ cursor: 'pointer' }}>
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