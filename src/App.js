import React from 'react'
import './index.css'
import AppBar from './components/AppBar'
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles'
import Cards from './components/Cards'
import {DndProvider} from 'react-dnd'
import FilterList from './components/FilterList'
import Backend from 'react-dnd-html5-backend'
import {useTranslation} from 'react-i18next'
import postUpdate from './api/postUpdate'
import CircularProgress from '@material-ui/core/CircularProgress'
import getPagination from './utils/pagination-prediction'
import {useAuth0} from './react-auth0-spa'
import {getComparator} from './utils/pagination-comparators'
import {
    addIndex,
    always,
    append,
    assoc,
    complement,
    compose,
    curry,
    dec,
    dissoc,
    findIndex,
    has,
    inc,
    includes,
    insert,
    intersection,
    lensPath,
    map,
    over,
    pathOr,
    prop,
    propEq,
    propOr,
    reduce,
    reject,
    remove,
    set,
    view,
    when,
} from 'ramda'
import SettingsIcon from '@material-ui/icons/Settings'
import Dialog from './components/Dialog'
import uuidv4 from 'uuid/v4'
import InfiniteScroll from 'react-infinite-scroller'
import CardDropZone from './components/CardDropZone'
import {getOrInitManifest} from './api/getManifest'
import VolumeSearch from './components/VolumeSearch'
import UpdateManifestError from './components/UpdateManifestError'

const mapIndex = addIndex(map);
const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#212121',
        },
    },
});

const imageListLens = lensPath(['view', 'view1', 'imagelist']);
function App() {
    const [manifest, updateManifest] = React.useState({
        isDefault: true,
        volumeData: {
            defaultLanguage: 'en',
        },
        appData: {
            bvmt: {
                'default-ui-string-lang': 'en',
            },
        },
    });
    const [settingsDialogOpen, setSettingsDialog] = React.useState(false);
    const imageList = view(imageListLens, manifest) || [];
    const [isFetching, setIsFetching] = React.useState(false);
    const [fetchErr, setFetchErr] = React.useState(null);
    const [renderToIdx, setRenderToIdx] = React.useState(9);
    const [isLoadingMore, setIsLoadingMore] = React.useState(false);
    const [postErr, setPostErr] = React.useState(null);

    React.useEffect(() => {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const volume = params.get('volume');
        setFetchErr(null);
        if (!volume) {
            setIsFetching(false)
        } else {
            const getData = async () => {
                setIsFetching(true);
                try {
                    const { manifest } = await getOrInitManifest(volume, {
                        uiLanguage: 'en',
                    });
                    setIsFetching(false);
                    updateManifest(manifest)
                } catch (err) {
                    setIsFetching(false);
                    setFetchErr(err.message)
                }
            };
            getData()
        }
    }, []);

    const saveUpdatesToManifest = async auth => {
        try {
            const removeCollapsed = map(dissoc('collapsed'));
            const formattedManifest = over(
                imageListLens,
                removeCollapsed,
                manifest
            );
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
    };
    const updateImageList = updatedImageList => {
        updateManifest(set(imageListLens, updatedImageList, manifest))
    };
    const handleLoadMore = () => {
        setRenderToIdx(renderToIdx + 10);
        // setting this isfetching stops the infinite scroll from getting caught in a loop
        setIsLoadingMore(true);
        setTimeout(() => {
            setIsLoadingMore(false)
        }, 3000)
    };
    const sectionInUseCount = sectionId => {
        return reduce(
            (acc, val) => {
                return val.sectionId === sectionId ? ++acc : acc
            },
            0,
            imageList
        )
    };
    const handleSettingsUpdate = curry((lens, value) => {
        const updatedManifest = set(lens, value, manifest);
        updateManifest(updatedManifest)
    });
    const updateImageSection = (imageId, key, value) => {
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                const sectionLens = lensPath([
                    'pagination',
                    manifest.pagination[0].id,
                    key,
                ]);
                return set(sectionLens, value, image)
            } else {
                return image
            }
        }, imageList);
        updateImageList(updatedImageList)
    };
    const updateOfField = (imageId, val, key) => {
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                return assoc(key, val.name, image)
            } else {
                return image
            }
        }, imageList);
        updateImageList(updatedImageList)
    };
    const setDuplicateType = (imageId, val) => {
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                return assoc('duplicateType', val, image)
            } else {
                return image
            }
        }, imageList);
        updateImageList(updatedImageList)
    };
    const deleteImageChip = (imageId, chipId) => {
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                const updatedChips = reject(
                    ({ id }) => id === chipId,
                    propOr([], 'chips', image)
                );
                return assoc('chips', updatedChips, image)
            } else {
                return image
            }
        }, imageList);
        updateImageList(updatedImageList)
    };
    const toggleReview = imageId => {
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                const reviewed = prop('reviewed', image);
                return compose(
                    image =>
                        !reviewed ? assoc('collapsed', true, image) : image,
                    assoc('reviewed', !reviewed)
                )(image)
            } else {
                return image
            }
        }, imageList);
        updateImageList(updatedImageList)
    };
    const insertMissing = (i, direction) => {
        const defaultMissingImage = {
            id: uuidv4(),
            type: 'missing',
        };
        if (direction === 'before') {
            updateImageList(insert(i, defaultMissingImage, imageList))
        } else if (direction === 'after') {
            updateImageList(insert(i + 1, defaultMissingImage, imageList))
        }
    };
    const toggleCollapseImage = imageId => {
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                const hidden = !!prop('collapsed', image);
                return assoc('collapsed', !hidden, image)
            } else {
                return image
            }
        }, imageList);
        updateImageList(updatedImageList)
    };
    const selectType = (imageId, e, i) => {
        const val = e.target.value;
        const attachDuplicateOfPreImage = image => {
            const previousImage = imageList[dec(i)];
            const fileName = prop('filename', previousImage);
            return fileName
                ? assoc(
                      'duplicateOf',
                      { name: fileName, id: previousImage.id },
                      image
                  )
                : image
        };
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                if (val === 'file') return dissoc('type', image);
                if (val === 'duplicate') {
                    return compose(
                        attachDuplicateOfPreImage,
                        assoc('type', val)
                    )(image)
                }
                return assoc('type', val, image)
            } else {
                return image
            }
        }, imageList);
        updateImageList(updatedImageList)
    };
    const addImageTag = (imageId, tags) => {
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                const duplicateTags = ['T0018', 'T0017'];
                const detailTags = ['T0016'];
                const currentTags = propOr([], 'tags', image);
                const prevTagsHaveDuplicates =
                    intersection(currentTags, duplicateTags).length > 0;
                const prevTagsHaveDetail =
                    intersection(currentTags, detailTags).length > 0;

                const newTagsHaveDuplicates =
                    intersection(tags, duplicateTags).length > 0;

                const newTagsHaveDetail =
                    intersection(tags, detailTags).length > 0;

                const removeDuplicateOf =
                    prevTagsHaveDuplicates && !newTagsHaveDuplicates;
                const removeDetailOf = prevTagsHaveDetail && !newTagsHaveDetail;

                return compose(
                    when(always(removeDuplicateOf), dissoc('duplicate-of')),
                    when(always(removeDetailOf), dissoc('detail-of')),
                    assoc('tags', tags)
                )(image)
            } else {
                return image
            }
        }, imageList);
        updateImageList(updatedImageList)
    };

    const removeOfField = (imageId, ofField) => {
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                return dissoc(ofField, image)
            } else {
                return image
            }
        }, imageList);
        updateImageList(updatedImageList)
    };

    const removeImageTag = (imageId, tag) => {
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                const updatedTags = reject(
                    imgTag => imgTag === tag,
                    propOr([], 'tags', image)
                );
                const duplicateTags = ['T0018', 'T0017'];
                const detailTags = ['T0016'];
                const isDuplicateTag = includes(tag, duplicateTags);
                const isDetailTag = includes(tag, detailTags);

                return compose(
                    when(always(isDuplicateTag), dissoc('duplicate-of')),
                    when(always(isDetailTag), dissoc('detail-of')),
                    assoc('tags', updatedTags)
                )(image)
            } else {
                return image
            }
        }, imageList);
        updateImageList(updatedImageList)
    };
    const setPagination = (imageId, pagination) => {
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                return assoc('pagination', pagination, image)
            } else {
                return image
            }
        }, imageList);
        updateImageList(updatedImageList)
    };
    const addNote = (imageId, note) => {
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                const updatedNotes = append(note, propOr([], 'note', image));
                return assoc('note', updatedNotes, image)
            } else {
                return image
            }
        }, imageList);
        updateImageList(updatedImageList)
    };
    const removeNote = (imageId, noteIdx) => {
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                const updatedNotes = remove(
                    noteIdx,
                    1,
                    propOr([], 'note', image)
                );
                return assoc('note', updatedNotes, image)
            } else {
                return image
            }
        }, imageList);
        updateImageList(updatedImageList)
    };
    const updateImageValue = (imageId, key, value) => {
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                return assoc(key, value, image)
            } else {
                return image
            }
        }, imageList);
        updateImageList(updatedImageList)
    };
    const hideCardInManifest = (imageId, hide) => {
        const updatedImageList = map(image => {
            if (image.id === imageId) {
                return compose(
                    assoc('collapsed', hide),
                    assoc('hide', hide)
                )(image)
            } else {
                return image
            }
        }, imageList);
        updateImageList(updatedImageList)
    };
    const markPreviousAsReviewed = imageIdx => {
        const updatedImageList = mapIndex((image, idx) => {
            if (idx <= imageIdx) {
                return assoc('reviewed', true, image)
            } else {
                return image
            }
        }, imageList);
        updateImageList(updatedImageList)
    };
    const duplicateImageOptions = () =>
        compose(
            map(({ id, filename }) => ({ id, name: filename })),
            reject(complement(has)('filename'))
        )(imageList);

    const rearrangeImage = (imageId, idx) => {
        const { image, images } = reduce(
            (acc, val) => {
                if (val.id === imageId) {
                    const valToRemove = assoc('remove', true, val);
                    acc.image = val;
                    acc.images.push(valToRemove);
                    return acc
                }
                acc.images.push(val);
                return acc
            },
            {
                image: null,
                images: [],
            },
            imageList
        );
        const updatedImageList = reject(
            propEq('remove', true),
            insert(inc(idx), image, images)
        );
        updateImageList(updatedImageList)
    };

    const updateUncheckedItems = (id, paginationIndication, idx) => {
        const image0 = imageList[idx];
        const getMargin = getPagination(
            manifest,
            image0
        );
        // TODO: in the future it may depend on more elaborated checks:
        let pagination_id = manifest.pagination[0];
        const updatedImageList = mapIndex((image, i) => {
            const diff = i - idx;
            // TODO: here we shouldn't change anything after the first reviewed image,
            // even if some images are not reviewed
            if (diff > 0 && !image.reviewed) {
                let res = getMargin(diff);
                let newimg = assoc(
                    'indication',
                    res[1],
                    image
                )
                if (!newimg.pagination) {
                    newimg.pagination = {}
                }
                newimg.pagination[pagination_id] = res[0];
                return newimg;
            } else {
                return image
            }
        }, imageList);
        updateImageList(updatedImageList)
    };
    const foldCheckedImages = () => {
        const updatedImageList = map(
            image => (image.reviewed ? assoc('collapsed', true, image) : image),
            imageList
        );
        updateImageList(updatedImageList)
    };

    const handlePaginationPredication = image => {
        const cmp = curry(getComparator)(image.pagination);
        const idx = findIndex(img => cmp(img.pagination) < 0, imageList);
        if (idx !== -1) {
            rearrangeImage(image.id, dec(idx))
        }
    };
    const { t } = useTranslation();
    const auth = useAuth0();

    const imageListLength = imageList.length;

    return (
        <ThemeProvider theme={theme}>
            <DndProvider backend={Backend}>
                <AppBar
                    manifest={manifest}
                    handleSettingsUpdate={handleSettingsUpdate}
                />
                <UpdateManifestError
                    postErr={postErr}
                    setPostErr={setPostErr}
                />
                {manifest.isDefault || !auth.user ? (
                    <VolumeSearch
                        isFetching={isFetching}
                        fetchErr={fetchErr}
                        {...(manifest && manifest['for-volume']
                            ? { forVolume: manifest['for-volume'] }
                            : {})}
                    />
                ) : (
                    <div className="App" style={{ paddingTop: 60 }}>
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
                                        {manifest['for-volume']}
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
                                        <span
                                            className="underline text-md font-medium cursor-pointer mr-5"
                                            onClick={() =>
                                                saveUpdatesToManifest(auth)
                                            }
                                        >
                                            {t('SAVE')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <FilterList
                                handleSettingsUpdate={handleSettingsUpdate}
                                manifest={manifest}
                                foldCheckedImages={foldCheckedImages}
                                updateImageValue={updateImageValue}
                            />
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
                                                        handleDrop={
                                                            rearrangeImage
                                                        }
                                                    />
                                                )}
                                                <Cards
                                                    handlePaginationPredication={
                                                        handlePaginationPredication
                                                    }
                                                    hideCardInManifest={
                                                        hideCardInManifest
                                                    }
                                                    removeOfField={
                                                        removeOfField
                                                    }
                                                    volumeId={
                                                        manifest['for-volume']
                                                    }
                                                    manifestLanguage={
                                                        manifest.appData[
                                                            'bvmt'
                                                        ][
                                                            'default-vol-string-lang'
                                                        ]
                                                    }
                                                    uiLanguage={
                                                        manifest.appData[
                                                            'bvmt'
                                                        ][
                                                            'default-ui-string-lang'
                                                        ]
                                                    }
                                                    pagination={
                                                        manifest.pagination
                                                    }
                                                    imageListLength={
                                                        imageListLength
                                                    }
                                                    setPagination={
                                                        setPagination
                                                    }
                                                    updateImageSection={
                                                        updateImageSection
                                                    }
                                                    sectionInputs={
                                                        manifest.sections || []
                                                    }
                                                    updateImageValue={
                                                        updateImageValue
                                                    }
                                                    selectType={selectType}
                                                    addNote={addNote}
                                                    imageView={pathOr(
                                                        {
                                                            zoom: 0,
                                                            center: {
                                                                x: null,
                                                                y: null,
                                                            },
                                                        },
                                                        [
                                                            'appData',
                                                            'bvmt',
                                                            'preview-image-view',
                                                        ],
                                                        manifest
                                                    )}
                                                    data={item}
                                                    deleteImageChip={
                                                        deleteImageChip
                                                    }
                                                    toggleReview={toggleReview}
                                                    insertMissing={
                                                        insertMissing
                                                    }
                                                    toggleCollapseImage={
                                                        toggleCollapseImage
                                                    }
                                                    key={item.id}
                                                    duplicateImageOptions={duplicateImageOptions()}
                                                    setImageView={handleSettingsUpdate(
                                                        lensPath([
                                                            'appData',
                                                            'bvmt',
                                                            'preview-image-view',
                                                        ])
                                                    )}
                                                    i={i}
                                                    updateOfField={
                                                        updateOfField
                                                    }
                                                    setDuplicateType={
                                                        setDuplicateType
                                                    }
                                                    addImageTag={addImageTag}
                                                    removeImageTag={
                                                        removeImageTag
                                                    }
                                                    removeNote={removeNote}
                                                    markPreviousAsReviewed={
                                                        markPreviousAsReviewed
                                                    }
                                                    updateUncheckedItems={
                                                        updateUncheckedItems
                                                    }
                                                    hideDeletedImages={pathOr(
                                                        false,
                                                        [
                                                            'volumeData',
                                                            'bvmt_props',
                                                            'hideDeletedImages',
                                                        ],
                                                        manifest
                                                    )}
                                                />
                                                <CardDropZone
                                                    i={i}
                                                    handleDrop={rearrangeImage}
                                                />
                                            </React.Fragment>
                                        ),
                                        imageList.slice(0, renderToIdx)
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

export default App
