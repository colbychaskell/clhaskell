import ContactForm from "../components/ContactForm";
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const ContactPage = () => {
  return (
    <Container className="py-5 px-4 min-vh-100" fluid>
      <Row>
        <Col md={5} className='mx-auto mt-1 mb-5'>
          <h1>Contact Information</h1>
          <h5 className='mb-4'>Feel free to fill out our form or contact us directly</h5>
          {/* table of contact information  */}
          <p><b>Phone:</b> 207-367-2715</p>
          <p><b>Fax:</b> 207-367-2585</p>
          <p><b>Email:</b> <a href="mailto:clhaskell@clhaskellelectric.com" target="_blank" rel="noreferrer">clhaskell@clhaskellelectric.com</a>
          </p>
          <p><b>Mailing Address: </b>P.O. Box 43, Stonington, ME 04681</p>
          <p><b>Physical Address: </b>78 Oceanville Rd, Stonington, ME 04681</p>

          <h1 className='mt-5 mb-3'>Billing Information</h1>
          <p>Please mail checks to P.O. Box 43, Stonington, ME 04681. This is our only <u>Mailing Address</u>.</p>
          <p>We may be able to offer credit card or online ACH payments for some projects.
            Please call us to discuss your options.</p>
          <p>We strive to provide detailed billing information for all customer projects. If you
            have a billing question, give us a call any time during business hours and we will do
            our best to make it right!</p>
        </Col>
        <Col md={5} className='mx-auto mt-1'>
          <h1>Contact Us</h1>
          <ContactForm />
        </Col>

      </Row>
    </Container>
  );
}

export default ContactPage;