import React from 'react'
import './index.css'
import AppBar from './components/AppBar'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import Card from './components/Card'
import { DndProvider } from 'react-dnd'
import FilterList from './components/FilterList'
import { HTML5Backend } from 'react-dnd-html5-backend'
import postUpdate from './api/postUpdate'
import { useTranslation } from 'react-i18next'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useAuth0 } from './react-auth0-spa'
import { AxiosError } from "axios"
import {
    addIndex,
    assoc,
    curry,
    dissoc,
    inc,
    insert,
    lensPath,
    map,
    over,
    propEq,
    reduce,
    reject,
    set,
    view,
} from 'ramda'
import SettingsIcon from '@material-ui/icons/Settings'
import Dialog from './components/Dialog'
import InfiniteScroll from 'react-infinite-scroller'
import CardDropZone from './components/CardDropZone'
import { getOrInitManifest } from './api/getManifest'
import VolumeSearch from './components/VolumeSearch'
import UpdateManifestError from './components/UpdateManifestError'
import { Buda } from '../types'
import { setManifest } from './redux/actions/manifest'
import { connect } from 'react-redux'

const mapIndex = addIndex(map)
const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#212121',
        },
    },
})

const imageListLens = lensPath(['view', 'view1', 'imagelist'])

type ImageAndRemove = Buda.Image & { remove?: boolean }

function App(props: any) {
    const { manifest } = props

    const [settingsDialogOpen, setSettingsDialog] = React.useState(false)
    const imageList = (view(imageListLens, manifest) as Buda.Image[]) || []
    const [isFetching, setIsFetching] = React.useState(false)
    const [fetchErr, setFetchErr] = React.useState<string|null>(null)
    const [renderToIdx, setRenderToIdx] = React.useState(9)
    const [isLoadingMore, setIsLoadingMore] = React.useState(false)
    const [postErr, setPostErr] = React.useState<string|null>(null)

    const { dispatch } = props

    const search = window.location.search
    const params = new URLSearchParams(search)
    const volume = params.get('volume') || props.volume
    
    //console.log("vol:",volume,props,manifest)
    
    if(!volume && !manifest.isDefault) { 
        manifest.isDefault = true
        if(manifest.imggroup) delete manifest.imggroup 
    }

    // fix for hot reload triggering "Cannot have two HTML5 backends at the same time" error
    // (see https://github.com/react-dnd/react-dnd/issues/894#issuecomment-386698852)
    (window as any).__isReactDndBackendSetUp = false;

    React.useEffect(() => {
        return () => {
            //console.log("unmounting BVMT")
        }
    }, [])

    React.useEffect(() => {
        setFetchErr(null)
        if (!volume) {
            setIsFetching(false)
        } else {
            const getData = async () => {
                setIsFetching(true)
                try {
                    const { manifest } = await getOrInitManifest(volume, {
                        uiLanguage: 'en',
                    })
                    setIsFetching(false)
                    dispatch(setManifest(manifest))
                } catch (error) {
                    const err = error as AxiosError
                    setIsFetching(false)
                    setFetchErr(err.message)
                }
            }
            getData()
        }
    }, [dispatch,volume])

    const saveUpdatesToManifest = async (auth: any) => {
        try {
            const removeCollapsed = map(dissoc('collapsed'))
            const formattedManifest = over(
                imageListLens,
                removeCollapsed,
                manifest
            )
            await postUpdate(formattedManifest, auth)
        } catch (error) {
            const err = error as AxiosError
            if (err.response) {
                setPostErr(err.response.data)
            } else if (err.request) {
                setPostErr(err.request)
            } else {
                setPostErr(err.message)
            }
        }
    }
    const updateImageList = (updatedImageList: Buda.Image[]) => {
        props.dispatch(
            setManifest(set(imageListLens, updatedImageList, manifest))
        )
    }
    const handleLoadMore = () => {
        setRenderToIdx(renderToIdx + 10)
        // setting this isfetching stops the infinite scroll from getting caught in a loop
        setIsLoadingMore(true)
        setTimeout(() => {
            setIsLoadingMore(false)
        }, 3000)
    }
    const sectionInUseCount = (sectionId: string) => {
        return reduce(
            (acc: number, val: Buda.Image) => {
                return val.sectionId === sectionId ? ++acc : acc
            },
            0,
            imageList
        )
    }
    const handleSettingsUpdate = curry((lens, value) => {
        const updatedManifest = set(lens, value, manifest)
        props.dispatch(setManifest(updatedManifest))
    })

    const rearrangeImage = (imageId: string, idx: number) => {
        const { image, images } = reduce(
            (acc: {image: Buda.Image | null, images: Buda.Image[]}, val: Buda.Image) => {
                if (val.id === imageId) {
                    acc.image = val
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
        const tmpList = insert(idx+1, image, images)
        // TODO: check
        const updatedImageList = tmpList.filter( (img: Buda.Image | null, i: number) => {
          return img && (imageId != img.id || i == idx+1)
        }) as Buda.Image[]
        updateImageList(updatedImageList)
    }

    const foldCheckedImages = () => {
        const updatedImageList = map(
            image => (image.reviewed ? assoc('collapsed', true, image) : image),
            imageList
        )
        updateImageList(updatedImageList)
    }

    const { t } = useTranslation()
    const auth = useAuth0()

    const imageListLength = imageList.length

    return (
        <ThemeProvider theme={theme}>
            <DndProvider backend={HTML5Backend}>
                <AppBar
                    manifest={manifest}
                    handleSettingsUpdate={handleSettingsUpdate}
                >
                    <>{!manifest.isDefault && (
                        <FilterList
                            handleSettingsUpdate={handleSettingsUpdate}
                            manifest={manifest}
                            foldCheckedImages={foldCheckedImages}
                        />
                    )}</>
                </AppBar>
                <UpdateManifestError
                    postErr={postErr}
                    setPostErr={setPostErr}
                />

                {manifest.isDefault ? (
                    <VolumeSearch
                        isFetching={isFetching}
                        fetchErr={fetchErr}
                        {...(manifest && manifest['imggroup']
                            ? { forVolume: manifest['imggroup'] }
                            : {})}
                    />
                ) : (
                    <div className="App" style={{ paddingTop: 125 }}>
                        <div>
                            <Dialog
                                appData={manifest.appData}
                                sectionInUseCount={sectionInUseCount}
                                open={settingsDialogOpen}
                                handleClose={() => setSettingsDialog(false)}
                                manifest={manifest}
                                handleSettingsUpdate={handleSettingsUpdate}
                            />
                            <div className="container mx-auto flex flex-row py-6">
                                <div className="w-1/2 flex flex-col">
                                    <span className="text-gray-600 text-sm">
                                        {t('Volume')}
                                    </span>
                                    <span className="text-sm font-bold text-xl mb-3">
                                        {manifest['imggroup']}
                                        <span
                                            onClick={() =>
                                                setSettingsDialog(true)
                                            }
                                            className="underline text-md font-medium cursor-pointer"
                                        >
                                            <SettingsIcon />
                                        </span>
                                    </span>
                                    {/*<span className="underline text-blue-600 cursor-pointer">*/}
                                    {/*    {t('Preview')}*/}
                                    {/*</span>*/}
                                </div>
                                <div className="w-1/2 flex flex-col">
                                    <div className="self-end">
                                        {(props.auth?.isAuthenticated || auth.isAuthenticated) && (
                                            <span
                                                className="underline text-md font-medium cursor-pointer mr-5"
                                                onClick={() =>
                                                    saveUpdatesToManifest(props.auth?props.auth:auth)
                                                }
                                            >
                                                {t('SAVE')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="container mx-auto">
                                <InfiniteScroll
                                    pageStart={0}
                                    key={0}
                                    loadMore={handleLoadMore}
                                    hasMore={
                                        imageList.length > renderToIdx &&
                                        !isLoadingMore
                                    }
                                    loader={
                                        <div
                                            key="circular"
                                            className="container mx-auto flex items-center justify-center"
                                        >
                                            <CircularProgress />
                                        </div>
                                    }
                                    useWindow={true}
                                >
                                    {imageList.slice(0, renderToIdx).map(
                                        (item: Buda.Image, i: number) => (
                                            <React.Fragment key={i}>
                                                {i === 0 && (
                                                    <CardDropZone
                                                        i={-1}
                                                        handleDrop={
                                                            rearrangeImage
                                                        }
                                                    />
                                                )}
                                                <Card
                                                    imageListLength={
                                                        imageListLength
                                                    }
                                                    data={item}
                                                    key={item.id}
                                                    i={i}
                                                />
                                                <CardDropZone
                                                    i={i}
                                                    handleDrop={rearrangeImage}
                                                />
                                            </React.Fragment>
                                        )
                                    )}
                                </InfiniteScroll>
                            </div>
                        </div>
                    </div>
                )}
            </DndProvider>
        </ThemeProvider>
    )
}

const mapStateToProps = function(state: any) {
    return {
        manifest: state.manifest,
    }
}

export default connect(mapStateToProps)(App)
