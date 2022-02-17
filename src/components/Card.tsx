import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import { red } from '@material-ui/core/colors'
import TextField from '@material-ui/core/TextField'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import { Checkbox } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import VisibilityOnIcon from '@material-ui/icons/Visibility'
import ArrowDropDown from '@material-ui/icons/ArrowDropDown'
import ArrowDropUp from '@material-ui/icons/ArrowDropUp'
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import EditCard from './EditCard'
import PreviewImage from './PreviewImage'
import axios from 'axios'
import BeenhereIcon from '@material-ui/icons/Beenhere'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import ReorderIcon from '@material-ui/icons/Reorder'
import { useDrag } from 'react-dnd'
import { useTranslation } from 'react-i18next'
import Tags from './Tags'
import TypeSelect from './TypeSelect'
import NoteIcon from '@material-ui/icons/Note'
import { Formik } from 'formik'
import DeleteIcon from '@material-ui/icons/Delete'
import { pathOr } from 'ramda'
import InputLabel from '@material-ui/core/InputLabel'
import LanguageOptions from './LanguageOptions'
import { connect } from 'react-redux'
import {
    handlePaginationPredication,
    hideCardInManifest,
    insertMissing,
    markPreviousAsReviewed,
    toggleCollapseImage,
    toggleReview,
    updateImageSection,
    updateImageValue,
    updateUncheckedItems,
} from '../redux/actions/manifest'

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

function ImageCard(props: {
    i: number
    imageListLength: any
    sectionInputs: any
    data: any
    volumeId: string
    uiLanguage: any
    manifestLanguage: any
    pagination: any
    dispatch: any
}) {
    const classes = useStyles()
    const [editDialogOpen, setEditDialogOpen] = React.useState(false)
    const [iiif, setiiif] = React.useState(null)
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
                    `https://iiif.bdrc.io/${props.volumeId}::${image.filename}/info.json`,
                )
                const iiif = data.data
                setiiif(iiif)
                return () => {
                }
            } catch (err) {
                console.log('iiifErr', err)
            }
        }
        if (props.volumeId && image.filename) {
            getData()
        }
    }, [image.filename, props.volumeId])

    const Header = () => {
        return (
            <div
                className="flex justify-between card-head"
                style={{ borderBottom: '1px solid rgb(235, 235, 235)' }}
            >
                <div className="flex pl-2" >
                    <DragHandleIcon
                        className="mr-2"
                        style={{ cursor: 'move' }}
                    />
                    <h3
                        className={`py-2 font-bold ${image.hide &&
                        'text-red-600'} flex align-center`}                         
                        onClick={() =>
                            props.dispatch(toggleCollapseImage(props.i))
                        }
                    >
                        {image.hide && (
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
                <div className="self-center flex pr-4">
                    {image.note && image.note.length > 0 && (
                        <NoteIcon className="mr-4"/>
                    )}
                    <span
                        className="cursor-pointer"
                        onClick={() =>
                            props.dispatch(toggleCollapseImage(props.i))
                        }
                    >
                        {image.collapsed ? (
                            <ArrowDropDown className="mr-2" style={{fontSize:"32px"}}/>
                        ) : (
                            <ArrowDropUp className="mr-2" style={{fontSize:"32px"}}/>
                        )}
                    </span>

                    <Edit
                        onClick={() => setEditDialogOpen(true)}
                        className="mr-2 cursor-pointer"
                    />

                    <SimpleMenu/>
                </div>
            </div>
        )
    }

    function SimpleMenu() {
        const [anchorEl, setAnchorEl] = React.useState(null)

        const { t } = useTranslation()

        const handleClick = (event: { currentTarget: any }) => {
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
                    getContentAnchorEl={null}
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 36,
                        horizontal: 44,
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    elevation={0}
                >
                    <MenuItem
                        onClick={() =>
                            props.dispatch(insertMissing(props.i, 'before'))
                        }
                    >
                        <ArrowUpwardIcon className="mr-2"/>
                        {t('Insert One Above')}
                    </MenuItem>
                    <MenuItem
                        onClick={() =>
                            props.dispatch(insertMissing(props.i, 'after'))
                        }
                    >
                        <ArrowDownwardIcon className="mr-2"/>
                        {t('Insert One Below')}
                    </MenuItem>

                    {!image.hide && (
                        <MenuItem
                            onClick={() => {
                                props.dispatch(
                                    hideCardInManifest(props.i, true),
                                )
                            }}
                        >
                            <DeleteIcon className="mr-2"/>
                            {t('Hide in Manifest')}
                        </MenuItem>
                    )}
                    {image.hide && (
                        <MenuItem
                            onClick={() => {
                                props.dispatch(
                                    hideCardInManifest(props.i, false),
                                )
                            }}
                        >
                            <DeleteIcon className="mr-2"/>
                            {t('Unhide in Manifest')}
                        </MenuItem>
                    )}
                    {image.pagination && (
                        <MenuItem
                            onClick={() => {
                                props.dispatch(
                                    updateUncheckedItems(image, props.i),
                                )
                            }}
                        >
                            <BeenhereIcon className="mr-2"/>
                            {t('Update following unchecked items')}
                        </MenuItem>
                    )}
                    {image.pagination && (
                        <MenuItem
                            onClick={() => {
                                props.dispatch(
                                    handlePaginationPredication(props.data),
                                )
                            }}
                        >
                            <ReorderIcon className="mr-2"/>
                            {t(
                                'Reorder this image according to indicated pagination',
                            )}
                        </MenuItem>
                    )}
                    <MenuItem
                        onClick={() =>
                            props.dispatch(markPreviousAsReviewed(props.i))
                        }
                    >
                        <CheckBoxIcon className="mr-2"/>
                        {t('Mark all images down to this one as checked')}
                    </MenuItem>
                </Menu>
            </div>
        )
    }

    const { t } = useTranslation()
    const hideImage = image.hide
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
                idx={props.i}
            />
            <CardHeader className={classes.cardHeader} component={Header}/>
            {!image.collapsed && (
                <CardContent className="flex justify-between" style={{ padding: 0 }}>
                    {iiif ? (
                        <PreviewImage i={props.i as never} iiif={iiif as never}/>
                    ) : (
                        <div className="flex border-r border-gray-300 mr-2 w-3/5">
                            <div
                                style={{
                                    backgroundColor:"#ddd",
                                    width:"100%",
                                    height:"100%",
                                    position: 'relative',
                                }}
                                className="nOSD items-center flex justify-center"
                            ><NotInterestedIcon /></div>
                        </div>
                    )}

                    <div className="flex flex-col w-2/5 px-4 py-3">
                        <div className="w-full flex flex-row  w-1/3">
                            <div className="mb-2">
                                <Formik
                                    initialValues={{
                                        marginIndication: pathOr(
                                            '',
                                            ['indication', '@value'],
                                            image,
                                        ),
                                        language: props.manifestLanguage,
                                    }}
                                    onSubmit={({
                                                   marginIndication,
                                                   language,
                                               }) => {
                                        props.dispatch(
                                            updateImageValue(
                                                props.i,
                                                'indication',
                                                {
                                                    '@value': marginIndication,
                                                    '@language': language,
                                                },
                                            ),
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
                                                onBlur={() => {
                                                    setTimeout(
                                                        handleSubmit,
                                                        500,
                                                    )
                                                }}
                                                inputProps={{
                                                    name: 'marginIndication',
                                                }}
                                                helperText={t(
                                                    'Margin Indication',
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
                                                    onBlur={() => {
                                                        setTimeout(
                                                            handleSubmit,
                                                            500,
                                                        )
                                                    }}
                                                    inputProps={{
                                                        id: 'language',
                                                    }}
                                                >
                                                    <LanguageOptions/>
                                                </Select>
                                            </FormControl>
                                        </>
                                    )}
                                </Formik>

                                <Checkbox
                                    checked={!!image.reviewed}
                                    onChange={() => {
                                        props.dispatch(toggleReview(props.i))
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
                                                    image,
                                                )}
                                                onChange={e => {
                                                    props.dispatch(
                                                        updateImageSection(
                                                            props.i,
                                                            'section',
                                                            e.target.value,
                                                        ),
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
                                                    (
                                                        section: {
                                                            id:
                                                                | string
                                                                | number
                                                                | string[]
                                                            name: {
                                                                [x: string]: React.ReactNode
                                                            }
                                                        },
                                                        i: React.Key,
                                                    ) => {
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
                                                    },
                                                )}
                                            </Select>
                                        )}

                                        <Formik
                                            initialValues={{
                                                pagination: pathOr(
                                                    '',
                                                    [
                                                        'pagination',
                                                        props.pagination[0].id,
                                                        'value',
                                                    ],
                                                    image,
                                                ),
                                            }}
                                            onSubmit={({ pagination }) => {
                                                props.dispatch(
                                                    updateImageSection(
                                                        props.i,
                                                        'value',
                                                        pagination,
                                                    ),
                                                )
                                            }}
                                            enableReinitialize
                                        >
                                            {({
                                                  values,
                                                  handleChange,
                                                  handleSubmit,
                                              }) => (
                                                <TextField
                                                    helperText={t('Pagination')}
                                                    value={values.pagination}
                                                    onChange={handleChange}
                                                    onBlur={() => {
                                                        setTimeout(
                                                            handleSubmit,
                                                            500,
                                                        )
                                                    }}
                                                    inputProps={{
                                                        name: 'pagination',
                                                    }}
                                                />
                                            )}
                                        </Formik>
                                    </div>
                                </FormControl>
                            </div>
                        </div>

                        <Tags idx={props.i} id={image.id} tags={image.tags}/>

                        <TypeSelect
                            tags={image.tags}
                            id={image.id}
                            i={props.i}
                            duplicateOf={image.duplicateOf}
                        />
                    </div>
                </CardContent>
            )}
        </div>
    )
}

ImageCard.whyDidYouRender = true

const emptyArr: any[] = []

const mapStateToProps = function(state: any) {
    const { manifest } = state
    return {
        volumeId: manifest['imggroup'],
        manifestLanguage: manifest.appData['bvmt']['default-vol-string-lang'],
        uiLanguage: manifest.appData['bvmt']['default-ui-string-lang'],
        pagination: manifest.pagination,
        sectionInputs: manifest.sections || emptyArr,
    }
}

// @ts-ignore
export default connect(mapStateToProps)(ImageCard)
