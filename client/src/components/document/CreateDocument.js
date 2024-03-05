import React, { useEffect, useState } from 'react';
import { Form, Button, Container, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import RowsList from './RowsList';

const CreateDocument = () => {

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // aggiungi 1 perchè i mesi iniziano da 0
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [formData, setFormData] = useState({
        tipdoc: 'INVEN',
        datadoc: getCurrentDate(),
        codart: '',
        unimis: 'n.',
        quanti: 1,
        codmat: ''
    });

    const [rows, setRows] = useState([]);

    const [isTestataSave, setIsTestataSave] = useState(false)

    const [newSerial, setNewSerial] = useState('0000000001')

    useEffect(() => {
        async function getMaxSerial() {
            const response = await fetch("http://192.168.1.29:5000/new_serial");
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const json = await response.json();
            if(json[0].MAX_SERIAL){
                const max_serial = parseInt(json[0].MAX_SERIAL, 10);
                const newSerial = max_serial + 1;
                const newSerialString = String(newSerial).padStart(10, '0');
                setNewSerial(newSerialString);
            }
        }
        getMaxSerial();
        return;
    }, [isTestataSave])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Qui puoi gestire l'invio dei dati, ad esempio inviandoli al server
        if(rows.length===0)
            alert("Nessura riga inserita");
        else {
            rows.forEach(async (row) => {
                try {
                    const response = await fetch("http://192.168.1.29:5000/record/add", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(row),
                    });
                    if (!response.ok) {
                        const message = `An error occurred: ${response.statusText}`;
                        window.alert(message);
                        return;
                    }
                    setFormData({
                        tipdoc: 'INVEN',
                        datadoc: getCurrentDate(),
                        codart: '',
                        unimis: 'n.',
                        quanti: 1,
                        codmat: ''
                    });
                    setIsTestataSave(false)
                    setRows([]);
                    alert("Documento Creato!");
                } catch (error) {
                    console.error("Errore nella richiesta post:", error);
                    window.alert(error);
                    return;
                };
            });
        }
    };

    const salvaTestata = () => {
        setIsTestataSave(true)
    }

    const artHandler = () => {

    }

    const addRowHandler = (e) => {
        e.preventDefault();
        const newRecord = {
            ...formData,
            serial: newSerial,
            magpar: '1026',
            insuser: '690a10eb6bd3636a',
            rownum: (rows.length + 1) * 10
        }
        setRows(prevRows => [...prevRows, newRecord]);
        // Resetta il formData
        setFormData({
            ...formData,
            quanti: 1,
            codmat: ''
        });
        alert("Riga Aggiunta")
        if (rows.length === 0)
            setIsTestataSave(true)
    }

    return (
        <Container className='mt-3'>
            <h2>Nuovo Documento</h2>
            <Form onSubmit={addRowHandler}>
                <Form.Group controlId="tipdoc">
                    <Form.Label>Tipo Documento</Form.Label>
                    <Form.Control as="select" name="tipdoc" value={formData.tipdoc} onChange={handleChange} disabled={isTestataSave}>
                        <option value="INVEN">Inventario</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="datadoc">
                    <Form.Label>Data Documento</Form.Label>
                    <Form.Control required type="date" name="datadoc" value={formData.datadoc} onChange={handleChange} disabled={isTestataSave} />
                </Form.Group>
                {!isTestataSave && <div>
                    <Button className="mt-3" variant="primary" onClick={salvaTestata}>
                        Conferma Testata
                    </Button>
                </div>}
                <Form.Group controlId="codart">
                    <Form.Label>Codice Articolo</Form.Label>
                    <div className='d-flex'><Form.Control required type="text" name="codart" value={formData.codart} onChange={handleChange} />
                        <Button onClick={artHandler}><FontAwesomeIcon icon={faSearch} /></Button></div>
                </Form.Group>

                <Form.Group controlId="unimis">
                    <Form.Label>Unità di Misura</Form.Label>
                    <Form.Control required as="select" name="unimis" value={formData.unimis} onChange={handleChange}>
                        <option value="pz">Pz</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="quanti">
                    <Form.Label>Quantità</Form.Label>
                    <Form.Control required type="number" step="1" name="quanti" value={formData.quanti} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="codmat">
                    <Form.Label>Codice Matricola</Form.Label>
                    <Form.Control required type="text" name="codmat" value={formData.codmat} onChange={handleChange} />
                </Form.Group>

                <div>
                    <Button className="mt-3" variant="primary" type="submit">
                        Aggiungi Riga
                    </Button>
                </div>
                <Button onClick={handleSubmit} className="mt-3" variant="primary" type="">
                    Salva Documento
                </Button>
            </Form>
            <RowsList rows={rows} />
        </Container>
    );

}

export default CreateDocument
