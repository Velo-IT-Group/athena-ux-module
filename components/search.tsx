'use client';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { SearchIcon, RefreshCcw } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useFormStatus } from 'react-dom';
import { Button } from './ui/button';

type Props = {
	baseUrl: string;
	placeholder: string;
	className?: string;
	queryParam?: string;
};

const Search = ({ baseUrl, placeholder, className, queryParam = 'search' }: Props) => {
	const { pending } = useFormStatus();
	const [text, setText] = useState('');
	const debounced = useDebouncedCallback((value) => {
		setText(value);
	}, 250);
	// const [query] = useDebounce(text, 500);
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	// console.log(pathname);

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(name, value);

			return params.toString();
		},
		[searchParams]
	);

	useEffect(() => {
		const searchText = searchParams.get('search');
		if (searchText) {
			setText(searchText);
		} else {
			setText('');
		}
	}, []);

	useEffect(() => {
		if (!text) {
			router.push(pathname);
		} else {
			console.log(searchParams);
			router.push(pathname + '?' + createQueryString(queryParam, text.trim()));
		}
	}, [baseUrl, createQueryString, pathname, router, text, queryParam]);

	return (
		<form
			className={cn(
				'flex h-9 overflow-hidden items-center w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
				className
			)}
			cmdk-input-wrapper=''
		>
			{pending ? <RefreshCcw className='mr-1.5 animate-spin' /> : <SearchIcon className='mr-1.5 shrink-0 opacity-50' />}

			<Input
				placeholder={placeholder}
				defaultValue={text}
				onChange={(event) => debounced(event.target.value)}
				onKeyUp={(e) => {
					if (e.key === 'Enter') {
						debounced.cancel();
						if (!text) {
							router.push(`${baseUrl}`);
						} else {
							console.log(text);
							router.push(pathname + '?' + createQueryString('search', text));
						}
					}
				}}
				className='border-0 shadow-none focus-visible:ring-0 p-0'
			/>

			<Button className='hidden' />
		</form>
	);
};

export default Search;
