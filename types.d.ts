export namespace Buda {
    type Text = { '@value': string; '@language': string }
    export interface Manifest {
        isDefault?: boolean
        'for-volume': string
        'spec-version': string
        status: string
        'volume-label': Text[]
        rev: string
        attribution: Text[]
        note: Text[]
        'viewing-direction': string
        changes: {
            time: string
            user: string
            message: Text
        }[]
        pagination: {
            id: string
            type: string
            note: Text[]
        }[]

        sections: {
            id: 'intro'
            name: Text[]
        }[]

        'default-view': 'view1'
        view: {
            view1: {
                imagelist: {
                    id: string
                    filename: string
                    pagination?: {
                        pgfolios: Text
                    }
                    note?: Text[]
                    indication?: Text
                    tags?: string[]
                    display?: false
                    tags?: string[]
                    'duplicate-of'?: string
                }[]
            }
        }
        appData: {
            bvmt: {
                'metadata-for-bvmt-ver'?: string
                'default-vol-string-lang'?: string
                'show-checked-images'?: boolean
                'show-hidden-images'?: boolean
                'margin-indication-odd'?: string
                'margin-indication-even'?: string
                'default-ui-string-lang': string
            }
        }
    }
}
