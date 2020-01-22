import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import {Checkbox} from '@material-ui/core'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import {append, lensPath, lensProp, pathOr, propEq, reject, view} from 'ramda'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import uuidv4 from 'uuid/v4'
import {useTranslation} from 'react-i18next'

const styles = theme => ({
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

const DialogTitle = withStyles(styles)(props => {
    const { children, classes, onClose, ...other } = props
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
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
})

function SectionInput(props) {
    const value = pathOr('', ['data', 'value'], props)
    const language = pathOr('', ['data', 'value'], props)
    const id = pathOr(null, ['data', 'id'], props)
    const [sectionValue, setSectionValue] = React.useState(value)
    const [languageValue, setLanguageValue] = React.useState(language)
    const {
        handleAddSection,
        handleRemoveSection,
        sectionInUseCount,
        key,
    } = props
    const { t } = useTranslation()
    const inputValid = sectionValue.length > 0
    return (
        <div className="w-full flex mb-6" key={key}>
            <div className="w-1/2">
                <TextField
                    label={t('Section')}
                    type="text"
                    disabled={!props.new}
                    value={sectionValue}
                    style={{ width: '100%' }}
                    onChange={e => {
                        setSectionValue(e.target.value)
                    }}
                />
            </div>
            <div className="w-1/2 pl-8 flex flex-row">
                <div className="w-3/4">
                    <FormControl style={{ width: '100%' }}>
                        <InputLabel shrink>{t('Language')}</InputLabel>
                        <Select
                            native
                            disabled={!props.new}
                            value={languageValue}
                            onChange={e => {
                                setLanguageValue(e.target.value)
                            }}
                        >
                            <option value="bo">བོ</option>
                            <option value="eng">English</option>
                        </Select>
                    </FormControl>
                </div>
                <div className="w-1/4 flex items-center">
                    {props.new ? (
                        <AddCircleIcon
                            style={{
                                color: inputValid ? 'black' : 'gray',
                                cursor: inputValid ? 'pointer' : 'initial',
                            }}
                            onClick={() => {
                                if (inputValid) {
                                    setSectionValue('')
                                    setLanguageValue('')
                                    handleAddSection(
                                        sectionValue,
                                        languageValue
                                    )
                                } else {
                                    alert(t('Section name must not be empty!'))
                                }
                            }}
                        />
                    ) : (
                        <RemoveCircleIcon
                            className="cursor-pointer"
                            onClick={() => {
                                const count = sectionInUseCount(id)
                                if (count > 0) {
                                    alert(
                                        `${t(
                                            'alert before count'
                                        )} ${count} ${t('alert after count')}`
                                    )
                                } else {
                                    handleRemoveSection(id)
                                }
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

const DialogActions = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions)

export default function SettingsDialog(props) {
    const { handleSettingsUpdate, settings, sectionInUseCount } = props

    const handleAddSection = (value, language) => {
        const sectionsLens = lensPath(['inputOne', 'sectionInputs'])
        const currentSections = view(sectionsLens, settings)
        const updatedSections = append(
            { value, language, id: uuidv4() },
            currentSections
        )
        handleSettingsUpdate(sectionsLens, updatedSections)
    }

    const handleRemoveSection = id => {
        const sectionsLens = lensPath(['inputOne', 'sectionInputs'])
        const currentSections = view(sectionsLens, settings)
        const updatedSections = reject(propEq('id', id), currentSections)
        handleSettingsUpdate(sectionsLens, updatedSections)
    }

    const { t } = useTranslation()

    return (
        <Dialog
            onClose={props.handleClose}
            aria-labelledby="customized-dialog-title"
            open={props.open}
            fullWidth
        >
            <DialogTitle
                id="customized-dialog-title"
                onClose={props.handleClose}
            >
                {t('Edit')}
            </DialogTitle>
            <div className="p-3">
                <div>
                    <div className="w-full">
                        <div className="w-2/4">
                            <FormControl style={{ width: '100%' }}>
                                <InputLabel shrink>
                                    {t('Volume Language')}
                                </InputLabel>
                                <Select
                                    value={settings.volumeLanguage}
                                    onChange={e => {
                                        handleSettingsUpdate(
                                            lensProp('volumeLanguage'),
                                            e.target.value
                                        )
                                    }}
                                    native
                                >
                                    <option value="bo">བོ</option>
                                    <option value="eng">English</option>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                </div>
                <h2 className="mb-3 font-bold">{t('Input 1')}</h2>
                <div className="w-full">
                    <div className="w-2/4">
                        <FormControl style={{ width: '100%' }}>
                            <InputLabel shrink>
                                {t('Pagination Type')}
                            </InputLabel>
                            <Select
                                value={settings.inputOne.paginationType}
                                onChange={e => {
                                    handleSettingsUpdate(
                                        lensPath([
                                            'inputOne',
                                            'paginationType',
                                        ]),
                                        e.target.value
                                    )
                                }}
                                native
                            >
                                <option value="folio">{t('Folio')}</option>
                                <option value="folio-with-sections">
                                    {t('Folio With Sections')}
                                </option>
                                <option value="normal">
                                    {t('Normal Pagination')}
                                </option>
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <FormControlLabel
                    style={{ display: 'block' }}
                    control={
                        <Checkbox
                            checked={settings.inputOne.inputForWholeMargin}
                            onChange={e => {
                                handleSettingsUpdate(
                                    lensPath([
                                        'inputOne',
                                        'inputForWholeMargin',
                                    ]),
                                    !settings.inputOne.inputForWholeMargin
                                )
                            }}
                            value="input-whole-margin"
                            color="primary"
                            inputProps={{
                                'aria-label': 'primary checkbox',
                            }}
                        />
                    }
                    label={t('add input for whole margin')}
                />
                <div className="w-full my-4">
                    <div className="w-2/4">
                        <FormControl style={{ width: '100%' }}>
                            <InputLabel shrink>
                                {t('Viewing Direction')}
                            </InputLabel>
                            <Select
                                value={settings.viewingDirection || ''}
                                onChange={e => {
                                    handleSettingsUpdate(
                                        lensPath(['viewingDirection']),
                                        e.target.value
                                    )
                                }}
                                native
                            >
                                <option value=""></option>
                                <option value="top-to-bottom">
                                    {t('top to bottom')}
                                </option>
                                <option value="left-to-right">
                                    {t('left to right')}
                                </option>
                                <option value="right-to-left">
                                    {t('right to left')}
                                </option>
                                <option value="bottom-to-top">
                                    {t('bottom to top')}
                                </option>
                                <option value="continuous">
                                    {t('continuous')}
                                </option>
                            </Select>
                        </FormControl>
                    </div>
                </div>
                {settings.inputOne.sectionInputs.map((data, i) => {
                    return (
                        <SectionInput
                            i={i}
                            key={i}
                            data={data}
                            handleAddSection={handleAddSection}
                            handleRemoveSection={handleRemoveSection}
                            sectionInUseCount={sectionInUseCount}
                        />
                    )
                })}
                <SectionInput
                    new
                    handleAddSection={handleAddSection}
                    handleRemoveSection={handleRemoveSection}
                    sectionInUseCount={sectionInUseCount}
                />
                <div className="w-full">
                    <TextField
                        label={t('Indication (odd)')}
                        type="text"
                        defaultValue={settings.inputOne.indicationOdd}
                        onBlur={e => {
                            handleSettingsUpdate(
                                lensPath(['inputOne', 'indicationOdd']),
                                e.target.value
                            )
                        }}
                        style={{ width: '50%' }}
                    />
                </div>
                <div className="w-full">
                    <TextField
                        label={t('Indication (even)')}
                        type="text"
                        defaultValue={settings.inputOne.indicationEven}
                        style={{ width: '50%' }}
                        onBlur={e => {
                            handleSettingsUpdate(
                                lensPath(['inputOne', 'indicationEven']),
                                e.target.value
                            )
                        }}
                    />
                </div>
                <h3>{t('Comments')}</h3>
                <div className="block">
                    <TextField
                        defaultValue={settings.comments}
                        style={{ width: '50%' }}
                        multiline
                        rows="4"
                        onBlur={e => {
                            handleSettingsUpdate(
                                lensPath(['comments']),
                                e.target.value
                            )
                        }}
                    />
                </div>
                <DialogActions>
                    <Button
                        autoFocus
                        onClick={props.handleClose}
                        color="primary"
                    >
                        {t('OK')}
                    </Button>
                </DialogActions>
            </div>
        </Dialog>
    )
}
