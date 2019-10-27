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
                    subtype: 'cover',
                    filename: 'I1KG9128001.tif',
                },
                {
                    subtype: 'blank',
                    filename: 'I1KG9128002.tif',
                    pagination: '1a',
                },
                {
                    subtype: 'title',
                    thumbnail: true,
                    filename: 'I1KG9128003.tif',
                    pagination: '1b',
                },
                {
                    filename: 'I1KG9128004.tif',
                    pagination: "1'a",
                    rotation: 180,
                    'rotation-reason': 'scan',
                    note: [
                        'rotating 180° because of the scan being upside down',
                    ],
                },
                {
                    type: 'missing',
                    subtype: 'from-scan',
                    pagination: "1'b",
                },
                {
                    type: 'duplicate',
                    filename: 'I1KG9128005.tif',
                    subtype: 'from-scan',
                    display: false,
                    'of-file': 'I1KG9128004.tif',
                },
            ],
        },
    },
}

export default data
