

function getComparator(sectionList) {
	return function(a_pagination, a_section, b_pagination, b_section) {
		/* TODO: 
		 * first, if a_section and b_section are not the same, compare their index in the sectionList
		 * if they're the same, get the paginationtype (from pagination-prediction.js) of the section 
		 * and put it in the "ptype" variable. Then:
		 */
		return ptype.compare(a_pagination, b_pagination);
	}
}