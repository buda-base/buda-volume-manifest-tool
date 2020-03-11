import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import {red} from '@material-ui/core/colors'
import TextField from '@material-ui/core/TextField'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import {Checkbox} from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import VisibilityOnIcon from '@material-ui/icons/Visibility'
import EditCard from './EditCard'
import PreviewImage from './PreviewImage'
import axios from 'axios'
import BeenhereIcon from '@material-ui/icons/Beenhere'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import ReorderIcon from '@material-ui/icons/Reorder'
import {useDrag} from 'react-dnd'
import {useTranslation} from 'react-i18next'
import Tags from './Tags'
import TypeSelect from './TypeSelect'
import NoteIcon from '@material-ui/icons/Note'
import {Formik} from 'formik'
import DeleteIcon from '@material-ui/icons/Delete'
import {pathOr} from 'ramda'
import InputLabel from '@material-ui/core/InputLabel'
import LanguageOptions from './LanguageOptions'

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

    const [, dragRef] = useDrag({
        item: { type: 'CARD', imageId: image.id },
        collect: monitor => ({
            opacity: monitor.isDragging() ? 0.3 : 1,
        }),
    })

    React.useEffect(() => {
        const getData = async () => {
            try {
                const data = await axios.get(
                    `https://iiif-dev.bdrc.io/${props.volumeId}::${image.filename}/info.json`
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
                    <h3
                        className={`font-bold ${image.deleted &&
                            'text-red-600'} flex align-center`}
                    >
                        {image.deleted && (
                            <DeleteIcon
                                className="mr-2"
                                style={{ color: 'red' }}
                            />
                        )}
                        {image.filename || image.type}{' '}
                        <span className="text-gray-500 text-sm ml-4">{`(${props.i +
                            1} of ${props.imageListLength})`}</span>
                    </h3>
                </div>
                <div className="self-end flex">
                    {image.note && image.note.length > 0 && (
                        <NoteIcon className="mr-4" />
                    )}
                    <span
                        className="cursor-pointer"
                        onClick={() => props.toggleHideImage(image.id)}
                    >
                        {image.hide ? (
                            <VisibilityOnIcon className="mr-4" />
                        ) : (
                            <VisibilityOffIcon className="mr-4" />
                        )}
                    </span>

                    <Edit
                        onClick={() => setEditDialogOpen(true)}
                        className="mr-4 cursor-pointer"
                    />

                    <SimpleMenu />
                </div>
            </div>
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

                    {!image.deleted && (
                        <MenuItem
                            onClick={() =>
                                props.updateImageValue(
                                    image.id,
                                    'deleted',
                                    true
                                )
                            }
                        >
                            <DeleteIcon className="mr-2" />
                            {t('Delete')}
                        </MenuItem>
                    )}
                    {image.indication && image.indication['@value'] && (
                        <MenuItem
                            onClick={() => {
                                props.updateUncheckedItems(
                                    image.id,
                                    image.indication['@value'],
                                    props.i
                                )
                            }}
                        >
                            <BeenhereIcon className="mr-2" />
                            {t('Update following unchecked items')}
                        </MenuItem>
                    )}
                    {image.pagination && (
                        <MenuItem
                            onClick={() => {
                                props.handlePaginationPredication(props.data)
                            }}
                        >
                            <ReorderIcon className="mr-2" />
                            {t(
                                'Reorder this image according to indicated pagination'
                            )}
                        </MenuItem>
                    )}
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

    const { t } = useTranslation()
    const hideImage = props.hideDeletedImages && image.deleted
    return hideImage ? null : (
        <div
            className="shadow-sm hover:shadow-md w-full border-2 rounded border-gray-200 bg-white"
            ref={dragRef}
        >
            <EditCard
                open={editDialogOpen}
                setEditDialogOpen={setEditDialogOpen}
                uiLanguage={props.uiLanguage}
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
                        <div className="border-r border-gray-300 mr-2">
                            <div
                                style={{
                                    width: 300,
                                    height: 192,
                                    position: 'relative',
                                }}
                                className="items-center flex justify-centermr-2"
                            ></div>
                        </div>
                    )}

                    <div className="flex flex-col w-1/2">
                        <div className="w-full flex flex-row  w-1/3">
                            <div className="mb-2">
                                <Formik
                                    initialValues={{
                                        marginIndication: pathOr(
                                            '',
                                            ['indication', '@value'],
                                            image
                                        ),
                                        language: props.manifestLanguage,
                                    }}
                                    onSubmit={({
                                        marginIndication,
                                        language,
                                    }) => {
                                        props.updateImageValue(
                                            image.id,
                                            'indication',
                                            {
                                                '@value': marginIndication,
                                                '@language': language,
                                            }
                                        )
                                    }}
                                    enableReinitialize
                                >
                                    {({
                                        values,
                                        handleChange,
                                        handleSubmit,
                                    }) => (
                                        <>
                                            <TextField
                                                label={' '}
                                                type="text"
                                                value={values.marginIndication}
                                                onChange={handleChange}
                                                onBlur={handleSubmit}
                                                inputProps={{
                                                    id: 'marginIndication',
                                                }}
                                                id="margin-indication"
                                                helperText={t(
                                                    'Margin Indication'
                                                )}
                                            />
                                            <FormControl>
                                                <InputLabel shrink>
                                                    ''
                                                </InputLabel>
                                                <Select
                                                    native
                                                    value={values.language}
                                                    onChange={handleChange}
                                                    onBlur={handleSubmit}
                                                    id="margin-indication-lang"
                                                    inputProps={{
                                                        id: 'language',
                                                    }}
                                                >
                                                    <LanguageOptions />
                                                </Select>
                                            </FormControl>
                                        </>
                                    )}
                                </Formik>

                                <Checkbox
                                    checked={!!image.reviewed}
                                    onChange={() => {
                                        props.toggleReview(image.id)
                                    }}
                                    value="reviewed"
                                    color="primary"
                                />
                            </div>
                        </div>
                        <div className="w-1/2 flex flex-col content-center mb-4">
                            <div className="w-full">
                                <FormControl style={{ marginTop: '.5rem' }}>
                                    <div>
                                        {sectionInputs.length > 0 && (
                                            <Select
                                                native
                                                value={pathOr(
                                                    'none',
                                                    [
                                                        'pagination',
                                                        props.pagination[0].id,
                                                        'section',
                                                    ],
                                                    image
                                                )}
                                                onChange={e => {
                                                    props.updateImageSection(
                                                        image.id,
                                                        'section',
                                                        e.target.value
                                                    )
                                                }}
                                                className="mr-2"
                                                style={{ width: 155 }}
                                            >
                                                <option value={'none'}>
                                                    {t('Choose Section')}
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
                                                                    section
                                                                        .name[
                                                                        '@value'
                                                                    ]
                                                                }
                                                            </option>
                                                        )
                                                    }
                                                )}
                                            </Select>
                                        )}
                                        <TextField
                                            helperText={t('Pagination')}
                                            defaultValue={pathOr(
                                                '',
                                                [
                                                    'pagination',
                                                    props.pagination[0].id,
                                                    'value',
                                                ],
                                                image
                                            )}
                                            onBlur={e => {
                                                props.updateImageSection(
                                                    image.id,
                                                    'value',
                                                    e.target.value
                                                )
                                            }}
                                        />
                                    </div>
                                </FormControl>
                            </div>
                        </div>

                        <Tags
                            id={image.id}
                            tags={image.tags}
                            addImageTag={props.addImageTag}
                            removeImageTag={props.removeImageTag}
                            removeOfField={props.removeOfField}
                        />

                        <TypeSelect
                            image={image}
                            removeOfField={props.removeOfField}
                            tags={image.tags}
                            setDuplicateType={props.setDuplicateType}
                            updateOfField={props.updateOfField}
                            id={image.id}
                            duplicateType={image.duplicateType}
                            selectType={props.selectType}
                            i={props.i}
                            duplicateImageOptions={props.duplicateImageOptions}
                            duplicateOf={image.duplicateOf}
                            filename={image.filename}
                        />
                    </div>
                </CardContent>
            )}
        </div>
    )
}
