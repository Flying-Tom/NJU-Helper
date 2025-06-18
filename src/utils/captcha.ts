import { GM_xmlhttpRequest } from '$';
import { waitForElm } from "./promise";
import { AutoLogin } from "../interfaces/auto_login";

interface ICaptchaResp {
  result: string;
  status: number;
}

function getBase64Str(image_target: HTMLImageElement): string {
  const canvas = document.createElement("canvas");
  canvas.width = image_target.naturalWidth;
  canvas.height = image_target.naturalHeight;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.drawImage(image_target, 0, 0);
    return canvas.toDataURL("image/png");
  }
  return "";
}

function solveCAPTCHA(
  image_target: HTMLImageElement,
  captcha_input_selectors: string,
  autoLogin: AutoLogin,
) {
  GM_xmlhttpRequest({
    method: "POST",
    url: "https://njucaptcha.cystom.top/ocr/b64/json",
    data: JSON.stringify({
      image: getBase64Str(image_target),
      callback: "handle",
    }),
    onload: function (res) {
      if (res.status == 200) {
        let data = {} as ICaptchaResp;
        try {
          data = JSON.parse(res.responseText) as ICaptchaResp;
        } catch (e) {
          console.warn(e);
        } finally {
          console.debug(data.result);
          const captchaInput = document.querySelector(captcha_input_selectors);
          if (captchaInput) {
            (captchaInput as HTMLInputElement).value = data.result;
          }
          if (autoLogin.enabled == true) {
            const intervalId = setInterval(function () {
              const usernameInput = document.querySelector(autoLogin.usernameSelectors);
              const passwordInput = document.querySelector(autoLogin.passwordSelectors);
              const submitButton = document.querySelector(autoLogin.submitSelectors);
              if (usernameInput && passwordInput && submitButton) {
                if ((usernameInput as HTMLInputElement).value && (passwordInput as HTMLInputElement).value) {
                  (submitButton as HTMLInputElement).click();
                  clearInterval(intervalId);
                }
              }
            }, 1000);
          }
        }
      }
    }
  });
}

export function handleCaptcha(
  captcha_img_selectors: string,
  captcha_input_selectors: string,
  autoLogin: AutoLogin,
) {
  void waitForElm(captcha_img_selectors).then((data) => {
    const image_target = data as HTMLImageElement;

    if (image_target.complete == true) {
      solveCAPTCHA(image_target, captcha_input_selectors, autoLogin);
    } else {
      image_target.addEventListener("load", () => solveCAPTCHA(image_target, captcha_input_selectors, autoLogin));
    }
  });
}
