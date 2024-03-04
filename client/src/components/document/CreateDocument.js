import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const CreateDocument = () => {

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // aggiungi 1 perchè i mesi iniziano da 0
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

    const [formData, setFormData] = useState({
        tipdoc: '',
        datadoc: getCurrentDate(),
        codart: '',
        unimis: '',
        quanti: 1,
        codmat: ''
    });

    const [isTestataSave, setIsTestataSave] = useState(false)

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
        console.log(formData);
    };

    const salvaTestata = () => {
        setIsTestataSave(true)
    }

    return (
        <Container className='mt-3'>
            <h2>Nuovo Documento</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="tipdoc">
                    <Form.Label>Tipo Documento</Form.Label>
                    <Form.Control as="select" name="tipdoc" value={formData.tipdoc} onChange={handleChange} disabled={isTestataSave}>
                        <option value="INVEN">Inventario</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="datadoc">
                    <Form.Label>Data Documento</Form.Label>
                    <Form.Control required type="date" name="datadoc" value={formData.datadoc} onChange={handleChange}  disabled={isTestataSave}/>
                </Form.Group>
                {!isTestataSave &&<div>
                    <Button className="mt-3" variant="primary" onClick={salvaTestata}>
                        Conferma Testata
                    </Button>
                </div>}
                <Form.Group controlId="codart">
                    <Form.Label>Codice Articolo</Form.Label>
                    <Form.Control required type="text" name="codart" value={formData.codart} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="unimis">
                    <Form.Label>Unità di Misura</Form.Label>
                    <Form.Control required as="select" name="unimis" value={formData.unimis} onChange={handleChange}>
                        <option value="pz">Pz</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="quanti">
                    <Form.Label>Quantità</Form.Label>
                    <Form.Control required  type="number" step="1" name="quanti" value={formData.quanti} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="codmat">
                    <Form.Label>Codice Matricola</Form.Label>
                    <Form.Control required type="text" name="codmat" value={formData.codmat} onChange={handleChange} />
                </Form.Group>

                <div>
                    <Button className="mt-3" variant="primary" type="">
                        Aggiungi Riga
                    </Button>
                </div>
                <Button className="mt-3" variant="primary" type="submit">
                    Salva Documento
                </Button>
            </Form>
        </Container>
    );

}

export default CreateDocument
