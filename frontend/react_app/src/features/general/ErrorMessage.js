import Alert from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Row';

export const ErrorMessage = ({isFailed, message, error}) => { 
  if (isFailed) {
    return(
      <Col>
        <Alert className="mb-2 fade alert alert-danger show" variant="danger">
          <span>{message}</span>
          <p>{error}</p>
        </Alert>
      </Col>
    )
  }
    return null
  }