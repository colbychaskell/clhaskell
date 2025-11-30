import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import TitledSection from '../components/TitledSection';
import { Link } from 'react-router-dom';
import './ServicesPage.css'

const ServicesPage = () => {
  return (
    <Container fluid className='min-vh-100'>
      <TitledSection title='Our Services'>
        <Row>
          <Col>
            <p>
              We provide a wide range of electrical services to meet your needs.
              From installations to repairs, our team of skilled electricians is here to help.
            </p>
          </Col>
        </Row>
        <Row className='my-5'>
          <Col className='my-3 col-12 col-md-6'>
            <h4>Residential and Commercial Electrical Services</h4>
            <p>
              Our team handles both residential and commercial electrical installations, including wiring, outlets,
              switches, light fixtures, and more. Our team can help you with both new constructions and repairs.
            </p>
          </Col>
          <Col className='my-3 col-12 col-md-6'>
            <h4>Home Solar Systems</h4>
            <p>
              We have installed and serviced a variety of solar systems for homes and businesses. We can help you
              determine the right solar system for your needs and budget. We also offer solar system services to
              the surrounding islands.
            </p>
          </Col>
          <Col className='my-3 col-12 col-md-6'>
            <h4>Electrical Panel Upgrades</h4>
            <p>
              If your electrical panel is outdated or insufficient for your power needs, we can help
              with panel upgrades. We&apos;ll assess your electrical demands and recommend the right panel
              upgrade to ensure optimal electrical performance and safety for your home or business.
            </p>
          </Col>
          <Col className='my-3 col-12 col-md-6'>
            <h4>Lighting Installations</h4>
            <p>
              Enhance your space with our professional lighting installations. Whether you need
              interior lighting, outdoor lighting, or energy-efficient solutions, we offer a variety
              of options to suit your preferences and budget.
            </p>
          </Col>
          <Col className='my-3 col-12 col-md-6'>
            <h4>Generator Sales & Service</h4>
            <p>
              We are an authorized Generac dealer, and we sell, install, and service Generac
              generators. We provide 24-hour emergency service for all generators purchased from us.
            </p><p>
              We also service Onan, Briggs & Stratton, Kohler, and other generator brands.
            </p>
          </Col>
          <Col className='my-3 col-12 col-md-6'>
            <h4>Island Service</h4>
            <p>We are happy to provide services to the surrounding islands, including Isle au Haut. We operate our own service boat and we will transport our crew equipment to the islands as needed.</p>
          </Col>
          <Col className='my-3 col-12 col-md-6'>
            <h4>And More...</h4>
            <p>
              In addition to the services mentioned here, we offer many more personalized services. <Link to="/contact">Contact us</Link> to
              discuss your specific needs.
            </p>
          </Col>
        </Row>
      </TitledSection>
    </Container>

  );
};

export default ServicesPage;