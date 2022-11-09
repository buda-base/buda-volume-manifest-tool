import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'
import {
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  VisibilityOff as VisibilityOffIcon,
  Visibility as VisibilityIcon,
  DragHandle as DragHandleIcon,
  NotInterested as NotInterestedIcon,
  Beenhere as BeenhereIcon,
  CheckBox as CheckBoxIcon,
  Reorder as ReorderIcon,
  Note as NoteIcon,
  Delete as DeleteIcon,
  Edit
} from '@mui/icons-material'
import {
  CardHeader,
  CardContent,
  TextField,
  Select,
  FormControl,
  Checkbox,
  InputLabel,
  Menu,
} from "@mui/material"
import MenuItem from '@material-ui/core/MenuItem'
import ArrowDropDown from '@material-ui/icons/ArrowDropDown'
import ArrowDropUp from '@material-ui/icons/ArrowDropUp'
import EditCard from './EditCard'
import PreviewImage from './PreviewImage'
import axios from 'axios'
import { useDrag, DragSourceMonitor } from 'react-dnd'
import { useTranslation } from 'react-i18next'
import Tags from './Tags'
import TypeSelect from './TypeSelect'
import { Formik } from 'formik'
import { pathOr } from 'ramda'
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
    const [iiif, setiiif] = React.useState<any|null>(null)
    const { data: image, sectionInputs } = props

    const [{ opacity }, dragRef] = useDrag({
        type: 'CARD',
        item: { imageId: image.id },
        collect: (monitor) => ({
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
                className="flex p-2 justify-between"
                style={{ borderBottom: '1px solid rgb(235, 235, 235)' }}
            >
                <div className="flex">
                    <DragHandleIcon
                        className="mr-2"
                        style={{ cursor: 'move' }}
                    />
                    <h3
                        className={`font-bold ${image.hide &&
                        'text-red-600'} flex align-center`}
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
                <div className="self-end flex">
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
                            <VisibilityIcon className="mr-4"/>
                        ) : (
                            <VisibilityOffIcon className="mr-4"/>
                        )}
                    </span>

                    <Edit
                        onClick={() => setEditDialogOpen(true)}
                        className="mr-4 cursor-pointer"
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
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
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
                <CardContent className="flex" style={{ padding: 0 }}>
                    {iiif ? (
                        <PreviewImage i={props.i as never} iiif={iiif as never}/>
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
