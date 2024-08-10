'use client';
import React from 'react';
import ActiveCallHeader from '@/components/active-call/active-call-header';
import ActiveCallParticipants from '@/components/active-call/active-call-participants';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Combobox, ComboBoxItem } from '@/components/ui/combobox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Ellipsis } from 'lucide-react';
import { useDevice } from '@/providers/device-provider';
import parsePhoneNumber from 'libphonenumber-js';
import { activeTaskAttributesListState } from '@/atoms/twilioStateAtom';
import { useRecoilValue } from 'recoil';

type Props = {
	workers: ComboBoxItem[];
};

const ToolbarCalls = ({ workers }: Props) => {
	const { activeCalls } = useDevice();
	const attributesList = useRecoilValue(activeTaskAttributesListState);

	return (
		<>
			{activeCalls?.map((call) => {
				const attributes = attributesList.find(
					(attributeItem) => attributeItem.conference.participants.worker === call.parameters.CallSid
				);

				if (!attributes) return <div></div>;

				const name = attributes.firstName + ' ' + attributes.lastName;
				const number = parsePhoneNumber(attributes.from ?? '', 'US');
				return (
					<div
						className='flex items-center gap-3 dark'
						key={attributes.call_sid}
					>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant='secondary'
									size='sm'
									className='min-w-96 justify-start hover:backdrop-blur-sm hover:backdrop-brightness-100'
								>
									{call.parameters.CallSid}
									<span className='text-muted-foreground ml-1.5'>
										{name ?? attributes.companyName ?? number?.format('NATIONAL') ?? ''}
									</span>
									<Button
										variant='ghost'
										size='smIcon'
										className='ml-auto'
									>
										<Ellipsis />
									</Button>
								</Button>
							</PopoverTrigger>

							<PopoverContent
								side='top'
								align='center'
								className='min-w-96 dark p-0'
								sideOffset={4}
							>
								<Card className='shadow-none'>
									<ActiveCallHeader attributes={attributes} />

									<ActiveCallParticipants conferenceSid={attributes?.conference.sid} />

									{/* <ActiveCallFooter /> */}
								</Card>
							</PopoverContent>
						</Popover>

						<Combobox
							items={workers}
							placeholder='Search worker...'
							side='top'
							align='center'
							className='dark'
							value={''}
							setValue={() => {}}
						>
							<Button
								variant='secondary'
								size='sm'
							>
								Add people
							</Button>
						</Combobox>

						<Combobox
							items={workers}
							placeholder='Search worker...'
							side='top'
							align='center'
							className='dark'
							value={''}
							setValue={() => {}}
						>
							<Button
								variant='secondary'
								size='sm'
							>
								Transfer
							</Button>
						</Combobox>

						<Button
							onClick={() => {
								call.disconnect();
							}}
							variant='destructive'
						>
							End Call
						</Button>
					</div>
				);
			})}
		</>
	);
};

export default ToolbarCalls;
