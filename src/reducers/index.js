import { mergeRight } from 'ramda'

export default (
    state = {
        isDefault: true,
        volumeData: {
            defaultLanguage: 'en',
        },
        appData: {
            bvmt: {
                'default-ui-string-lang': 'en',
            },
        },
    },
    action
) => {
    switch (action.type) {
        case 'SET_MANIFEST':
            return action.payload.manifest
        default:
            return state
    }
}
