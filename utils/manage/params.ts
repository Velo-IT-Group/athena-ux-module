interface KeyValue {
	[key: string]: number | string | boolean;
}

export type Conditions<T> = {
	conditions?: Array<KeyValue>;
	childConditions?: Array<KeyValue>;
	customFieldConditions?: string;
	orderBy?: { key: keyof T; order?: 'asc' | 'desc' };
	fields?: Array<keyof T>;
	page?: number;
	pageSize?: number;
};

const generateParams = <T>(init?: Conditions<T>): string => {
	if (!init) return '';
	const { conditions, childConditions, orderBy, fields, page, pageSize } = init;
	let params = new URLSearchParams();

	if (conditions) {
		conditions.forEach((condition) => {
			Object.entries(condition).forEach(([key, value]) => {
				const conditions = params.get('conditions');
				params.set('conditions', conditions ? `${`${conditions} and ${key} = ${value}`}` : `${key} = ${value}`);
			});
		});
	}

	if (childConditions) {
		childConditions.forEach((condition) => {
			Object.entries(condition).forEach(([key, value]) => {
				const childConditions = params.get('childConditions');
				params.set(
					'childConditions',
					childConditions ? `${`${childConditions} and ${key} = ${value}`}` : `${key} = ${value}`
				);
			});
		});
	}

	if (orderBy) {
		params.set('orderBy', orderBy && `${orderBy.key.toString()} ${orderBy.order ?? 'asc'}`);
	}

	if (fields) {
		params.set('fields', fields.toString());
	}

	if (fields) {
		params.set('page', fields.toString());
	}

	if (pageSize) {
		params.set('pageSize', pageSize.toString());
	}

	if (page) {
		params.set('page', page.toString());
	}

	return '?' + params.toString();
};

const baseHeaders = new Headers();
baseHeaders.set('clientId', process.env.CONNECT_WISE_CLIENT_ID!);
baseHeaders.set(
	'Authorization',
	'Basic ' + btoa(process.env.CONNECT_WISE_USERNAME! + ':' + process.env.CONNECT_WISE_PASSWORD!)
);
baseHeaders.set('Content-Type', 'application/json');

export { baseHeaders, generateParams };
