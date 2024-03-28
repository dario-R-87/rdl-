import React from 'react'
import {  Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare,faTrash } from '@fortawesome/free-solid-svg-icons';
import { nanoid } from 'nanoid';

const DocRows = ({rows, handleUpdate, handleDelete}) => {
    return (
        <div className='mt-5'>
            {rows.slice().reverse().map((row) => (
                <Card key={nanoid()} className="mb-3 bg-secondary text-white">
                    <Card.Body>
                        <div className='text-dark'><strong>RIGA {row.ROWNUM}</strong></div>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <Card.Text>Art: <strong>{row.CODART}</strong></Card.Text>
                                <Card.Text>
                                    {row.UNIMIS}: <strong>{row.QUANTI}</strong>
                                </Card.Text>
                                {row.CODMAT.trim()!=="" && <Card.Text>
                                    Mat.: <strong>{row.CODMAT}</strong>
                                </Card.Text>}
                            </div>
                            <div className="d-flex flex-column align-items-start gap-1">
                                <Button variant="primary" onClick={()=>handleUpdate(row.rownum)}><FontAwesomeIcon icon={faPenToSquare} /></Button>
                                <Button variant="danger" className="me-2" onClick={()=>handleDelete(row.rownum)}><FontAwesomeIcon icon={faTrash} /></Button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            ))}
        </div>
    )
}

export default DocRows
