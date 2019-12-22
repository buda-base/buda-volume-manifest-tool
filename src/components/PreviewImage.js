import React from 'react'
import OpenSeaDragon from 'openseadragon'

export default class PreviewImage extends React.Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        var viewer = OpenSeaDragon({
            id: `openseadragon${this.props.i}`,
            tileSources: [
                {
                    '@context': 'http://iiif.io/api/image/2/context.json',
                    '@id':
                        'https://iiif.bdrc.io/bdr:V22084_I0916::09160001.tif',
                    width: 878,
                    height: 1138,
                    tiles: [
                        {
                            width: 878,
                            height: 1138,
                            scaleFactors: [1, 2, 4, 8],
                        },
                    ],
                    profile: [
                        'http://iiif.io/api/image/2/level1.json',
                        {
                            supports: [
                                'baseUriRedirect',
                                'cors',
                                'jsonldMediaType',
                                'profileLinkHeader',
                                'canonicalLinkHeader',
                                'regionByPct',
                                'regionByPx',
                                'regionSquare',
                                'rotationBy90s',
                                'mirroring',
                                'sizeByConfinedWh',
                                'sizeByDistortedWh',
                                'sizeByH',
                                'sizeByPct',
                                'sizeByW',
                                'sizeByWh',
                            ],
                        },
                    ],
                    protocol: 'http://iiif.io/api/image',
                    preferredFormats: ['png', 'jpg'],
                },
            ],
        })
        viewer.viewport.setRotation('90')
    }

    render() {
        return (
            <div
                style={{ width: 300, height: 192, position: 'relative' }}
                className="items-center flex justify-center bg-black mr-2"
                id={`openseadragon${this.props.i}`}
            />
        )
    }
}
