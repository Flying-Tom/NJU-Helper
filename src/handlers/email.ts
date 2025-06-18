export function email_trust_handler() {
  console.debug('Solving email trust');
  const intervalId = setInterval(function () {
    const checkbox = document.getElementById("force_wx_scan_login_tc") as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = true;
      clearInterval(intervalId);
    }
  }, 500);
}