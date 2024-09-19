import { useState } from 'react';
import { Conditions, Comparison } from '@/utils/manage/params';
import { updateFilterCookie } from '@/components/cookie-filter-actions';
import { TableDefinition } from '@/types';

export function useCookieFilter<T>(defaultParams: Conditions<T>, definition: TableDefinition) {
	const [params, setParams] = useState<Conditions<T>>(defaultParams);

	const addCondition = (newCondition: Comparison) => {
		const existingConditions = params.conditions || [];
		const existingIndex = existingConditions.findIndex(
			(condition) => Object.keys(condition.parameter)[0] === Object.keys(newCondition.parameter)[0]
		);

		console.log(existingIndex);

		if (existingIndex !== -1) {
			// Replace the existing condition with the new one
			const updatedConditions = [...existingConditions];
			updatedConditions[existingIndex] = newCondition;
			updateFilterCookie(definition, { ...params, conditions: updatedConditions });
			const newParams = {
				...params,
				conditions: [...existingConditions, newCondition],
				page: 1,
			};
			setParams(newParams);
			return;
		}

		const newParams = {
			...params,
			conditions: [...existingConditions, newCondition],
			page: 1,
		};
		setParams(newParams);

		console.log(newParams, newCondition);
		updateFilterCookie(definition, newParams);
	};

	const removeCondition = (keyToRemove: string) => {
		const newParams = {
			...params,
			conditions: params.conditions?.filter((condition) => Object.keys(condition.parameter)[0] !== keyToRemove),
			page: 1,
		};
		console.log(newParams);
		setParams(newParams);
		updateFilterCookie(definition, newParams);
	};

	const removeAllConditions = (keyToRemove: string) => {
		const newParams = {
			...params,
			conditions: [],
			page: 1,
		};
		console.log(newParams);
		setParams(newParams);
		updateFilterCookie(definition, newParams);
	};

	return {
		addCondition,
		params,
		removeCondition,
		removeAllConditions,
	};
}
