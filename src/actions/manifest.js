export function setManifest(manifest) {
    return {
        type: 'SET_MANIFEST',
        payload: { manifest },
    }
}

export function setUILanguage(language) {
    return {
        type: 'SET_UI_LANGUAGE',
        payload: language,
    }
}
