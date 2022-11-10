  import {
    addIndex,
    always,
    append,
    assoc,
    compose,
    curry,
    dec,
    dissoc,
    findIndex,
    inc,
    insert,
    intersection,
    lensPath,
    map,
    prop,
    propEq,
    propOr,
    reduce,
    reject,
    remove,
    set,
    view,
    when,
} from 'ramda'
import { Buda } from '../../../types'
import uuidv4 from 'uuid/v4'
import getPagination from '../../utils/pagination-prediction'
import { getComparator } from '../../utils/pagination-comparators'

const mapIndex = addIndex(map)

const imageListLens = lensPath(['view', 'view1', 'imagelist'])
const getImageList = (manifest: any) => {
    return (view(imageListLens, manifest) as Buda.Image[]) || []
}

const getPaginationFromManifest = (manifest: Buda.Manifest, pagination_id: string) => {
  for (const pagination of manifest.pagination) {
    if (pagination.id == pagination_id)
      return pagination
  }
  return null
}

export default (
    manifest: Buda.Manifest = {
        'default-view': 'view1',
        'imggroup': '',
        'spec-version': '',
        'viewing-direction': '',
        'volume-label': [],
        attribution: [],
        changes: [],
        note: [],
        pagination: [],
        rev: '',
        status: '',
        view: { view1: { imagelist: [] } },
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
    action: {
        type: any
        payload: {
            image0: any
            idx: number
            note?: Buda.Image['note']
            ofField?: string
            value?: any
            key?: any
            imageId?: any
            manifest?: any
            hide?: Buda.Image['hide']
            e?: any
            i?: number
            val?: { name: any }
            direction?: 'before' | 'after'
            tags?: readonly string[]
            tag?: string
            noteIdx?: number
            imageIdx?: number
            image?: any
        }
    },
) => {

    const updateImage = (idx: number, fn: (image: any) => any) => {
        const imageList = getImageList(manifest)
        const image = imageList[idx]
        imageList[idx] = fn(image)
        return set(imageListLens, imageList, manifest)
    }
    switch (action.type) {
        case 'SET_MANIFEST':
            return action.payload.manifest
        case 'SET_UI_LANGUAGE':
            return set(
                lensPath(['appData', 'bvmt', 'default-ui-string-lang']),
                action.payload.value,
                manifest,
            )
        case 'UPDATE_IMAGE_VALUE':
            return updateImage(action.payload.idx, (image: Buda.Image) =>
                assoc(
                    action.payload.key,
                    action.payload.value,
                    image,
                ),
            )
        case 'HIDE_CARD_IN_MANIFEST': {
            return updateImage(action.payload.idx, (image: Buda.Image) =>
                compose(
                    assoc('collapsed', action.payload.hide),
                    assoc('hide', action.payload.hide),
                )(image),
            )
        }

        case 'REMOVE_OF_FIELD':
            return updateImage(action.payload.idx, (image: Buda.Image) =>
                dissoc(action.payload.ofField as keyof Buda.Image, image),
            )

        case 'ADD_NOTE':
            return updateImage(action.payload.idx, (image: Buda.Image) => {
                    const updatedNotes = append(
                        action.payload.note,
                        propOr([], 'note', image),
                    )
                    return assoc('note', updatedNotes, image)

                },
            )

        case 'UPDATE_IMAGE_SECTION':
            return updateImage(action.payload.idx, (image: Buda.Image) => {
                    const sectionLens = lensPath([
                        'pagination',
                        manifest.pagination[0].id,
                        action.payload.key,
                    ])
                    return set(sectionLens, action.payload.value, image)
                },
            )


        case 'TOGGLE_REVIEW':
            return updateImage(action.payload.idx, (image: Buda.Image) => {
                    const reviewed = prop('reviewed', image)
                    return compose(
                        image =>
                            !reviewed ? assoc('collapsed', true, image) : image,
                        assoc('reviewed', !reviewed),
                    )(image)
                },
            )

        case 'UPDATE_OF_FIELD':
            return updateImage(action.payload.idx, (image: Buda.Image) =>
                assoc(
                    action.payload.key,
                    action.payload.val?.name,
                    image,
                ),
            )
        case 'INSERT_MISSING':
            const defaultMissingImage = {
                id: uuidv4(),
                type: 'missing',
            } as Buda.Image
            var updateImageList9
            if (action.payload.direction === 'before') {
                updateImageList9 = insert(
                    action.payload.i as number,
                    defaultMissingImage,
                    getImageList(manifest),
                )
            } else if (action.payload.direction === 'after') {
                updateImageList9 = insert(
                    (action.payload.i as number) + 1,
                    defaultMissingImage,
                    getImageList(manifest),
                )
            }
            return set(imageListLens, updateImageList9, manifest)

        case 'TOGGLE_COLLAPSE_IMAGE':
            return updateImage(action.payload.idx, (image: Buda.Image) => {
                    const hidden = !!prop('collapsed', image)
                    return assoc('collapsed', !hidden, image)

                },
            )


        case 'SET_IMAGE_VIEW':
            return set(
                lensPath(['appData', 'bvmt', 'preview-image-view']),
                action.payload.value,
                manifest,
            )
        case 'ADD_IMAGE_TAG':
            return updateImage(action.payload.idx, (image: Buda.Image) => {
                    const duplicateTags = ['T0018', 'T0017']
                    const detailTags = ['T0016']
                    const currentTags = propOr(
                        [],
                        'tags',
                        image,
                    ) as readonly string[]
                    const prevTagsHaveDuplicates =
                        intersection(currentTags, duplicateTags).length > 0
                    const prevTagsHaveDetail =
                        intersection(currentTags, detailTags).length > 0

                    const newTagsHaveDuplicates =
                        intersection(action.payload.tags as string[], duplicateTags)
                            .length > 0

                    const newTagsHaveDetail =
                        intersection(action.payload.tags as string[], detailTags).length > 0

                    const removeDuplicateOf =
                        prevTagsHaveDuplicates && !newTagsHaveDuplicates
                    const removeDetailOf =
                        prevTagsHaveDetail && !newTagsHaveDetail

                    if (removeDuplicateOf)
                      image['duplicate-of'] = undefined

                    if (removeDetailOf)
                      image['detail-of'] = undefined

                    image.tags = action.payload.tags as string[]
                    return image
                },
            )

        case 'REMOVE_NOTE':
            return updateImage(action.payload.idx, (image: Buda.Image) => {
                    const updatedNotes = remove(
                        action.payload.noteIdx as number,
                        1,
                        'note' in image && image['note'] ? image['note'] : []
                    )
                    return assoc('note', updatedNotes, image)
                },
            )

        case 'MARK_PREVIOUS_AS_REVIEWED':
            const updateImageList14 = mapIndex((image, idx) => {
                if (idx <= (action.payload.imageIdx as number)) {
                    return assoc('reviewed', true, image)
                } else {
                    return image
                }
            }, getImageList(manifest))
            return set(imageListLens, updateImageList14, manifest)

        case 'UPDATE_UNCHECKED_ITEMS':
            const getMargin = getPagination(manifest, action.payload.image0)
            // TODO: in the future it may depend on more elaborated checks:
            const pagination_id = manifest.pagination[0].id
            const imageList = getImageList(manifest)
            const updateImageList15 = imageList.map(
                (image: Buda.Image, i: number) => {
                    const diff = i - action.payload.idx
                    // TODO: here we shouldn't change anything after the first reviewed image,
                    // even if some images are not reviewed
                    if (diff > 0 && !image.reviewed && getMargin) {
                        const margin = getMargin(diff)
                        if (!margin)
                          return image
                        const newimg = { ...image, 'indication':  margin[1] }
                        if (!newimg.pagination) {
                            newimg.pagination = {}
                        }
                        // TODO: check
                        if (margin[0])
                          newimg.pagination.pgfolios = margin[0] as Buda.Text
                        return newimg
                    } else {
                        return image
                    }
                }
            )
            return set(imageListLens, updateImageList15, manifest)
        case 'HANDLE_PAGINATION_PREDICTION':
            const imageList2 = getImageList(manifest)

            const rearrangeImage = (imageId: string, idx: number) => {
                const { image, images } = reduce(
                    (acc: {image: Buda.Image | null, images: Buda.Image[]}, val: Buda.Image) => {
                        if (val.id === imageId) {
                            acc.image = val
                        }
                        acc.images.push(val)
                        return acc
                    },
                    {
                        image: null,
                        images: [],
                    },
                    imageList2
                )
                const tmpList = insert(idx+1, image, images)
                // TODO: check
                const updatedImageList = tmpList.filter( (img: Buda.Image | null, i: number) => {
                  return img && (imageId != img.id || i == idx+1)
                }) as Buda.Image[]
                return updatedImageList
            }

            const cmp = curry(getComparator)(manifest)
            // TODO: the comparator is currently for the whole manifest, it might be
            // relevant to have it just for the specific image
            const idx = findIndex(
                img => cmp(action.payload.image.pagination, img.pagination) < 0,
                imageList2,
            )
            if (idx !== -1) {
                return set(
                    imageListLens,
                    rearrangeImage(action.payload.image.id, dec(idx)),
                    manifest,
                )
            } else {
                return manifest
            }
        default:
            return manifest
    }
}
