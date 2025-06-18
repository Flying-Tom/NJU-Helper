import { waitForElm, waitForElms } from "../utils/promise";

export function samrt_party_handler() {

  function search_and_pay() {
    console.debug('Try to search for input elements.');
    if (window.location.href.includes('partyCostPay')) {
      void waitForElms('.ivu-input-number-input').then((data) => {
        const feeInputElems = data as NodeListOf<HTMLInputElement>;

        feeInputElems.forEach((inputElem: HTMLInputElement) => {
          // Student Party Fee should be 0.2/month
          const fee = "0.2";
          inputElem.value = fee;

          // trigger input event
          inputElem.dispatchEvent(new Event('input', { bubbles: true }));

        });
      });
    }
  }

  void waitForElm('#app').then((data) => {
    const observer = new MutationObserver(search_and_pay);
    observer.observe(data as HTMLDivElement, {
      childList: true,
      subtree: true
    });

    // observer.disconnect();

  });

};
