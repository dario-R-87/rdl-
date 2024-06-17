import React, { useEffect, useState, useRef } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import RowsList from './RowsList';
import { useNavigate } from 'react-router-dom';
import Articoli from '../articoli/Articoli';
import "./document.css"
import Matricole from '../matricole/Matricole';
import DocType from './DocType';
import Magazzini from '../magazzini/Magazzini';
import Commesse from '../commesse/Commesse'
import Attivita from '../attivita/Attivita';
import Clienti from '../clienti/Clienti';
import md5 from 'crypto-js/md5';
import Logout from '../pages/Logout';
import TimerRefresh from '../timerRefresh/TimerRefresh';

const CreateDocument = () => {

    // const ip="192.168.1.122";
    const ip="192.168.5.87";

    const navigate = useNavigate();
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // aggiungi 1 perchè i mesi iniziano da 0
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const azienda = localStorage.getItem("azienda")
    const username = localStorage.getItem("username");
    const isLogged = localStorage.getItem("isLogged");
    const [formData, setFormData] = useState({
        tipdoc: '',
        datadoc: getCurrentDate(),
        codcon: '',
        tipcon: '',
        codart: '',
        unimis: '',
        quanti: 1,
        codmat: '',
        magpar: 'SEDE ',
        magdes: '',
        clientSearch: '',
        search: '',
        clientDesc: '',
        desc: '',
        mat_barcode: '',
        commessa: '',
        attivita: '',
    });
    const [commSearch, setCommSearch] = useState("");
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
    const [coms, setComs] = useState([]);
    const [atts, setAtts] = useState([]);
    const [hasCauCol, setHasCauCol] = useState(false);
    function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          randomString += characters.charAt(randomIndex);
        }
        return randomString;
      }
    const [checkModficato, setCheckModificato] = useState(generateRandomString(10));
    const [commessaKey, setCommessaKey] = useState(0);
    const formRef = useRef(null);
    const cards = useRef(null);
    const codartInputRef = useRef(null);
    const [aaa,setA]=useState(false);

    useEffect(()=>{
        if(isLogged!=="true")
            navigate("/");
    },[])

    useEffect(() => {
        async function getMaxSerial() {
            const response = await fetch(`http://${ip}:5000/new_serial/${azienda}`);
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
        if (codartInputRef.current && isTestataSave) {
            codartInputRef.current.focus();
        }
        return;
    }, [isTestataSave])

    useEffect(() => {
        // Incrementa la chiave per forzare il ri-render del componente Attivita
        setCommessaKey(prevKey => prevKey + 1);
      }, [formData.commessa]);

    const handleChange = (e) => {
        const { name, value } = e.target;       
        if(name==='search' && (value.length-formData.search.length)>2){
            setFormData({
                ...formData,
                [name]: value.substring(formData.search.length)
            });
            artHandler();
        } else if(name==='mat_barcode' && (value.length-formData.mat_barcode.length)>2){
            setFormData({
                ...formData,
                [name]: value.substring(formData.mat_barcode.length),
                codmat: value.substring(formData.mat_barcode.length),
            });
        } else if(name==='commSearch'){
                    setCommSearch(value);
        } else {
            setFormData({
                ...formData,
                [name]: value
             });
        }
    };

    const rownumRecalc = () => {
        setRows(prevRows => {
            return prevRows.map((row, index) => {
                return {...row, rownum: (index+1)*10};
            });
        });
    }

    const postData = async (row) => {console.log(row)
        try {
            const response = await fetch(`http://${ip}:5000/record/add/${azienda}`, {
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
                    // let currentRowNum = 10;
                    // rows.forEach((row)=>{
                    //     row.rownum = currentRowNum;
                    //     currentRowNum += 10;
                    // });
                    await Promise.all(rows.map(postData)); // Esegue tutte le richieste in parallelo
                    // Se tutte le richieste sono state completate con successo
                    setFormData({
                        tipdoc: '',
                        datadoc: getCurrentDate(),
                        codart: '',
                        unimis: '',
                        quanti: 1,
                        codmat: '',
                        codcon: '',
                        tipcon: '',
                        commessa: '',
                        attivita: '',
                    });
                    setIsTestataSave(false);
                    setRows([]);
                    alert("Documento Creato!");
                    navigate('/documenti');
                } catch (error) {
                    // Se una o più richieste hanno fallito, gestisci l'errore qui
                    window.alert(error.message);
                }
            }
        }
    };

    const salvaTestata = () => {
        // if(!formData.tipdoc.includes("DDT")){
        //     if(formData.datadoc!=="" && formData.tipdoc!=="" && formData.commessa!=="" && formData.attivita!==""){
        //         setIsTestataSave(true)
        //         handleCauCol()
        //     }
        //     else
        //         alert("Si prega di compilare tutti i campi della testata!")
        // } else {
        //     if(formData.datadoc!=="" && formData.tipdoc!=="" && formData.codcon!=="" && formData.commessa!=="" && formData.attivita!==""){
        //         setIsTestataSave(true)
        //         handleCauCol()
        //         if (codartInputRef.current) {
        //             codartInputRef.current.focus();
        //         }
        //     }
        //     else
        //         alert("Si prega di compilare tutti i campi della testata!")
        // }

        if(formData.datadoc==="" || formData.tipdoc==="" || formData.commessa==="" || formData.attivita===""){
            alert("Si prega di compilare tutti i campi della testata!");
        } else {
            if(!hasClient() && !hasForn()){
                setIsTestataSave(true)
                handleCauCol()
                if (codartInputRef.current) {
                    codartInputRef.current.focus();
                }
            } else {
                if(formData.codcon===""){
                    alert("Si prega di compilare tutti i campi della testata!");
                } else {
                    setIsTestataSave(true)
                    handleCauCol()
                    if (codartInputRef.current) {
                        codartInputRef.current.focus();
                    }
                }

            }
        }
    }

    const handleCauCol = async() => {
        try {
            const tipdoc = docType.filter((tp)=>tp.TDTIPDOC.includes(formData.tipdoc));
            setFormData({...formData, tipcon: tipdoc[0].TDFLINTE});
            const response = await fetch(`http://${ip}:5000/causale_mag/${azienda}/${tipdoc[0].TDCAUMAG}`);
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
            const response = await fetch(`http://${ip}:5000/artsdata/${azienda}/${selected.CACODART}`);
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
        setFormData({
            ...formData,
            codart: selected.CACODART,
            desc: selected.CADESART,
            search: "",
            codmat: artData.ARGESMAT==='S' ? selected.matricola : '',
            unimis: artData.ARUNMIS1,
        })
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
            insuser: md5(username).toString().substring(0, 20),
            cpccchk: checkModficato,
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
        // if (rows.length === 0)
        //     setIsTestataSave(true)
        // if(cards.current) {
        //     // Usa il metodo scrollIntoView() per scorrere fino al form
        //     cards.current.scrollIntoView({ behavior: "smooth", block: "start" });
        // }
        if (codartInputRef.current) {
            codartInputRef.current.focus();
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
            rownumRecalc();
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
            // if(cards.current) {
            //     // Usa il metodo scrollIntoView() per scorrere fino al form
            //     cards.current.scrollIntoView({ behavior: "smooth", block: "start" });
            // }
            if (codartInputRef.current) {
                codartInputRef.current.focus();
            }
        }
    }

    const handleDocType = (records) => {
        setDocType(records);
    }

    const handleMag = (records) => {
        setMag(records);
    }

    const handleCom = (records) => {
        setComs(records);
    }

    const handleAtt = (records) => {
        setAtts(records);
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

    const onExit = () => {
        const conferma = window.confirm("Se abbandoni la pagina perderai tutti i dati inseriti, confermi uscita?");
        if(conferma){
            navigate('/homepage');
        }
    }

    useEffect(()=>{
        if(coms.length==1){
            setFormData({...formData, commessa: coms[0].CNCODCAN});
            setCommSearch('');
        }
    }, [coms.length])

    const test=()=>{
        console.log("comm length: " + coms.length);
        setA(!aaa)
    }

    return (
        <Container className='my-5 py-5'>
            {/* <button onClick={test}>test</button> */}
            <Logout />
            <TimerRefresh />
            <Matricole ip={ip} serial={currentArt.CACODART} onLoadMat={hanldeMat}/>
            <DocType ip={ip} onLoadDocType={handleDocType}/>
            <Magazzini ip={ip} onLoadMag={handleMag}/>
            <Commesse ip={ip} onLoadCom={handleCom} key={commSearch} searchValue={commSearch}/>
            <Attivita ip={ip} onLoadAtt={handleAtt} commessa={formData.commessa} key={commessaKey}/>
            <div className='my-3 d-flex justify-content-between'>
                {/* <Link to="/homepage"><Button variant='secondary'>Home</Button></Link> */}
                <h2>Nuovo Documento</h2>
                <Button variant='secondary' onClick={onExit}>Home</Button>
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

                {(hasClient() || hasForn()) && <Form.Group controlId="codcon">
                    <Form.Label className='custom-label mt-3'>{hasClient() ? "Cliente" : "Fornitore"}</Form.Label>
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
                        name="codcon"
                        defaultValue={formData.codcon}
                        disabled
                    />
                    <Form.Control placeholder="Descrizione" type="text" name="clientDesc" defaultValue={formData.clientDesc} readOnly disabled />
                    {clientShow && <Clienti 
                                        ip={ip}
                                        clientShow={clientShow} 
                                        handleClientClose={cliHandler} 
                                        handleClientSelected={onCliSelect} 
                                        clientSearchValue={formData.clientSearch}
                                        type={hasClient() ? "clienti" : "fornitori"}>
                                    </Clienti>}
                </Form.Group>} 

                <Form.Group controlId="commessa">
                    <Form.Label className='custom-label mt-3'>Commessa</Form.Label>
                    <Form.Control
                            className={update.updating ? 'update-input' : ''}
                            placeholder="Cerca..."
                            type="text"
                            name="commSearch"
                            value={commSearch}
                            onChange={handleChange}
                    />
                    <Form.Control
                        required as="select"
                        name="commessa"
                        value={formData.commessa}
                        onChange={handleChange}
                        className={update.updating ? 'update-input' : ''}
                        disabled={isTestataSave} >
                        <option value=''></option>
                        {coms.map((com) => {
                            return <option key={com.CNCODCAN} value={com.CNCODCAN}>{com.CNCODCAN}</option>
                        })}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="attivita">
                    <Form.Label className='custom-label mt-3'>Attività</Form.Label>
                    <Form.Control
                        required as="select"
                        name="attivita"
                        value={formData.attivita}
                        onChange={handleChange}
                        className={update.updating ? 'update-input' : ''}
                        disabled={isTestataSave} >
                        <option value=""></option>
                        {atts.map((att) => {
                            return <option key={att.ATCODATT} value={att.ATCODATT}>{att.ATDESCRI}</option>
                        })}
                    </Form.Control>
                </Form.Group>  

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
                            ref={codartInputRef}
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
                    {show && <Articoli ip={ip} show={show} handleClose={artHandler} handleArticoloSelect={onArtSelect} searchValue={formData.search}></Articoli>}
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

                {!hasForn() && (currentArt.data.ARGESMAT==='S' || (formData.codmat!=='' || currentMat.length>0)) && <Form.Group controlId="codmat">
                    <Form.Label className='custom-label mt-3'>Codice Matricola</Form.Label>
                    <Form.Control
                            className={update.updating ? 'update-input' : ''}
                            placeholder="Leggi con palmare"
                            type="text"
                            name="mat_barcode"
                            value={formData.mat_barcode}
                            onChange={handleChange}
                        />
                    <Form.Label className='mb-0 mt-3 mat-label'>Elenco matricole disponibili</Form.Label>                    
                    <Form.Control 
                        className={update.updating ? 'update-input' : ''}
                        required 
                        as="select" 
                        name="codmat" 
                        value={formData.codmat} 
                        onChange={handleChange}>
                         <option value=""></option>
                         {currentMat.map((mat)=> <option key={mat.AMCODICE} value={mat.AMCODICE.trim()}>{mat.AMCODICE}</option>)}
                    </Form.Control>
                </Form.Group>}

                {hasForn() && (currentArt.data.ARGESMAT==='S' || (formData.codmat!=='' || currentMat.length>0)) && <Form.Group controlId="codmat">
                    <Form.Label className='custom-label mt-3'>Codice Matricola</Form.Label>
                    <Form.Control 
                        className={update.updating ? 'update-input' : ''}
                        required 
                        name="codmat"
                        type="text"
                        value={formData.codmat} 
                        onChange={handleChange}>
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
