import { ErrorMessage } from "./ErrorMessage";

export const RequestFailedMessage = ({message, error}) => {
    return <ErrorMessage 
        isFailed={error}  
        message={message}
        error={JSON.stringify(error.data ? error.data : error)}
      />
  }
  