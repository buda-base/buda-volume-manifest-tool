import React from 'react'
import Select from '@material-ui/core/Select'
import { assoc, includes } from 'ramda'
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
import { Buda } from '../../types'

const tagMap: Record<string,Buda.Tag> = (tags as Buda.Tag[]).reduce((acc, val) => {
    return assoc(val.id, val, acc)
}, {})

const useStyles = makeStyles(() => ({
    formControl: {
        minWidth: 120,
        maxWidth: 300,
    },
}))
const Tags = (props: { tags: string[]; id?: string; dispatch: any; idx: number }) => {
    const { t } = useTranslation()
    const classes = useStyles()

    const [tagOptions, setTagOptions] = React.useState<string[]>([])
    React.useEffect(() => {
        setTagOptions(props.tags)
    }, [props.tags])

    const MenuProps = {
        PaperProps: {
            style: {
                height: 500,
                width: 500,
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
                    value={props.tags || []}
                    onChange={handleChange}
                    input={<Input />}
                    renderValue={(selected: unknown) => {
                        return (<>{
                            (selected as string[])
                                .map((tagid: string) => tagMap[tagid].label.en)
                                .join(', ')
                                }</>
                        )
                    }}
                    MenuProps={MenuProps}
                >
                    {tagOptions?.map((tagid: string) => (
                        <MenuItem key={tagid} value={tagid}>
                            <Checkbox
                                checked={
                                    (includes(
                                        tagid,
                                        tagsSafe
                                    ) as unknown) as boolean
                                }
                            />
                            <ListItemText primary={tagMap[tagid].label.en} />
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText>{t('Tags')}</FormHelperText>
            </FormControl>
        </div>
    )
}

const mapStateToProps = function() {
    return {}
}

// @ts-ignore
export default connect(mapStateToProps)(Tags)
