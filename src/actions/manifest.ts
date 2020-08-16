import { Buda } from '../../types'

export function setManifest(manifest: any) {
    return {
        type: 'SET_MANIFEST',
        payload: { manifest },
    }
}

export function updateImageValue(idx: number, key: string, value: any) {
    return {
        type: 'UPDATE_IMAGE_VALUE',
        payload: { idx, key, value },
    }
}

export function updateImageSection(idx: number, key: string, value: any) {
    return {
        type: 'UPDATE_IMAGE_SECTION',
        payload: { idx, key, value },
    }
}

export function hideCardInManifest(idx: number, hide: Buda.Image['hide']) {
    return {
        type: 'HIDE_CARD_IN_MANIFEST',
        payload: { idx, hide },
    }
}

export function removeOfField(idx: number, ofField: string) {
    return {
        type: 'REMOVE_OF_FIELD',
        payload: { idx, ofField },
    }
}

export function toggleReview(idx: number) {
    return {
        type: 'TOGGLE_REVIEW',
        payload: { idx },
    }
}

export function addNote(idx: number, note: Buda.Text) {
    return {
        type: 'ADD_NOTE',
        payload: { idx, note },
    }
}

export function updateOfField(idx: number, val: { name: any }, key: any) {
    return {
        type: 'UPDATE_OF_FIELD',
        payload: { idx, val, key },
    }
}

export function insertMissing(i: number, direction: 'before' | 'after') {
    return {
        type: 'INSERT_MISSING',
        payload: { i, direction },
    }
}

export function toggleCollapseImage(idx: number) {
    return {
        type: 'TOGGLE_COLLAPSE_IMAGE',
        payload: { idx },
    }
}

export function setImageView(value: any) {
    return {
        type: 'SET_IMAGE_VIEW',
        payload: { value },
    }
}

export function addImageTag(idx: number, tags: readonly string[]) {
    return {
        type: 'ADD_IMAGE_TAG',
        payload: { tags, idx },
    }
}

export function removeNote(idx: number, noteIdx: number) {
    return {
        type: 'REMOVE_NOTE',
        payload: { noteIdx, idx },
    }
}

export function markPreviousAsReviewed(imageIdx: number) {
    return {
        type: 'MARK_PREVIOUS_AS_REVIEWED',
        payload: { imageIdx },
    }
}

export function updateUncheckedItems(image0: any, idx: number) {
    return {
        type: 'UPDATE_UNCHECKED_ITEMS',
        payload: { image0, idx },
    }
}

export function handlePaginationPredication(image: Buda.Image) {
    return {
        type: 'HANDLE_PAGINATION_PREDICTION',
        payload: { image },
    }
}


export function setUILanguage(language: any) {
    return {
        type: 'SET_UI_LANGUAGE',
        payload: language,
    }
}
