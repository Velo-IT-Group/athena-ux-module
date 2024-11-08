const formatter = new Intl.RelativeTimeFormat('en', { style: 'short' });


export function relativeDate(date: Date) {
	const now = new Date();
	const diff: number = Math.round((now.getTime() - (date?.getTime() ? date.getTime() : 0)) / 1000);

	const minute = 60;
	const hour = minute * 60;
	const day = hour * 24;
	const week = day * 7;
	const month = day * 30;
	const year = month * 12;

	if (diff < minute) {
		return formatter.format(-diff, 'seconds');
	} else if (diff < hour) {
		return formatter.format(-Math.floor(diff / minute), 'minutes');
	} else if (diff < day) {
		return formatter.format(-Math.floor(diff / hour), 'hours');
	} else if (diff < week) {
		return formatter.format(-Math.floor(diff / day), 'days');
	} else if (diff < month) {
		return formatter.format(-Math.floor(diff / week), 'weeks');
	} else if (diff < year && diff < year) {
		return formatter.format(-Math.floor(diff / month), 'months');
	} else {
		return formatter.format(-Math.floor(diff / year), 'years');
	}
}

export function addSeconds(date: Date, seconds: number) {
  date.setSeconds(date.getSeconds() + seconds);
  return date;
}

export const formatDate = (options?: Intl.DateTimeFormatOptions) => {
	return  new Intl.DateTimeFormat('en', options);
}