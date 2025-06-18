import { GM_info } from '$';

import { wechat_page_handler } from './handlers/wechat_page';
import { njuauth_handler } from './handlers/njuauth';
import { njuhospital_handler } from './handlers/hospital';
import { ehall_handler } from './handlers/ehall';
import { email_trust_handler } from './handlers/email';
import { zhtj_handler } from './handlers/zhtj';
import { wspj_handler } from './handlers/wspj';
import { samrt_party_handler } from './handlers/smart_party';

(function () {
  'use strict';
  (function () {
    const matchIdx: string = GM_info.script.matches
      .map(rule => rule.replace(/\.|\*|\/|\?/g, match => ({ ".": "\\.", "*": ".*", "/": "\\/", "?": "\\?" }[match]) ?? ''))
      .map(rule => new RegExp(rule))
      .map((regExp, index) => regExp.test(window.location.href) ? index : null)
      .filter(index => index != null).join().toString();

    // interface Istragety { [key: string]: () => void };
    type Istragety = Record<string, () => void>;
    

    const strategyLoad: Istragety = {
      "0": njuauth_handler, // 南大统一身份认证自动登录
      "1": njuhospital_handler, // 南大校医院验证码
      "2": zhtj_handler, // 智慧团建验证码
      "3": ehall_handler, // 南大 ehall 自动登录
      "4": email_trust_handler, // 南大学生邮箱信任本机
      "5": wspj_handler, // 南大ehall 课程评教
    }

    const strategyInstant: Istragety = {
      "6": wechat_page_handler, // 南大信息门户 pc 端
      "7": samrt_party_handler, // 智慧党建
    }

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