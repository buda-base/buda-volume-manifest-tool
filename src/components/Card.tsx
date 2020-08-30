import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import { red } from '@material-ui/core/colors'
import TextField from '@material-ui/core/TextField'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
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
import { Formik } from 'formik'
import DeleteIcon from '@material-ui/icons/Delete'
import { pathOr } from 'ramda'
import LanguageOptions from './LanguageOptions'
import { connect } from 'react-redux'
import {
    handlePaginationPredication,
    hideCardInManifest,
    insertMissing,
    markPreviousAsReviewed,
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
                    `https://iiif-dev.bdrc.io/${props.volumeId}::${image.filename}/info.json`
                )
                const iiif = data.data
                setiiif(iiif)
                return () => {}
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
            <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                <div className="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-no-wrap">
                    <div className="ml-4 mt-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg
                                    onClick={() => {
                                        props.dispatch(toggleReview(props.i))
                                    }}
                                    className={`h-12 w-12 rounded-full stroke-current cursor-pointer ${
                                        !!image.reviewed
                                            ? 'text-green-400'
                                            : 'text-gray-300'
                                    }`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                {/*<img*/}
                                {/*    className="h-12 w-12 rounded-full"*/}
                                {/*    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"*/}
                                {/*    alt=""*/}
                                {/*/>*/}
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    {image.filename || image.type}
                                </h3>
                                <p className="text-sm leading-5 text-gray-500">
                                    <span>{`(${props.i + 1} of ${
                                        props.imageListLength
                                    })`}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="ml-4 mt-4 flex-shrink-0 flex">
                        <span className="inline-flex rounded-md shadow-sm">
                            <button
                                type="button"
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-50 active:text-gray-800"
                            >
                                <svg
                                    className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                                <span>Phone</span>
                            </button>
                        </span>

                        <span className="ml-3 inline-flex rounded-md shadow-sm">
                            <button
                                type="button"
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-50 active:text-gray-800"
                            >
                                <svg
                                    className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                <span>Email</span>
                            </button>
                        </span>
                    </div>
                </div>
            </div>
            // <div
            //     className="flex p-2 justify-between"
            //     style={{ borderBottom: '1px solid rgb(235, 235, 235)' }}
            // >
            //     <div className="flex">
            //         <DragHandleIcon
            //             className="mr-2"
            //             style={{ cursor: 'move' }}
            //         />
            //         <h3
            //             className={`font-bold ${image.hide &&
            //                 'text-red-600'} flex align-center`}
            //         >
            //             {image.hide && (
            //                 <DeleteIcon
            //                     className="mr-2"
            //                     style={{ color: 'red' }}
            //                 />
            //             )}
            //             {image.filename || image.type}{' '}
            //             <span className="text-gray-500 text-sm ml-4">{`(${props.i +
            //                 1} of ${props.imageListLength})`}</span>
            //         </h3>
            //     </div>
            //     <div className="self-end flex">
            //         {image.note && image.note.length > 0 && (
            //             <NoteIcon className="mr-4" />
            //         )}
            //         <span
            //             className="cursor-pointer"
            //             onClick={() =>
            //                 props.dispatch(toggleCollapseImage(props.i))
            //             }
            //         >
            //             {image.collapsed ? (
            //                 <VisibilityOnIcon className="mr-4" />
            //             ) : (
            //                 <VisibilityOffIcon className="mr-4" />
            //             )}
            //         </span>
            //
            //         <Edit
            //             onClick={() => setEditDialogOpen(true)}
            //             className="mr-4 cursor-pointer"
            //         />
            //
            //         <SimpleMenu />
            //     </div>
            // </div>
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
                        <ArrowUpwardIcon className="mr-2" />
                        {t('Insert One Above')}
                    </MenuItem>
                    <MenuItem
                        onClick={() =>
                            props.dispatch(insertMissing(props.i, 'after'))
                        }
                    >
                        <ArrowDownwardIcon className="mr-2" />
                        {t('Insert One Below')}
                    </MenuItem>

                    {!image.hide && (
                        <MenuItem
                            onClick={() => {
                                props.dispatch(
                                    hideCardInManifest(props.i, true)
                                )
                            }}
                        >
                            <DeleteIcon className="mr-2" />
                            {t('Hide in Manifest')}
                        </MenuItem>
                    )}
                    {image.hide && (
                        <MenuItem
                            onClick={() => {
                                props.dispatch(
                                    hideCardInManifest(props.i, false)
                                )
                            }}
                        >
                            <DeleteIcon className="mr-2" />
                            {t('Unhide in Manifest')}
                        </MenuItem>
                    )}
                    {image.pagination && (
                        <MenuItem
                            onClick={() => {
                                props.dispatch(
                                    updateUncheckedItems(image, props.i)
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
                                props.dispatch(
                                    handlePaginationPredication(props.data)
                                )
                            }}
                        >
                            <ReorderIcon className="mr-2" />
                            {t(
                                'Reorder this image according to indicated pagination'
                            )}
                        </MenuItem>
                    )}
                    <MenuItem
                        onClick={() =>
                            props.dispatch(markPreviousAsReviewed(props.i))
                        }
                    >
                        <CheckBoxIcon className="mr-2" />
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
            className="bg-white shadow overflow-hidden sm:rounded-lg"
            ref={dragRef}
        >
            <EditCard
                open={editDialogOpen}
                setEditDialogOpen={setEditDialogOpen}
                uiLanguage={props.uiLanguage}
                data={image}
                idx={props.i}
            />
            <CardHeader className={classes.cardHeader} component={Header} />
            {!image.collapsed && (
                <CardContent className="flex" style={{ padding: 0 }}>
                    {iiif ? (
                        <PreviewImage i={props.i} iiif={iiif} />
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
                                        props.dispatch(
                                            updateImageValue(
                                                props.i,
                                                'indication',
                                                {
                                                    '@value': marginIndication,
                                                    '@language': language,
                                                }
                                            )
                                        )
                                    }}
                                    enableReinitialize
                                >
                                    {({
                                        values,
                                        handleChange,
                                        handleSubmit,
                                    }) => (
                                        <div>
                                            <label
                                                htmlFor="margin_indication"
                                                className="block text-sm font-medium leading-5 text-gray-700"
                                            >
                                                Margin Indication
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 flex items-center">
                                                    <select
                                                        aria-label="Country"
                                                        className="form-select h-full py-0 pl-3 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm sm:leading-5"
                                                    >
                                                        <LanguageOptions />
                                                    </select>
                                                </div>
                                                <input
                                                    id="margin_indication"
                                                    className="form-input block w-full pl-16 sm:text-sm sm:leading-5"
                                                    value={
                                                        values.marginIndication
                                                    }
                                                    onChange={handleChange}
                                                    name="marginIndication"
                                                    onBlur={() => {
                                                        setTimeout(
                                                            handleSubmit,
                                                            500
                                                        )
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        // <>
                                        //     <TextField
                                        //         label={' '}
                                        //         type="text"
                                        //         value={values.marginIndication}
                                        //         onChange={handleChange}
                                        //         onBlur={() => {
                                        //             setTimeout(
                                        //                 handleSubmit,
                                        //                 500,
                                        //             )
                                        //         }}
                                        //         inputProps={{
                                        //             name: 'marginIndication',
                                        //         }}
                                        //         helperText={t(
                                        //             'Margin Indication',
                                        //         )}
                                        //     />
                                        //     <FormControl>
                                        //         <InputLabel shrink>
                                        //             ''
                                        //         </InputLabel>
                                        //         <Select
                                        //             native
                                        //             value={values.language}
                                        //             onChange={handleChange}
                                        //             onBlur={() => {
                                        //                 setTimeout(
                                        //                     handleSubmit,
                                        //                     500,
                                        //                 )
                                        //             }}
                                        //             inputProps={{
                                        //                 id: 'language',
                                        //             }}
                                        //         >
                                        //             <LanguageOptions/>
                                        //         </Select>
                                        //     </FormControl>
                                        // </>
                                    )}
                                </Formik>

                                {/*<Checkbox*/}
                                {/*    checked={!!image.reviewed}*/}
                                {/*    onChange={() => {*/}
                                {/*        props.dispatch(toggleReview(props.i))*/}
                                {/*    }}*/}
                                {/*    value="reviewed"*/}
                                {/*    color="primary"*/}
                                {/*/>*/}
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
                                                    props.dispatch(
                                                        updateImageSection(
                                                            props.i,
                                                            'section',
                                                            e.target.value
                                                        )
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
                                                        i: React.Key
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
                                                    }
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
                                                    image
                                                ),
                                            }}
                                            onSubmit={({ pagination }) => {
                                                props.dispatch(
                                                    updateImageSection(
                                                        props.i,
                                                        'value',
                                                        pagination
                                                    )
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
                                                            500
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

                        <Tags idx={props.i} id={image.id} tags={image.tags} />

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
        volumeId: manifest['for-volume'],
        manifestLanguage: manifest.appData['bvmt']['default-vol-string-lang'],
        uiLanguage: manifest.appData['bvmt']['default-ui-string-lang'],
        pagination: manifest.pagination,
        sectionInputs: manifest.sections || emptyArr,
    }
}

// @ts-ignore
export default connect(mapStateToProps)(ImageCard)
