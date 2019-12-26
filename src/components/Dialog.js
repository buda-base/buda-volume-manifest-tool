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
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import {append, lensPath, lensProp, pathOr, propEq, reject, view} from 'ramda'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import uuidv4 from 'uuid/v4'

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
    const { handleAddSection, handleRemoveSection, sectionInUseCount } = props
    const inputValid = sectionValue.length > 0
    return (
        <div className="w-full flex mb-6">
            <div className="w-1/2">
                <TextField
                    label="Section"
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
                        <InputLabel shrink>Language</InputLabel>
                        <Select
                            native
                            disabled={!props.new}
                            value={languageValue}
                            onChange={e => {
                                setLanguageValue(e.target.value)
                            }}
                        >
                            <option value="bo">Tibetan</option>
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
                                    alert('Section name must not be empty!')
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
                                        `This section is set to ${count} images. Unselect these to remove the section`
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
                Edit
            </DialogTitle>
            <div className="p-3">
                <div>
                    <div className="w-full">
                        <div className="w-2/4">
                            <FormControl style={{ width: '100%' }}>
                                <InputLabel shrink>Volume Language</InputLabel>
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
                                    <option value="bo">Tibetan</option>
                                    <option value="eng">English</option>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                </div>
                <h2 className="mb-3 font-bold">Input 1</h2>
                <div className="w-full">
                    <div className="w-2/4">
                        <FormControl style={{ width: '100%' }}>
                            <InputLabel shrink>Pagination Type</InputLabel>
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
                                <option value="folio">Folio</option>
                                <option value="folio-with-sections">
                                    Folio With Sections
                                </option>
                                <option value="normal">
                                    Normal Pagination
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
                    label="add input for whole margin"
                />
                {settings.inputOne.sectionInputs.map((data, i) => {
                    return (
                        <SectionInput
                            i={i}
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
                        label="Indication (odd)"
                        type="text"
                        value={'{volname}-{sectionname}-{pagenum:bo}'}
                        style={{ width: '50%' }}
                    />
                </div>
                <div className="w-full">
                    <TextField
                        label="Indication (even)"
                        type="text"
                        value={'{volname}'}
                        style={{ width: '50%' }}
                    />
                </div>
                <h3>Comments</h3>
                <div className="block">
                    <TextareaAutosize
                        placeholder="Minimum 3 rows"
                        value={'ka kha'}
                        style={{ width: '50%' }}
                    />
                </div>
                <DialogActions>
                    <Button
                        autoFocus
                        onClick={props.handleClose}
                        color="primary"
                    >
                        Save changes
                    </Button>
                </DialogActions>
            </div>
        </Dialog>
    )
}
