import React from 'react'
import './index.css'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import Card from './components/Card'
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import postUpdate from './api/postUpdate'
import { useTranslation } from 'react-i18next'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useAuth0 } from './react-auth0-spa'
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
import Dialog from './components/Dialog'
import InfiniteScroll from 'react-infinite-scroller'
import CardDropZone from './components/CardDropZone'
import { getOrInitManifest } from './api/getManifest'
import VolumeSearch from './components/VolumeSearch'
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

function App(props: any) {
    const { manifest } = props

    const [settingsDialogOpen, setSettingsDialog] = React.useState(false)
    const imageList = (view(imageListLens, manifest) as Buda.Image[]) || []
    const [isFetching, setIsFetching] = React.useState(false)
    const [fetchErr, setFetchErr] = React.useState(null)
    const [renderToIdx, setRenderToIdx] = React.useState(9)
    const [isLoadingMore, setIsLoadingMore] = React.useState(false)
    const [postErr, setPostErr] = React.useState(null)

    const { dispatch } = props
    React.useEffect(() => {
        const search = window.location.search
        const params = new URLSearchParams(search)
        const volume = params.get('volume')
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
                } catch (err) {
                    setIsFetching(false)
                    setFetchErr(err.message)
                }
            }
            getData()
        }
    }, [dispatch])

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
            if (error.response) {
                setPostErr(error.response.data)
            } else if (error.request) {
                setPostErr(error.request)
            } else {
                setPostErr(error.message)
            }
        }
    }
    const updateImageList = (updatedImageList: unknown[]) => {
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
    const { user = {} } = useAuth0()
    console.log('user', user)

    return (
        <ThemeProvider theme={theme}>
            <DndProvider backend={Backend}>
                {/*<AppBar*/}
                {/*    manifest={manifest}*/}
                {/*    handleSettingsUpdate={handleSettingsUpdate}*/}
                {/*/>*/}
                {/*<UpdateManifestError*/}
                {/*    postErr={postErr}*/}
                {/*    setPostErr={setPostErr}*/}
                {/*/>*/}
                <div>
                    <div className="bg-gray-800 pb-32">
                        <nav className="bg-gray-800">
                            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                                <div className="border-b border-gray-700">
                                    <div className="flex items-center justify-between h-16 px-4 sm:px-0">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <img
                                                    className="h-8 w-8"
                                                    src="https://tailwindui.com/img/logos/workflow-mark-on-dark.svg"
                                                    alt="Workflow logo"
                                                />
                                            </div>
                                            <div className="hidden md:block">
                                                <div className="ml-10 flex items-baseline space-x-4">
                                                    <a
                                                        href="#"
                                                        className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700"
                                                    >
                                                        Manifest Tool
                                                    </a>

                                                    {/*<a*/}
                                                    {/*    href="#"*/}
                                                    {/*    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"*/}
                                                    {/*>*/}
                                                    {/*    Team*/}
                                                    {/*</a>*/}

                                                    {/*<a*/}
                                                    {/*    href="#"*/}
                                                    {/*    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"*/}
                                                    {/*>*/}
                                                    {/*    Projects*/}
                                                    {/*</a>*/}

                                                    {/*<a*/}
                                                    {/*    href="#"*/}
                                                    {/*    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"*/}
                                                    {/*>*/}
                                                    {/*    Calendar*/}
                                                    {/*</a>*/}

                                                    {/*<a*/}
                                                    {/*    href="#"*/}
                                                    {/*    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"*/}
                                                    {/*>*/}
                                                    {/*    Reports*/}
                                                    {/*</a>*/}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="hidden md:block">
                                            <div className="ml-4 flex items-center md:ml-6">
                                                <button
                                                    className="p-1 border-2 border-transparent text-gray-400 rounded-full hover:text-white focus:outline-none focus:text-white focus:bg-gray-700"
                                                    aria-label="Notifications"
                                                >
                                                    <svg
                                                        className="h-6 w-6"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                                        />
                                                    </svg>
                                                </button>

                                                <div className="ml-3 relative">
                                                    <div>
                                                        <button
                                                            className="max-w-xs flex items-center text-sm rounded-full text-white focus:outline-none focus:shadow-solid"
                                                            id="user-menu"
                                                            aria-label="User menu"
                                                            aria-haspopup="true"
                                                        >
                                                            <img
                                                                className="h-8 w-8 rounded-full"
                                                                src={
                                                                    user.picture
                                                                }
                                                                alt=""
                                                            />
                                                        </button>
                                                    </div>

                                                    {/*<div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg">*/}
                                                    {/*    <div className="py-1 rounded-md bg-white shadow-xs">*/}
                                                    {/*        <a*/}
                                                    {/*            href="#"*/}
                                                    {/*            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"*/}
                                                    {/*        >*/}
                                                    {/*            Your Profile*/}
                                                    {/*        </a>*/}

                                                    {/*        <a*/}
                                                    {/*            href="#"*/}
                                                    {/*            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"*/}
                                                    {/*        >*/}
                                                    {/*            Settings*/}
                                                    {/*        </a>*/}

                                                    {/*        <a*/}
                                                    {/*            href="#"*/}
                                                    {/*            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"*/}
                                                    {/*        >*/}
                                                    {/*            Sign out*/}
                                                    {/*        </a>*/}
                                                    {/*    </div>*/}
                                                    {/*</div>*/}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="-mr-2 flex md:hidden">
                                            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white">
                                                <svg
                                                    className="block h-6 w-6"
                                                    stroke="currentColor"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M4 6h16M4 12h16M4 18h16"
                                                    />
                                                </svg>
                                                <svg
                                                    className="hidden h-6 w-6"
                                                    stroke="currentColor"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden border-b border-gray-700 md:hidden">
                                <div className="px-2 py-3 space-y-1 sm:px-3">
                                    <a
                                        href="#"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700"
                                    >
                                        Dashboard
                                    </a>

                                    <a
                                        href="#"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
                                    >
                                        Team
                                    </a>

                                    <a
                                        href="#"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
                                    >
                                        Projects
                                    </a>

                                    <a
                                        href="#"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
                                    >
                                        Calendar
                                    </a>

                                    <a
                                        href="#"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
                                    >
                                        Reports
                                    </a>
                                </div>
                                <div className="pt-4 pb-3 border-t border-gray-700">
                                    <div className="flex items-center px-5 space-x-3">
                                        <div className="flex-shrink-0">
                                            <img
                                                className="h-10 w-10 rounded-full"
                                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                alt=""
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-base font-medium leading-none text-white">
                                                Tom Cook
                                            </div>
                                            <div className="text-sm font-medium leading-none text-gray-400">
                                                tom@example.com
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="mt-3 px-2 space-y-1"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="user-menu"
                                    >
                                        <a
                                            href="#"
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
                                            role="menuitem"
                                        >
                                            Your Profile
                                        </a>

                                        <a
                                            href="#"
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
                                            role="menuitem"
                                        >
                                            Settings
                                        </a>

                                        <a
                                            href="#"
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
                                            role="menuitem"
                                        >
                                            Sign out
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </nav>
                        <header className="py-10">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <h1 className="text-3xl leading-9 font-bold text-white">
                                    {manifest['for-volume']}
                                    {/*<span*/}
                                    {/*    onClick={() => setSettingsDialog(true)}*/}
                                    {/*    className="underline text-md font-medium cursor-pointer"*/}
                                    {/*>*/}
                                    {/*    <SettingsIcon />*/}
                                    {/*</span>*/}
                                </h1>
                                <div>
                                    <div className="sm:hidden">
                                        <select
                                            aria-label="Selected tab"
                                            className="mt-1 form-select block w-full pl-3 pr-10 py-2 text-base leading-6 border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5 transition ease-in-out duration-150"
                                        >
                                            <option>My Account</option>
                                            <option>Company</option>
                                            <option selected>
                                                Team Members
                                            </option>
                                            <option>Billing</option>
                                        </select>
                                    </div>
                                    <div className="hidden sm:block">
                                        <div className="border-b border-gray-200">
                                            <nav className="-mb-px flex">
                                                <a
                                                    href="#"
                                                    className="whitespace-no-wrap py-4 px-1 border-b-2 border-white font-medium text-sm leading-5 text-white focus:outline-none focus:text-indigo-800 focus:border-indigo-700"
                                                    aria-current="page"
                                                >
                                                    Images
                                                </a>
                                                <a
                                                    href="#"
                                                    className="whitespace-no-wrap ml-8 py-4 px-1 border-b-2 border-transparent font-medium text-sm leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300"
                                                >
                                                    Settings
                                                </a>
                                                {/*<a*/}
                                                {/*    href="#"*/}
                                                {/*    className="whitespace-no-wrap ml-8 py-4 px-1 border-b-2 border-indigo-500 font-medium text-sm leading-5 text-indigo-600 focus:outline-none focus:text-indigo-800 focus:border-indigo-700"*/}
                                                {/*    aria-current="page"*/}
                                                {/*>*/}
                                                {/*    Team Members*/}
                                                {/*</a>*/}
                                                {/*<a*/}
                                                {/*    href="#"*/}
                                                {/*    className="whitespace-no-wrap ml-8 py-4 px-1 border-b-2 border-transparent font-medium text-sm leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300"*/}
                                                {/*>*/}
                                                {/*    Billing*/}
                                                {/*</a>*/}
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </header>
                    </div>

                    <main className="-mt-32">
                        <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
                            <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
                                {manifest.isDefault || !auth.user ? (
                                    <VolumeSearch
                                        isFetching={isFetching}
                                        fetchErr={fetchErr}
                                        {...(manifest && manifest['for-volume']
                                            ? {
                                                  forVolume:
                                                      manifest['for-volume'],
                                              }
                                            : {})}
                                    />
                                ) : (
                                    <div className="App">
                                        <div>
                                            <Dialog
                                                appData={manifest.appData}
                                                sectionInUseCount={
                                                    sectionInUseCount
                                                }
                                                open={settingsDialogOpen}
                                                handleClose={() =>
                                                    setSettingsDialog(false)
                                                }
                                                manifest={manifest}
                                                handleSettingsUpdate={
                                                    handleSettingsUpdate
                                                }
                                            />
                                            <div className="pb-5 border-b border-gray-200 space-y-3 sm:flex sm:items-center sm:justify-between sm:space-x-4 sm:space-y-0">
                                                {/*<h3*/}
                                                {/*    onClick={() =>*/}
                                                {/*        setSettingsDialog(true)*/}
                                                {/*    }*/}
                                                {/*    className="underline text-lg leading-6 font-medium cursor-pointer text-black"*/}
                                                {/*>*/}
                                                {/*    Edit*/}
                                                {/*</h3>*/}
                                                <div className="flex space-x-3">
                                                    <span className="shadow-sm rounded-md">
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out"
                                                        >
                                                            Fold Checked Images
                                                        </button>
                                                    </span>
                                                    <span className="shadow-sm rounded-md">
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-700 active:bg-indigo-700 transition duration-150 ease-in-out"
                                                        >
                                                            Hide Deleted Images
                                                        </button>
                                                    </span>
                                                </div>
                                            </div>

                                            {/*<div className="container mx-auto flex flex-row">*/}
                                            {/*    /!*<div className="w-1/2 flex flex-col">*!/*/}
                                            {/*    /!*    <span className="text-gray-600 text-sm">*!/*/}
                                            {/*    /!*        {t('Volume')}*!/*/}
                                            {/*    /!*    </span>*!/*/}
                                            {/*    /!*    <span className="text-sm font-bold text-xl mb-3">*!/*/}
                                            {/*    /!*        {manifest['for-volume']}*!/*/}
                                            {/*    /!*        <span*!/*/}
                                            {/*    /!*            onClick={() =>*!/*/}
                                            {/*    /!*                setSettingsDialog(*!/*/}
                                            {/*    /!*                    true*!/*/}
                                            {/*    /!*                )*!/*/}
                                            {/*    /!*            }*!/*/}
                                            {/*    /!*            className="underline text-md font-medium cursor-pointer"*!/*/}
                                            {/*    /!*        >*!/*/}
                                            {/*    /!*            <SettingsIcon />*!/*/}
                                            {/*    /!*        </span>*!/*/}
                                            {/*    /!*    </span>*!/*/}
                                            {/*    /!*    /!*<span className="underline text-blue-600 cursor-pointer">*!/*!/*/}
                                            {/*    /!*    /!*    {t('Preview')}*!/*!/*/}
                                            {/*    /!*    /!*</span>*!/*!/*/}
                                            {/*    /!*</div>*!/*/}
                                            {/*    <div className="w-1/2 flex flex-col">*/}
                                            {/*        <div className="self-end">*/}
                                            {/*            <span*/}
                                            {/*                className="underline text-md font-medium cursor-pointer mr-5"*/}
                                            {/*                onClick={() =>*/}
                                            {/*                    saveUpdatesToManifest(*/}
                                            {/*                        auth*/}
                                            {/*                    )*/}
                                            {/*                }*/}
                                            {/*            >*/}
                                            {/*                {t('SAVE')}*/}
                                            {/*            </span>*/}
                                            {/*        </div>*/}
                                            {/*    </div>*/}
                                            {/*</div>*/}
                                            {/*<FilterList*/}
                                            {/*    handleSettingsUpdate={*/}
                                            {/*        handleSettingsUpdate*/}
                                            {/*    }*/}
                                            {/*    manifest={manifest}*/}
                                            {/*    foldCheckedImages={*/}
                                            {/*        foldCheckedImages*/}
                                            {/*    }*/}
                                            {/*/>*/}
                                            <div className="container mx-auto">
                                                <InfiniteScroll
                                                    pageStart={0}
                                                    key={0}
                                                    loadMore={handleLoadMore}
                                                    hasMore={
                                                        imageList.length >
                                                            renderToIdx &&
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
                                                    {mapIndex(
                                                        (
                                                            item: Buda.Image,
                                                            i: number
                                                        ) => (
                                                            <React.Fragment
                                                                key={i}
                                                            >
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
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    i={i}
                                                                />
                                                                <CardDropZone
                                                                    i={i}
                                                                    handleDrop={
                                                                        rearrangeImage
                                                                    }
                                                                />
                                                            </React.Fragment>
                                                        ),
                                                        imageList.slice(
                                                            0,
                                                            renderToIdx
                                                        )
                                                    )}
                                                </InfiniteScroll>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
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
