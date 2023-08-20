const Languages = {
  en: {
    nativeName: "English",
    flag: "GB"
  },
  fr: {
    nativeName: "français",
    flag: "FR"
  },
  zh: {
    nativeName: "中文",
    flag: "CN"
  }
};

/**
 * Unsupported languages do not show up in the website's language selector.
 * However, they can be selected in the CustomTooltip so users can contribute to them.
 */
const UnsupportedLanguages = {
  ar: {
    nativeName: "عربي"
  },
  de: {
    nativeName: "Deutsch"
  },
  es: {
    nativeName: "español"
  }
};

const DEFAULT_LANGUAGE = "en";

module.exports = { Languages, UnsupportedLanguages, DEFAULT_LANGUAGE };
