'use client';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useFormStatus } from 'react-dom';
import { Button } from './ui/button';
import { RefreshCcw, SearchIcon } from 'lucide-react';
import { Comparison } from '@/utils/manage/params';

type Props = {
	placeholder: string;
	className?: string;
	queryParam?: string;
	defaultValue?: string;
	addCondition: (newCondition: Comparison) => void;
	removeCondition: (keyToRemove: string) => void;
};

const Search = ({
	placeholder,
	className,
	queryParam = 'search',
	defaultValue,
	addCondition,
	removeCondition,
}: Props) => {
	const { pending } = useFormStatus();
	const [text, setText] = useState(defaultValue?.replaceAll("'", ''));
	const debounced = useDebouncedCallback((value) => {
		setText(value);
	}, 500);

	useEffect(() => {
		if (!text) {
			removeCondition(queryParam);
		} else {
			console.log(text);
			addCondition({ parameter: { [queryParam]: `'${text}'` }, comparator: 'contains' });
		}
	}, [text, queryParam]);

	return (
		<form
			className={cn(
				'flex h-9 items-center w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
				className
			)}
			cmdk-input-wrapper=''
		>
			{pending ? <RefreshCcw className='mr-1.5 animate-spin' /> : <SearchIcon className='mr-1.5 shrink-0 opacity-50' />}

			<Input
				placeholder={placeholder}
				value={text}
				onChange={(event) => debounced(event.target.value)}
				onKeyUp={(e) => {
					if (e.key === 'Enter') {
						debounced.cancel();
						if (!text) {
							removeCondition(queryParam);
						} else {
							console.log(text);
							addCondition({ parameter: { [queryParam]: `'${text}'` }, comparator: 'contains' });
						}
					}
				}}
				className='border-0 shadow-none focus-visible:ring-0'
			/>

			<Button className='hidden' />
		</form>
	);
};

export default Search;
