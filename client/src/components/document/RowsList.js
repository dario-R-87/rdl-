import React from 'react'
import {  Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare,faTrash } from '@fortawesome/free-solid-svg-icons';


const RowsList = ({ rows, handleDelete, handleUpdate }) => {
   
    return (
        <div className='mt-3'>
            {rows.slice().reverse().map((row) => (
                <Card key={row.rownum} className="mb-3 bg-primary text-white">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <Card.Text>Art: <strong>{row.desc}</strong></Card.Text>
                                <Card.Text>
                                    {row.unimis}: <strong>{row.quanti}</strong>
                                </Card.Text>
                                {false &&<Card.Text>
                                    Mat.: <strong>{row.codmat}</strong>
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

export default RowsList


