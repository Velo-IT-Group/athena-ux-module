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

// Formatter for "Today" and "Yesterday" etc
const relative = new Intl.RelativeTimeFormat(
'en-US', {numeric: 'auto'}
);
// Formatter for weekdays, e.g. "Monday"
const short = new Intl.DateTimeFormat(
'en-US', {weekday: 'long'}
);
// Formatter for dates, e.g. "Mon, 31 May 2021"
const long = new Intl.DateTimeFormat(
'en-US', {
weekday: 'short',
day: 'numeric',
month: 'short',
year: 'numeric'
});

 export const relativeDay = (date: Date) => {
	const now = new Date().setHours(0, 0, 0, 0);
	const then = date.setHours(0, 0, 0, 0);
	const days = (then - now) / 86400000;
	if (days > -6) {
	  if (days > -2) {
		return relative.format(days, 'day');
	  }
	  return short.format(date);
	}
	return long.format(date);
  };


export function addSeconds(date: Date, seconds: number) {
  date.setSeconds(date.getSeconds() + seconds);
  return date;
}

export const formatDate = (options?: Intl.DateTimeFormatOptions) => {
	return  new Intl.DateTimeFormat('en', options);
}