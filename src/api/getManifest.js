import uuidv4 from 'uuid/v4'
import axios from 'axios'

var apiroot = 'https://iiifpres-dev.bdrc.io';

async function getImageList(volumeQname) {
    const data = await axios.get(`${apiroot}/il/v:${volumeQname}`);
    return data.data.map(({ filename }) => ({
        id: uuidv4(),
        filename,
    }))
}

async function getManifest(volumeQname) {
    // this returns an existing manifest, might return a 404
    const { data } = await axios.get(`${apiroot}/bvm/ig:${volumeQname}`);
    return data
}

export async function getOrInitManifest(volumeQname, options) {
    var manifest;

    try {
        manifest = await getManifest(volumeQname)
    } catch (err) {
        console.log('err!', err);
        console.log('err.response.status', err.response.status);
        if (err.response.status !== 404) {
            throw err
        }
        const images = await getImageList(volumeQname);
        manifest = initManifestFromImageList(images, volumeQname, options)
    }
    return { manifest }
}

function initManifestFromImageList(images, volumeQname, options) {
    return {
        'for-volume': volumeQname,
        'volume-label': [], // an option
        'spec-version': '0.1.0',
        rev: null,
        'viewing-direction': 'top-to-bottom',
        status: 'editing',
        note: [],
        changes: [],
        attribution: [], // the attribution of the data in the manifest, if the user wants to be credited
        // a reasonable default
        pagination: [
            {
                id: 'pgfolios',
                type: 'folios'
            }
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
                'default-vol-string-lang': 'bo', // reasonable default for now, should be an option
                'margin-indication-even': '{pagenum:bo}', // an option
                'margin-volname': '', // an option too
                'margin-indication-odd': '',
                'preview-image-view': {
                    zoom: 0,
                    center: { x: null, y: null },
                    rotation: 0,
                },
            },
        },
    }
}
