import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import FormHelperText from '@material-ui/core/FormHelperText'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {always, cond, equals, propEq, reject} from 'ramda'
import TextField from '@material-ui/core/TextField'
import {useTranslation} from 'react-i18next'
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

const TypeSelect = props => {
    const {t} = useTranslation();
    const classes = useStyles();
    const type = cond([
        [equals('duplicate'), always('duplicate')],
        [() => props.filename, always('file')],
        [equals('missing'), always('missing')],
    ])(props.type);
    return (
        <div className="flex w-full">
            <div>
                <FormControl className={classes.formControl}>
                    <div>
                        <Select
                            native
                            disabled={type === 'missing'}
                            value={type}
                            onChange={e => {
                                props.selectType(props.id, e, props.i)
                            }}
                            style={{ width: 155 }}
                        >
                            <option value="file"></option>
                            {type === 'missing' && (
                                <option value="missing">{t('Missing')}</option>
                            )}
                            <option value="duplicate">{t('Duplicate')}</option>
                        </Select>
                        <FormHelperText>{t('Type')}</FormHelperText>
                    </div>
                </FormControl>
                {type === 'duplicate' && (
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
                                        props.updateDuplicateOf(
                                            props.id,
                                            newValue
                                        )
                                    }}
                                    renderInput={params => {
                                        return (
                                            <TextField
                                                helperText={t('of File')}
                                                {...params}
                                                fullWidth
                                            />
                                        )
                                    }}
                                />
                            </div>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <div>
                                <Select
                                    native
                                    value={props.duplicateType}
                                    onChange={e => {
                                        props.setDuplicateType(
                                            props.id,
                                            e.target.value
                                        )
                                    }}
                                    style={{ width: 250 }}
                                >
                                    <option value="dup-in-original">
                                        {t('Duplicate in Original')}
                                    </option>
                                    <option value="dif-pic-same-page">
                                        {t('Different Picture of Same Page')}
                                    </option>
                                    <option value="same-pic-same-page">
                                        {t('Same Picture of Same Page')}
                                    </option>
                                </Select>
                            </div>
                        </FormControl>
                    </>
                )}
            </div>
        </div>
    )
};

export default TypeSelect
