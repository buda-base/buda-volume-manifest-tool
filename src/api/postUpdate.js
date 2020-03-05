import axios from 'axios'
import {append, assoc} from 'ramda'

function add_changelog(manifest, userId, changelogStr) {
    const changelog = {
        timestamp: Date.now(),
        str: changelogStr,
        user: userId,
    }
    return assoc('changelog', append(changelog, manifest.changelog), manifest)
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
        
        const data = await axios.put(`https://iiifpres.bdrc.io/bvm/v:${volume}`,{}, { headers: {
            "Authorization": "Bearer " + id_token
        } })

        manifest.rev = data.rev
        // if the put fails (http status != 200), then a popup should be presented
        // to the user with the payload of the response
    }
    else {
        // users must be logged in 
    }

}

export default saveManifest
