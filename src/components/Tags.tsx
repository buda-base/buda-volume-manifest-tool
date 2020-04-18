import React from 'react'
import Select from '@material-ui/core/Select'
import { includes, toPairs } from 'ramda'
import { useTranslation } from 'react-i18next'
import tags from '../tags.json'
import FormHelperText from '@material-ui/core/FormHelperText'
import { makeStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'

const useStyles = makeStyles(theme => ({
    formControl: {
        minWidth: 120,
        maxWidth: 300,
    },
}))
const Tags = props => {
    const { t } = useTranslation()
    const classes = useStyles()

    const [tagOptions, setTagOptions] = React.useState([])
    const { id, addImageTag } = props
    React.useEffect(() => {
        setTagOptions(toPairs(tags))
    }, [props.tags])

    const MenuProps = {
        PaperProps: {
            style: {
                height: 500,
                width: 250,
            },
        },
    }
    const tagsSafe = props.tags || []
    const handleChange = e => {
        const newTags = e.target.value
        addImageTag(id, newTags)
    }

    return (
        <div>
            <FormControl className={classes.formControl}>
                <Select
                    multiple
                    // helperText={t('Detail of File') as string}
                    value={props.tags || []}
                    onChange={handleChange}
                    input={<Input />}
                    renderValue={(selected: any[]) => {
                        return selected
                            .map(tag => tags[tag].label.en)
                            .join(', ')
                    }}
                    MenuProps={MenuProps}
                >
                    {tagOptions.map(([id, data]) => (
                        <MenuItem key={id} value={id}>
                            <Checkbox checked={includes(id, tagsSafe)} />
                            <ListItemText primary={data.label.en} />
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText>{t('Tags')}</FormHelperText>
            </FormControl>
        </div>
    )
}

export default Tags
