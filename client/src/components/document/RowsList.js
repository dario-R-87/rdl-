import React from 'react'
import {  Container } from 'react-bootstrap';

const RowsList = ({rows}) => {
    return (
        <Container className='mt-3'>
            <ul>
                {rows.map((row) => {
                    return <li key={row.rownum}>Art. {row.codart} - {row.unimis} {row.quanti}</li>
                })}
            </ul >
        </Container>
    )
}

export default RowsList
