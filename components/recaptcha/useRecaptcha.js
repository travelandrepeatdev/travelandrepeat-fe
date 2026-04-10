import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export function useRecaptcha() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getRecaptchaToken = async (action) => {
    if (!executeRecaptcha) {
      console.error('reCAPTCHA no está listo');
      throw new Error('reCAPTCHA no está listo');
    }
    return executeRecaptcha(action);
  };

  return { getRecaptchaToken };
}
