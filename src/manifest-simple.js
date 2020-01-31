import uuidv4 from 'uuid/v4'

const data = {
    'for-volume': 'bdr:V4CZ5369_I1KG9128',
    'spec-version': '0.1.0',
    rev: '860f508e-608e-484d-9fc3-62392fab0b12',
    attribution: 'data contributed by rKTs',
    'default-string-lang': 'en',
    note: 'not sure about the order of page 2',
    'changes-history': [
        {
            timestamp: 1568463794,
            user: 'bdr:U0002',
            log: 'initial version',
        },
    ],
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
            imagelist: [
                {
                    id: 1,
                    subtype: 'cover',
                    filename: 'I1KG91280001.tif',
                    chips: [{ id: 2, text: 'Cover Page' }],
                },
                {
                    id: 2,
                    subtype: 'blank',
                    filename: 'I1KG91280002.tif',
                    pagination: '1a',
                    chips: [{ id: 1, text: 'Title Page' }],
                },
                {
                    id: 3,
                    subtype: 'title',
                    thumbnail: true,
                    filename: 'I1KG91280003.jpg',
                    pagination: '1b',
                },
                {
                    id: 4,
                    filename: 'I1KG91280005.jpg',
                    pagination: "1'a",
                    rotation: 180,
                    'rotation-reason': 'scan',
                    note: [
                        'rotating 180° because of the scan being upside down',
                    ],
                },
                {
                    id: 5,
                    type: 'missing',
                    subtype: 'from-scan',
                    pagination: "1'b",
                },
                {
                    id: 6,
                    type: 'duplicate',
                    filename: 'I1KG91280006.jpg',
                    subtype: 'from-scan',
                    display: false,
                    'of-file': 'I1KG9128004.tif',
                },
            ],
        },
    },
    volumeData: {
        volume: 'bdr:V22084_I0888',
        defaultLanguage: 'en',
        volumeLanguage: 'tibetan',
        showCheckedImages: true,
        showHiddenImages: true,
        viewingDirection: 'left-to-right',
        inputOne: {
            paginationType: 'folios',
            inputForWholeMargin: true,
            sectionInputs: [
                { value: 'Section 1a', language: 'bo', id: uuidv4() },
                { value: 'Section 2a', language: 'bo', id: uuidv4() },
            ],
            indicationOdd: '{volname}-{sectionname}-{pagenum:bo}',
            indicationEven: '{volname}',
        },
        comments: '',
    },
}

export default data
