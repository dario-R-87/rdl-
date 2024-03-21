import React, { useEffect, useState, useRef } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import RowsList from './RowsList';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Articoli from '../articoli/Articoli';
import "./document.css"
import Matricole from '../matricole/Matricole';
import DocType from './DocType';
import Magazzini from '../magazzini/Magazzini';
import Clienti from '../clienti/Clienti';


const CreateDocument = () => {

    const navigate = useNavigate();
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // aggiungi 1 perchè i mesi iniziano da 0
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const azienda = localStorage.getItem("azienda")
    const isLogged = localStorage.getItem("isLogged");
    const [formData, setFormData] = useState({
        tipdoc: '',
        datadoc: getCurrentDate(),
        codcli: '',
        codart: '',
        unimis: '',
        quanti: 1,
        codmat: '',
        magpar: '',
        magdes: '',
        clientSearch: '',
        search: '',
        clientDesc: '',
        desc: '',
    });
    const [rows, setRows] = useState([]);
    const [isTestataSave, setIsTestataSave] = useState(false)
    const [update, setUpdate] = useState({ updating: false, rownum: 0 })
    const [newSerial, setNewSerial] = useState('0000000001')
    const [show, setShow] = useState(false);
    const [clientShow, setClientShow] = useState(false);
    const [currentArt, setCurrentArt] = useState({
        CACODART:"", 
        data:{
            ARGESMAT:"N",
            ARUNMIS1: null,
            ARUNMIS2: null}
        })
    const [currentMat, setCurrentMat] = useState([]);
    const [docType, setDocType] = useState([]);
    const [mag, setMag] = useState([]);
    const [hasCauCol, setHasCauCol] = useState(false);
    const formRef = useRef(null);
    const cards = useRef(null);

    const [aaa,setA]=useState(false);

    useEffect(()=>{
        if(isLogged!=="true")
            navigate("/");
    },[])

    useEffect(() => {
        async function getMaxSerial() {
            const response = await fetch(`http://192.168.1.29:5000/new_serial/${azienda}`);
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
            const response = await fetch(`http://192.168.1.29:5000/record/add/${azienda}`, {
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
                        tipdoc: '',
                        datadoc: getCurrentDate(),
                        codart: '',
                        unimis: '',
                        quanti: 1,
                        codmat: '',
                    });
                    setIsTestataSave(false);
                    setRows([]);
                    alert("Documento Creato!");
                    navigate('/homepage');
                } catch (error) {
                    // Se una o più richieste hanno fallito, gestisci l'errore qui
                    window.alert(error.message);
                }
            }
        }
    };

    const salvaTestata = () => {
        if(!formData.tipdoc.includes("DDT")){
            if(formData.datadoc!=="" && formData.tipdoc!==""){
                setIsTestataSave(true)
                handleCauCol()    
            }
            else
                alert("Inserire tipo e data documento!")
        } else {
            if(formData.datadoc!=="" && formData.tipdoc!=="" && formData.codcli!==""){
                setIsTestataSave(true)
                handleCauCol()    
            }
            else
                alert("Inserire tipo, data documento e cliente!")
        }
    }

    const handleCauCol = async() => {
        try {
            const tipdoc = docType.filter((tp)=>tp.TDTIPDOC.includes(formData.tipdoc));
            const response = await fetch(`http://192.168.1.29:5000/causale_mag/${azienda}/${tipdoc[0].TDCAUMAG}`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            let records = await response.json();
            setHasCauCol(records[0].CMCAUCOL ? true : false);
        } catch (error) {
            alert(error.message);
        }
    }

    const artHandler = () => {
        setShow(!show)
    }

    const cliHandler = () => {
        setClientShow(!clientShow)
    }

    const hanldeMat = (matricole)=>{
        setCurrentMat(matricole);
    }

    const getArtData = async (selected) => {
        try {
            const response = await fetch(`http://192.168.1.29:5000/artsdata/${azienda}/${selected.CACODICE}`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const artData = await response.json();
            setCurrentArt({...selected, data: artData[0]})
            return artData[0];
        } catch (error) {
            alert(error.message);
        }
    }

    const onArtSelect = async (selected) => {
        const artData = await getArtData(selected)
        console.log(artData.ARUNMIS1)
        setFormData({
            ...formData,
            codart: selected.CACODART,
            desc: selected.CADESART,
            search: "",
            codmat: '',
            unimis: artData.ARUNMIS1,
        })
    }

    const onCliSelect = async (selected) => {
        setFormData({
            ...formData,
            codcli: selected.ANCODICE,
            clientDesc: selected.ANDESCRI,
            clientSearch: '',
        })
    }    

    const resetByUpdate = () => {
        setFormData({
            ...formData,
            quanti: 1,
            codmat: '',
            codart: '',
            desc: '',
            search: '',
            unimis: '',
            magpar: rows.length>0 ? rows[0].magpar : formData.magpar,
            magdes: rows.length>0 ? rows[0].magdes : formData.magdes,
        });
        setUpdate({ ...update, updating: false, rownum: 0 })
        setCurrentArt({CACODART:"", data:{ARGESMAT:"N", ARUNMIS1: null, ARUNMIS2:null}})
        setCurrentMat([]);
    }

    const addRowHandler = (e) => {
        e.preventDefault();
        if(!isTestataSave){
            alert("Conferma Testata");
            return;
        }
        if (formData.codart === '') {
            alert('Inserisci Articolo')
            return
        }
        const newRecord = {
            ...formData,
            serial: newSerial,
            insuser: '690a10eb6bd3636a',
            rownum: (rows.length + 1) * 10,
            matricole: currentMat,
            // unimis: formData.unimis,
            unimis1: currentArt.data.ARUNMIS1,
            unimis2: currentArt.data.ARUNMIS2,
        }
        setRows(prevRows => [...prevRows, newRecord]);
        alert("Riga Aggiunta")
        resetByUpdate();
        // if (rows.length === 0)
        //     setIsTestataSave(true)
        if(cards.current) {
            // Usa il metodo scrollIntoView() per scorrere fino al form
            cards.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    const onDelete = (rownum) => {
        const conferma = window.confirm("Sei sicuro di voler elimiare la riga?");
        if(conferma){
            // Filtra gli elementi escludendo quello con rownum uguale a rownumToDelete
            const updatedRows = rows.filter(row => row.rownum !== rownum);
            // Aggiorna lo stato con il nuovo array di elementi
            setRows(updatedRows);
            resetByUpdate();
            alert("Riga eliminata");
        }    
    }

    const onUpdate = (rownum) => {
        setUpdate({ ...update, updating: true, rownum: rownum })
        const rowByUpdate = rows.find(row => row.rownum === rownum);
        setCurrentMat(rowByUpdate.matricole)
        setCurrentArt({...currentArt, 
            data:{...currentArt.data, 
                ARUNMIS1: rowByUpdate.unimis1,
                ARUNMIS2: rowByUpdate.unimis2}
            });
        setFormData({
            ...formData,
            codmat: rowByUpdate.codmat,
            quanti: rowByUpdate.quanti,
            codart: rowByUpdate.codart,
            desc: rowByUpdate.desc,
            unimis: rowByUpdate.unimis,
            magpar: rowByUpdate.magpar,
            magdes: rowByUpdate.magdes
        })
        if(formRef.current) {
            // Usa il metodo scrollIntoView() per scorrere fino al form
            formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    const updateControl = () => {
        let msg = "";
        if(currentMat.length>0 && formData.codmat===''){msg="Inserisci una matricola"}
        else if(formData.magpar===""){msg="Inserisci magazzino origine"}
        else if(hasCauCol && formData.magdes===''){msg="Inserisci magazzino destinazione"}
        else if(formData.unimis===""){msg="Inserisci unità di misura"}
        return msg;
    }

    const updateRow = () => {
        // Crea un nuovo array aggiornando l'elemento con il rownum corrispondente
        const msg = updateControl();
        if(msg!==""){
            alert(msg)
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
                        unimis: formData.unimis,
                        magpar: formData.magpar,
                        magdes: formData.magdes
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

    const handleDocType = (records) => {
        setDocType(records);
    }

    const handleMag = (records) => {
        setMag(records);
    }

    const test=()=>{
        console.log(clientShow)
        setA(!aaa)
    }

    return (
        <Container className='my-3 pb-5'>
            {/* <button onClick={test}>test</button> */}
            <Matricole serial={currentArt.CACODART} onLoadMat={hanldeMat}/>
            <DocType onLoadDocType={handleDocType}/>
            <Magazzini onLoadMag={handleMag}/>
            <div className='my-3 d-flex justify-content-between'>
                <Link to="/homepage"><Button variant='secondary'>Home</Button></Link>
                <h2>Nuovo Documento</h2>
            </div>
            <Form onSubmit={addRowHandler}>
                <Form.Group controlId="tipdoc">
                    <Form.Label className='custom-label mt-3'>Tipo Documento</Form.Label>
                    <Form.Control required as="select" name="tipdoc" value={formData.tipdoc} onChange={handleChange} disabled={isTestataSave}>
                        <option value=""></option>
                        {docType.map((type)=> <option key={type.TDTIPDOC} value={type.TDTIPDOC}>{type.TDDESDOC}</option>)}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="datadoc">
                    <Form.Label className='custom-label mt-3'>Data Documento</Form.Label>
                    <Form.Control required type="date" name="datadoc" value={formData.datadoc} onChange={handleChange} disabled={isTestataSave} />
                </Form.Group>

                {formData.tipdoc.includes('DDT') && <Form.Group controlId="codcli">
                    <Form.Label className='custom-label mt-3'>Cliente</Form.Label>
                    <div className={`d-flex ${isTestataSave ? 'd-none' : ''}`}>
                        <Form.Control
                            className={update.updating ? 'update-input' : ''}
                            placeholder="Cerca..."
                            type="text"
                            name="clientSearch"
                            value={formData.clientSearch}
                            onChange={handleChange}
                        />
                        <Button onClick={cliHandler}><FontAwesomeIcon icon={faSearch} /></Button>
                    </div>
                    <Form.Control
                        placeholder="Codice"
                        required type="text"
                        name="codcli"
                        defaultValue={formData.codcli}
                        disabled
                    />
                    <Form.Control placeholder="Descrizione" type="text" name="clientDesc" defaultValue={formData.clientDesc} readOnly disabled />
                    {clientShow && <Clienti clientShow={clientShow} handleClientClose={cliHandler} handleClientSelected={onCliSelect} clientSearchValue={formData.clientSearch}></Clienti>}
                </Form.Group>}   

                {!isTestataSave && <div>
                    <Button className="mt-3" variant="success" onClick={salvaTestata}>
                        Conferma Testata
                    </Button>
                </div>}

                <div ref={formRef} className='text-center fw-bold text-danger mt-5'>
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

                <Form.Group controlId="magpar">
                    <Form.Label className='custom-label mt-3'>Magazzino Origine</Form.Label>
                    <Form.Control 
                        required as="select" 
                        name="magpar" 
                        value={formData.magpar} 
                        onChange={handleChange}
                        className={update.updating ? 'update-input' : ''}>
                            <option value=""></option>
                            {mag.map((ma)=>{
                                if(ma.MGDESMAG.trim()!==''){
                                    return <option key={ma.MGCODMAG} value={ma.MGCODMAG}>{ma.MGDESMAG}</option>}
                                return null;
                                })}
                    </Form.Control>
                </Form.Group>

                {hasCauCol && <Form.Group controlId="magdes">
                    <Form.Label className='custom-label mt-3'>Magazzino Destinazione</Form.Label>
                    <Form.Control 
                        required 
                        as="select" 
                        name="magdes" 
                        value={formData.magdes} 
                        onChange={handleChange}
                        className={update.updating ? 'update-input' : ''}>
                            <option value=""></option>
                            {mag.map((ma)=>{
                                if(ma.MGDESMAG.trim()!==''){
                                    return <option key={ma.MGCODMAG} value={ma.MGCODMAG}>{ma.MGDESMAG}</option>}
                                return null;
                                })}
                    </Form.Control>
                </Form.Group>}

                <Form.Group controlId="unimis">
                    <Form.Label className='custom-label mt-3'>Unità di Misura</Form.Label>
                    <Form.Control
                        required
                        className={update.updating ? 'update-input' : ''}
                        as="select"
                        name="unimis"
                        value={formData.unimis}
                        onChange={handleChange}>
                            <option value=""></option>
                            {currentArt.data.ARUNMIS1 && (<option value={currentArt.data.ARUNMIS1}>{currentArt.data.ARUNMIS1}</option>)}
                            {currentArt.data.ARUNMIS2 && (<option value={currentArt.data.ARUNMIS2}>{currentArt.data.ARUNMIS2}</option>)}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="quanti">
                    <Form.Label className='custom-label mt-3'>Quantità</Form.Label>
                    <Form.Control
                        className={update.updating ? 'update-input' : ''}
                        required
                        type="number"
                        name="quanti"
                        min="1"
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

                <div ref={cards}><RowsList rows={rows} handleDelete={onDelete} handleUpdate={onUpdate} /></div>
            </Form>
        </Container>
    );

}

export default CreateDocument
