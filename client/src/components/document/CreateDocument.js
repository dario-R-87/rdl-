import React, { useEffect, useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import RowsList from './RowsList';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Articoli from '../articoli/Articoli';
import "./document.css"
import Matricole from '../matricole/Matricole';


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
        codmat: '',
        search: '',
        desc: ''
    });
    const [rows, setRows] = useState([]);
    const [isTestataSave, setIsTestataSave] = useState(false)
    const [update, setUpdate] = useState({ updating: false, rownum: 0 })
    const [newSerial, setNewSerial] = useState('0000000001')
    const [show, setShow] = useState(false);
    const [currentArt, setCurrentArt] = useState({CACODART:"", data:{ARGESMAT:"N"}})
    const [currentMat, setCurrentMat] = useState([]);
    const [aaa,setA]=useState(false);

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
        const conferma = window.confirm("Sei sicuro di voler salvare il documento?");
        if (conferma) {
            if (rows.length === 0)
                alert("Nessura riga inserita");
            else {
                try {
                    await Promise.all(rows.map(postData)); // Esegue tutte le richieste in parallelo
                    // Se tutte le richieste sono state completate con successo
                    setFormData({
                        tipdoc: 'INVEN',
                        datadoc: getCurrentDate(),
                        codart: '',
                        unimis: 'n.',
                        quanti: 1,
                        codmat: '',
                    });
                    setIsTestataSave(false);
                    setRows([]);
                    alert("Documento Creato!");
                    navigate('/');
                } catch (error) {
                    // Se una o più richieste hanno fallito, gestisci l'errore qui
                    window.alert(error.message);
                }
            }
        }
    };

    const salvaTestata = () => {
        setIsTestataSave(true)
    }

    const artHandler = () => {
        setShow(!show)
    }

    const hanldeMat = (matricole)=>{
        setCurrentMat(matricole);
    }

    const getArtData = async (selected) => {
        try {
            const response = await fetch(`http://192.168.1.29:5000/artsdata/${selected.CACODICE}`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const artData = await response.json();
            setCurrentArt({...selected, data: artData[0]})
        } catch (error) {
            alert(error.message);
        }
    }

    const onArtSelect = async (selected) => {
        setFormData({
            ...formData,
            codart: selected.CACODART,
            desc: selected.CADESART,
            search: "",
            codmat: ''
        })
        getArtData(selected)
    }

    const resetByUpdate = () => {
        setFormData({
            ...formData,
            quanti: 1,
            codmat: '',
            codart: '',
            desc: '',
            search: '',
        });
        setUpdate({ ...update, updating: false, rownum: 0 })
        setCurrentArt({CACODART:"", data:{ARGESMAT:"N"}})
        setCurrentMat([]);
    }

    const addRowHandler = (e) => {
        e.preventDefault();
        if (formData.codart === '') {
            alert('Inserisci Articolo')
            return
        }
        const newRecord = {
            ...formData,
            serial: newSerial,
            magpar: '1026',
            insuser: '690a10eb6bd3636a',
            rownum: (rows.length + 1) * 10,
            matricole: currentMat,
        }
        setRows(prevRows => [...prevRows, newRecord]);
        // Resetta il formData
        // setFormData({
        //     ...formData,
        //     quanti: 1,
        //     codmat: 'NULL',
        // });
        alert("Riga Aggiunta")
        resetByUpdate();
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
        setCurrentMat(rowByUpdate.matricole)
        setFormData({
            ...formData,
            codmat: rowByUpdate.codmat,
            quanti: rowByUpdate.quanti,
            codart: rowByUpdate.codart,
            desc: rowByUpdate.desc
        })
    }

    const updateRow = () => {
        // Crea un nuovo array aggiornando l'elemento con il rownum corrispondente
        if(currentMat.length>0 && formData.codmat===''){
            alert("Inserisci una matricola")
        } else {
            const updatedRows = rows.map(row => {
                // Se rownum corrisponde, aggiorna l'elemento con i dati da formData
                if (row.rownum === update.rownum) {
                    return {
                        ...row,
                        codmat: formData.codmat,
                        quanti: currentMat.length>0 ? 1 :formData.quanti,
                        codart: formData.codart,
                        desc: formData.desc,
                        matricole: currentMat,
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
    }

    const test=()=>{
        //console.log("artdata: "+artData.ARGESMAT)
        console.log("matricole: "+currentMat.length)
        setA(!aaa)
        const x = [];
        console.log(x[0])
    }

    return (
        <Container className='mt-3'>
            <button onClick={test}>test</button>
            <Matricole serial={currentArt.CACODART} onLoadMat={hanldeMat}/>
            <div className='my-3 d-flex justify-content-between'>
                <Link to="/"><Button variant='secondary'>Home</Button></Link>
                <h2>Nuovo Documento</h2>
            </div>
            <Form onSubmit={addRowHandler}>
                <Form.Group controlId="tipdoc">
                    <Form.Label className='custom-label mt-3'>Tipo Documento</Form.Label>
                    <Form.Control as="select" name="tipdoc" value={formData.tipdoc} onChange={handleChange} disabled={isTestataSave}>
                        <option value="INVEN">Inventario</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="datadoc">
                    <Form.Label className='custom-label mt-3'>Data Documento</Form.Label>
                    <Form.Control required type="date" name="datadoc" value={formData.datadoc} onChange={handleChange} disabled={isTestataSave} />
                </Form.Group>
                {!isTestataSave && <div>
                    <Button className="mt-3" variant="success" onClick={salvaTestata}>
                        Conferma Testata
                    </Button>
                </div>}
                <div className='text-center fw-bold text-danger mt-3'>
                    {update.updating ? `MODIFICA RIGA ${update.rownum}` : ''}
                </div>
                <Form.Group controlId="codart">
                    <Form.Label className='custom-label mt-3'>Articolo</Form.Label>
                    <div className='d-flex'>
                        <Form.Control
                            className={update.updating ? 'update-input' : ''}
                            placeholder="Cerca..."
                            type="text"
                            name="search"
                            value={formData.search}
                            onChange={handleChange}
                        />
                        <Button onClick={artHandler}><FontAwesomeIcon icon={faSearch} /></Button>
                    </div>
                    <Form.Control
                        placeholder="Codice"
                        required type="text"
                        name="codart"
                        defaultValue={formData.codart}
                        disabled
                    />
                    <Form.Control placeholder="Descrizione" type="text" name="desc" defaultValue={formData.desc} readOnly disabled />
                    {show && <Articoli show={show} handleClose={artHandler} handleArticoloSelect={onArtSelect} searchValue={formData.search}></Articoli>}
                </Form.Group>

                <Form.Group controlId="unimis">
                    <Form.Label className='custom-label mt-3'>Unità di Misura</Form.Label>
                    <Form.Control
                        className={update.updating ? 'update-input' : ''}
                        required
                        as="select"
                        name="unimis"
                        value={formData.unimis}
                        onChange={handleChange}>
                        <option value="pz">Pz</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="quanti">
                    <Form.Label className='custom-label mt-3'>Quantità</Form.Label>
                    <Form.Control
                        className={update.updating ? 'update-input' : ''}
                        required
                        type="number"
                        name="quanti"
                        disabled={(currentArt.data.ARGESMAT==='S' || (formData.codmat!=='')) ? true : false}
                        value={(currentArt.data.ARGESMAT==='S' || (formData.codmat!=='')) ? 1 : formData.quanti}
                        onChange={handleChange}
                    />
                </Form.Group>

                {(currentArt.data.ARGESMAT==='S' || (formData.codmat!=='')) && <Form.Group controlId="codmat">
                    <Form.Label className='custom-label mt-3'>Codice Matricola</Form.Label>
                    <Form.Control 
                        className={update.updating ? 'update-input' : ''}
                        required 
                        as="select" 
                        name="codmat" 
                        value={formData.codmat} 
                        onChange={handleChange}>
                         <option value=""></option>
                         {currentMat.map((mat)=> <option key={mat.AMCODICE} value={mat.AMCODICE}>{mat.AMCODICE}</option>)}
                    </Form.Control>
                </Form.Group>}

                <div className='d-flex justify-content-between'>
                    {!update.updating && <Button className="mt-3" variant="primary" type="submit">
                        Aggiungi Riga
                    </Button>}
                    {update.updating && <Button onClick={() => { updateRow() }} className="mt-3" variant="success">
                        Salva Modifiche
                    </Button>}
                    {!update.updating && <Button onClick={() => { handleSubmit() }} className="mt-3" variant="warning">
                        Salva Documento
                    </Button>}
                    {update.updating && <Button onClick={() => resetByUpdate()} className="mt-3" variant="danger">
                        Annulla
                    </Button>}
                </div>
                <RowsList rows={rows} handleDelete={onDelete} handleUpdate={onUpdate} />
            </Form>
        </Container>
    );

}

export default CreateDocument
