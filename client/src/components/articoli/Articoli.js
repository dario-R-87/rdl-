import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Form } from 'react-bootstrap';
import LoadSpinner from "../loading/LoadSpinner";


const Articoli = ({ ip, show, handleClose, handleArticoloSelect, searchValue }) => {
    
    const azienda = localStorage.getItem("azienda")
    const [articoli, setArticoli] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterValue, setFilterValue] = useState(searchValue);
    const [artsFiltered, setArtsFiltered] = useState([]);

    const handleChange = (e) => {
        const newValue = e.target.value
        if((newValue.length-filterValue.length)>2){
            setFilterValue(newValue.substring(filterValue.length))
        } else {
            setFilterValue(newValue)
        }
    }

    const filterArt = () => {
        // console.log("filter art "+filterValue);
        let arts=[];
        if(filterValue!==''){
            arts = articoli.filter((item) => {
                return (
                    item.CADESART.toLowerCase().includes(filterValue.toLowerCase()) ||
                    item.CACODICE.includes(filterValue)
                )
                });
                // console.log(arts)

        } else {
            arts=articoli;
        }
        setArtsFiltered(arts);
        if(arts.length===1){
            selectArticolo(arts[0].CACODART);
        }
    }

    useEffect(() => {
        //if(filterValue.length>4 || filterValue.length===0)
        filterArt();
    }, [filterValue]);

    const getArtCode = () => {
        if(!filterValue.includes("|")){
            return filterValue;
        } else {
            const parts = filterValue.split("|")
            return parts[0];
        }
    }

    const getMatCode = () => {
        if(filterValue.includes("|")){
            const parts = filterValue.split("|")
            return parts[1];
        } else {
            return "";
        }
    }

    // This method fetches the records from the database.
    const getArticoli = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://${ip}:5000/articoli/${azienda}`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            let records = await response.json();
            if (filterValue.length > 0) {
                const artCode = getArtCode();
                const matCode = getMatCode();
                const filteredRecords = records.filter((item) => {
                    return (
                        item.CADESART.toLowerCase().includes(artCode.toLowerCase()) ||
                        item.CACODICE.includes(artCode))
                });
                setArtsFiltered(filteredRecords)
                if(filteredRecords.length===1){
                    filteredRecords[0].matricola = matCode;
                    handleArticoloSelect(filteredRecords[0]);
                    handleClose();
                }
            } else {
                setArtsFiltered(records)
            }
            setArticoli(records);
            setLoading(false);
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        getArticoli();
        // console.log(filterValue)
        // setFilterValue(searchValue)
        // // filterArt();
        // console.log(artsFiltered)
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
                    </Form>}
                    {/*artsFiltered.length>0 && */}
                {!loading && artsFiltered.length===0 && <div className='text-center mt-3'>La ricerca non ha prodotto risultati!</div>}
                {!loading && artsFiltered.slice(0, artsFiltered.length > 50 ? 50 : undefined).map((articolo) => (
                    <Card className="mt-2" key={articolo.CACODICE} onClick={() => selectArticolo(articolo.CACODART)} style={{ cursor: 'pointer' }}>
                        <Card.Body>
                            <Card.Title>{articolo.CACODICE}</Card.Title>
                            <Card.Text>{articolo.CADESART + articolo.CADESSUP}</Card.Text>
                        </Card.Body>
                    </Card>
                ))}
                {/* {!loading && artsFiltered.length===0 && articoli.map((articolo) => (
                    <Card className="mt-2" key={articolo.CACODICE} onClick={() => selectArticolo(articolo.CACODART)} style={{ cursor: 'pointer' }}>
                        <Card.Body>
                            <Card.Title>{articolo.CACODART}</Card.Title>
                            <Card.Text>{articolo.CADESART + articolo.CADESSUP}</Card.Text>
                        </Card.Body>
                    </Card>
                ))} */}
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