import {lensPath, set} from 'ramda'

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
            return action.payload.manifest;
        case 'SET_UI_LANGUAGE':
            return set(
                lensPath(['appData', 'bvmt', 'default-ui-string-lang']),
                action.payload,
                state
            );
        default:
            return state
    }
}
