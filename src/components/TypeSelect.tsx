import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { __, complement, compose, find, has, includes, lensPath, map, propEq, propOr, reject, view } from 'ramda'
import TextField from '@material-ui/core/TextField'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { removeOfField, updateOfField } from '../redux/actions/manifest'
import { Buda } from '../../types'

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: '0 1em 1em 0',
        minWidth: 120,
    },
}))

const TypeSelect = (props: {
    id: any
    duplicateImageOptions: readonly Record<'id', any>[]
    duplicateOf: any
    tags: any
    i?: any
    dispatch: any
}) => {
    const { t } = useTranslation()
    const classes = useStyles()
    const duplicateTags = ['T0018', 'T0017']
    const detailTags = ['T0016']
    const duplicateTag = find(
        // @ts-ignore
        includes(__, duplicateTags),
        propOr([], 'tags', props)
    )
    // @ts-ignore
    const detailTag = find(includes(__, detailTags), propOr([], 'tags', props))
    return (
        <div className="flex w-full">
            <div>
                {!!duplicateTag && (
                    <>
                        <FormControl className={classes.formControl}>
                            <div>
                                <Autocomplete
                                    autoComplete
                                    options={reject(
                                        propEq('id', props.id),
                                        props.duplicateImageOptions
                                    )}
                                    style={{ width: 250, marginLeft: 0 }}
                                    autoSelect
                                    autoHighlight
                                    value={props.duplicateOf}
                                    getOptionLabel={({ name }) => name}
                                    onChange={(event: any, newValue: any) => {
                                        if (!newValue) {
                                            props.dispatch(
                                                removeOfField(
                                                    props.i,
                                                    'duplicate-of'
                                                )
                                            )
                                        } else {
                                            props.dispatch(
                                                updateOfField(
                                                    props.i,
                                                    newValue,
                                                    'duplicate-of'
                                                )
                                            )
                                        }
                                    }}
                                    renderInput={params => {
                                        return (
                                            <TextField
                                                helperText={t(
                                                    'Duplicate of File'
                                                )}
                                                {...params}
                                                fullWidth
                                            />
                                        )
                                    }}
                                />
                            </div>
                        </FormControl>
                    </>
                )}
                {!!detailTag && (
                    <>
                        <FormControl className={classes.formControl}>
                            <div>
                                <Autocomplete
                                    autoComplete
                                    options={reject(
                                        propEq('id', props.id),
                                        props.duplicateImageOptions
                                    )}
                                    style={{ width: 250 }}
                                    autoSelect
                                    autoHighlight
                                    value={props.duplicateOf}
                                    getOptionLabel={({ name }) => name}
                                    onChange={(event: any, newValue: any) => {
                                        if (!newValue) {
                                            props.dispatch(
                                                removeOfField(
                                                    props.i,
                                                    'detail-of'
                                                )
                                            )
                                        } else {
                                            props.dispatch(
                                                updateOfField(
                                                    props.i,
                                                    newValue,
                                                    'detail-of'
                                                )
                                            )
                                        }
                                    }}
                                    renderInput={params => {
                                        return (
                                            <TextField
                                                helperText={t('Detail of File')}
                                                {...params}
                                                fullWidth
                                            />
                                        )
                                    }}
                                />
                            </div>
                        </FormControl>
                    </>
                )}
            </div>
        </div>
    )
}

TypeSelect.whyDidYouRender = false

const mapStateToProps = function(state: any) {
    const imageListLens = lensPath(['view', 'view1', 'imagelist'])
    const imageList = (view(imageListLens, state.manifest) as Buda.Image[]) || []
    return {
        duplicateImageOptions: compose(
            map(({ id, filename }) => ({ id, name: filename })),
            // @ts-ignore
            reject(complement(has)('filename'))
            // @ts-ignore
        )(imageList)
    }
}

export default connect(mapStateToProps)(TypeSelect)
