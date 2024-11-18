'use client';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { SlidersHorizontal } from 'lucide-react';
import {
	FilterItem as ComboboxFilterItem,
	LinearCombobox,
} from './linear-combobox';
import FilterItem from './filter-item';

type Props = {
	filters: ComboboxFilterItem[];
};

const FilterHeader = ({ filters }: Props) => {
	const [selectedFilters, setSelectedFilters] = useState<
		ComboboxFilterItem[]
	>([]);

	return (
		<header className="flex items-center gap-3 h-9 px-3 border-b">
			{selectedFilters.map((filter) => (
				<FilterItem
					key={`selected-filter-${filter.label}`}
					filter={filter}
				/>
			))}

			<LinearCombobox
				filterGroups={[{ filters }]}
				filterValues={selectedFilters}
				setFilterValues={setSelectedFilters}
			/>

			<Button
				size="sm"
				variant="outline"
				className="space-x-1.5 h-6 ml-auto">
				<SlidersHorizontal />
				<span className="text-xs">Display</span>
			</Button>
		</header>
	);
};

export default FilterHeader;
