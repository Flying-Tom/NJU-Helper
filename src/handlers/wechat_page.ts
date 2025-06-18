export function wechat_page_handler() {
  console.debug('Solving wechat page');
  if (window.location.href.includes('electric')) {
    // 电费充值页面
    return;
  } else if (window.location.href.includes('recharge')) {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
          body {
              width: 40%;
              margin: 0 auto;
          }
        `;
    document.head.appendChild(styleElement);
  }
}