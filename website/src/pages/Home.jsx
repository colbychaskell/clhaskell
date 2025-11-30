import Col from 'react-bootstrap/Col';
import ContactForm from '../components/ContactForm';
import Hero from '../components/Hero';
import MapLocation from '../components/MapLocation';
import About from '../components/About';
import Row from 'react-bootstrap/Row';

import './Home.css'
import TitledSection from '../components/TitledSection';

const Home = () => {
  const officeLocation = {
    address: '76 Oceanville Rd, Stonington, ME 04681',
    lat: 44.180230,
    lng: -68.650520,
  }

  return (
    <>
      <Hero  />
      <About />
      <TitledSection title='Contact Us'>
        <Row className="justify-content-between">
          <Col xl={5}>
            <ContactForm />
          </Col>
          <Col lg={5}>
            <MapLocation className='p-0 pe-5 d-xl-block d-none' location={officeLocation}  />
          </Col>
        </Row>
      </TitledSection>
    </>
  )
}

export default Home