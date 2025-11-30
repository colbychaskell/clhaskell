import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

const ButtonPrimary = ({ children, ...props }) => {
  return (
    <Button {...props}>
      {children}
    </Button>
  )
}

ButtonPrimary.propTypes = {
  children: PropTypes.element
}

export default ButtonPrimary