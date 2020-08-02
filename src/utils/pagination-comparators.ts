// @ts-nocheck
import { pagination_types } from './pagination-prediction'

export function getComparator(manifest: {
    pagination: any
    section: any
    sections: string | any[]
}) {
    var paginations = manifest.pagination
    if (!paginations || paginations.length < 1) {
        // error
        return function(a, b) {
            console.error(
                'no pagination indication in the manifest, cannot compare anything'
            )
            return 0
        }
    }
    var default_pg_name = paginations[0].id
    // TODO for Alex: this probably won't work as pagination_types is a variable of
    // pagination-prediction.ts which is not exported, not sure how to make it work
    var default_pg_type_info = pagination_types[paginations[0].type]
    var sections_id_map = null
    if (manifest.section) {
        for (var i = 0; i < manifest.sections.length; i++) {
            sections_id_map[manifest.sections[i].id] = i
        }
    }
    // a and b are pagination objects of imageinfo
    return function(a, b) {
        if (!a || !b) {
            console.error('calling pagination comparator with null argument')
            return 0
        }
        if (a[default_pg_name] && b[default_pg_name]) {
            var a_dpg = a[default_pg_name]
            var b_dpg = b[default_pg_name]
            if (
                sections_id_map &&
                a_dpg.section &&
                b_dpg.section &&
                a_dpg.section !== b_dpg.section
            ) {
                return (
                    sections_id_map[a_dpg.section] -
                    sections_id_map[b_dpg.section]
                )
            }
            // we ignore the case where one has a section and not the other as it's invalid
            return default_pg_type_info.compare(a_dpg.value, b_dpg.value)
        }
        // TODO, for later as it won't impact the current too: handling non-default pagination
    }
}
