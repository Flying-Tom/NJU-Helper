import { handleCaptcha } from "../utils/captcha";
import { AutoLogin } from "../interfaces/auto_login";

export function njuhospital_handler() {
  console.debug('Solving nju hospital captcha');
  const inputElement = document.querySelector<HTMLInputElement>('input[name="NewWebYzm"]');
  if (inputElement) {
    inputElement.value = '';
  }
  handleCaptcha("#refreshCaptcha", 'input[name="NewWebYzm"]', {
    enabled: false,
  } as AutoLogin);
}