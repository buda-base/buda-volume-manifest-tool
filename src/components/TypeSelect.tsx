import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { __, find, includes, propEq, propOr, reject } from 'ramda'
import TextField from '@material-ui/core/TextField'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: '0 1em 1em 0',
        minWidth: 120,
    },
}))

const TypeSelect = props => {
    const { t } = useTranslation()
    const classes = useStyles()
    const duplicateTags = ['T0018', 'T0017']
    const detailTags = ['T0016']
    const duplicateTag = find(
        includes(__, duplicateTags),
        propOr([], 'tags', props)
    )
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
                                    onChange={(event, newValue) => {
                                        if (!newValue) {
                                            props.removeOfField(
                                                props.id,
                                                'duplicate-of'
                                            )
                                        } else {
                                            props.updateOfField(
                                                props.id,
                                                newValue,
                                                'duplicate-of'
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
                                    onChange={(event, newValue) => {
                                        if (!newValue) {
                                            props.removeOfField(
                                                props.id,
                                                'detail-of'
                                            )
                                        } else {
                                            props.updateOfField(
                                                props.id,
                                                newValue,
                                                'detail-of'
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

export default TypeSelect
