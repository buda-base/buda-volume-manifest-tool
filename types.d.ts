declare module 'history'

export namespace Buda {
    type Text = { '@value': string; '@language': string }

    type LangToText = Record<string,string>

    interface Tag {
      helpMessage: LangToText
      id: string
      label: LangToText
      ofField?: string
    }

    interface Image {
        id: string
        filename: string
        // TODO: this should be an object with the different pagination types
        pagination?: {
            pgfolios?: Text
        }
        note?: Text[]
        indication?: Text
        tags?: string[]
        display?: false
        'duplicate-of'?: string
        'detail-of'?: string
        sectionId?: string
        reviewed?: boolean
        type?: string
        collapsed?: boolean
        hide?: boolean
        thumbnailForVolume?: boolean
        specialLabel: Text
        belongsToVolume?: boolean
    }

    interface Manifest {
        isDefault?: boolean
        volumeData?: {
            defaultLanguage: string
        }
        'imggroup': string
        'spec-version': string
        status: string
        'volume-label': Text[]
        rev: string | null
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
            note?: Text[]
        }[]

        sections?: {
            id: 'intro'
            name: Text[]
        }[]

        'default-view': 'view1'
        view: {
            view1: {
                imagelist: Image[]
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
                'margin-volname'?: string
                'preview-image-view'?: {
                    zoom: number
                    center: { x?: null | number; y?: null | number }
                    rotation: number
                }
            }
        }
    }
}
