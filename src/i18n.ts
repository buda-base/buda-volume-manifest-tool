import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import getTranslations from './translations'

const translations = getTranslations()

const resources = {
    en: {
        // @ts-ignore
        translation: translations.en,
    },
    bo: {
        // @ts-ignore
        translation: translations.bo,
    },
}

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: 'en',
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    })

export default i18n
