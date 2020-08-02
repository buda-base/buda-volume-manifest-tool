import { Buda } from '../../types'

export function setManifest(manifest: any) {
    return {
        type: 'SET_MANIFEST',
        payload: { manifest },
    }
}

export function updateImageValue(imageId: string, key: string, value: any) {
    return {
        type: 'UPDATE_IMAGE_VALUE',
        payload: { imageId, key, value },
    }
}

export function updateImageSection(imageId: string, key: string, value: any) {
    return {
        type: 'UPDATE_IMAGE_SECTION',
        payload: { imageId, key, value },
    }
}

export function hideCardInManifest(imageId: string, hide: Buda.Image['hide']) {
    return {
        type: 'HIDE_CARD_IN_MANIFEST',
        payload: { imageId, hide },
    }
}

export function removeOfField(imageId: string, ofField: string) {
    return {
        type: 'REMOVE_OF_FIELD',
        payload: { imageId, ofField },
    }
}

export function toggleReview(imageId: string) {
    return {
        type: 'TOGGLE_REVIEW',
        payload: { imageId },
    }
}

export function addNote(imageId: string, note: Buda.Text) {
    return {
        type: 'ADD_NOTE',
        payload: { imageId, note },
    }
}

export function updateOfField(imageId: string, val: { name: any }, key: any) {
    return {
        type: 'UPDATE_OF_FIELD',
        payload: { imageId, val, key },
    }
}
export function insertMissing(i: number, direction: 'before' | 'after') {
    return {
        type: 'INSERT_MISSING',
        payload: { i, direction },
    }
}
export function toggleCollapseImage(imageId: string) {
    return {
        type: 'TOGGLE_COLLAPSE_IMAGE',
        payload: { imageId },
    }
}
export function setImageView(value: any) {
    return {
        type: 'SET_IMAGE_VIEW',
        payload: { value },
    }
}

export function addImageTag(imageId: string, tags: readonly string[]) {
    return {
        type: 'ADD_IMAGE_TAG',
        payload: { tags, imageId },
    }
}
export function removeNote(imageId: string, noteIdx: number) {
    return {
        type: 'REMOVE_NOTE',
        payload: { noteIdx, imageId },
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
// export function removeImageTag(imageId: string, tag: string) {
//     return {
//         type: 'REMOVE_IMAGE_TAG',
//         payload: { tag, imageId },
//     }
// }

// export function selectType(imageId: string, e: any, i: number) {
//     return {
//         type: 'REMOVE_OF_FIELD',
//         payload: { imageId, e, i },
//     }
// }

export function setUILanguage(language: any) {
    return {
        type: 'SET_UI_LANGUAGE',
        payload: language,
    }
}
