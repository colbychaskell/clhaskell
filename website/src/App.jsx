import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReactGA from 'react-ga';

import SiteNav from './components/SiteNav';
import Footer from './components/Footer';

import Home from './pages/Home';
import ContactPage from './pages/ContactPage';
import ServicesPage from './pages/ServicesPage';
import NotFound from './pages/NotFound';

const TRACKING_ID = "G-2QGJ5XS6JK";

function App() {
  ReactGA.initialize(TRACKING_ID);

  return (
    <Router>
      <header>
        <SiteNav />
      </header>
      <Routes className='container fluid'>
        <Route path='/' exact element={<Home />} />
        <Route path='/services' exact element={<ServicesPage />} />
        <Route path='/contact' exact element={<ContactPage />} />
        {/* TODO: */}
        {/* <Route path='/billing' element={<BillingPage />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <footer className='text-center'>
        <Footer />
      </footer>
    </Router>
  );
}

export default App;
