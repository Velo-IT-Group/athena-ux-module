'use client';
import { useState, useEffect, useTransition, ReactNode } from 'react';
import { Combobox } from './ui/combobox';
import { Button } from './ui/button';
import { LucideIcon } from 'lucide-react';

export type Identifiable = {
	id: number;
	name: string;
};

type Props<T extends Identifiable> = {
	icon: ReactNode;
	fetchFunction: Promise<T[]>;
	updateFunction: (arg0: T) => Promise<any>;
	defaultValue?: T;
	prompt: string;
	placeholder: string;
};

const AsyncSelector = async <T extends Identifiable>({
	icon,
	fetchFunction,
	updateFunction,
	defaultValue,
	prompt,
	placeholder,
}: Props<T>) => {
	const [pending, startTransition] = useTransition();
	const [selectedData, setSelectedData] = useState<T | undefined>(defaultValue);
	const [data, setData] = useState<T[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				console.log(await fetchFunction);

				const result = await fetchFunction;
				console.log(result);
				setData(result);
			} catch (err) {
				setError((err as Error).message);
			}
		};

		console.log('running func');

		fetchData();
	}, [fetchFunction]);

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<Combobox
			items={data.map((board) => {
				return { label: board?.name, value: `${board?.id}-${board?.name}` };
			})}
			side='left'
			align='start'
			placeholder={placeholder}
			value={`${selectedData?.id}-${selectedData?.name}`}
			setValue={(e) => {
				startTransition(async () => {
					const id = e.toString().split('-')[0];
					const selected = data.find((b) => b.id === Number(id));
					setSelectedData(selected);
					if (selected) {
						await updateFunction(selected);
					}
				});
			}}
		>
			<Button
				size='sm'
				variant='ghost'
				className='flex'
			>
				{icon}
				<span className='text-xs text-muted-foreground'>{selectedData ? selectedData.name : prompt}</span>
			</Button>
		</Combobox>
	);
};

export default AsyncSelector;
