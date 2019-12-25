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
import {lensPath, lensProp} from 'ramda'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'

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

const DialogActions = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions)

export default function SettingsDialog(props) {
    const { volume, handleSettingsUpdate, settings } = props

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
                    {/*todo: is this needed here?*/}
                    {/*<TextField*/}
                    {/*    label="Volume Name"*/}
                    {/*   */}
                    {/*    type="text"*/}
                    {/*    value={settings.volume}*/}
                    {/*/>*/}
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
                {/*<h3>Preview</h3>*/}
                {/*<PreviewImage*/}
                {/*    i={2323}*/}
                {/*    setImageView={setImageView}*/}
                {/*    imageView={imageView}*/}
                {/*    zoom={imageView.zoom}*/}
                {/*    showUpdateView*/}
                {/*/>*/}
                {settings.inputOne.sectionInputs.map((data, i) => {
                    return (
                        <div key={i} className="w-full flex mb-6">
                            <div className="w-1/2">
                                <TextField
                                    label="Section 1 name"
                                    type="text"
                                    value={data.value}
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div className="w-1/2 pl-8">
                                <FormControl style={{ width: '100%' }}>
                                    <InputLabel shrink>Language</InputLabel>
                                    <Select
                                        native
                                        value={data.language}
                                        onChange={x => {
                                            console.log('selected', x)
                                        }}
                                    >
                                        <option value="bo">Tibetan</option>
                                        <option value="eng">English</option>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                    )
                })}
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
