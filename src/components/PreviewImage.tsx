import React from 'react'
// @ts-ignore
import OpenSeaDragon from 'openseadragon'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core'
import Icon from '@material-ui/core/Icon'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { setImageView } from '../redux/actions/manifest'
import { pathOr } from 'ramda'

interface IState {
    degrees?: number
    center: null | number
    zoom: null | number
    viewer?: any
}

interface IProps {
    iiif?: string
    i: number
    degrees?: number
    zoom?: number
    pZoom: number
    pX: number
    pY: number
    dispatch: any
}

const getImageProps = (props: any) => {
    return {
        zoom: props.pZoom,
        center: {
            x: props.pX,
            y: props.pY,
        },
        rotation: props.pRotation,
    }
}

class PreviewImage extends React.Component<IProps, IState> {
    constructor(props: Readonly<IProps>) {
        super(props)
        this.state = {
            center: null,
            zoom: null,
        }
    }
    componentDidMount() {
        const imageView = getImageProps(this.props)
        if (this.props.iiif) {
            const viewer = OpenSeaDragon({
                id: `openseadragon${this.props.i}`,
                degrees: this.state.degrees,
                defaultZoomLevel: this.props.zoom,
                showRotationControl: true,
                tileSources: [this.props.iiif],
            })

            if (imageView) {
                viewer.addHandler('open', () => {
                    if (imageView.center.x) {
                        viewer.viewport.panTo(imageView.center, true)
                        viewer.viewport.zoomTo(imageView.zoom)
                        viewer.viewport.setRotation(imageView.rotation)
                    }
                })
            }

            this.setState({ viewer })
        }
    }

    // @ts-ignore
    componentDidUpdate(prevProps: {
        imageView: {
            center: { x: number; y: number }
            zoom: number
            rotation: number
        }
    }) {
        const imageView = getImageProps(this.props)
        const prevImage = getImageProps(prevProps)
        const hasViewDiff =
            imageView.center.x !== prevImage.center.x ||
            imageView.center.y !== prevImage.center.y ||
            imageView.zoom !== prevImage.zoom ||
            imageView.rotation !== prevImage.rotation

        if (imageView.center.x && hasViewDiff) {
            this.state.viewer.viewport.panTo(imageView.center, true)
            this.state.viewer.viewport.zoomTo(imageView.zoom)
            this.state.viewer.viewport.setRotation(imageView.rotation)
        }
    }

    render() {
        const ImageMenu = () => {
            const [anchorEl, setAnchorEl] = React.useState(null)
            const { t } = useTranslation()

            const handleClick = (event: { currentTarget: any }) => {
                setAnchorEl(event.currentTarget)
            }

            const handleClose = () => {
                setAnchorEl(null)
            }
            return (
                <div
                    style={{
                        color: 'white',
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        zIndex: 40,
                    }}
                >
                    <div
                        style={{ backgroundColor: 'black' }}
                        className="flex content-center justify-center"
                    >
                        <Icon
                            aria-controls="simple-menu"
                            aria-haspopup="true"
                            onClick={handleClick}
                            style={{ color: 'white', cursor: 'pointer' }}
                        >
                            more_vert
                        </Icon>
                    </div>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem
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

                                this.props.dispatch(
                                    setImageView({
                                        zoom,
                                        center,
                                        rotation,
                                    })
                                )
                            }}
                        >
                            {t('Set Preview')}
                        </MenuItem>
                    </Menu>
                </div>
            )
        }

        const ImageMenuOverlay = withStyles(() => ({
            root: {
                color: 'white',
            },
        }))(ImageMenu)

        return (
            <div className="border-r border-gray-300 mr-2 w-1/2">
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                    }}
                    className="items-center flex justify-center mr-2"
                    id={`openseadragon${this.props.i}`}
                >
                    <div
                        style={{
                            height: '100%',
                            width: '100%',
                            backgroundColor: 'transparent',
                            position: 'absolute',
                        }}
                        className="text-white"
                    >
                        <ImageMenuOverlay />
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = function(state: any) {
    const { zoom, center, rotation } = pathOr(
        {
            zoom: 0,
            center: {
                x: null,
                y: null,
            },
            rotation: 90,
        },
        ['appData', 'bvmt', 'preview-image-view'],
        state.manifest
    )
    return {
        pZoom: zoom,
        pX: center.x,
        pY: center.y,
        pRotation: rotation,
    }
}

// @ts-ignore
export default connect(mapStateToProps)(PreviewImage)
