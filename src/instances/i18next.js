// import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { default as i18n } from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

/*  HOW TO USE IN COMPONENTS:
      1. Add a translation here in the wanted language json
         name:"שם"
      2. In the component to want to translate something, add the useTranslation hook
         import {useTranslation} from 'react-i18next'
      3. Create a const to handle the translation
         const {t} = useTranslation();
      4. Send the name of the translation
         t("name");

    Example for interpolating value in translation:
    "Name": {"1":"שלום, {{username}}"}
*/
const Languages = ["he", "en"];

const resources = {
  he: {
    translation: {
      login_header: "שלום:)",
      user: "כינוי",
      hello_user: "שלום ",
      left_the_conversation: " עזב/ה ",
      joined_the_conversation: " הצטרפ/ה ",
      you: "את/ה",
    },
  },
  en: {
    translation: {
      login_header: "Hello ;)",
      user: "Nickname",
      hello_user: "Hello ",
      joined_the_conversation: " joined ",
      left_the_conversation: " left ",
      you: "you",
    },
  },
};

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: "he",
    debug: true,
    whitelist: Languages,
    resources,
    lng: "he",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
