import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from "react-router-dom"

const NotFound = () => {
    return (
        <Container fluid className='vh-100 vw-100'>
            <Row className='h-100 justify-content-center align-items-center'>
                <Col md={6} className='text-center'>
                    <h1>404</h1>
                    <h2>Page Not Found</h2>
                    <p>Sorry, the page you are looking for does not exist.</p>
                    <Link to='/' className='btn btn-primary'>Return Home</Link>
                </Col>
            </Row>
        </Container>
    )
}

export default NotFound