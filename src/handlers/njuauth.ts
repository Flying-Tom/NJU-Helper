

import { handleCaptcha } from "../utils/captcha";

export function njuauth_handler() {
  console.debug('Solving njuauth captcha');
  const inputElement = document.querySelector<HTMLInputElement>("input[name=dllt][value=userNamePasswordLogin]");
  if (inputElement) {
    inputElement.value = "mobileLogin";
  }

  const showPassElement = document.getElementsByClassName("showPass")?.[0] as HTMLElement;
  if (showPassElement) {
    showPassElement.click();
  }

  handleCaptcha("#captchaImg", "#captchaResponse", {
    enabled: true,
    // enabled: false,
    usernameSelectors: "input[name=username]",
    passwordSelectors: "input[type=password]",
    submitSelectors: "button[type=submit]",
  });
}
