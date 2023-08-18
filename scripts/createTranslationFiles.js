const { languages } = require("../src/constants/languages");
const {
  initializeTranslationKeys,
  ...tGroupsDefaultLanguage
} = require("../src/constants/translations");

const tGroupsOtherLanguages = JSON.parse(
  JSON.stringify(
    tGroupsDefaultLanguage,
    (key, val) => (typeof val === "string" ? null : val) // Convert all strings to null for non-default languages
  )
);

const fs = require("fs");

// Settings

/**
 * Schema in translations.js to be defined using this language.
 * The values in translation.js will always be set to those defined in translation.js,
 *
 * However, you may still toggle KEEP_UNRECOGNIZED keys to keep any additional keys not defined in the schema.
 */
const DEFAULT_LANGUAGE = "en";
/**
 * If true, unrecognized key-value pairs in all translation.json files will be kept.
 * Otherwise, they are discarded and will strictly follow the schema in translation.js.
 */
const KEEP_UNRECOGNIZED_KEYS = false;
/**
 * If true: Use any existing translation already in the JSON file. Otherwise, set the translated value to null.
 * NOTE: Not applicable to DEFAULT_LANGUAGE JSON file, which will strictly use values defined in translation.js.
 * NOTE: Only applicable to other languages (e.g. Set true if you want to keep existing translations).
 */
const KEEP_EXISTING_TRANSLATIONS = true;

/**
 * Creates the json object based on the schema provided in translations.js.
 *
 * @param {object} readJson Existing json object src translation.json.
 * @param {boolean} isDefaultLanguage True if the language is the DEFAULT_LANGUAGE.
 * @returns The json object to be written to translation.json.
 */
function createTranslationJson(readJson, isDefaultLanguage) {
  const finalJson = isDefaultLanguage
    ? JSON.parse(JSON.stringify(tGroupsDefaultLanguage))
    : JSON.parse(JSON.stringify(tGroupsOtherLanguages));

  if (KEEP_UNRECOGNIZED_KEYS) {
    keepUnrecognizedKeys(readJson, finalJson);
  }

  // Only copy existing translations for non-default languages if setting is set to true
  if (KEEP_EXISTING_TRANSLATIONS && !isDefaultLanguage) {
    keepExistingTranslations(readJson, finalJson);
  }

  return finalJson;
}

/**
 * Copies over key-value pairs present in srcPtr that are not in targetPtr.
 *
 * For this use case, it is used to preserve additional key-value pairs that have been added to translation.json
 * but not found in the schema in translation.js.
 *
 * @param {object} srcPtr Object whose values will be copied from.
 * @param {object} targetPtr Object to copy values to.
 */
function keepUnrecognizedKeys(srcPtr, targetPtr) {
  for (const srcKey in srcPtr) {
    const srcObj = srcPtr[srcKey];
    const targetObj = targetPtr[srcKey];

    if (targetObj === undefined) {
      // Key-value pair does not exist in target => Copy over value directly
      // NOTE: Empty objects are also copied over
      // Uncomment the following guard clause to prevent empty objects from being copied over

      // if (srcObj !== null && typeof srcObj === "object" && Object.keys(srcObj).length === 0) {
      //   continue;
      // }

      if (srcObj !== null && typeof srcObj === "object") {
        // Source value is an object => Create empty object and recursively copy in the nested object
        targetPtr[srcKey] = {};
        keepUnrecognizedKeys(srcObj, targetPtr[srcKey]);
      } else {
        // Value is a string => Copy value over
        targetPtr[srcKey] = srcObj;
      }
    } else if (
      targetObj !== null &&
      typeof targetObj === "object" &&
      srcObj !== null &&
      typeof srcObj === "object"
    ) {
      // Both values are objects => Recurse into them
      keepUnrecognizedKeys(srcObj, targetObj);
    }
  }
}

/**
 * For each key-value pair in srcPtr that is also present in targetPtr, overwrite the value in targetPtr.
 * NOTE: Only overwrites if the source and target values are either type string or null.
 *
 * For this use case, it is used to recursively copy over existing values in translation.json files
 * if the key is present in the schema provided in translations.js.
 *
 * @param {object} srcPtr Object whose values will be copied from.
 * @param {object} targetPtr Object to copy values to.
 */
function keepExistingTranslations(srcPtr, targetPtr) {
  if (srcPtr === undefined) {
    return;
  }

  for (const targetKey in targetPtr) {
    const srcObj = srcPtr[targetKey];
    const targetObj = targetPtr[targetKey];

    if (srcObj === undefined) {
      continue;
    }

    if (
      targetObj !== null &&
      typeof targetObj === "object" &&
      srcObj !== null &&
      typeof srcObj === "object"
    ) {
      // Both values are objects => Recursively overwrite nested objects
      keepExistingTranslations(srcObj, targetObj);
    } else if (
      (srcObj === null || typeof srcObj === "string") &&
      (targetObj === null || typeof targetObj === "string")
    ) {
      // Both values are type string or null => Copy over
      targetPtr[targetKey] = srcObj;
    }
  }
}

function createTranslationFile(lang) {
  const filePathDir = `public/locales/${lang}`;
  // Both refer to same file but the functions use different base paths
  const fileRead = `../${filePathDir}/translation.json`;
  const fileWrite = `${filePathDir}/translation.json`;

  let readJson = {};

  // Read existing translation.json file if it exists
  try {
    readJson = require(fileRead);
  } catch (err) {}

  const writeJson = createTranslationJson(readJson, lang === DEFAULT_LANGUAGE);

  // Create dir if it does not exist
  mkdirSync(filePathDir);

  fs.writeFileSync(
    fileWrite,
    JSON.stringify(
      writeJson,
      (key, val) => (val === undefined ? null : val), // Convert undefined to null since undefined values are auto discarded
      2
    ),
    "utf8",
    () => console.log("DONE")
  );
}

/**
 * Creates a directory if it does not exist.
 *
 * @param {string} dir Filepath of the directory.
 */
function mkdirSync(dir) {
  try {
    fs.mkdirSync(dir);
    console.log("Dir: " + dir + " does not exist. Creating now ...");
  } catch (err) {
    // Print the error if it is not due to dir already exists
    if (err.code !== "EEXIST") {
      console.log(err);
    }
  }
}

/**
 * Main code
 */
mkdirSync("public");
mkdirSync("public/locales");
for (const lang in languages) {
  console.log(lang);

  createTranslationFile(lang);
}

// Enter all required values for the DEFAULT_LANGUAGE (en) in constants/translations.js
// This will create the DEFAULT_LANGUAGE json file with the same key-value pairs
