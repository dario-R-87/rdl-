import React, { useEffect, useState, useRef } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Articoli from '../articoli/Articoli';
import "./document.css"
import Matricole from '../matricole/Matricole';
import DocType from './DocType';
import Magazzini from '../magazzini/Magazzini';
import Clienti from '../clienti/Clienti';
import md5 from 'crypto-js/md5';
import Logout from '../pages/Logout';
import TimerRefresh from '../timerRefresh/TimerRefresh';
//import DocRows from './DocRows';
import RowsList from './RowsList';
import { formatISO } from 'date-fns';


const DocDett = ({ serial }) => {
    const navigate = useNavigate();
    const azienda = localStorage.getItem("azienda")
    const username = localStorage.getItem("username");
    const isLogged = localStorage.getItem("isLogged");
    const [formData, setFormData] = useState({
        tipdoc: '',
        datadoc: '',
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
        codcon: '',
    });
    const [rows, setRows] = useState([]);
    const [update, setUpdate] = useState({ updating: false, rownum: 0 })
    const [show, setShow] = useState(false);
    const [clientShow, setClientShow] = useState(false);
    const [currentArt, setCurrentArt] = useState({
        CACODART: "",
        data: {
            ARGESMAT: "N",
            ARUNMIS1: null,
            ARUNMIS2: null
        }
    })
    const [currentMat, setCurrentMat] = useState([]);
    const [docType, setDocType] = useState([]);
    const [mag, setMag] = useState([]);
    const [hasCauCol, setHasCauCol] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editable, setEditable] = useState(false);
    const formRef = useRef(null);
    const cards = useRef(null);

    const setTestata = async (record) => {
        let tipconParam = '';
        if(record.TIPCON==='C')
            tipconParam = "clienti"
        else if(record.TIPCON==='F')
            tipconParam = "fornitori"

        try {
            let clifor=null;
            if(tipconParam!==''){
                const response = await fetch(`http://192.168.1.29:5000/${tipconParam}/${azienda}/${record.CODCON}`);

                if (!response.ok) {
                    const message = `An error occurred: ${response.statusText}`;
                    window.alert(message);
                    return;
                }
                clifor = await response.json();
            }
            const data = formatISO(new Date(record.DATDOC), { representation: 'date' });
            setFormData({
                ...formData,
                tipdoc: record.TIPDOC,
                datadoc: data,
                codcon: record.CODCON,
                tipcon: record.TIPCON,
                clientDesc: clifor ? clifor[0].ANDESCRI : '',
            })
        } catch (error) {
            alert(error.message);
        }
    }

    const getRowDetails = async (row) => {
        try {
            const response = await fetch(`http://192.168.1.29:5000/artsdata/${azienda}/${row.codart}`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const artData = await response.json();
            const matResponse = await fetch(`http://192.168.1.29:5000/matricole/${azienda}/${row.codart}`);
            if (!matResponse.ok) {
                const message = `An error occurred: ${matResponse.statusText}`;
                window.alert(message);
                return;
            }
            let mats = await matResponse.json();
            return {
                ...row,
                desc: artData[0].ARDESART,
                unimis1: artData[0].ARUNMIS1,
                unimis2: artData[0].ARUNMIS2,
                hasMat: artData[0].ARGESMAT === 'S' ? true : false,
                matricole: mats,
            }
        } catch (error) {
            alert(error.message);
        }
    }

    const setRowDetails = async (currentRow, i) => {
        const newRow = await getRowDetails(currentRow);
        setRows(prevRows => {
            return prevRows.map((row, index) => {
                if (i === index) {
                    return newRow; // Sovrascrivi l'elemento all'indice specificato
                } else {
                    return row; // Mantieni invariati gli altri elementi
                }
            });
        });

        // return newRow
    }

    useEffect(() => {
        rows.map(async (row, i) => setRowDetails(row, i));
    }, [loading]);

    useEffect(() => { handleCauCol(); }, [formData.tipdoc]);

    const getDocument = async () => {
        try {
            const response = await fetch(`http://192.168.1.29:5000/documento/${azienda}/${serial}`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const records = await response.json();
            //MAP DEI RECORD
            if(records[0].FLIMPO==='P'){
                setEditable(true);
            }
            const formattedRecord = records.map((item) => {
                return {
                    serial: item.SERIAL,
                    tipdoc: item.TIPDOC,
                    datadoc: item.DATDOC,
                    codart: item.CODART,
                    unimis: item.UNIMIS,
                    quanti: item.QUANTI,
                    codmat: item.CODMAT,
                    magpar: item.MAGPAR,
                    magdes: item.MAGDES,
                    insuser: item.INSUSER,
                    rownum: item.ROWNUM,
                    codcon: item.CODCON,
                    tipcon: item.TIPCON,
                    flimpo: item.FLIMPO,
                    // desc: '',
                    // matricole: [],
                    // unimis1: "",
                    // unimis2: "",
                }
            })

            setRows(formattedRecord)
            setTestata(records[0]);
            setLoading(false);
        } catch (error) {
            alert(error.message);
        }
    }

    useEffect(() => {
        if (isLogged !== "true")
            navigate("/")
        else {
            getDocument();
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const rownumRecalc = () => {
        setRows(prevRows => {
            return prevRows.map((row, index) => {
                return {...row, rownum: (index+1)*10};
            });
        });
    }

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
                    const response = await fetch(`http://192.168.1.29:5000/record/delete/${azienda}/${serial}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    if (!response.ok) {
                        throw new Error(`An error occurred: ${response.statusText}`);
                    }
                    // rownumRecalc();
                    // let currentRowNum = 10;
                    // rows.forEach((row) => {
                    //     row.rownum = currentRowNum;
                    //     currentRowNum += 10;
                    // });
                    await Promise.all(rows.map(postData)); // Esegue tutte le richieste in parallelo
                    //Se tutte le richieste sono state completate con successo
                    setFormData({
                        tipdoc: '',
                        datadoc: '',
                        codart: '',
                        unimis: '',
                        quanti: 1,
                        codmat: '',
                    });
                    setRows([]);
                    alert("Documento Modificato!");
                    navigate('/documenti');
                } catch (error) {
                    // Se una o più richieste hanno fallito, gestisci l'errore qui
                    window.alert(error.message);
                }
            }
        }
    };

    const handleCauCol = async () => {
        try {
            const tipdoc = docType.filter((tp) => tp.TDTIPDOC.includes(formData.tipdoc));
            if (tipdoc[0]) {
                const response = await fetch(`http://192.168.1.29:5000/causale_mag/${azienda}/${tipdoc[0].TDCAUMAG}`);
                if (!response.ok) {
                    const message = `An error occurred: ${response.statusText}`;
                    window.alert(message);
                    return;
                }
                let records = await response.json();
                setHasCauCol(records[0].CMCAUCOL ? true : false);
            }
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

    const hanldeMat = (matricole) => {
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
            setCurrentArt({ ...selected, data: artData[0] })
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
        handleCauCol();
    }

    const onCliSelect = async (selected) => {
        setFormData({
            ...formData,
            codcon: selected.ANCODICE,
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
            magpar: rows.length > 0 ? rows[0].magpar : formData.magpar,
            magdes: rows.length > 0 ? rows[0].magdes : formData.magdes,
        });
        setUpdate({ ...update, updating: false, rownum: 0 })
        setCurrentArt({ CACODART: "", data: { ARGESMAT: "N", ARUNMIS1: null, ARUNMIS2: null } })
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
            serial: serial,
            insuser: md5(username).toString().substring(0, 20),
            rownum: (rows.length + 1) * 10,
            matricole: currentMat,
            // unimis: formData.unimis,
            unimis1: currentArt.data.ARUNMIS1,
            unimis2: currentArt.data.ARUNMIS2,
        }
        setRows(prevRows => [...prevRows, newRecord]);
        alert("Riga Aggiunta")
        resetByUpdate();
        rownumRecalc();
        if (cards.current) {
            // Usa il metodo scrollIntoView() per scorrere fino al form
            cards.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    const onDelete = (rownum) => {
        const conferma = window.confirm("Sei sicuro di voler elimiare la riga?");
        if (conferma) {
            // Filtra gli elementi escludendo quello con rownum uguale a rownumToDelete
            const updatedRows = rows.filter(row => row.rownum !== rownum);
            // Aggiorna lo stato con il nuovo array di elementi
            setRows(updatedRows);
            resetByUpdate();
            rownumRecalc();
            alert("Riga eliminata");
        }
    }

    const onUpdate = (rownum) => {
        setUpdate({ ...update, updating: true, rownum: rownum })
        const rowByUpdate = rows.find(row => row.rownum === rownum);
        setCurrentMat(rowByUpdate.matricole)
        setCurrentArt({
            ...currentArt,
            data: {
                ...currentArt.data,
                ARUNMIS1: rowByUpdate.unimis1,
                ARUNMIS2: rowByUpdate.unimis2
            }
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
        if (formRef.current) {
            // Usa il metodo scrollIntoView() per scorrere fino al form
            formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    const updateControl = () => {
        let msg = "";
        if (currentMat.length > 0 && formData.codmat === '') { msg = "Inserisci una matricola" }
        else if (formData.magpar === "") { msg = "Inserisci magazzino origine" }
        else if (hasCauCol && formData.magdes === '') { msg = "Inserisci magazzino destinazione" }
        else if (formData.unimis === "") { msg = "Inserisci unità di misura" }
        return msg;
    }

    const updateRow = () => {
        // Crea un nuovo array aggiornando l'elemento con il rownum corrispondente
        const msg = updateControl();
        if (msg !== "") {
            alert(msg)
        } else {
            const updatedRows = rows.map(row => {
                // Se rownum corrisponde, aggiorna l'elemento con i dati da formData
                if (row.rownum === update.rownum) {
                    return {
                        ...row,
                        codmat: formData.codmat,
                        quanti: currentMat.length > 0 ? 1 : parseInt(formData.quanti),
                        codart: formData.codart,
                        desc: formData.desc,
                        matricole: currentMat,
                        unimis: formData.unimis,
                        magpar: formData.magpar,
                        magdes: formData.magdes,
                        insuser: md5(username).toString().substring(0, 20),
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
            if (cards.current) {
                // Usa il metodo scrollIntoView() per scorrere fino al form
                cards.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    }

    const handleDocType = (records) => {
        setDocType(records);
    }

    const handleMag = (records) => {
        setMag(records);
    }

    const onExit = (dest) => {
        const conferma = window.confirm("Se abbandoni la pagina perderai le modifiche apportate, confermi uscita?");
        if(conferma){
            navigate(dest);
        }
    }

    const hasClient = () => {
        if(formData.tipdoc){
            const docTypeSel = docType.filter((item)=>{
                return (formData.tipdoc===item.TDTIPDOC)
            })
            if(docTypeSel[0].TDFLINTE==='C')
                return true;
            else
               return false;
        } else {
            return false
        }
    }

    const hasForn = () => {
        if(formData.tipdoc){
            const docTypeSel = docType.filter((item)=>{
                return (formData.tipdoc===item.TDTIPDOC)
            })
            if(docTypeSel[0].TDFLINTE==='F')
                return true;
            else
                return false;
        } else {
            return false
        }
    }

    const test = () => {
        console.log(editable)
    }

    return (
        <Container className='my-5 py-5'>
            <button onClick={test}>test</button>
            <Logout />
            <TimerRefresh />
            <Matricole serial={currentArt.CACODART} onLoadMat={hanldeMat} />
            <DocType onLoadDocType={handleDocType} />
            <Magazzini onLoadMag={handleMag} />
            <div className='my-3 d-flex align-items-center justify-content-between'>
                <Button variant='success' onClick={()=>{onExit("/documenti")}}>Indietro</Button>
                <Button variant='secondary' onClick={()=>{onExit("/homepage")}}>Home</Button>
            </div>
            <h4>Documento N. {serial}</h4>
            <Form onSubmit={addRowHandler}>
                <Form.Group controlId="tipdoc">
                    <Form.Label className='custom-label mt-3'>Tipo Documento</Form.Label>
                    <Form.Control required as="select" name="tipdoc" value={formData.tipdoc} onChange={handleChange} disabled>
                        <option value=""></option>
                        {docType.map((type) => <option key={type.TDTIPDOC} value={type.TDTIPDOC}>{type.TDDESDOC}</option>)}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="datadoc">
                    <Form.Label className='custom-label mt-3'>Data Documento</Form.Label>
                    <Form.Control required type="date" name="datadoc" value={formData.datadoc} onChange={handleChange} disabled />
                </Form.Group>

                {(hasClient() || hasForn())  && <Form.Group controlId="codcon">
                    <Form.Label className='custom-label mt-3'>{hasClient() ? "Cliente" : "Fornitore"}</Form.Label>
                    <Form.Control
                        placeholder="Codice"
                        required type="text"
                        name="codcon"
                        defaultValue={formData.codcon}
                        disabled
                    />
                    <Form.Control placeholder="Descrizione" type="text" name="clientDesc" defaultValue={formData.clientDesc} readOnly disabled />
                    {clientShow && <Clienti 
                                        clientShow={clientShow} 
                                        handleClientClose={cliHandler} 
                                        handleClientSelected={onCliSelect} 
                                        clientSearchValue={formData.clientSearch}
                                        type={hasClient() ? "clienti" : "fornitori"}>
                                    </Clienti>}
                </Form.Group>}

                {!loading && <div ref={cards}><RowsList rows={rows} handleDelete={onDelete} handleUpdate={onUpdate} /></div>}

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
                        {mag.map((ma) => {
                            if (ma.MGDESMAG.trim() !== '') {
                                return <option key={ma.MGCODMAG} value={ma.MGCODMAG}>{ma.MGDESMAG}</option>
                            }
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
                        {mag.map((ma) => {
                            if (ma.MGDESMAG.trim() !== '') {
                                return <option key={ma.MGCODMAG} value={ma.MGCODMAG}>{ma.MGDESMAG}</option>
                            }
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
                        disabled={(currentArt.data.ARGESMAT === 'S' || (formData.codmat.trim() !== '')) ? true : false}
                        value={(currentArt.data.ARGESMAT === 'S' || (formData.codmat.trim() !== '')) ? 1 : formData.quanti}
                        onChange={handleChange}
                    />
                </Form.Group>

                {(currentArt.data.ARGESMAT === 'S' || (formData.codmat.trim() !== '')) && <Form.Group controlId="codmat">
                    <Form.Label className='custom-label mt-3'>Codice Matricola</Form.Label>
                    <Form.Control
                        className={update.updating ? 'update-input' : ''}
                        required
                        as="select"
                        name="codmat"
                        value={formData.codmat}
                        onChange={handleChange}>
                        <option value=""></option>
                        {currentMat.map((mat) => <option key={mat.AMCODICE} value={mat.AMCODICE}>{mat.AMCODICE}</option>)}
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
            </Form>
        </Container>
    );

}

export default DocDett
