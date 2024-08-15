import { getConfigurations } from '@/lib/manage/read';
import { Configuration, ReferenceType } from '@/types/manage';
import { Conditions } from '@/utils/manage/params';
import React from 'react';
import { DataTable } from '../ui/data-table';
import { columns } from '../table-columns/configuration';
import { Combobox } from '../ui/combobox';
import { Cable, X } from 'lucide-react';
import { Button, buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type Props = {
	type: 'table' | 'combobox' | 'select';
	defaultValue?: ReferenceType | Configuration[];
	params?: Conditions<Configuration>;
};

const ConfigurationsList = async ({ type, defaultValue, params }: Props) => {
	const { configurations, count } = await getConfigurations(params);
	return (
		<>
			{type === 'table' && (
				<DataTable
					data={configurations}
					columns={columns}
					count={count}
				/>
			)}
			{type === 'combobox' && (
				<Combobox
					items={configurations.map(({ id, name }) => {
						return { label: name, value: `${id}-${name}` };
					})}
					placeholder='Search configurations...'
					align='end'
					side='left'
					value={String(defaultValue ?? '')}
					setValue={() => {}}
				>
					<div className='grid place-items-start'>
						{defaultValue && typeof defaultValue === 'object' && Array.isArray(defaultValue) ? (
							<>
								{defaultValue.map((config) => (
									<Link
										href={`/configurations/${config.id}`}
										className={cn(
											'flex items-center gap-1.5',
											buttonVariants({ variant: 'ghost', size: 'sm', className: 'justify-start group' })
										)}
									>
										<span>{config.name}</span>

										<Button
											className='opacity-0 group-hover:opacity-100 transition-opacity'
											variant='ghost'
											size='smIcon'
										>
											<X />
										</Button>
									</Link>
								))}
							</>
						) : (
							<Button
								variant='ghost'
								size='sm'
								className='text-muted-foreground'
							>
								<Cable className='mr-1.5' />
								{defaultValue?.name}
							</Button>
						)}

						{!defaultValue && (
							<Button
								variant='ghost'
								size='sm'
								className='text-muted-foreground'
							>
								<Cable className='mr-1.5' />
								Assign configuration...
							</Button>
						)}
					</div>
				</Combobox>
			)}
		</>
	);
};

export default ConfigurationsList;
