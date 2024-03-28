import React, { useEffect,useState } from 'react'
import { Container, Table, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { format, parse } from 'date-fns';
import "./document.css"

const Documents = () => {
    const navigate = useNavigate();
    const azienda = localStorage.getItem("azienda")
    const [documents, setDocuments] = useState([]);

    const getDocuments = async () => {
        try {
            const response = await fetch(`http://192.168.1.29:5000/documenti/${azienda}`);
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
    }, [])

    return (
        <Container className='my-5 py-5'>
            <div className='mt-3 mb-5 d-flex justify-content-between'>
                <h2>Lista Documenti</h2>
                <Button variant='secondary' onClick={onExit}>Home</Button>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Numero</th>
                        <th>Tipo</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.length===0 ? 
                    (<tr>
                        <td colSpan="4" style={{ fontWeight: 'bold', textAlign: 'center' }}>Nessun documento trovato!</td>
                    </tr>) : 
                    (documents.slice().reverse().map((doc, index)=>                        
                        (<tr key={index}>
                            <td>{index+1}</td>
                            <td><a href={`/docdett/${doc.SERIAL}`}>{doc.SERIAL}</a></td>
                            <td>{doc.TIPDOC}</td>
                            <td>{format(new Date(doc.DATDOC), 'dd/MM/yyyy')}</td>
                        </tr>)
                    ))}
                </tbody>
            </Table>
        </Container>
    )
}

export default Documents
