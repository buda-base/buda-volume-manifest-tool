import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import {red} from '@material-ui/core/colors'
import TextField from '@material-ui/core/TextField'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import Chip from '@material-ui/core/Chip'
import Typography from '@material-ui/core/Typography'
import {Box, Checkbox} from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import VisibilityOnIcon from '@material-ui/icons/Visibility'
import EditCard from './EditCard'
import {always, cond, map, propEq, propOr} from 'ramda'
import PreviewImage from './PreviewImage'
import axios from 'axios'
import BeenhereIcon from '@material-ui/icons/Beenhere'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import ReorderIcon from '@material-ui/icons/Reorder'

const useStyles = makeStyles(theme => ({
    card: {
        width: '100%',
        marginBottom: '1rem',
    },
    cardHeader: {
        textAlign: 'left',
    },
    media: {
        maxWidth: '90%',
        width: 'auto',
        height: 'auto',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    marginIndicationTextField: {
        padding: 0,
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
}))

export default function ImageCard(props) {
    const classes = useStyles()
    const [editDialogOpen, setEditDialogOpen] = React.useState(false)
    const [iiif, setiiif] = React.useState(null)
    const { imageView, setImageView } = props
    const { data: image } = props

    React.useEffect(() => {
        const getData = async () => {
            try {
                const data = await axios.get(
                    `https://iiif.bdrc.io/bdr:V4CZ5369_I1KG9128::${image.filename}/info.json`
                )
                const iiif = data.data
                setiiif(iiif)
                return () => {}
            } catch (err) {
                console.log('iiifErr', err)
            }
        }
        getData()
    }, [])

    const Header = () => {
        return (
            <div
                className="flex p-2 justify-between"
                style={{ borderBottom: '1px solid rgb(235, 235, 235)' }}
            >
                <div className="flex">
                    <DragHandleIcon
                        className="mr-2"
                        style={{ cursor: 'move' }}
                    />
                    <h3 className="font-bold">
                        {image.filename || image.type}
                    </h3>
                </div>
                <div className="self-end flex">
                    <SimpleMenu />
                    <KeyboardArrowDownIcon style={{ cursor: 'pointer' }} />
                </div>
            </div>
        )
    }

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        }
    }

    function TabPanel(props) {
        const { children, value, index, ...other } = props

        return (
            <Typography
                component="div"
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && <Box className="mt-2">{children}</Box>}
            </Typography>
        )
    }

    function CardMenu() {
        const [anchorEl, setAnchorEl] = React.useState(null)

        const handleClick = event => {
            setAnchorEl(event.currentTarget)
        }

        const handleClose = () => {
            setAnchorEl(null)
        }
        return (
            <div className="inline-block">
                <MoreVertIcon
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    style={{ cursor: 'pointer' }}
                />

                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={() => {}}>
                        <BeenhereIcon className="mr-2" />
                        Update following unchecked items
                    </MenuItem>
                    <MenuItem onClick={() => {}}>
                        <ReorderIcon className="mr-2" />
                        Reorder this image according to indicated pagination
                    </MenuItem>
                    <MenuItem onClick={() => {}}>
                        <CheckBoxIcon className="mr-2" />
                        Mark all images down to this one as checked
                    </MenuItem>
                </Menu>
            </div>
        )
    }

    function SimpleMenu() {
        const [anchorEl, setAnchorEl] = React.useState(null)

        const handleClick = event => {
            setAnchorEl(event.currentTarget)
        }

        const handleClose = () => {
            setAnchorEl(null)
        }

        return (
            <div className="flex inline-block">
                <MoreVertIcon
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    style={{ cursor: 'pointer' }}
                />

                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem
                        onClick={() => props.insertMissing(props.i, 'before')}
                    >
                        <ArrowUpwardIcon className="mr-2" />
                        Insert One Above
                    </MenuItem>
                    <MenuItem
                        onClick={() => props.insertMissing(props.i, 'after')}
                    >
                        <ArrowDownwardIcon className="mr-2" />
                        Insert One Below
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            handleClose()
                            setEditDialogOpen(true)
                        }}
                    >
                        <Edit className="mr-2" /> Edit
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            props.toggleHideImage(image.id)
                        }}
                    >
                        {image.hide ? (
                            <VisibilityOnIcon className="mr-2" />
                        ) : (
                            <VisibilityOffIcon className="mr-2" />
                        )}

                        {image.hide ? 'Unhide' : 'Hide'}
                    </MenuItem>
                </Menu>
            </div>
        )
    }

    const type = cond([
        [propEq('type', 'duplicate'), always('duplicate')],
        [({ filename }) => filename, always('file')],
        [propEq('type', 'missing'), always('missing')],
    ])(image)

    return (
        <Card className={classes.card}>
            <EditCard
                open={editDialogOpen}
                setEditDialogOpen={setEditDialogOpen}
                data={image}
            />
            <CardHeader className={classes.cardHeader} component={Header} />
            {!image.hide && (
                <CardContent className="flex" style={{ padding: 0 }}>
                    {iiif ? (
                        <PreviewImage
                            showUpdateView
                            setImageView={setImageView}
                            image={image}
                            i={props.i}
                            imageView={imageView}
                            iiif={iiif}
                        />
                    ) : (
                        <div>
                            <div
                                style={{
                                    width: 300,
                                    height: 192,
                                    position: 'relative',
                                }}
                                className="items-center flex justify-center bg-black mr-2"
                            />
                        </div>
                    )}

                    <div className="w-full flex">
                        <div className="w-1/2 flex flex-col content-center">
                            <div className="flex">
                                <FormControl className={classes.formControl}>
                                    <div>
                                        <Select
                                            native
                                            disabled={type === 'missing'}
                                            value={type}
                                            onChange={e => {
                                                props.selectType(image.id, e)
                                            }}
                                            style={{ width: 155 }}
                                            inputProps={{
                                                name: 'type',
                                                id: 'type',
                                            }}
                                        >
                                            <option value="file">File</option>
                                            {type === 'missing' && (
                                                <option value="missing">
                                                    Missing
                                                </option>
                                            )}
                                            <option value="duplicate">
                                                Duplicate
                                            </option>
                                        </Select>
                                    </div>
                                </FormControl>
                            </div>
                            {/*<Tabs*/}
                            {/*    value={0}*/}
                            {/*    onChange={() => console.log('handle change')}*/}
                            {/*    aria-label="simple tabs example"*/}
                            {/*    indicatorColor="primary"*/}
                            {/*>*/}
                            {/*<Tab label="Input 1" {...a11yProps(0)} />*/}
                            {/*<Tab label="Input 2" {...a11yProps(1)} />*/}
                            {/*</Tabs>*/}

                            <TabPanel value={0} index={0} className="p-0">
                                <div className="mb-2">
                                    <TextField
                                        label="Margin Indication"
                                        type="text"
                                    />
                                    <Checkbox
                                        checked={image.reviewed}
                                        onChange={() => {
                                            props.toggleReview(image.id)
                                        }}
                                        value="reviewed"
                                        color="primary"
                                        inputProps={{
                                            'aria-label': 'primary checkbox',
                                        }}
                                    />
                                </div>
                                <div>
                                    <FormControl style={{ marginTop: '.5rem' }}>
                                        <div>
                                            <Select
                                                native
                                                value="file"
                                                onChange={x => {
                                                    console.log('selected', x)
                                                }}
                                                className="mr-2"
                                                style={{ width: 155 }}
                                                inputProps={{
                                                    name: 'type',
                                                    id: 'type',
                                                }}
                                            >
                                                <option value="section1a">
                                                    Section 1a
                                                </option>
                                                <option value="section2a">
                                                    Section 2a
                                                </option>
                                            </Select>
                                            <TextField type="text" />
                                            <CardMenu />
                                        </div>
                                    </FormControl>
                                </div>
                            </TabPanel>
                            {/*<TabPanel value={0} index={1}>*/}
                            {/*    Item Two*/}
                            {/*</TabPanel>*/}
                        </div>
                        <div className="flex flex-row content-center mt-3">
                            {map(({ id, text }) => {
                                return (
                                    <Chip
                                        key={image.id}
                                        label={text}
                                        onDelete={() => {
                                            props.deleteImageChip(image.id, id)
                                        }}
                                    />
                                )
                            }, propOr([], 'chips', image))}
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    )
}
