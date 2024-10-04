type Comparator = '=' | '!=' | '<' | '<=' | '>' | '>=' | '==' | 'contains' | 'like' | 'in' | 'not';

export interface KeyValue {
	[key: string]: number | string | boolean | string[] | number[] | Date | null | undefined | { value: number | string | boolean, comparison: Comparator };
	// comparator?: Comparator;
}

export interface Comparison {
	parameter: KeyValue;
	comparator?: Comparator;
}

export type Conditions<T> = {
	conditions?: KeyValue;
	childConditions?: KeyValue;
	customFieldConditions?: string;
	orderBy?: { key: keyof T; order?: 'asc' | 'desc' };
	fields?: Array<keyof T>;
	page?: number;
	pageSize?: number;
};

const generateConditions = (condition: KeyValue) => {
	let generatedConditions: string[] = []

	const entries = Object.entries(condition)

	if (!entries.length) {
		return ''
	}

	entries.forEach(([key, value]) => {
		if (value === undefined) return;
		const type = typeof value
		if (type === 'object') {
			if (Array.isArray(value)) {
				generatedConditions.push(`${key} in (${value.toString()})`)
				// @ts-ignore
			} else if (value?.value !== undefined) {
				// @ts-ignore
				generatedConditions.push(`${key} ${value.comparison} ${value.value}`)
			} else if (value instanceof Date) {
				generatedConditions.push(`${key} contains [${value}]`)
			} else if (value === null) {
				generatedConditions.push(`${key} = ${value}`)

			}
		} else {
			generatedConditions.push(`${key} = ${value}`)
		}
	})

	return generatedConditions.length > 1 ? generatedConditions.map((c, i) => i === 0 ? c : `and ${c}`).join(' ') : generatedConditions[0]
}

const generateParams = <T>(init?: Conditions<T>): string => {
	if (!init) return '';
	const { conditions, childConditions, orderBy, fields, page, pageSize } = init;
	let params = new URLSearchParams();

	if (conditions) {
		params.set('conditions', generateConditions(conditions))
	}

	if (childConditions) {
		params.set('childConditions', generateConditions(childConditions))
	}

	if (orderBy) {
		params.set('orderBy', orderBy && `${orderBy.key.toString()} ${orderBy.order ?? 'asc'}`);
	}

	if (fields) {
		params.set('fields', fields.toString());
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
