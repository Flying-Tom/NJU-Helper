import { waitForElms } from "../utils/promise";

export function wspj_handler() {

  // const intervalId = setInterval(checkForElement, 1000);
  setInterval(checkForElement, 1000);

  // 检查页面中是否存在指定 ID 的元素
  function checkForElement() {
    const element = document.querySelector('#pjfooter');

    if (element) {
      console.debug('Solving wspj page');
      void waitForElms('.bh-radio-label.paper_dx').then((elems) => {
        const choices = elems as NodeListOf<HTMLElement>;
        choices.forEach((elem) => {
          const choice = elem;
          const spanElement = choice.querySelector('span');
          const input = choice.querySelector('input');
          if (spanElement && input) {
            if (spanElement.textContent === '符合') {
              input.checked = true;
            }

          }
        });
      }
      );
      // clearInterval(intervalId); // 找到后停止定时器
    } else {
      return;
    }
  }
}