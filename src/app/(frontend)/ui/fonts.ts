import { M_PLUS_1_Code, Noto_Sans_JP, Zen_Kaku_Gothic_New, Shippori_Mincho_B1, Castoro_Titling } from 'next/font/google';

export const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-zen-kaku-gothic-new',
});

export const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto-sans-jp',
});

export const mPlus1Code = M_PLUS_1_Code({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-m-plus-1-code',
}); 

export const shipporiMinchoB1 = Shippori_Mincho_B1({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-shippori-mincho-b1',
});

export const castoroTitling = Castoro_Titling({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-castoro-titling',
});