import uuidv4 from 'uuid/v4'
import axios from 'axios'

async function getImageList(volume) {
    const data = await axios.get(`https://iiifpres.bdrc.io/il/v:${volume}`)
    return data.data.map(({ filename }) => ({
        id: uuidv4(),
        filename,
        subtype: 'from-scan',
    }))
}

async function getManifest(volume) {
    // this returns an existing manifest, might return a 404
    return await axios.get(`https://iiifpres.bdrc.io/bvm/v:${volume}`)
}

export async function getOrInitManifest(volume, options) {
    var manifest
    var images
    try {
        manifest = await getManifest(volume)
    } catch (err) {
        if (err.response.status != 404) {
            throw err
        }
        images = await getImageList(volume)
        manifest = initManifestFromImageList(images, volume, options)
    }
    return { manifest, images }
}

function initManifestFromImageList(images, volume, options) {
    return {
        'for-volume': volume,
        'spec-version': '0.1.0',
        attribution: 'data produced by BVMT',
        'default-string-lang': options.uiLanguage,
        note: [],
        changelog: [],
        pagination: {
            folios1: {
                type: 'potifolios',
                name: 'original pagination',
            },
        },
        'pagination-default': 'folios1',
        'view-default': 'view1',
        view: {
            view1: {
                imagelist: images,
            },
        },
        volumeData: {
            // same here, language of the interface
            defaultLanguage: options.uiLanguage,
            // bo by default is fine here, next 3 properties
            // should be set in the volume info
            volumeLanguage: 'bo',
            'volname-margin': null,
            vollabel: [],
            changelog: [],
            // here it should be modifyable in the settings
            // TODO: top-to-bottom should be the default for volumes
            // where the typical page has width > heigth
            // it still needs to be modifying in the UI because some
            // Chinese books are right-to-left, others are left-to-right
            viewingDirection: 'top-to-bottom',
            inputOne: {
                paginationType: 'folios',
                inputForWholeMargin: true,
                sectionInputs: [],
                indicationOdd: '{volname}-{pagenum:bo}',
                indicationEven: '{volname}',
            },
            comments: '',
            bvmt_props: {
                hideDeletedImages: false,
            },
        },
    }
}
