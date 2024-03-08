import Container from 'react-bootstrap/Container';
import {Button} from 'react-bootstrap';
import { Link } from "react-router-dom";
import Matricole from '../matricole/Matricole';

const Main = () => {
    return (
        <Container className='mt-5 d-flex justify-content-center'>
            <Link to="/nuovo"><Button>Nuovo Documento</Button></Link>
            <Matricole />
        </Container>
    );
}

export default Main;