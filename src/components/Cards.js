import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import { red } from '@material-ui/core/colors'
import TextField from '@material-ui/core/TextField'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import Chip from '@material-ui/core/Chip'
import Typography from '@material-ui/core/Typography'
import { Box, Checkbox } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import VisibilityOnIcon from '@material-ui/icons/Visibility'
import EditCard from './EditCard'
import { always, cond, map, path, propEq, propOr, reject } from 'ramda'
import PreviewImage from './PreviewImage'
import axios from 'axios'
import BeenhereIcon from '@material-ui/icons/Beenhere'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import ReorderIcon from '@material-ui/icons/Reorder'
import Autocomplete from '@material-ui/lab/Autocomplete'
import FormHelperText from '@material-ui/core/FormHelperText'
import { useDrag } from 'react-dnd'
import tags from '../tags'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(theme => ({
    card: {
        width: '100%',
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
    const { data: image, sectionInputs } = props

    const [{ opacity }, dragRef] = useDrag({
        item: { type: 'CARD', imageId: image.id },
        collect: monitor => ({
            opacity: monitor.isDragging() ? 0.3 : 1,
        }),
    })

    React.useEffect(() => {
        const getData = async () => {
            try {
                const data = await axios.get(
                    `https://iiif.bdrc.io/${props.volumeId}::${
                        image.filename
                    }/info.json`
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
                    {/*<KeyboardArrowDownIcon style={{ cursor: 'pointer' }} />*/}
                </div>
            </div>
        )
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

    function SimpleMenu() {
        const [anchorEl, setAnchorEl] = React.useState(null)

        const { t } = useTranslation()

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
                        {t('Insert One Above')}
                    </MenuItem>
                    <MenuItem
                        onClick={() => props.insertMissing(props.i, 'after')}
                    >
                        <ArrowDownwardIcon className="mr-2" />
                        {t('Insert One Below')}
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            handleClose()
                            setEditDialogOpen(true)
                        }}
                    >
                        <Edit className="mr-2" /> {t('Edit')}
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

                        {image.hide ? t('Unhide') : t('Hide')}
                    </MenuItem>
                    <MenuItem onClick={() => {}}>
                        <BeenhereIcon className="mr-2" />
                        {t('Update following unchecked items')}
                    </MenuItem>
                    <MenuItem onClick={() => {}}>
                        <ReorderIcon className="mr-2" />
                        {t(
                            'Reorder this image according to indicated pagination'
                        )}
                    </MenuItem>
                    <MenuItem
                        onClick={() => props.markPreviousAsReviewed(props.i)}
                    >
                        <CheckBoxIcon className="mr-2" />
                        {t('Mark all images down to this one as checked')}
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

    const sectionId = image.sectionId || 'none'

    const hideCard =
        (!props.showHiddenImages && !!image.hide) ||
        (!!image.reviewed && !props.showCheckedImages)

    const { t } = useTranslation()

    return hideCard ? null : (
        <Card className={classes.card} style={{ opacity }} ref={dragRef}>
            <EditCard
                open={editDialogOpen}
                setEditDialogOpen={setEditDialogOpen}
                addImageTag={props.addImageTag}
                data={image}
                removeImageTag={props.removeImageTag}
                addNote={props.addNote}
                removeNote={props.removeNote}
                updateImageValue={props.updateImageValue}
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

                    <div className="flex flex-col w-full">
                        <div className="flex w-full">
                            <div>
                                <FormControl className={classes.formControl}>
                                    <div>
                                        <Select
                                            native
                                            disabled={type === 'missing'}
                                            value={type}
                                            onChange={e => {
                                                props.selectType(
                                                    image.id,
                                                    e,
                                                    props.i
                                                )
                                            }}
                                            style={{ width: 155 }}
                                        >
                                            <option value="file"></option>
                                            {type === 'missing' && (
                                                <option value="missing">
                                                    {t('Missing')}
                                                </option>
                                            )}
                                            <option value="duplicate">
                                                {t('Duplicate')}
                                            </option>
                                        </Select>
                                        <FormHelperText>
                                            {t('Type')}
                                        </FormHelperText>
                                    </div>
                                </FormControl>
                                {type === 'duplicate' && (
                                    <>
                                        <FormControl
                                            className={classes.formControl}
                                        >
                                            <div>
                                                <Autocomplete
                                                    autoComplete
                                                    options={reject(
                                                        propEq('id', image.id),
                                                        props.duplicateImageOptions
                                                    )}
                                                    style={{ width: 250 }}
                                                    autoSelect
                                                    autoHighlight
                                                    value={image.duplicateOf}
                                                    getOptionLabel={({
                                                        name,
                                                    }) => name}
                                                    onChange={(
                                                        event,
                                                        newValue
                                                    ) => {
                                                        props.updateDuplicateOf(
                                                            image.id,
                                                            newValue
                                                        )
                                                    }}
                                                    renderInput={params => {
                                                        return (
                                                            <TextField
                                                                helperText={t(
                                                                    'of File'
                                                                )}
                                                                {...params}
                                                                fullWidth
                                                            />
                                                        )
                                                    }}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormControl
                                            className={classes.formControl}
                                        >
                                            <div>
                                                <Select
                                                    native
                                                    value={image.duplicateType}
                                                    onChange={e => {
                                                        props.setDuplicateType(
                                                            image.id,
                                                            e.target.value
                                                        )
                                                    }}
                                                    style={{ width: 250 }}
                                                >
                                                    <option value="dup-in-original">
                                                        {t(
                                                            'Duplicate in Original'
                                                        )}
                                                    </option>
                                                    <option value="dif-pic-same-page">
                                                        {t(
                                                            'Different Picture of Same Page'
                                                        )}
                                                    </option>
                                                    <option value="same-pic-same-page">
                                                        {t(
                                                            'Same Picture of Same Page'
                                                        )}
                                                    </option>
                                                </Select>
                                            </div>
                                        </FormControl>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="w-full flex">
                            <div className="w-1/2 flex flex-col content-center">
                                <TabPanel value={0} index={0} className="p-0">
                                    <div className="mb-2">
                                        <TextField
                                            label={t('Margin Indication')}
                                            type="text"
                                        />
                                        <Checkbox
                                            checked={image.reviewed}
                                            onChange={() => {
                                                props.toggleReview(image.id)
                                            }}
                                            value="reviewed"
                                            color="primary"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <FormControl
                                            style={{ marginTop: '.5rem' }}
                                        >
                                            <div>
                                                {sectionInputs.length > 0 && (
                                                    <Select
                                                        native
                                                        value={sectionId}
                                                        onChange={e => {
                                                            props.updateImageSection(
                                                                image.id,
                                                                e.target.value
                                                            )
                                                        }}
                                                        className="mr-2"
                                                        style={{ width: 155 }}
                                                        inputProps={{
                                                            name: 'type',
                                                            id: 'type',
                                                        }}
                                                    >
                                                        <option value={'none'}>
                                                            {t(
                                                                'Choose Section'
                                                            )}
                                                        </option>
                                                        )
                                                        {sectionInputs.map(
                                                            (section, i) => {
                                                                return (
                                                                    <option
                                                                        key={i}
                                                                        value={
                                                                            section.id
                                                                        }
                                                                    >
                                                                        {
                                                                            section.value
                                                                        }
                                                                    </option>
                                                                )
                                                            }
                                                        )}
                                                    </Select>
                                                )}
                                                <TextField
                                                    helperText={t('Pagination')}
                                                    defaultValue={
                                                        image.pagination
                                                    }
                                                    onBlur={e => {
                                                        props.setPagination(
                                                            image.id,
                                                            e.target.value
                                                        )
                                                    }}
                                                />
                                            </div>
                                        </FormControl>
                                    </div>
                                </TabPanel>
                            </div>
                            <div className="flex flex-row content-center mt-3 w-1/2">
                                <div className="flex flex-wrap  max-w-full">
                                    {map(tagId => {
                                        const tagData = tags[tagId]
                                        return (
                                            <div className="m-2">
                                                <Chip
                                                    key={tagId}
                                                    label={path(
                                                        ['label', 'eng'],
                                                        tagData
                                                    )}
                                                    onDelete={() => {
                                                        props.removeImageTag(
                                                            image.id,
                                                            tagId
                                                        )
                                                    }}
                                                />
                                            </div>
                                        )
                                    }, propOr([], 'tags', image))}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    )
}
