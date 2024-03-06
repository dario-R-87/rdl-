import React, { useEffect, useState } from 'react';
import { Form, Button, Container, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import RowsList from './RowsList';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


const CreateDocument = () => {

    const navigate = useNavigate();

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
    const [update, setUpdate] = useState({ updating: false, rownum: 0 })
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
            if (json[0].MAX_SERIAL) {
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

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     // Qui puoi gestire l'invio dei dati, ad esempio inviandoli al server
    //     if (rows.length === 0)
    //         alert("Nessura riga inserita");
    //     else {
    //         rows.forEach(async (row) => {
    //             try {
    //                 const response = await fetch("http://192.168.1.29:5000/record/add", {
    //                     method: "POST",
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                     },
    //                     body: JSON.stringify(row),
    //                 });
    //                 if (!response.ok) {
    //                     const message = `An error occurred: ${response.statusText}`;
    //                     window.alert(message);
    //                     return;
    //                 }
    //                 setFormData({
    //                     tipdoc: 'INVEN',
    //                     datadoc: getCurrentDate(),
    //                     codart: '',
    //                     unimis: 'n.',
    //                     quanti: 1,
    //                     codmat: ''
    //                 });
    //                 setIsTestataSave(false)
    //                 setRows([]);
    //                 alert("Documento Creato!");
    //             } catch (error) {
    //                 console.error("Errore nella richiesta post:", error);
    //                 window.alert(error);
    //                 return;
    //             };
    //         });
    //         navigate('/');
    //     }
    // };
    const postData = async (row) => {
        try {
            const response = await fetch("http://192.168.1.29:5000/record/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(row),
            });
            if (!response.ok) {
                throw new Error(`An error occurred: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Errore nella richiesta post:", error);
            throw error; // Rilancia l'errore per gestirlo nell'handler esterno
        }
    };
    
    const handleSubmit = async () => {
        try {
            await Promise.all(rows.map(postData)); // Esegue tutte le richieste in parallelo
            // Se tutte le richieste sono state completate con successo
            setFormData({
                tipdoc: 'INVEN',
                datadoc: getCurrentDate(),
                codart: '',
                unimis: 'n.',
                quanti: 1,
                codmat: ''
            });
            setIsTestataSave(false);
            setRows([]);
            alert("Documento Creato!");
            navigate('/');
        } catch (error) {
            // Se una o più richieste hanno fallito, gestisci l'errore qui
            window.alert(error.message);
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

    const onDelete = (rownum) => {
        // Filtra gli elementi escludendo quello con rownum uguale a rownumToDelete
        const updatedRows = rows.filter(row => row.rownum !== rownum);
        // Aggiorna lo stato con il nuovo array di elementi
        setRows(updatedRows);
        resetByUpdate();
        alert("Riga eliminata");
    }

    const onUpdate = (rownum) => {
        setUpdate({ ...update, updating: true, rownum: rownum })
        const rowByUpdate = rows.find(row => row.rownum === rownum);
        setFormData({
            ...formData,
            codmat: rowByUpdate.codmat,
            quanti: rowByUpdate.quanti,
            codart: rowByUpdate.codart,
        })
    }

    const resetByUpdate = () => {
        setFormData({
            ...formData,
            quanti: 1,
            codmat: '',
            codart: '',
        });
        setUpdate({...update, updating: false, rownum: 0})
    }

    const updateRow = () => {
        // Crea un nuovo array aggiornando l'elemento con il rownum corrispondente
        const updatedRows = rows.map(row => {
            // Se rownum corrisponde, aggiorna l'elemento con i dati da formData
            if (row.rownum === update.rownum) {
                return {
                    ...row,
                    codmat: formData.codmat,
                    quanti: formData.quanti,
                    codart: formData.codart
                };
            }
            // Altrimenti, lascia l'elemento invariato
            return row;
        });
        // Aggiorna lo stato con il nuovo array di elementi
        setRows(updatedRows);
        // Resetta il formData
        resetByUpdate();
        alert("Riga Aggiornata");
    }

    return (
        <Container className='mt-3'>
            <div className='my-3 d-flex justify-content-between'>
                <Link to="/"><Button variant='secondary'>Home</Button></Link>
                <h2>Nuovo Documento</h2>
            </div>
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
                    <Button className="mt-3" variant="success" onClick={salvaTestata}>
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
                    <Form.Control required type="number" name="quanti" value={formData.quanti} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="codmat">
                    <Form.Label>Codice Matricola</Form.Label>
                    <Form.Control required type="text" name="codmat" value={formData.codmat} onChange={handleChange} />
                </Form.Group>

                <div className='d-flex justify-content-between'>
                    {!update.updating && <Button className="mt-3" variant="primary" type="submit">
                        Aggiungi Riga
                    </Button>}
                    {update.updating && <Button onClick={() => { updateRow() }} className="mt-3" variant="success">
                        Salva Modifiche
                    </Button>}
                    {!update.updating && <Button onClick={handleSubmit} className="mt-3" variant="warning" type="">
                        Salva Documento
                    </Button>}
                    {update.updating && <Button onClick={()=>resetByUpdate()} className="mt-3" variant="danger">
                        Annulla
                    </Button>}
                </div>
                <RowsList rows={rows} handleDelete={onDelete} handleUpdate={onUpdate} />
            </Form>
        </Container>
    );

}

export default CreateDocument
