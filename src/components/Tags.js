import React from 'react'
import Select from '@material-ui/core/Select'
import {includes, map, path, propOr, reject, toPairs} from 'ramda'
import AddIcon from '@material-ui/icons/Add'
import {useTranslation} from 'react-i18next'
import tags from '../tags'
import Chip from '@material-ui/core/Chip'
import FormHelperText from '@material-ui/core/FormHelperText'

const Tags = props => {
    const { t } = useTranslation()
    const [selectedTag, setSelectedTag] = React.useState('initial')
    const [tagOptions, setTagOptions] = React.useState([])
    const { id, addImageTag } = props
    React.useEffect(() => {
        const options = reject(
            ([tag]) => includes(tag, propOr([], 'tags', props)),
            toPairs(tags)
        )
        if (options[0]) {
            setSelectedTag(options[0][0])
        }
        setTagOptions(options)
    }, [props.tags])
    return (
        <div className="w-full flex mb-6 flex-col overflow-auto">
            <h3 className="block">{t('Tags:')}</h3>
            <div>
                <div className="flex flex-row w-1/3 inline-block">
                    <div style={{ width: 150 }}>
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
                                        {t(path(['label', 'eng'], tag[1]))}
                                    </option>
                                )
                            })}
                        </Select>
                        <FormHelperText>{t('Tags')}</FormHelperText>
                    </div>
                    <div>
                        {tagOptions.length > 0 && (
                            <AddIcon
                                className="self-center cursor-pointer"
                                onClick={() => {
                                    setSelectedTag('')
                                    addImageTag(id, selectedTag)
                                }}
                            />
                        )}
                    </div>
                </div>
                <div className="overflow-auto w-2/3 inline-block">
                    <div className="flex" style={{ minHeight: 'min-content' }}>
                        {map(tagId => {
                            const tagData = tags[tagId]
                            return (
                                <div className="m-2 inline-block" key={tagId}>
                                    <Chip
                                        key={tagId}
                                        label={t(
                                            path(['label', 'eng'], tagData)
                                        )}
                                        onDelete={() => {
                                            props.removeImageTag(id, tagId)
                                        }}
                                    />
                                </div>
                            )
                        }, propOr([], 'tags', props))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tags
