import {compose, fromPairs, map, reduce, toPairs} from 'ramda'

export default () => {
    const LANGUAGES = ['en', 'bo']
    const translations = {
        'Volume': {
            bo: 'བོའའའའདད།',
            en: 'Volume:',
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
