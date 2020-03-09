import uuidv4 from 'uuid/v4'
import axios from 'axios'

var apiroot = 'https://iiifpres.bdrc.io'

async function getImageList(volumeQname) {
    const data = await axios.get(`${apiroot}/il/v:${volumeQname}`)
    return data.data.map(({ filename }) => ({
        id: uuidv4(),
        filename,
    }))
}

async function getManifest(volumeQname) {
    // this returns an existing manifest, might return a 404
    return await axios.get(`${apiroot}/bvm/ig:${volumeQname}`)
}

export async function getOrInitManifest(volumeQname, options) {
    var manifest
    var images
    try {
        manifest = await getManifest(volumeQname)
    } catch (err) {
        console.log('err!', err)
        console.log('err.response.status', err.response.status)
        if (err.response.status != 404) {
            throw err
        }
        images = await getImageList(volumeQname)
        manifest = initManifestFromImageList(images, volumeQname, options)
    }
    return { manifest, images }
}

function initManifestFromImageList(images, volumeQname, options) {
    return {
        'for-volume': volumeQname,
        label: [], // an option
        'spec-version': '0.1.0',
        rev: null,
        'viewing-direction': 'top-to-bottom',
        status: 'editing',
        note: [],
        changelog: [],
        attribution: [], // the attribution of the data in the manifest, if the user wants to be credited
        // a reasonable default
        pagination: [
            {
                id: 'pgfolios',
                type: 'folios',
                note: [
                    {
                        '@value': 'from the original blockprint',
                        '@language': 'en',
                    },
                ],
            },
        ],
        'default-view': 'view1',
        view: {
            view1: {
                imagelist: images,
            },
        },
        appData: {
            bvmt: {
                'metadata-for-bvmt-ver': '0.1.0', // TODO: ajust if necessary
                'default-ui-string-lang': options.uiLanguage,
                'default-vol-string-lang': 'en', // reasonable default for now, should be an option
                'margin-indication-odd': '{volname}-{sectionname}-{pagenum:bo}', // an option
                'margin-volname': '', // an option too
                'margin-indication-even': '',
            },
        },
    }
}
