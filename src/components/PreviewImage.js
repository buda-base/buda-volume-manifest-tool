import React from 'react'
import OpenSeaDragon from 'openseadragon'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import {withStyles} from '@material-ui/core'
import Icon from '@material-ui/core/Icon'

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
            const viewer = OpenSeaDragon({
                id: `openseadragon${this.props.i}`,
                degrees: this.state.degrees,
                defaultZoomLevel: this.props.zoom,
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
        const ImageMenu = props => {
            const [anchorEl, setAnchorEl] = React.useState(null)
            const { classes } = props

            const handleClick = event => {
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
                        zIndex: '99',
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
                                this.props.setImageView({
                                    zoom,
                                    center,
                                    rotation,
                                })
                            }}
                        >
                            Set Preview
                        </MenuItem>
                    </Menu>
                </div>
            )
        }

        const ImageMenuOverlay = withStyles(theme => ({
            root: {
                color: 'white',
            },
        }))(ImageMenu)

        return (
            <div>
                <div
                    style={{ width: 300, height: 192, position: 'relative' }}
                    className="items-center flex justify-center bg-black mr-2 border-black border-2"
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
