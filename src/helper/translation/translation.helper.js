const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');

const { log } = require("../../services/logger");
const LANGUAGE_SCRIPT = require("../../helper/translation/translation.const");
const TransliterationKey = process.env.TRANSLITRATIONS_KEY;
const TransliterationURL= process.env.TRANSLITRATIONS_URL;
const TransliterationLocation= process.env.TRANSLITRATIONS_LOCATION;
const TRANSLITRATIONS_API_VERSAION= process.env.TRANSLITRATIONS_API_VERSAION;

const translateText = async (text, targetLanguage ) => {
    try {
        return await axios({
            baseURL: TransliterationURL,
            url: '/translate',
            method: 'post',
            headers: {
                'Ocp-Apim-Subscription-Key': TransliterationKey,
                'Ocp-Apim-Subscription-Region': TransliterationLocation,
                'Content-type': 'application/json',
                'X-ClientTraceId': uuidv4().toString()
            },
            params: {
                'api-version': TRANSLITRATIONS_API_VERSAION,
                'to': targetLanguage,
                'toScript': LANGUAGE_SCRIPT[targetLanguage].script
            },
            data: [{
                text
            }],
            responseType: 'json'
        })
    } catch (err) {
        throw err;
    }
};

/** Translate text into user target language  */
const getTranslate = async (userText, targetLanguage) => {
    try {
        log.trace("translationHelper : getTranslate invoked....");
        log.info("user query", userText);
        const translatedObj = await translateText(userText, targetLanguage);
        return {
            userQuery: translatedObj.data[0].translations[0].text,
            detectedLanguage: translatedObj.data[0].detectedLanguage.language,
        };
    } catch (err) {
        log.error('Error while query translation',err);
        throw err
    }
};

/** Give Transliteration of text  for ex : user says 'કેમ છો' the function give response 'kem chho'  ""*/
const getTransliteration = async  (text, language) => {
    try{
       const response = await axios({
            baseURL: TransliterationURL,
            url: '/transliterate',
            method: 'post',
            headers: {
                'Ocp-Apim-Subscription-Key': TransliterationKey,
                'Ocp-Apim-Subscription-Region': TransliterationLocation,
                'Content-type': 'application/json',
                'X-ClientTraceId': "604d2c62-b13a-4a4c-aee4-3ee8b6944c0e"
            },
            params: {
                'api-version': TRANSLITRATIONS_API_VERSAION,
                language: language,
                fromScript: LANGUAGE_SCRIPT[language].script,
                toScript:'Latn'
            },
            data: [{
                text,
            }],
            responseType: 'json'
        });
        return response.data[0].text;
    } catch (e) {
        log.error('Error while query Transliteration', e);
        throw error;
    }
};

module.exports = {
    getTranslate,
    getTransliteration
};
