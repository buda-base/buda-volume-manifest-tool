import React from 'react'
import OpenSeaDragon from 'openseadragon'

export default class PreviewImage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            center: null,
            zoom: null,
        }
    }
    componentDidMount() {
        if (this.props.iiif) {
            console.log('this.props.iiif', this.props.iiif)
            const viewer = OpenSeaDragon({
                id: `openseadragon${this.props.i}`,
                degrees: this.state.degrees,
                defaultZoomLevel: this.props.zoom,
                // def
                // center: {
                //     "x": 0.5,
                //     "y": 0.6480637813211846
                // },
                showRotationControl: true,
                tileSources: [this.props.iiif],
            })

            if (this.props.imageView) {
                viewer.addHandler('open', () => {
                    if (this.props.imageView.center.x) {
                        viewer.viewport.panTo(this.props.imageView.center, true)
                        viewer.viewport.zoomTo(this.props.imageView.zoom)
                    }
                })
            }

            this.setState({ viewer })
        }
    }

    componentDidUpdate(prevProps) {
        const hasViewDiff =
            this.props.imageView.center.x !== prevProps.imageView.center.x ||
            this.props.imageView.center.y !== prevProps.imageView.center.y ||
            this.props.imageView.zoom !== prevProps.imageView.zoom ||
            this.props.imageView.rotation !== prevProps.imageView.rotation

        if (this.props.imageView.center.x && hasViewDiff) {
            this.state.viewer.viewport.panTo(this.props.imageView.center, true)
            this.state.viewer.viewport.zoomTo(this.props.imageView.zoom)
            this.state.viewer.viewport.setRotation(
                this.props.imageView.rotation
            )
        }
    }


    render() {
        console.log('imageView', this.props)
        return (
            <div>
                <div
                    style={{ width: 300, height: 192, position: 'relative' }}
                    className="items-center flex justify-center bg-black mr-2"
                    id={`openseadragon${this.props.i}`}
                />
                {this.props.showUpdateView && (
                    <button
                        onClick={() => {
                            const zoom = this.state.viewer.viewport.getZoom(
                                true
                            )
                            const center = this.state.viewer.viewport.getCenter(
                                true
                            )
                            const rotation = this.state.viewer.viewport.getRotation(
                                true
                            )
                            this.props.setImageView({
                                zoom,
                                center,
                                rotation,
                            })
                        }}
                    >
                        Update View
                    </button>
                )}
            </div>
        )
    }
}
