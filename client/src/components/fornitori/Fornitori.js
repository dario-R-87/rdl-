import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Form } from 'react-bootstrap';
import LoadSpinner from "../loading/LoadSpinner";

const Fornitori = ({ clientShow, handleClientClose, handleClientSelected, clientSearchValue }) => {
    const ip="192.168.1.122";

    const azienda = localStorage.getItem("azienda")
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterValue, setFilterValue] = useState(clientSearchValue);
    const [clientsFiltered, setClientsFiltered] = useState([]);

    const handleChange = (e) => {
        const newValue = e.target.value
        setFilterValue(newValue)
    }

    const clientsFilter = () => {
        let clis=[];
        if(filterValue!==''){
            clis = clients.filter((item) => {
                return (
                    item.ANDESCRI.toLowerCase().includes(filterValue.toLowerCase()) ||
                    item.ANCODICE.includes(filterValue)
                )
                });
        } else {
            clis=clients;
        }
        setClientsFiltered(clis);
    }

    useEffect(() => {
        clientsFilter();
    }, [filterValue]);

    const getClients = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://${ip}:5000/clienti/${azienda}`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            let records = await response.json();
            if (filterValue.length > 0) {
                const filteredRecords = records.filter((item) => {
                    return (
                        item.ANDESCRI.toLowerCase().includes(filterValue.toLowerCase()) ||
                        item.ANCODICE.includes(filterValue))
                });
                setClientsFiltered(filteredRecords)
            } else {
                setClientsFiltered(records)
            }
            setClients(records);
            setLoading(false);
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        getClients();
    }, []);

    const selectClient = (codcli) => {
        const cliSelected = clients.find(cli => cli.ANCODICE === codcli);
        handleClientSelected(cliSelected);
        handleClientClose();
    };
    return (<>
        <Modal show={clientShow} onHide={handleClientClose}>

            <Modal.Header closeButton>
                <Modal.Title>Seleziona un Cliente</Modal.Title>
            </Modal.Header>
            <Modal.Body className="row justify-content-center mx-3">
                {loading && <LoadSpinner />}
                {!loading &&
                    <Form>
                        <Form.Group controlId="codcli">
                            <Form.Label className='custom-label mt-3'></Form.Label>
                            <div className='d-flex'>
                                <Form.Control placeholder="Cerca..." type="text" name="search" value={filterValue} onChange={handleChange} />
                            </div>
                        </Form.Group>
                    </Form>}
                {!loading && clientsFiltered.length===0 && <div className='text-center mt-3'>La ricerca non ha prodotto risultati!</div>}
                {!loading && clientsFiltered.slice(0, clientsFiltered.length > 50 ? 50 : undefined).map((cliente) => (
                    <Card className="mt-2" key={cliente.ANCODICE} onClick={() => selectClient(cliente.ANCODICE)} style={{ cursor: 'pointer' }}>
                        <Card.Body>
                            <Card.Title>{cliente.ANCODICE}</Card.Title>
                            <Card.Text>{cliente.ANDESCRI}</Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClientClose}>
                    Chiudi
                </Button>
            </Modal.Footer>
        </Modal></>
    )
}

export default Fornitori
