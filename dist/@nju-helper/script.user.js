// ==UserScript==
// @name         NJU Helper
// @namespace    Flying-Tom/NJU-Helper
// @version      0.1.0
// @author       Flying-Tom
// @description  A helper for you to automate your life in NJU.
// @license      AGPL-3.0
// @icon         https://z1.ax1x.com/2023/11/21/pia2Gtg.png
// @match        https://authserver.nju.edu.cn/authserver/login*
// @match        http://ndyy.nju.edu.cn/*
// @match        https://zhtj.youth.cn/zhtj/
// @match        https://ehall.nju.edu.cn/ywtb-portal/official/index.html*
// @match        https://mail.smail.nju.edu.cn/cgi-bin/loginpage*
// @match        https://ehallapp.nju.edu.cn/gsapp/sys/wspjapp/*
// @match        https://epay.nju.edu.cn/epay/h5/*
// @match        https://zzbdjgz.nju.edu.cn/consumer/*
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
  'use strict';

  var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  function wechat_page_handler() {
    if (window.location.href.includes("electric")) {
      return;
    } else if (window.location.href.includes("recharge")) {
      const styleElement = document.createElement("style");
      styleElement.textContent = `
          body {
              width: 40%;
              margin: 0 auto;
          }
        `;
      document.head.appendChild(styleElement);
    }
  }
  function waitForElm(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }
      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }
  function waitForElms(selector) {
    return new Promise((resolve) => {
      if (document.querySelectorAll(selector).length > 0) {
        return resolve(document.querySelectorAll(selector));
      }
      const observer = new MutationObserver(() => {
        if (document.querySelectorAll(selector).length > 0) {
          resolve(document.querySelectorAll(selector));
          observer.disconnect();
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }
  function getBase64Str(image_target) {
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
  function solveCAPTCHA(image_target, captcha_input_selectors, autoLogin) {
    _GM_xmlhttpRequest({
      method: "POST",
      url: "https://njucaptcha.cystom.top/ocr/b64/json",
      data: JSON.stringify({
        image: getBase64Str(image_target),
        callback: "handle"
      }),
      onload: function(res) {
        if (res.status == 200) {
          let data = {};
          try {
            data = JSON.parse(res.responseText);
          } catch (e) {
            console.warn(e);
          } finally {
            /* @__PURE__ */ console.debug(data.result);
            const captchaInput = document.querySelector(captcha_input_selectors);
            if (captchaInput) {
              captchaInput.value = data.result;
            }
            if (autoLogin.enabled == true) {
              const intervalId = setInterval(function() {
                const usernameInput = document.querySelector(autoLogin.usernameSelectors);
                const passwordInput = document.querySelector(autoLogin.passwordSelectors);
                const submitButton = document.querySelector(autoLogin.submitSelectors);
                if (usernameInput && passwordInput && submitButton) {
                  if (usernameInput.value && passwordInput.value) {
                    submitButton.click();
                    clearInterval(intervalId);
                  }
                }
              }, 1e3);
            }
          }
        }
      }
    });
  }
  function handleCaptcha(captcha_img_selectors, captcha_input_selectors, autoLogin) {
    void waitForElm(captcha_img_selectors).then((data) => {
      const image_target = data;
      if (image_target.complete == true) {
        solveCAPTCHA(image_target, captcha_input_selectors, autoLogin);
      } else {
        image_target.addEventListener("load", () => solveCAPTCHA(image_target, captcha_input_selectors, autoLogin));
      }
    });
  }
  function njuauth_handler() {
    var _a;
    const inputElement = document.querySelector("input[name=dllt][value=userNamePasswordLogin]");
    if (inputElement) {
      inputElement.value = "mobileLogin";
    }
    const showPassElement = (_a = document.getElementsByClassName("showPass")) == null ? void 0 : _a[0];
    if (showPassElement) {
      showPassElement.click();
    }
    handleCaptcha("#captchaImg", "#captchaResponse", {
      enabled: true,
      // enabled: false,
      usernameSelectors: "input[name=username]",
      passwordSelectors: "input[type=password]",
      submitSelectors: "button[type=submit]"
    });
  }
  function njuhospital_handler() {
    const inputElement = document.querySelector('input[name="NewWebYzm"]');
    if (inputElement) {
      inputElement.value = "";
    }
    handleCaptcha("#refreshCaptcha", 'input[name="NewWebYzm"]', {
      enabled: false
    });
  }
  function ehall_handler() {
    const intervalId = setInterval(function() {
      if (document.querySelector(".header-user")) {
        const spanElement = document.evaluate("//span[contains(., '首页')]", document, null, XPathResult.ANY_TYPE).iterateNext();
        if (spanElement) {
          spanElement.click();
        }
        clearInterval(intervalId);
      }
      const btnLogin = document.querySelector(".btn-login");
      if (btnLogin) {
        btnLogin.click();
      }
    }, 200);
    setTimeout(function() {
      clearInterval(intervalId);
    }, 5e3);
  }
  function email_trust_handler() {
    const intervalId = setInterval(function() {
      const checkbox = document.getElementById("force_wx_scan_login_tc");
      if (checkbox) {
        checkbox.checked = true;
        clearInterval(intervalId);
      }
    }, 500);
  }
  function zhtj_handler() {
    handleCaptcha("#codeImage", "#yzm", {
      enabled: false
    });
  }
  function wspj_handler() {
    setInterval(checkForElement, 1e3);
    function checkForElement() {
      const element = document.querySelector("#pjfooter");
      if (element) {
        void waitForElms(".bh-radio-label.paper_dx").then(
          (elems) => {
            const choices = elems;
            choices.forEach((elem) => {
              const choice = elem;
              const spanElement = choice.querySelector("span");
              const input = choice.querySelector("input");
              if (spanElement && input) {
                if (spanElement.textContent === "符合") {
                  input.checked = true;
                }
              }
            });
          }
        );
      } else {
        return;
      }
    }
  }
  function samrt_party_handler() {
    function search_and_pay() {
      if (window.location.href.includes("partyCostPay")) {
        void waitForElms(".ivu-input-number-input").then((data) => {
          const feeInputElems = data;
          feeInputElems.forEach((inputElem) => {
            const fee = "0.2";
            inputElem.value = fee;
            inputElem.dispatchEvent(new Event("input", { bubbles: true }));
          });
        });
      }
    }
    void waitForElm("#app").then((data) => {
      const observer = new MutationObserver(search_and_pay);
      observer.observe(data, {
        childList: true,
        subtree: true
      });
    });
  }
  (function() {
    (function() {
      const matchIdx = _GM_info.script.matches.map((rule) => rule.replace(/\.|\*|\/|\?/g, (match) => ({ ".": "\\.", "*": ".*", "/": "\\/", "?": "\\?" })[match] ?? "")).map((rule) => new RegExp(rule)).map((regExp, index) => regExp.test(window.location.href) ? index : null).filter((index) => index != null).join().toString();
      const strategyLoad = {
        "0": njuauth_handler,
        // 南大统一身份认证自动登录
        "1": njuhospital_handler,
        // 南大校医院验证码
        "2": zhtj_handler,
        // 智慧团建验证码
        "3": ehall_handler,
        // 南大 ehall 自动登录
        "4": email_trust_handler,
        // 南大学生邮箱信任本机
        "5": wspj_handler
        // 南大ehall 课程评教
      };
      const strategyInstant = {
        "6": wechat_page_handler,
        // 南大信息门户 pc 端
        "7": samrt_party_handler
        // 智慧党建
      };
      if (matchIdx in strategyInstant) {
        const strategyInstantFunc = strategyInstant[matchIdx];
        strategyInstantFunc();
      } else if (matchIdx in strategyLoad) {
        const strategyLoadFunc = strategyLoad[matchIdx];
        if (document.readyState == "complete") {
          strategyLoadFunc();
        } else {
          window.addEventListener("load", strategyLoadFunc);
        }
      }
    })();
  })();

})();