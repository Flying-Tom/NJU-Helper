export function ehall_handler() {
  console.debug('Solving ehall captcha');
  const intervalId = setInterval(function () {
    if (document.querySelector('.header-user')) {
      // 已经登录
      const spanElement = document.evaluate("//span[contains(., '首页')]", document, null, XPathResult.ANY_TYPE).iterateNext() as HTMLElement;
      if (spanElement) {
        spanElement.click();
      }
      clearInterval(intervalId);
    };
    const btnLogin = document.querySelector('.btn-login');
    if (btnLogin) {
      (btnLogin as HTMLElement).click();
    }
  }, 200);

  setTimeout(function () {
    clearInterval(intervalId);
  }, 5000);
}