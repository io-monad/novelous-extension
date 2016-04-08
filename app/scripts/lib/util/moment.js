import moment from "moment-timezone";
import "moment/locale/ja";

moment.locale(chrome.i18n.getUILanguage());

export default moment;
