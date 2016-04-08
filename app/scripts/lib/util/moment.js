import moment from "moment";
import "moment/locale/ja";

moment.locale(chrome.i18n.getUILanguage());

export default moment;
