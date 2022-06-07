import * as moment from 'moment';
import 'moment/locale/ja';

moment.locale('ja');
moment.updateLocale('ja', {
  longDateFormat : {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'MM/DD(dd)',
    LL: 'YYYY/MM',
    LLL: 'YYYY',
    LLLL: 'YYYY年M月D日 dddd HH:mm',
    l: 'YYYY-MM-DD',
    ll: 'YYYY-MM',
    lll: 'YYYY',
    llll: 'YYYY年MM月DD日 HH時mm分'
  }
});
export {moment}
