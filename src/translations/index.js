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
        'Edit-image': {
            bo: 'བོའའའའདད།',
            en: 'Edit',
        },
        'Thumbnail for Volume': {
            bo: 'བོའའའའདད།',
            en: 'Thumbnail for Volume',
        },
        'Special Label': {
            bo: 'བོའའའའདད།',
            en: 'Special Label',
        },
        'Belongs to vol': {
            bo: 'བོའའའའདད།',
            en: 'Belongs to vol:',
        },
        'Volume Id': {
            bo: 'བོའའའའདད།',
            en: 'Volume Id',
        },
        'Page Side': {
            bo: 'བོའའའའདད།',
            en: 'Page Side',
        },
        left: {
            bo: 'བོའའའའདད།',
            en: 'left',
        },
        right: {
            bo: 'བོའའའའདད།',
            en: 'right',
        },
        recto: {
            bo: 'བོའའའའདད།',
            en: 'recto',
        },
        verso: {
            bo: 'བོའའའའདད།',
            en: 'verso',
        },
        Tags: {
            bo: 'བོའའའའདད།',
            en: 'Tags:',
        },
        Notes: {
            bo: 'བོའའའའདད།',
            en: 'Notes:',
        },
        'Set Preview': {
            bo: 'བོའའའའདད།',
            en: 'Set Preview',
        },
        Missing: {
            bo: 'བོའའའའདད།',
            en: 'Missing',
        },
        Duplicate: {
            bo: 'བོའའའའདད།',
            en: 'Duplicate',
        },
        Type: {
            bo: 'བོའའའའདད།',
            en: 'Type',
        },
        'of File': {
            bo: 'བོའའའའདད།',
            en: 'of File',
        },
        'Duplicate in Original': {
            bo: 'བོའའའའདད།',
            en: 'Duplicate in Original',
        },
        'Different Picture of Same Page': {
            bo: 'བོའའའའདད།',
            en: 'Different Picture of Same Page',
        },
        'Same Picture of Same Page': {
            bo: 'བོའའའའདད།',
            en: 'Same Picture of Same Page',
        },
        'Margin Indication': {
            bo: 'བོའའའའདད།',
            en: 'Margin Indication',
        },
        'Choose Section': {
            bo: 'བོའའའའདད།',
            en: 'Choose Section',
        },
        Pagination: {
            bo: 'བོའའའའདད།',
            en: 'Choose Section',
        },
        'Insert One Above': {
            bo: 'བོའའའའདད།',
            en: 'Insert One Above',
        },
        'Insert One Below': {
            bo: 'བོའའའའདད།',
            en: 'Insert One Below',
        },
        Unhide: {
            bo: 'བོའའའའདད།',
            en: 'Unhide',
        },
        Hide: {
            bo: 'བོའའའའདད།',
            en: 'Hide',
        },
        'Update following unchecked items': {
            bo: 'བོའའའའདད།',
            en: 'Update following unchecked items',
        },
        'Reorder this image according to indicated pagination': {
            bo: 'བོའའའའདད།',
            en: 'Reorder this image according to indicated pagination',
        },
        'Mark all images down to this one as checked': {
            bo: 'བོའའའའདད།',
            en: 'Mark all images down to this one as checked',
        },
        'cover page': {
            bo: 'བོའའའའདད།',
            en: 'cover page',
        },
        'cover page (inside)': {
            bo: 'བོའའའའདད།',
            en: 'cover page (inside)',
        },
        'back cover': {
            bo: 'བོའའའའདད།',
            en: 'back cover',
        },
        'back cover (inside)': {
            bo: 'བོའའའའདད།',
            en: 'back cover (inside)',
        },
        'catalog card (not part of the original, added for cataloging)': {
            bo: 'བོའའའའདད།',
            en: 'catalog card (not part of the original, added for cataloging)',
        },
        'bdrc scan request page': {
            bo: 'བོའའའའདད།',
            en: 'bdrc scan request page',
        },
        'picture of book side': {
            bo: 'བོའའའའདད།',
            en: 'picture of book side',
        },
        'picture of edge': {
            bo: 'བོའའའའདད།',
            en: 'picture of edge',
        },
        'picture of close volume': {
            bo: 'བོའའའའདད།',
            en: 'picture of close volume',
        },
        'picture of wrapped volume': {
            bo: 'བོའའའའདད།',
            en: 'picture of wrapped volume',
        },
        'picture of wrapping cloth': {
            bo: 'བོའའའའདད།',
            en: 'picture of wrapping cloth',
        },
        'volume title page': {
            bo: 'བོའའའའདད།',
            en: 'volume title page',
        },
        'text title page': {
            bo: 'བོའའའའདད།',
            en: 'text title page',
        },
        'blank page': {
            bo: 'བོའའའའདད།',
            en: 'blank page',
        },
        'illustration page': {
            bo: 'བོའའའའདད།',
            en: 'illustration page',
        },
        'color cards / rules': {
            bo: 'བོའའའའདད།',
            en: 'color cards / rules',
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
