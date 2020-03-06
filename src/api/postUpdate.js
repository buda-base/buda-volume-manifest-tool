import axios from 'axios'
import {append, assoc} from 'ramda'

// having a changelog is mandatory
function add_changelog(manifest, userId, changelogStr) {
    const changelog = {
        timestamp: Date.now(),
        str: changelogStr,
        user: null,
    }
    return assoc('changelog', append(changelog, manifest.changes), manifest)
}

async function saveManifest(
    manifest,
    userId = 'noUser',
    changelogStr = 'defaultChangeStr'
){
    // first check: users must be logged in (let's ignore that for now)
    const id_token = localStorage.getItem('id_token');
    if(id_token) {

        // and a changelog string must be provided (when the save button is pressed)

        // post updated manifest to api!
        const volume = manifest['for-volume']
        const formattedManifest = add_changelog(manifest, userId, changelogStr)
        console.log('formattedManifest', formattedManifest)
        
        const data = await axios.put(`https://iiifpres.bdrc.io/bvm/ig:${volume}`,{}, { headers: {
            "Authorization": "Bearer " + id_token
        } })

        manifest.rev = data.rev
        // if the put fails (http status != 200), then a popup should be presented
        // to the user with the payload of the response
    }
    else {
        // users must be logged in 
    }

    // post updated manifest to api!
    const volumeQname = manifest['for-volume']
    if (!changelogStr) {
        changelogStr = "bvmt: update for "+volumeQname;
    }
    const formattedManifest = add_changelog(manifest, userId, changelogStr)
    console.log('formattedManifest', formattedManifest)
    const data = await axios.put(`https://iiifpres-dev.bdrc.io/bvm/ig:${volumeQname}`)
    manifest.rev = data.rev
    // if the put fails (http status != 200 && != 201), then a popup should be presented
    // to the user with the payload of the response
}

export default saveManifest
