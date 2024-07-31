interface KeyValue {
	[key: string]: number | string;
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

export const generateParams = <T>(init: Conditions<T>): string | undefined => {
	const { conditions, childConditions, orderBy, fields, page, pageSize } = init;
	let params = new URLSearchParams();

	if (conditions) {
		conditions.forEach((condition) => {
			Object.entries(condition).forEach(([key, value]) => {
				const conditions = params.get('conditions');
				// @ts-ignore
				params.set('conditions', conditions ? `${`${conditions} and ${key} = ${value}`}` : `${key} = ${value}`);
			});
		});
	}

	if (childConditions) {
		childConditions.forEach((condition) => {
			Object.entries(condition).forEach(([key, value]) => {
				const childConditions = params.get('childConditions');
				// @ts-ignore
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

	return params.toString();
};
