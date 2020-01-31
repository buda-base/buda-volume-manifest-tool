/* eslint-disable */
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

function intToTibStr(i, method) {
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

var pagination_types = {
    folios: {
        // see https://github.com/buda-base/manifest-tk/blob/master/pagination-spec.md
        is_well_formed: function(s) {
            // actual regexp should be converted in JS (see aforementionned url)
            return true
        },
        // 1a -> 1
        // 1b -> 2
        // 2a -> 3
        // etc.
        // this works only in the simple cases where there is no duplicate
        // we cannot know anything about other cases, use with caution!
        str_to_seqnum: function(s) {
            apo_idx = s.indexOf("'")
            final = s.substring(s.length - 1, s.length)
            if (apo_idx == -1) first_part = s.substring(0, s.length - 1)
            else first_part = s.substring(0, apo_idx)
            first_part_i = parseInt(first_part, 10)
            return 2 * first_part_i + (final == 'b' ? 1 : 0)
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
            // no full page indication on verso
            if (i % 2 == 1) return ''
            folio_i = Math.floor(i / 2)
            return intToTibStr(folio_i)
        },
    },
    simple: {
        is_well_formed: function(s) {
            return !isNaN(parseInt(n, 10))
        },
        str_to_seqnum: function(s) {
            return parseInt(n, 10)
        },
        next_str: function(s) {
            return (parseInt(n, 10) + 1).toString()
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
    },
    // one boring TODO: roman numerals (preferably lower case)
}

function get_get_info(
    pagination_type,
    index0_pagination,
    section_template,
    section_name
) {
    // I'm doing it for the pagination type folios where we have 1a, 1b, etc.
    var pgf = pagination_types[pagination_type]


    if (!pgf.is_well_formed(index0_pagination)) {
        // return some error
        return
    }
    // this is a bit tricky, but if we don't do that we end up with wrong
    // value in edge cases where there are apostrophes and all that good stuff
    var index1_pagination = pgf.next_str(index0_pagination)
    var index1_seqnum = pgf.str_to_seqnum(index1_pagination)
    // then dealing with templates, which we don't always have
    var template = null
    if (section_template)
        template = section_template.replace('{section_name}', section_name)
    return function(nextimgseqnum) {
        // nextimgseqnum is the index after the image we have given as index0.
        // For instance is index0_pagination is '7a', if we want info about
        // the next page, we call this function with argument 1.
        if (nextimgseqnum < 1) {
            // sorry, we can't compute that reliably
            return null
        }
        var pagination, full_str
        if (nextimgseqnum == 1) {
            // 1 is a special case because of edge cases where index0 is 7'a for instance.
            // Note that index1_seqnum might be wrong is some edge cases but
            // it doesn't impact further computation so we let the user correct
            // it if needed. On second thoughts, it would be wrong on verso, but
            // the full_str on verso is empty so we should be safe in all cases.
            pagination = index1_pagination
            full_str = pgf.seqnum_to_full_str(index1_seqnum)
        } else {
            // note that this seqnum has nothing to do with nextimgseqnum, it's the
            // seqnum if everything was regular so it's sort of virtual. For 1a it would be
            // 1, for 1b it would be 2, etc.
            seqnum = nextimgseqnum + index1_seqnum - 1
            pagination = pgf.seqnum_to_str(seqnum)
            full_str = pgf.seqnum_to_full_str(seqnum)
        }
        if (template) {
            full_str = template.replace('{pagenum_full}', full_str)
        }
        return [pagination, full_str]
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
