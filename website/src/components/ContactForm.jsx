import { useState } from 'react';

import Alert from 'react-bootstrap/Alert';
import ButtonPrimary from './ButtonPrimary';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import processContactForm from '../services/contact';


function ContactForm() {
  // Hook for form validation
  const [validated, setValidated] = useState(false);

  // Hooks for each input field
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');

  // Hook for showing error message
  const [showMessage, setShowMessage] = useState(false)
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('danger');
  const [alertHead, setAlertHead] = useState('Error!');


  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    if (form.checkValidity() === true) {
      try {
        await processContactForm(
          name,
          email,
          phone,
          topic,
          message
        )
      } catch (error) {
        setShowMessage(true);
        setAlertHead('Error!');
        setAlertMessage(error.message);
        setAlertVariant('danger');
        setValidated(true);
        return;
      }
    } else {
      setShowMessage(false);
      setValidated(true);
      return;
    }

    setShowMessage(true);
    setAlertHead('Success!');
    setAlertVariant('success');
    setAlertMessage('We will reach out to you shortly!');
    setValidated(true);
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Text className="text-muted">
          This is a secure form. We will never share your information.
        </Form.Text>
        <Form.Group className="mb-2 mt-3" controlId="formBasicName">
          <Form.Label>Full Name</Form.Label>
          <InputGroup hasValidation>
            <Form.Control type="text" placeholder="Enter Name" onChange={e => setName(e.target.value)} value={name} required />
            <Form.Control.Feedback type="invalid">
              Please enter your name.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group className="my-2" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <InputGroup hasValidation>
            <Form.Control type="email" placeholder="Enter Email" onChange={e => setEmail(e.target.value)} value={email} required />
            <Form.Control.Feedback type="invalid">
              Please enter a valid email address.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group className="my-2" controlId="formBasicPhone">
          <Form.Label>Phone Number</Form.Label>
          <InputGroup hasValidation>
            <Form.Control type="tel" placeholder="Enter Phone Number" onChange={e => setPhone(e.target.value)} value={phone} required />
            <Form.Control.Feedback type="invalid">
              Please enter a valid phone number.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group className="my-2" controlId="formBasicTopic">
          <Form.Label>Reason for Contacting</Form.Label>
          <InputGroup hasValidation>
            <Form.Control as="select" defaultValue="Choose..." required onChange={e => setTopic(e.target.value)} value={topic}>
              <option value="">Choose...</option>
              <option>General Inquiry</option>
              <option>Service Request</option>
              <option>Billing</option>
              <option>Other</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              Please select a reason for contacting us.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicMessage">
          <Form.Label>Message</Form.Label>
          <InputGroup hasValidation>
            <Form.Control as="textarea" rows={6} placeholder="Enter Message" onChange={e => setMessage(e.target.value)} value={message} required />
            <Form.Control.Feedback type="invalid">
              Please enter a message.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Alert show={showMessage} className="mt-3" variant={alertVariant}>
          <Alert.Heading>{alertHead}</Alert.Heading>
          <p>
            {alertMessage}
          </p>
        </Alert>
        <ButtonPrimary type="submit">
          Submit
        </ButtonPrimary>
      </Form>
    </>
  );
}

export default ContactForm;