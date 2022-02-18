import React from 'react'
// @ts-ignore
import OpenSeaDragon from 'openseadragon'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core'
import Icon from '@material-ui/core/Icon'
import { useTranslation } from 'react-i18next'
import i18n from "i18next"
import { connect } from 'react-redux'
import { setImageView } from '../redux/actions/manifest'
import { pathOr } from 'ramda'
import "../css/PreviewImage.css"

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
                toolbar:`openseadragon${this.props.i}_toolbar`,
                prefixUrl:'/images/osd/',
                navImages:{
                    zoomIn:{ 
                        REST:"plus.svg",
                        GROUP:"plus.svg",
                        HOVER:"plus.svg",
                        DOWN:"plus.svg" 
                    },
                    zoomOut:{ 
                        REST:"minus.svg",
                        GROUP:"minus.svg",
                        HOVER:"minus.svg",
                        DOWN:"minus.svg" 
                    },
                    fullpage:{ 
                        REST:"fullscreen.svg",
                        GROUP:"fullscreen.svg",
                        HOVER:"fullscreen.svg",
                        DOWN:"fullscreen.svg" 
                    },
                    rotateleft:{ 
                        REST:"rotate90.svg",
                        GROUP:"rotate90.svg",
                        HOVER:"rotate90.svg",
                        DOWN:"rotate90.svg" 
                    },
                    rotateright:{ 
                        REST:"rotate270.svg",
                        GROUP:"rotate270.svg",
                        HOVER:"rotate270.svg",
                        DOWN:"rotate270.svg" 
                    },
                    home:{ 
                        REST:"home.svg",
                        GROUP:"home.svg",
                        HOVER:"home.svg",
                        DOWN:"home.svg" 
                    }
                }
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
            <div className="border-r border-gray-300 mr-2 w-3/5 osd-preview">
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
                        {/* <ImageMenuOverlay /> */}
                    </div>                
                </div>
                <div id={`openseadragon${this.props.i}_toolbar`} class="osd-toolbar-ui">
                    <div className="preview" style={{display:"inline-block"}} onClick={() => {
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
                    }}>{i18n.t('Set Preview')}<img src="/images/osd/preview.svg" alt="Set Preview"/></div>
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
