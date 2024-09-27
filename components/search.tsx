'use client';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useFormStatus } from 'react-dom';
import { Button } from './ui/button';
import { RefreshCcw, SearchIcon } from 'lucide-react';
import { KeyValue } from '@/utils/manage/params';

type Props = {
	placeholder: string;
	className?: string;
	queryParam?: string;
	defaultValue?: string;
	setCondition: (condition: KeyValue) => void;
	removeCondition: (keyToRemove: string) => void;
};

const Search = ({
	placeholder,
	className,
	queryParam = 'search',
	defaultValue,
	setCondition,
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
			if (text.includes('*')) {
				// const value = text.replace('*', '%');
				setCondition({ [queryParam]: { value: `'${text}'`, comparison: 'like' } });
			} else {
				setCondition({ [queryParam]: { value: `'${text}'`, comparison: 'contains' } });
			}
		}
	}, [text, queryParam]);

	return (
		<div
			className={cn(
				'flex h-9 items-center w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
				className
			)}
			cmdk-input-wrapper=''
		>
			{pending ? <RefreshCcw className='mr-1.5 animate-spin' /> : <SearchIcon className='mr-1.5 shrink-0 opacity-50' />}

			<Input
				placeholder={placeholder}
				defaultValue={text}
				onChange={(event) => debounced(event.target.value)}
				autoFocus
				onKeyUp={(e) => {
					if (e.key === 'Enter') {
						// debounced.cancel();
						if (!text) {
							removeCondition(queryParam);
						} else {
							const value = text.replace('*', '%');

							setCondition({ [queryParam]: { value: `'${value}'`, comparison: 'contains' } });
						}
					}
				}}
				className='border-0 shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-0'
			/>

			<Button className='hidden' />
		</div>
	);
};

export default Search;
