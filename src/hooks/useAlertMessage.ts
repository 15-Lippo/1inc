import { useState } from 'react';

interface AlertProps {
  title: string;
  text: string;
}

export const useAlertMessage = () => {
  const [errorMessage, setErrorMessage] = useState<AlertProps>({ title: '', text: '' });

  const shouldOpenModal = () => errorMessage.text !== '' && errorMessage.title !== '';

  const clearMessage = () => setErrorMessage({ title: '', text: '' });

  return {
    errorMessage,
    setErrorMessage,
    shouldOpenModal,
    clearMessage,
  };
};
