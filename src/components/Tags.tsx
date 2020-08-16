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
import { connect } from 'react-redux'
import { addImageTag } from '../redux/actions/manifest'

const useStyles = makeStyles(theme => ({
    formControl: {
        minWidth: 120,
        maxWidth: 300,
    },
}))
const Tags = (props: {
    tags?: any
    id?: any
    dispatch: any
    idx: number
}) => {
    const { t } = useTranslation()
    const classes = useStyles()

    const [tagOptions, setTagOptions] = React.useState([])
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
    const handleChange = (e: { target: { value: any } }) => {
        const newTags = e.target.value
        props.dispatch(addImageTag(props.idx, newTags))
    }

    return (
        <div>
            <FormControl className={classes.formControl}>
                <Select
                    multiple
                    // helperText={t('Detail of File') as string}
                    value={props.tags || []}
                    onChange={handleChange}
                    input={<Input/>}
                    renderValue={(selected: any[]) => {
                        return (
                            selected
                                // @ts-ignore
                                .map(tag => tags[tag].label.en)
                                .join(', ')
                        )
                    }}
                    MenuProps={MenuProps}
                >
                    {tagOptions.map(([id, data]) => (
                        <MenuItem key={id} value={id}>
                            <Checkbox checked={includes(id, tagsSafe)}/>
                            <ListItemText primary={data.label.en}/>
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText>{t('Tags')}</FormHelperText>
            </FormControl>
        </div>
    )
}

const mapStateToProps = function(state: any) {
    return {}
}

// @ts-ignore
export default connect(mapStateToProps)(Tags)
