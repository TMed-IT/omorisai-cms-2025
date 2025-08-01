import { festival } from './festival'

const OMORISAI_YEAR = Number(festival.festivalInfo.year)
const OMORISAI_COUNT = OMORISAI_YEAR - 1963 + 1

export const messages = [
  {
    slug: '1',
    position: '医学部 大森祭実行委員長',
    name: '田中 健一',
    message: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: `${OMORISAI_YEAR}年度大森祭の実行委員長を務めさせていただきます、医学部3年の`, version: 1 },
              { type: 'text', text: '田中健一', version: 1, format: 1 },
              { type: 'text', text: 'と申します。', version: 1 },
            ], direction: 'ltr' as const, format: '' as const, indent: 0, version: 1,
          },
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: '本年度は', version: 1 },
              { type: 'text', text: '2日間', version: 1, format: 2 },
              { type: 'text', text: 'に渡り、医学部と看護学部合同で東邦大学大森祭を開催いたします。', version: 1 },
            ], direction: 'ltr' as const, format: '' as const, indent: 0, version: 1,
          },
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: '第', version: 1 },
              { type: 'text', text: `${OMORISAI_COUNT}回`, version: 1, format: 1 },
              { type: 'text', text: 'を迎える今年の大森祭のテーマは', version: 1 },
              { type: 'text', text: '未来へつなぐ絆', version: 1, format: 2 },
              { type: 'text', text: 'です。', version: 1 },
            ], direction: 'ltr' as const, format: '' as const, indent: 0, version: 1,
          },
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: '各部活、委員一同が一生懸命準備をしてきた年に一度の祭典を、お楽しみいただけますと幸いです。', version: 1 },
            ], direction: 'ltr' as const, format: '' as const, indent: 0, version: 1,
          },
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: '最後になりましたが、第', version: 1 },
              { type: 'text', text: `${OMORISAI_COUNT}回`, version: 1, format: 1 },
              { type: 'text', text: '大森祭を開催するにあたり、多大なるご尽力を賜りました', version: 1 },
              { type: 'text', text: '教職員の皆様', version: 1, format: 2 },
              { type: 'text', text: '、', version: 1 },
              { type: 'text', text: '地域の皆様', version: 1, format: 2 },
              { type: 'text', text: '、東邦大学習志野のキャンパス東邦祭実行委員の皆様にこの場をお借りし、改めて心より御礼申し上げます。', version: 1 },
            ], direction: 'ltr' as const, format: '' as const, indent: 0, version: 1,
          },
        ], direction: 'ltr' as const, format: '' as const, indent: 0, version: 1,
      },
    },
  },
  {
    slug: '2',
    position: '看護学部 大森祭実行委員長',
    name: '中村 羽那',
    message: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: '第', version: 1 },
              { type: 'text', text: `${OMORISAI_COUNT}回`, version: 1, format: 1 },
              { type: 'text', text: '大森祭にご来場いただき誠にありがとうございます。', version: 1 },
              { type: 'text', text: `${OMORISAI_YEAR}年度看護学部大森祭実行委員長を務めさせて頂きます、`, version: 1 },
              { type: 'text', text: '中村羽那', version: 1, format: 1 },
              { type: 'text', text: 'です。', version: 1 },
            ], direction: 'ltr' as const, format: '' as const, indent: 0, version: 1,
          },
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: '本年度は', version: 1 },
              { type: 'text', text: '2日間', version: 1, format: 2 },
              { type: 'text', text: 'にわたり、医学部看護学部合同で東邦大学大森祭を開催いたします。', version: 1 },
            ], direction: 'ltr' as const, format: '' as const, indent: 0, version: 1,
          },
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: '第', version: 1 },
              { type: 'text', text: `${OMORISAI_COUNT}回`, version: 1, format: 1 },
              { type: 'text', text: '大森祭のテーマは', version: 1 },
              { type: 'text', text: '未来へつなぐ絆', version: 1, format: 2 },
              { type: 'text', text: 'です。', version: 1 },
            ], direction: 'ltr' as const, format: '' as const, indent: 0, version: 1,
          },
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: '今回の大森祭は委員全員が試行錯誤しながら、協力を重ねたことで多くの初挑戦を実現できたと感じております。', version: 1 },
            ], direction: 'ltr' as const, format: '' as const, indent: 0, version: 1,
          },
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: '本校学生の皆様にも多大なるご協力を賜り、', version: 1 },
              { type: 'text', text: '豪華な模擬店の出店', version: 1, format: 2 },
              { type: 'text', text: '、日々の活動の成果を発表する場を設けさせていただくことができました。', version: 1 },
            ], direction: 'ltr' as const, format: '' as const, indent: 0, version: 1,
          },
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: '学生みんなが全力で作り上げる大森祭を楽しんでいただけたら幸いです。', version: 1 },
            ], direction: 'ltr' as const, format: '' as const, indent: 0, version: 1,
          },
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: '最後になりましたが、第', version: 1 },
              { type: 'text', text: `${OMORISAI_COUNT}回`, version: 1, format: 1 },
              { type: 'text', text: '大森祭を開催するにあたり、多大なるご尽力を賜りました', version: 1 },
              { type: 'text', text: '教職員の皆様', version: 1, format: 2 },
              { type: 'text', text: '、', version: 1 },
              { type: 'text', text: '梅屋敷交会協同組合並木隆明さま', version: 1, format: 2 },
              { type: 'text', text: 'をはじめとした地域の皆様、習志野キャンパス東邦祭実行委員の皆様にはこの場をお借りし改めて御礼申し上げます。', version: 1 },
            ], direction: 'ltr' as const, format: '' as const, indent: 0, version: 1,
          },
        ], direction: 'ltr' as const, format: '' as const, indent: 0, version: 1,
      },
    },
  },
] 