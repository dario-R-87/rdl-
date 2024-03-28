import React from 'react'
import DocDett from '../document/DocDett'
import { useParams } from 'react-router-dom';

const Details = () => {
  const { serial } = useParams();
  return (
    <DocDett serial={serial}/>
  )
}

export default Details
