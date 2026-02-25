import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export function useRecaptcha() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getToken = async (action) => {
    if (!executeRecaptcha) throw new Error('reCAPTCHA no listo');
    return executeRecaptcha(action);
  };

  return { getToken };
}
