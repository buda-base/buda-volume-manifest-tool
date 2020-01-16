import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import {Checkbox} from '@material-ui/core'
import {includes, map, path, propOr, reject, toPairs} from 'ramda'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import Chip from '@material-ui/core/Chip'
import AddIcon from '@material-ui/icons/Add'
import tags from '../tags'

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

const DialogContent = withStyles(theme => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent)

const DialogActions = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions)

export default function EditCard(props) {
    const handleClose = () => {
        props.setEditDialogOpen(false)
    }

    const { data } = props

    const [selectedTag, setSelectedTag] = React.useState('initial')
    const [tagOptions, setTagOptions] = React.useState([])
    const [notesInput, setNotesInput] = React.useState('')

    React.useEffect(() => {
        const options = reject(
            ([tag]) => includes(tag, propOr([], 'tags', data)),
            toPairs(tags)
        )
        setSelectedTag(options[0][0])
        setTagOptions(options)
    }, [data.tags])

    return (
        <div>
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={props.open}
                fullWidth
            >
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Edit {data.filename || data.type}
                </DialogTitle>
                <div className="p-3">
                    <div className="w-full">
                        <div className="w-1/2">
                            <FormControlLabel
                                style={{ display: 'block' }}
                                control={
                                    <Checkbox
                                        checked={true}
                                        onChange={e => {
                                            console.log(e)
                                        }}
                                        value="input-whole-margin"
                                        color="primary"
                                        inputProps={{
                                            'aria-label': 'primary checkbox',
                                        }}
                                    />
                                }
                                label="Thumbnail for Volume"
                            />
                            <div className="w-full flex mb-6">
                                <div className="w-1/2">
                                    <TextField
                                        label="Special Label"
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
                                            value="bo"
                                            onChange={x => {
                                                console.log('selected', x)
                                            }}
                                        >
                                            <option value="bo">བོད</option>
                                            <option value="eng">English</option>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex mb-6">
                        <div className="w-1/2 flex flex-row">
                            <div className="w-2/3">
                                <FormControlLabel
                                    style={{ display: 'block' }}
                                    control={
                                        <Checkbox
                                            checked={true}
                                            onChange={e => {
                                                console.log(e)
                                            }}
                                            value="input-whole-margin"
                                            color="primary"
                                            inputProps={{
                                                'aria-label':
                                                    'primary checkbox',
                                            }}
                                        />
                                    }
                                    label="Belongs to vol:"
                                />
                            </div>
                            <div className="w-1/3">
                                <TextField
                                    label="Volume Id"
                                    type="text"
                                    value={data.value}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex mb-6 flex-col">
                        <h3 className="block">Tags:</h3>
                        <div className="flex flex-row">
                            <div className="w-1/2">
                                <Select
                                    native
                                    value={selectedTag}
                                    onChange={e => {
                                        setSelectedTag(e.target.value)
                                    }}
                                    style={{ width: '100%' }}
                                >
                                    {tagOptions.map((tag, i) => {
                                        return (
                                            <option key={i} value={tag[0]}>
                                                {path(['label', 'eng'], tag[1])}
                                            </option>
                                        )
                                    })}
                                </Select>
                            </div>

                            {tagOptions.length > 0 && (
                                <AddIcon
                                    className="self-center cursor-pointer"
                                    onClick={() => {
                                        setSelectedTag('')
                                        props.addImageTag(data.id, selectedTag)
                                    }}
                                />
                            )}
                        </div>
                        <div className="flex flex-wrap  max-w-full">
                            {map(tagId => {
                                const tagData = tags[tagId]
                                return (
                                    <div className="m-2" key={tagId}>
                                        <Chip
                                            key={tagId}
                                            label={path(
                                                ['label', 'eng'],
                                                tagData
                                            )}
                                            onDelete={() => {
                                                props.removeImageTag(
                                                    data.id,
                                                    tagId
                                                )
                                            }}
                                        />
                                    </div>
                                )
                            }, propOr([], 'tags', data))}
                        </div>
                    </div>
                    {/*<div className="w-full flex mb-6 flex-col">*/}
                    {/*    <h3 className="block">Crop:</h3>*/}
                    {/*</div>*/}
                    <div className="w-full flex mb-6 flex-col">
                        <h3 className="block">Notes:</h3>
                        <div className="flex flex-row">
                            <TextField
                                value={notesInput}
                                onChange={e => setNotesInput(e.target.value)}
                                style={{ width: '50%' }}
                                multiline
                                rows="2"
                            />
                            <AddIcon
                                className="self-center cursor-pointer"
                                onClick={() => {
                                    if (notesInput.length > 0) {
                                        props.addNote(data.id, notesInput)
                                        setNotesInput('')
                                    }
                                }}
                            />
                        </div>
                        <List>
                            {propOr([], 'note', data).map((note, i) => (
                                <ListItem key={i} button>
                                    <ListItemIcon>
                                        <CloseIcon
                                            onClick={() => {
                                                props.removeNote(data.id, i)
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={note} />
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </div>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
