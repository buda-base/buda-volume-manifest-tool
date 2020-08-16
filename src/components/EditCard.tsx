import React from 'react'
import { createStyles, Theme, withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import { Checkbox } from '@material-ui/core'
import { pathOr, propOr, trim } from 'ramda'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import AddIcon from '@material-ui/icons/Add'
import { useTranslation } from 'react-i18next'
import { Formik } from 'formik'
import LanguageOptions from './LanguageOptions'
import { connect } from 'react-redux'
import { addNote, removeNote, updateImageValue } from '../redux/actions/manifest'

const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    })

const DialogTitle = withStyles(styles)(
    (props: { children: React.ReactElement; classes: any; onClose: any }) => {
        const { children, classes, onClose, ...other } = props
        return (
            <MuiDialogTitle
                disableTypography
                className={classes.root}
                {...other}
            >
                <Typography variant="h6">{children}</Typography>
                {onClose ? (
                    <IconButton
                        aria-label="close"
                        className={classes.closeButton}
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </MuiDialogTitle>
        )
    }
)

const DialogActions = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions)

function EditCard(props: {
    setEditDialogOpen: any
    data: any
    open: boolean
    uiLanguage: any
    dispatch: any
    idx: number
}) {
    const handleClose = () => {
        props.setEditDialogOpen(false)
    }

    const { data } = props
    const { t } = useTranslation()

    return (
        <div>
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={props.open}
                fullWidth
            >
                <DialogTitle onClose={handleClose}>
                    <>
                        {t('Edit-image')} {data.filename || data.type}
                    </>
                </DialogTitle>
                <div className="p-3">
                    <div className="w-full">
                        <div className="w-1/2">
                            <FormControlLabel
                                style={{ display: 'block' }}
                                control={
                                    <Checkbox
                                        checked={!!data.thumbnailForVolume}
                                        onChange={() => {
                                            props.dispatch(
                                                updateImageValue(
                                                    props.idx,
                                                    'thumbnailForVolume',
                                                    !data.thumbnailForVolume
                                                )
                                            )
                                        }}
                                        value="input-whole-margin"
                                        color="primary"
                                    />
                                }
                                label={t('Thumbnail for Volume')}
                            />

                            <Formik
                                initialValues={{
                                    specialLabel: pathOr(
                                        '',
                                        ['specialLabel', '@value'],
                                        data
                                    ),
                                    language: props.uiLanguage,
                                }}
                                onSubmit={(
                                    { specialLabel, language },
                                    { resetForm }
                                ) => {
                                    props.dispatch(
                                        updateImageValue(
                                            props.idx,
                                            'specialLabel',
                                            {
                                                '@value': trim(specialLabel),
                                                '@language': language,
                                            }
                                        )
                                    )
                                    resetForm()
                                }}
                                enableReinitialize
                            >
                                {({ values, handleChange, handleSubmit }) => (
                                    <div className="w-full flex mb-6">
                                        <div className="w-1/2">
                                            <TextField
                                                label={t('Special Label')}
                                                type="text"
                                                onChange={e => {
                                                    handleChange(e)
                                                }}
                                                onBlur={() => {
                                                    setTimeout(
                                                        handleSubmit,
                                                        500
                                                    )
                                                }}
                                                value={values.specialLabel}
                                                inputProps={{
                                                    id: 'specialLabel',
                                                }}
                                                id="specialLabel"
                                                // onBlur={() => handleSubmit()}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div className="w-1/2 pl-8">
                                            <FormControl
                                                style={{ width: '100%' }}
                                            >
                                                <InputLabel shrink>
                                                    {t('Language')}
                                                </InputLabel>
                                                <Select
                                                    native
                                                    value={values.language}
                                                    onChange={handleChange}
                                                    id="specialLabel-language"
                                                    inputProps={{
                                                        id: 'language',
                                                    }}
                                                >
                                                    <LanguageOptions />
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </div>
                                )}
                            </Formik>
                        </div>
                    </div>

                    <div className="w-full flex mb-6">
                        <div className="w-1/2 flex flex-row">
                            <div className="w-2/3">
                                <FormControlLabel
                                    style={{ display: 'block' }}
                                    control={
                                        <Checkbox
                                            checked={!!data.belongsToVolume}
                                            onChange={e => {
                                                props.dispatch(
                                                    updateImageValue(
                                                        props.idx,
                                                        'belongsToVolume',
                                                        !data.belongsToVolume
                                                    )
                                                )
                                            }}
                                            color="primary"
                                        />
                                    }
                                    label={t('Belongs to vol')}
                                />
                            </div>
                            <div className="w-1/3">
                                <TextField
                                    label={t('Volume Id')}
                                    type="text"
                                    defaultValue={data.belongsToVolId}
                                    onBlur={e => {
                                        props.dispatch(
                                            updateImageValue(
                                                props.idx,
                                                'belongsToVolId',
                                                e.target.value
                                            )
                                        )
                                    }}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-full my-4">
                        <div className="w-2/4">
                            <FormControl style={{ width: '100%' }}>
                                <InputLabel shrink>{t('Page Side')}</InputLabel>
                                <Select
                                    value={data.pageSide || ''}
                                    onChange={e => {
                                        props.dispatch(
                                            updateImageValue(
                                                props.idx,
                                                'pageSide',
                                                e.target.value
                                            )
                                        )
                                    }}
                                    native
                                >
                                    <option value=""></option>
                                    <option value="left">{t('left')}</option>
                                    <option value="right">{t('right')}</option>
                                    <option value="recto">{t('recto')}</option>
                                    <option value="verso">{t('verso')}</option>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div className="w-full flex mb-6 flex-col">
                        <h3 className="block">{t('Notes')}</h3>

                        <Formik
                            initialValues={{
                                note: '',
                                language: props.uiLanguage,
                            }}
                            onSubmit={({ note, language }, { resetForm }) => {
                                props.dispatch(
                                    addNote(props.idx, {
                                        '@value': trim(note),
                                        '@language': language,
                                    })
                                )
                                resetForm()
                            }}
                            enableReinitialize
                        >
                            {({ values, handleChange, handleSubmit }) => (
                                <div className="w-full">
                                    <div className="flex flex-row w-1/2">
                                        <TextField
                                            label={' '}
                                            value={values.note}
                                            onChange={handleChange}
                                            style={{ width: '50%' }}
                                            inputProps={{
                                                id: 'note',
                                            }}
                                            rows={2}
                                            id="note"
                                        />
                                        <FormControl>
                                            <InputLabel shrink>''</InputLabel>
                                            <Select
                                                native
                                                value={values.language}
                                                onChange={handleChange}
                                                id="note-language"
                                                inputProps={{
                                                    id: 'language',
                                                }}
                                            >
                                                <LanguageOptions />
                                            </Select>
                                        </FormControl>
                                        <div onClick={() => handleSubmit()}>
                                            <AddIcon className="self-center cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Formik>

                        <List>
                            {/*
                             // @ts-ignore */}
                            {propOr([], 'note', data).map((note, i) => (
                                <ListItem key={i} button>
                                    <ListItemIcon>
                                        <CloseIcon
                                            onClick={() => {
                                                props.dispatch(
                                                    removeNote(props.idx, i)
                                                )
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={note['@value']}
                                        secondary={note['@language']}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </div>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary">
                        {t('OK')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

const mapStateToProps = function(state: any) {
    return {}
}

export default connect(mapStateToProps)(EditCard)
