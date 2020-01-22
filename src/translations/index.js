import {compose, fromPairs, map, reduce, toPairs} from 'ramda'
import React from 'react'

export default () => {
    const LANGUAGES = ['en', 'bo']
    const translations = {
        Volume: {
            bo: 'བོའའའའདད།',
            en: 'Volume:',
        },
        Preview: {
            bo: 'བོའའའའདད།',
            en: 'Preview',
        },
        SAVE: {
            bo: 'བོའའའའདད།',
            en: 'SAVE',
        },
        'Show Checked Images': {
            bo: 'བོའའའའདད།',
            en: 'Show Checked Images',
        },
        'Show Hidden Images': {
            bo: 'བོའའའའདད།',
            en: 'Show Hidden Images',
        },
        Edit: {
            bo: 'བོའའའའདད།',
            en: 'Edit',
        },
        'Volume Language': {
            bo: 'བོའའའའདད།',
            en: 'Volume Language',
        },
        'Input 1': {
            bo: 'བོའའའའདད།',
            en: 'Input 1',
        },
        'Pagination Type': {
            bo: 'བོའའའའདད།',
            en: 'Pagination Type',
        },
        Folio: {
            bo: 'བོའའའའདད།',
            en: 'Folio',
        },
        'Folio With Sections': {
            bo: 'བོའའའའདད།',
            en: 'Folio With Sections',
        },
        'Normal Pagination': {
            bo: 'བོའའའའདད།',
            en: 'Normal Pagination',
        },
        'add input for whole margin': {
            bo: 'བོའའའའདད།',
            en: 'add input for whole margin',
        },
        'Viewing Direction': {
            bo: 'བོའའའའདད།',
            en: 'Viewing Direction',
        },
        'top to bottom': {
            bo: 'བོའའའའདད།',
            en: 'top to bottom',
        },
        'left to right': {
            bo: 'བོའའའའདད།',
            en: 'left to right',
        },
        'right to left': {
            bo: 'བོའའའའདད།',
            en: 'right to left',
        },
        'bottom to top': {
            bo: 'བོའའའའདད།',
            en: 'bottom to top',
        },
        continuous: {
            bo: 'བོའའའའདད།',
            en: 'continuous (for scrolls and leporellos)',
        },
        'Indication (odd)': {
            bo: 'བོའའའའདད།',
            en: 'Indication (odd)',
        },
        'Indication (even)': {
            bo: 'བོའའའའདད།',
            en: 'Indication (even)',
        },
        Comments: {
            bo: 'བོའའའའདད།',
            en: 'Comments',
        },
        Section: {
            bo: 'བོའའའའདད།',
            en: 'Section',
        },
        Language: {
            bo: 'བོའའའའདད།',
            en: 'Language',
        },
        'Section name must not be empty!': {
            bo: 'བོའའའའདད།',
            en: 'Section name must not be empty!',
        },
        'alert before count': {
            bo: 'བོའའའའདད།',
            en: 'This section is set to',
        },
        'alert after count': {
            bo: 'བོའའའའདད།',
            en: 'images. Unselect these to remove the section',
        },
        OK: {
            bo: 'བོའའའའདད།',
            en: 'OK',
        },
    }

    const initialReduceVal = fromPairs(LANGUAGES.map(lang => [lang, []]))
    return compose(
        map(fromPairs),
        reduce((acc, val) => {
            const [key, value] = val
            LANGUAGES.forEach(lang => {
                return acc[lang].push([key, value[lang]])
            })
            return acc
        }, initialReduceVal),
        toPairs
    )(translations)
}
