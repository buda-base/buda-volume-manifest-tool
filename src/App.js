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
import {
    addIndex,
    append,
    assoc,
    complement,
    compose,
    curry,
    dec,
    dissoc,
    has,
    inc,
    insert,
    lensPath,
    map,
    prop,
    propEq,
    propOr,
    reduce,
    reject,
    remove,
    set,
    trim,
    view,
} from 'ramda'
import SettingsIcon from '@material-ui/icons/Settings'
import Dialog from './components/Dialog'
import uuidv4 from 'uuid/v4'

import CardDropZone from './components/CardDropZone'

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
    const [workingData, setWorkingData] = React.useState(data)
    const [settingsDialogOpen, setSettingsDialog] = React.useState(false)
    const [imageView, setImageView] = React.useState({
        zoom: 0,
        center: { x: null, y: null },
    })
    const imageList = view(imageListLens, workingData)
    const [settings, updateSettings] = React.useState({
        volume: 'bdr:V22084_I0888',
        defaultLanguage: 'en',
        volumeLanguage: 'tibetan',
        showCheckedImages: true,
        showHiddenImages: true,
        viewingDirection: 'left-to-right',
        inputOne: {
            paginationType: 'folio',
            inputForWholeMargin: true,
            sectionInputs: [
                { value: 'Section 1a', language: 'bo', id: uuidv4() },
                { value: 'Section 2a', language: 'bo', id: uuidv4() },
            ],
            indicationOdd: '{volname}-{sectionname}-{pagenum:bo}',
            indicationEven: '{volname}',
        },
        comments: '',
    })

    const sectionInUseCount = sectionId => {
        const count = reduce(
            (acc, val) => {
                return val.sectionId === sectionId ? ++acc : acc
            },
            0,
            imageList
        )
        return count
    }

    const handleSettingsUpdate = curry((lens, value) => {
        const updatedSettings = set(lens, value, settings)
        updateSettings(updatedSettings)
    })

    const updateImageList = updatedImageList => {
        setWorkingData(set(imageListLens, updatedImageList, workingData))
    }

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

    const duplicateImageOptions = compose(
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
                    <AppBar
                        settings={settings}
                        handleSettingsUpdate={handleSettingsUpdate}
                    />
                    <div className="container mx-auto flex flex-row py-6">
                        <div className="w-1/2 flex flex-col">
                            <span className="text-gray-600 text-sm">
                                {t('Volume')}
                            </span>
                            <span className="text-sm font-bold text-xl mb-3">
                                {settings.volume}
                                <span
                                    onClick={() => setSettingsDialog(true)}
                                    className="underline text-md font-medium cursor-pointer"
                                >
                                    <SettingsIcon />
                                </span>
                            </span>
                            <span className="underline text-blue-600 cursor-pointer">
                                Preview
                            </span>
                        </div>
                        <div className="w-1/2 flex flex-col">
                            <div className="self-end">
                                <span className="underline text-md font-medium cursor-pointer mr-5">
                                    SAVE
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
                                        setPagination={setPagination}
                                        updateImageSection={updateImageSection}
                                        sectionInputs={
                                            settings.inputOne.sectionInputs
                                        }
                                        updateImageValue={updateImageValue}
                                        selectType={selectType}
                                        addNote={addNote}
                                        imageView={imageView}
                                        data={item}
                                        deleteImageChip={deleteImageChip}
                                        toggleReview={toggleReview}
                                        insertMissing={insertMissing}
                                        toggleHideImage={toggleHideImage}
                                        key={item.id}
                                        duplicateImageOptions={
                                            duplicateImageOptions
                                        }
                                        setImageView={setImageView}
                                        i={i}
                                        updateDuplicateOf={updateDuplicateOf}
                                        setDuplicateType={setDuplicateType}
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
                    </div>
                </div>
            </DndProvider>
        </ThemeProvider>
    )
}

export default App
