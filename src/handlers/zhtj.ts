import { handleCaptcha } from "../utils/captcha";
import { AutoLogin } from "../interfaces/auto_login";

export function zhtj_handler() {
  console.debug('Solving zhtj captcha');
  handleCaptcha("#codeImage", "#yzm", {
    enabled: false,
  } as AutoLogin);
}