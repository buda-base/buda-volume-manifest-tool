import React from 'react'
import './index.css'
import AppBar from './components/AppBar'
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles'
import Cards from './components/Cards'
import data from './manifest-simple'
import {DndProvider} from 'react-dnd'
import FilterList from './components/FilterList'
import Backend from 'react-dnd-html5-backend'
import {useTranslation} from 'react-i18next'
import postUpdate from './api/postUpdate'
import CircularProgress from '@material-ui/core/CircularProgress'
import {
    addIndex,
    append,
    assoc,
    complement,
    compose,
    concat,
    curry,
    dec,
    dissoc,
    has,
    inc,
    insert,
    isEmpty,
    lensPath,
    map,
    prop,
    propEq,
    propOr,
    reduce,
    reject,
    remove,
    set,
    splitEvery,
    trim,
    view,
} from 'ramda'
import SettingsIcon from '@material-ui/icons/Settings'
import Dialog from './components/Dialog'
import uuidv4 from 'uuid/v4'
import InfiniteScroll from 'react-infinite-scroller'
import CardDropZone from './components/CardDropZone'
import getManifest from './api/getManifest'

const mapIndex = addIndex(map)
const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#212121',
        },
    },
})

const imageListLens = lensPath(['view', 'view1', 'imagelist'])
function App() {
    const [workingData, setWorkingData] = React.useState({})
    const [settingsDialogOpen, setSettingsDialog] = React.useState(false)
    const [imageView, setImageView] = React.useState({
        zoom: 0,
        center: { x: null, y: null },
    })
    const imageList = view(imageListLens, workingData)
    const [settings, updateSettings] = React.useState(data.volumeData)
    const [images, setImages] = React.useState([])
    const [currentImageScrollIdx, setCurrentImageScrollIdx] = React.useState(0)

    React.useEffect(() => {
        const search = window.location.search
        const params = new URLSearchParams(search)
        const volume = params.get('volume')
        const getData = async () => {
            const { manifest, images } = await getManifest(volume)
            const splitImages = splitEvery(10, images)
            const updatedManifest = set(imageListLens, splitImages[0], manifest)
            setWorkingData(updatedManifest)
            setImages(splitImages)
            setCurrentImageScrollIdx(0)
        }
        getData()
    }, [])

    const updateImageList = updatedImageList => {
        setWorkingData(set(imageListLens, updatedImageList, workingData))
    }
    const handleLoadMore = num => {
        const imagesToRender = images[num] || []
        if (!isEmpty(imagesToRender)) {
            const updatedManifestImages = concat(
                view(imageListLens, workingData),
                imagesToRender
            )
            updateImageList(updatedManifestImages)
        }
        setCurrentImageScrollIdx(inc(currentImageScrollIdx))
    }

    const sectionInUseCount = sectionId => {
        return reduce(
            (acc, val) => {
                return val.sectionId === sectionId ? ++acc : acc
            },
            0,
            imageList
        )
    }

    const handleSettingsUpdate = curry((lens, value) => {
        const updatedSettings = set(lens, value, settings)
        updateSettings(updatedSettings)
    })

    const updateImageSection = (imageId, sectionId) => {
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                return assoc('sectionId', sectionId, image)
            } else {
                return image
            }
        }, imageList)
        updateImageList(updatedImageList)
    }
    const updateDuplicateOf = (imageId, val) => {
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                return assoc('duplicateOf', val, image)
            } else {
                return image
            }
        }, imageList)
        updateImageList(updatedImageList)
    }
    const setDuplicateType = (imageId, val) => {
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                return assoc('duplicateType', val, image)
            } else {
                return image
            }
        }, imageList)
        updateImageList(updatedImageList)
    }

    const deleteImageChip = (imageId, chipId) => {
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                const updatedChips = reject(
                    ({ id }) => id === chipId,
                    propOr([], 'chips', image)
                )
                return assoc('chips', updatedChips, image)
            } else {
                return image
            }
        }, imageList)
        updateImageList(updatedImageList)
    }

    const toggleReview = imageId => {
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                const reviewed = prop('reviewed', image)
                return assoc('reviewed', !reviewed, image)
            } else {
                return image
            }
        }, imageList)
        updateImageList(updatedImageList)
    }

    const insertMissing = (i, direction) => {
        const defaultMissingImage = {
            id: uuidv4(),
            type: 'missing',
        }
        if (direction === 'before') {
            updateImageList(insert(i, defaultMissingImage, imageList))
        } else if (direction === 'after') {
            updateImageList(insert(i + 1, defaultMissingImage, imageList))
        }
    }

    const toggleHideImage = imageId => {
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                const hidden = !!prop('hide', image)
                return assoc('hide', !hidden, image)
            } else {
                return image
            }
        }, imageList)
        updateImageList(updatedImageList)
    }

    const selectType = (imageId, e, i) => {
        const val = e.target.value
        const attachDuplicateOfPreImage = image => {
            const previousImage = imageList[dec(i)]
            const fileName = prop('filename', previousImage)
            return fileName
                ? assoc(
                      'duplicateOf',
                      { name: fileName, id: previousImage.id },
                      image
                  )
                : image
        }
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                if (val === 'file') return dissoc('type', image)
                if (val === 'duplicate') {
                    const res = compose(
                        attachDuplicateOfPreImage,
                        assoc('type', val)
                    )(image)
                    return res
                }
                return assoc('type', val, image)
            } else {
                return image
            }
        }, imageList)
        updateImageList(updatedImageList)
    }

    const addImageTag = (imageId, tag) => {
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                const updatedTags = append(tag, propOr([], 'tags', image))
                return assoc('tags', updatedTags, image)
            } else {
                return image
            }
        }, imageList)
        updateImageList(updatedImageList)
    }

    const removeImageTag = (imageId, tag) => {
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                const updatedTags = reject(
                    imgTag => imgTag === tag,
                    propOr([], 'tags', image)
                )
                return assoc('tags', updatedTags, image)
            } else {
                return image
            }
        }, imageList)
        updateImageList(updatedImageList)
    }

    const setPagination = (imageId, pagination) => {
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                return assoc('pagination', pagination, image)
            } else {
                return image
            }
        }, imageList)
        updateImageList(updatedImageList)
    }

    const addNote = (imageId, note) => {
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                const updatedNotes = append(
                    trim(note),
                    propOr([], 'note', image)
                )
                return assoc('note', updatedNotes, image)
            } else {
                return image
            }
        }, imageList)
        updateImageList(updatedImageList)
    }

    const removeNote = (imageId, noteIdx) => {
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                const updatedNotes = remove(
                    noteIdx,
                    1,
                    propOr([], 'note', image)
                )
                return assoc('note', updatedNotes, image)
            } else {
                return image
            }
        }, imageList)
        updateImageList(updatedImageList)
    }

    const updateImageValue = (imageId, key, value) => {
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                return assoc(key, value, image)
            } else {
                return image
            }
        }, imageList)
        updateImageList(updatedImageList)
    }

    const markPreviousAsReviewed = imageIdx => {
        const updatedImageList = mapIndex((image, idx) => {
            if (idx <= imageIdx) {
                return assoc('reviewed', true, image)
            } else {
                return image
            }
        }, imageList)
        updateImageList(updatedImageList)
    }

    const duplicateImageOptions = () =>
        compose(
            map(({ id, filename }) => ({ id, name: filename })),
            reject(complement(has)('filename'))
        )(imageList)

    const handleDrop = (imageId, idx) => {
        const { image, images } = reduce(
            (acc, val) => {
                if (val.id === imageId) {
                    const valToRemove = assoc('remove', true, val)
                    acc.image = val
                    acc.images.push(valToRemove)
                    return acc
                }
                acc.images.push(val)
                return acc
            },
            {
                image: null,
                images: [],
            },
            imageList
        )
        const updatedImageList = reject(
            propEq('remove', true),
            insert(inc(idx), image, images)
        )
        updateImageList(updatedImageList)
    }

    const { t } = useTranslation()

    return (
        <ThemeProvider theme={theme}>
            <DndProvider backend={Backend}>
                <AppBar
                    settings={settings}
                    handleSettingsUpdate={handleSettingsUpdate}
                />
                {isEmpty(workingData) ? (
                    <div className="container mx-auto flex items-center justify-center">
                        <CircularProgress />
                    </div>
                ) : (
                    <div className="App">
                        <Dialog
                            sectionInUseCount={sectionInUseCount}
                            open={settingsDialogOpen}
                            handleClose={() => setSettingsDialog(false)}
                            setImageView={setImageView}
                            imageView={imageView}
                            volume={workingData}
                            handleSettingsUpdate={handleSettingsUpdate}
                            settings={settings}
                        />
                        <div className="container mx-auto flex flex-row py-6">
                            <div className="w-1/2 flex flex-col">
                                <span className="text-gray-600 text-sm">
                                    {t('Volume')}
                                </span>
                                <span className="text-sm font-bold text-xl mb-3">
                                    {workingData['for-volume']}
                                    <span
                                        onClick={() => setSettingsDialog(true)}
                                        className="underline text-md font-medium cursor-pointer"
                                    >
                                        <SettingsIcon />
                                    </span>
                                </span>
                                <span className="underline text-blue-600 cursor-pointer">
                                    {t('Preview')}
                                </span>
                            </div>
                            <div className="w-1/2 flex flex-col">
                                <div className="self-end">
                                    <span
                                        className="underline text-md font-medium cursor-pointer mr-5"
                                        onClick={() => postUpdate(workingData)}
                                    >
                                        {t('SAVE')}
                                    </span>
                                    {/*<span*/}
                                    {/*    onClick={() => setSettingsDialog(true)}*/}
                                    {/*    className="underline text-md font-medium cursor-pointer"*/}
                                    {/*>*/}
                                    {/*    <SettingsIcon />*/}
                                    {/*</span>*/}
                                </div>
                            </div>
                        </div>
                        <FilterList
                            showCheckedImages={settings.showCheckedImages}
                            handleSettingsUpdate={handleSettingsUpdate}
                            showHiddenImages={settings.showHiddenImages}
                        />
                        <div className="container mx-auto">
                            <InfiniteScroll
                                pageStart={0}
                                key={0}
                                loadMore={handleLoadMore}
                                hasMore={images.length > currentImageScrollIdx}
                                loader={
                                    <div className="container mx-auto flex items-center justify-center">
                                        <CircularProgress />
                                    </div>
                                }
                                useWindow={true}
                            >
                                {mapIndex(
                                    (item, i) => (
                                        <React.Fragment key={i}>
                                            {i === 0 && (
                                                <CardDropZone
                                                    i={-1}
                                                    handleDrop={handleDrop}
                                                />
                                            )}
                                            <Cards
                                                volumeId={
                                                    workingData['for-volume']
                                                }
                                                setPagination={setPagination}
                                                updateImageSection={
                                                    updateImageSection
                                                }
                                                sectionInputs={
                                                    settings.inputOne
                                                        .sectionInputs
                                                }
                                                updateImageValue={
                                                    updateImageValue
                                                }
                                                selectType={selectType}
                                                addNote={addNote}
                                                imageView={imageView}
                                                data={item}
                                                deleteImageChip={
                                                    deleteImageChip
                                                }
                                                toggleReview={toggleReview}
                                                insertMissing={insertMissing}
                                                toggleHideImage={
                                                    toggleHideImage
                                                }
                                                key={item.id}
                                                duplicateImageOptions={duplicateImageOptions()}
                                                setImageView={setImageView}
                                                i={i}
                                                updateDuplicateOf={
                                                    updateDuplicateOf
                                                }
                                                setDuplicateType={
                                                    setDuplicateType
                                                }
                                                addImageTag={addImageTag}
                                                removeImageTag={removeImageTag}
                                                removeNote={removeNote}
                                                markPreviousAsReviewed={
                                                    markPreviousAsReviewed
                                                }
                                                showHiddenImages={
                                                    settings.showHiddenImages
                                                }
                                                showCheckedImages={
                                                    settings.showCheckedImages
                                                }
                                            />
                                            <CardDropZone
                                                i={i}
                                                handleDrop={handleDrop}
                                            />
                                        </React.Fragment>
                                    ),
                                    imageList
                                )}
                            </InfiniteScroll>
                        </div>
                    </div>
                )}
            </DndProvider>
        </ThemeProvider>
    )
}

export default App
