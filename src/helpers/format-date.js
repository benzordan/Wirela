import Moment from 'moment'

/**
 * Formats a date
 * @param {Date} date 	The date to be formatted
 * @param {string} dateFmt The format to use
 */
export function format_date(date, dateFmt) {
	return Moment(date).format(dateFmt);
}