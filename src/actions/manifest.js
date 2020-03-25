export function setManifest(manifest) {
    return {
        type: 'SET_MANIFEST',
        payload: { manifest },
    }
}
