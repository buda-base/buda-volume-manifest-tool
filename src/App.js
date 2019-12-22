import React from 'react'
import './index.css'
import AppBar from './components/AppBar'
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles'
import Cards from './components/Cards'
import InfoBar from './components/InfoBar'
import data from './manifest-simple'
import {addIndex, assoc, insert, lensPath, map, prop, propOr, reject, set, view,} from 'ramda'
import {Slider} from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings'
import Dialog from "./components/Dialog";

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
    const [settingsDialogOpen, setSettingsDialog] = React.useState(true)
    const imageList = view(imageListLens, workingData)

    const updateImageList = updatedImageList => {
        setWorkingData(set(imageListLens, updatedImageList, workingData))
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
            id: 'UPDATE_THIS',
            type: 'missing',
        }
        if (direction === 'before') {
            updateImageList(insert(i, defaultMissingImage, imageList))
        } else if (direction === 'after') {
            updateImageList(insert(i + 1, defaultMissingImage, imageList))
        }
    }

    const deleteImage = imageId => {
        const updatedImageList = reject(({ id }) => {
            return id === imageId
        }, imageList)
        updateImageList(updatedImageList)
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

    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <Dialog open={settingsDialogOpen} handleClose={() => setSettingsDialog(false)} />
                <AppBar />
                <div className="container mx-auto flex flex-row py-6">
                    <div className="w-1/2 flex flex-col">
                        <span className="text-gray-600 text-sm">Volume:</span>
                        <span className="text-sm font-bold text-xl mb-3">
                            S4SAD2SD34
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
                            <span onClick={() => setSettingsDialog(true)} className="underline text-md font-medium cursor-pointer">
                                <SettingsIcon />
                            </span>
                        </div>
                    </div>
                </div>
                <InfoBar />
                <div className="container mx-auto">
                    <div className="mt-5 text-gray-700" style={{ width: 144 }}>
                        <span className="text-xs">Thumbnail Zoom Level:</span>
                        <Slider
                            value={30}
                            onChange={val => console.log('handle change', val)}
                            aria-labelledby="continuous-slider"
                        />
                    </div>
                    {mapIndex(
                        (item, i) => (
                            <Cards
                                data={item}
                                deleteImageChip={deleteImageChip}
                                toggleReview={toggleReview}
                                insertMissing={insertMissing}
                                deleteImage={deleteImage}
                                toggleHideImage={toggleHideImage}
                                key={item.id}
                                i={i}
                            />
                        ),
                        imageList
                    )}
                </div>
            </div>
        </ThemeProvider>
    )
}

export default App
