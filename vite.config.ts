import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      server: {
        open: false,
      },

      userscript: {
        name: 'NJU Helper',
        namespace: 'Flying-Tom/NJU-Helper',
        author: 'Flying-Tom',
        version: '0.1.0',
        description: 'A helper for you to automate your life in NJU.',
        license: 'AGPL-3.0',
        icon: 'https://z1.ax1x.com/2023/11/21/pia2Gtg.png',
        match: [
          'https://authserver.nju.edu.cn/authserver/login*', // 0
          'http://ndyy.nju.edu.cn/*', // 1
          'https://zhtj.youth.cn/zhtj/', // 2
          'https://ehall.nju.edu.cn/ywtb-portal/official/index.html*', // 3
          'https://mail.smail.nju.edu.cn/cgi-bin/loginpage*', // 4
          'https://ehallapp.nju.edu.cn/gsapp/sys/wspjapp/*', // 5
          'https://epay.nju.edu.cn/epay/h5/*', // 6
          'https://zzbdjgz.nju.edu.cn/consumer/*', // 7
        ],
      },
    }),
  ],
});
