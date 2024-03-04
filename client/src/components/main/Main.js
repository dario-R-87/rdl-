import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Link } from "react-router-dom";

const Main = () => {
    return (
        <Container className='mt-3'>
            <Link to="/nuovo"><button>Nuovo Documento</button></Link>
        </Container>
    );
}

export default Main;