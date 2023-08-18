// Enter all required values for the DEFAULT_LANGUAGE here
// This will create the DEFAULT_LANGUAGE json file with the same key-value pairs
// You can then use these object properties instead of hard-coding the translation keys

const T_LANDING = {
  description: "The one-stop solution for your printing needs.",
  deliveredWithin: "Delivered within 2 working days.",
  showNow: "Shop Now",
  disclaimer: "Shipping fees & taxes may apply.",
}



/**
 * Appends 'groupName.' in front of all keys
 */
function generateTranslationKeyPaths(ptr, basePath) {
  for (const key in ptr) {
    const groupObj = ptr[key];

    if (groupObj !== null && typeof groupObj === "object") {
      // Nested object. Recursively create the key paths
      generateTranslationKeyPaths(groupObj, basePath + "." + key);
    } else {
      // It is a property. Replace the value with the key path
      ptr[key] = basePath + "." + key;
    }
  }
}

/**
 * Converts all values to their key path in translation.json.
 * e.g. GROUP.key = "value" => GROUP.key = "GROUP.key"
 *
 * Use this in index.js to initialize i18n functionality.
 *
 * Alternatively, this allows you to turn off i18n by simply removing this function call,
 * without having to remove all t(GROUP.key) calls, as GROUP.key now returns the text in default language.
 */
function initializeTranslationKeys() {
  for (const groupKey in toExport) {
    generateTranslationKeyPaths(toExport[groupKey], groupKey);
  }
}

const toExport = {
  initializeTranslationKeys,
  T_LANDING
};

module.exports = toExport;
