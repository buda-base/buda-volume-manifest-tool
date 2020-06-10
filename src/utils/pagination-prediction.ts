/* eslint-disable */
// @ts-nocheck
let apo_idx, final, first_part, first_part_i, folio_i, seqnum

var unit_prefix = [
    '',
    '',
    'གཉིས་',
    'གསུམ་',
    'བཞི་',
    'ལྔ་',
    'དྲུག་',
    'བདུན་',
    'བརྒྱད་',
    'དགུ་',
]
var unit_end = [
    '',
    'གཅིག',
    'གཉིས།',
    'གསུམ།',
    'བཞི།',
    'ལྔ།',
    'དྲུག',
    'བདུན།',
    'བརྒྱད།',
    'དགུ།',
]
var exceptions = {
    0: 'ཐིག',
    10: 'བཅུ།',
    15: 'བཅོ་ལྔ།',
    18: 'བཅོ་བརྒྱད།',
    20: 'ཉི་ཤུ',
    30: 'སུམ་བཅུ།',
}
var dozens = [
    '',
    'བཅུ་',
    'ཉེར་',
    'སོ་',
    'ཞེ་',
    'ང་',
    'རེ་',
    'དོན་',
    'གྱ་',
    'གོ་',
]
var hundred_prefix = 'བརྒྱ་ '
var hundred_end = 'བརྒྱ།'
var ten_end = 'བཅུ།'

function intToTibStr(i, method?) {
    // returns the Tibetan representation of i in Tibetan letters
    if (i < 0 && i > 999) {
        return ''
    }
    var hundredsi = Math.floor(i / 100)
    var resti = i % 100
    var hundredss = ''
    if (hundredsi > 0) {
        if (resti == 0) {
            return unit_prefix[hundredsi] + hundred_end
        } else {
            hundredss = unit_prefix[hundredsi] + hundred_prefix
        }
    }
    var rests
    if (exceptions[resti]) {
        rests = exceptions[resti]
    } else {
        var dozensi = Math.floor(resti / 10)
        var uniti = resti % 10
        if (uniti == 0) {
            rests = unit_prefix[dozensi] + ten_end
        } else {
            rests = dozens[dozensi] + unit_end[uniti]
        }
    }
    return hundredss + rests
}

const folioRtest = RegExp(/^\d+'*[ab]/)
const folioR = RegExp(/^(\d+)('*)([ab])(.*)$/)

export var pagination_types = {
    folios: {
        // see https://github.com/buda-base/manifest-tk/blob/master/pagination-spec.md
        is_well_formed: function(s) {
            return folioRtest.test(s)
        },
        // 1a -> 1
        // 1b -> 2
        // 2a -> 3
        // etc.
        // this works only in the simple cases where there is no duplicate
        // we cannot know anything about other cases, use with caution!
        str_to_seqnum: function(s) {
            let matchedS = folioR.exec(s)
            if (!matchedS) return 0
            let first_part_i = parseInt(matchedS[1], 10)
            return 2 * first_part_i + (matchedS[3] == 'b' ? 1 : 0)
        },
        // 1a -> 1b
        // 1b -> 2a
        // etc.
        // this actually works in all cases, which is nice
        next_str: function(s) {
            final = s.substring(s.length - 1, s.length)
            if (final == 'a') return s.substring(0, s.length - 1) + 'b'
            apo_idx = s.indexOf("'")
            if (apo_idx == -1) first_part = s.substring(0, s.length - 1)
            else first_part = s.substring(0, apo_idx)
            return (parseInt(first_part, 10) + 1).toString() + 'a'
        },
        seqnum_to_str: function(i) {
            final = i % 2 == 1 ? 'b' : 'a'
            return Math.floor(i / 2).toString() + final
        },
        seqnum_to_full_str: function(i) {
            // no full page indication on verso... handle that at manifest template level
            // if (i % 2 == 1) return '';
            folio_i = Math.floor(i / 2)
            return intToTibStr(folio_i)
        },
        compare: function(a, b) {
            let matchedA = folioR.exec(a)
            let matchedB = folioR.exec(b)
            if (!matchedA || !matchedB) return 0
            let fnumA = parseInt(matchedA[1], 10)
            let fnumB = parseInt(matchedB[1], 10)
            if (fnumA != fnumB) return fnumA - fnumB
            let lenQuotA = matchedA[2].length
            let lenQuotB = matchedB[2].length
            if (lenQuotA != lenQuotB) return lenQuotA - lenQuotB
            if (matchedA[3] == 'a' && matchedB[3] == 'b') return -1
            if (matchedA[3] == 'b' && matchedB[3] == 'a') return 1
            return matchedA[4].localeCompare(matchedB[4])
        },
    },
    simple: {
        is_well_formed: function(s) {
            let i = parseInt(s, 10)
            return !isNaN(i) && i > -1
        },
        str_to_seqnum: function(s) {
            return parseInt(s, 10)
        },
        next_str: function(s) {
            return (parseInt(s, 10) + 1).toString()
        },
        seqnum_to_str: function(i) {
            return i.toString()
        },
        seqnum_to_full_str: function(i) {
            // the page numbers are indicated in Latin numerals...
            // maybe there are cases where they are indicated in
            // Tibetan or Chinese numerals, we can see that later
            return i.toString()
        },
        compare: function(a, b) {
            return parseInt(a, 10) - parseInt(b, 10)
        },
    },
    // one boring TODO: roman numerals (preferably lower case)
}

export function getPaginationTypes() {
    return Object.keys(pagination_types)
}

function get_get_info(manifest, image) {
    // TODO: in the future this could depend on the image as we would have multiple
    // paginations per image
    var manifest_pagination = manifest.pagination[0]
    if (!image.pagination || !image.pagination[manifest_pagination.id]) {
        // error
        return null
    }
    var image0_pagination = image.pagination[manifest_pagination.id]
    var image0_section = image0_pagination.section
    var pgf = pagination_types[manifest_pagination.type]

    if (!pgf.is_well_formed(image0_pagination.value)) {
        // error
        return null
    }
    // this is a bit tricky, but if we don't do that we end up with wrong
    // value in edge cases where there are apostrophes and all that good stuff
    var index1_pagination_value = pgf.next_str(image0_pagination.value)
    var index1_seqnum = pgf.str_to_seqnum(index1_pagination_value)
    // then dealing with templates, which we don't always have
    var template_odd = manifest.appData.bvmt['margin-indication-odd']
    var template_even = manifest.appData.bvmt['margin-indication-even']
    var lang = manifest.appData.bvmt['default-vol-string-lang']
    return function(nextimgseqnum) {
        // nextimgseqnum is the index after the image we have given as index0.
        // For instance is index0_pagination is '7a', if we want info about
        // the next page, we call this function with argument 1.
        if (nextimgseqnum < 1) {
            // sorry, we can't compute that reliably
            return null
        }
        var seqnum,
            pagination_val,
            indication = null
        if (nextimgseqnum == 1) {
            // 1 is a special case because of edge cases where index0 is 7'a for instance.
            // Note that index1_seqnum might be wrong is some edge cases but
            // it doesn't impact further computation so we let the user correct
            // it if needed. On second thoughts, it would be wrong on verso, but
            // the full_str on verso is empty so we should be safe in all cases.
            pagination_val = index1_pagination_value
            seqnum = index1_seqnum
        } else {
            // note that this seqnum has nothing to do with nextimgseqnum, it's the
            // seqnum if everything was regular so it's sort of virtual. For 1a it would be
            // 1, for 1b it would be 2, etc.
            seqnum = nextimgseqnum + index1_seqnum - 1
            pagination_val = pgf.seqnum_to_str(seqnum)
        }
        var template = seqnum % 2 == 0 ? template_even : template_odd
        if (template !== undefined && template !== null) {
            // we want to leave blank strings here
            var indication_val = null
            if (template.includes('{pagenum:bo}')) {
                var full_str = pgf.seqnum_to_full_str(seqnum)
                indication_val = template.replace('{pagenum:bo}', full_str)
            } else if (template.includes('{pagenum}')) {
                indication_val = template.replace('{pagenum:bo}', seqnum)
            }
            if (indication_val !== null) {
                indication = { '@value': indication_val, '@language': lang }
            }
        }
        var pagination: { value: string; section?: string } = {
            value: pagination_val,
        }
        if (image0_section) {
            pagination.section = image0_section
        }
        return [pagination, indication]
    }
}

export default get_get_info
// a little example: we have a lit of images img01, img02, img03, etc.
// the user validated that img02 is "2'a", and the used clicked on
// "update following unckecked items" so for each following image
// we want to have the new expected pagination and marginal indication
// the first thing is to get the function:
// var get_info = get_get_info('folios', "2'a")
// console.log("we have img02 = 2'a")
// then if I want to get the info for img03 I do:
// var img03info = get_info(1)
// console.log('img03:')
// console.log(img03info)
// same for the next ones:
// var img04info = get_info(2)
// var img05info = get_info(3)
// var compare = pagination_types.folios.compare;
// console.log(compare("1b", "1a"));
// console.log(compare("1b", "1b"));
// console.log(compare("10b", "1b"));
// console.log(compare("1'a", "1b"));
