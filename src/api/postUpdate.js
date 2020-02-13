import axios from 'axios'

function add_changelog(manifest, userId, changelogStr) {
	const changelog = {
		timestamp: Date.now(),
		str: changelogStr,
		user: userId
	}
	manifest.changelog.append(changelog)
}

async function saveManifest(manifest, userId, changelogStr) {
	// first check: users must be logged in (let's ignore that for now)
	// and a changelog string must be provided (when the save button is pressed)
    console.log('manifest', manifest)
    // post updated manifest to api!
    const volume = manifest['for-volume'];
    add_changelog(manifest, userId, changelogStr);
    const data = await axios.put(`https://iiifpres.bdrc.io/bvm/v:${volume}`)
    manifest.rev = data.rev
    // if the put fails (http status != 200), then a popup should be presented
    // to the user with the payload of the response
}

export default saveManifest
