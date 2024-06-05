import React, { useEffect,useState } from 'react'
import { Container, Table, Button } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom';
import { format, parse } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faCheckDouble, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

import "./document.css"

const Documents = () => {

    const ip="192.168.1.122";
    // const ip="192.168.5.87";
    
    const navigate = useNavigate();
    const azienda = localStorage.getItem("azienda")
    const [documents, setDocuments] = useState([]);
    const [confirm, setConfirm] = useState(false);

    const getDocuments = async () => {
        try {
            const response = await fetch(`http://${ip}:5000/documenti/${azienda}`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            let records = await response.json();
            setDocuments(records);
        } catch (error) {
            alert(error.message);
        }
    }

    const onExit = () => {
        navigate('/homepage');
    }

    useEffect(()=>{
        getDocuments();
    }, [confirm])

    const confermaDocumento = async (serial) => {
        const conferma = window.confirm("Confermando il documento non vi si potranno più apportare modifiche!");
        if(conferma){
            try {
                const response = await fetch(`http://${ip}:5000/conferma/${azienda}/${serial}`, {
                    method: "PUT", // Metodo PUT per l'operazione di aggiornamento
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({}), // Includi i dati da aggiornare nel corpo della richiesta
                });
                if (!response.ok) {
                    const message = `An error occurred: ${response.statusText}`;
                    window.alert(message);
                    return;
                }
                alert("Documento Confermato!")
                setConfirm(!confirm);
            } catch (error) {
                alert(error.message);
            }
        }
    }

    const reloadPage = () => {
        window.location.reload();
      };

    return (
        <Container className='my-5 py-5'>
            <div className='mt-3 mb-5 d-flex justify-content-between'>
                <div className='d-flex justify-content-between align-items-center gap-2'>
                    <h2 className='mb-0'>Lista Documenti</h2>
                    <Link to="/documenti"><button title="Aggiorna" onClick={reloadPage}><FontAwesomeIcon icon={faArrowsRotate} /></button></Link>
                </div>
                <Button variant='secondary' onClick={onExit}>Home</Button>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Numero</th>
                        <th>Tipo</th>
                        <th>Data</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {documents.length===0 ? 
                    (<tr>
                        <td colSpan="5" style={{ fontWeight: 'bold', textAlign: 'center' }}>Nessun documento trovato!</td>
                    </tr>) : 
                    (documents.slice().reverse().map((doc, index)=>                        
                        (<tr key={index}>
                            <td>{index+1}</td>
                            <td><a href={`/docdett/${doc.SERIAL}`}>{doc.SERIAL}</a></td>
                            <td>{doc.TIPDOC}</td>
                            <td>{format(new Date(doc.DATDOC), 'dd/MM/yyyy')}</td>
                            <td className='conferma'>
                                {doc.FLIMPO==='P' ? 
                                <button title="Conferma documento" onClick={()=>{confermaDocumento(doc.SERIAL)}}><FontAwesomeIcon icon={faCircleCheck} /></button> : 
                                <FontAwesomeIcon icon={faCheckDouble} />}
                            </td>
                        </tr>)
                    ))}
                </tbody>
            </Table>
        </Container>
    )
}

export default Documents
