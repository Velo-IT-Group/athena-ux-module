'use client';

import React from 'react';
import { useWorker } from '@/providers/worker-provider';
import { Circle, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { faker } from '@faker-js/faker';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from './ui/command';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

function generateTestUsers(count: number) {
	const users = [];
	for (let i = 0; i < count; i++) {
		const isOnCall = faker.datatype.boolean();
		const user = {
			id: i + 1,
			name: faker.internet.userName(),
			imageUrl: faker.image.avatar(), // Generates a random avatar URL
			isOnCall: isOnCall,
			onCallWith: isOnCall ? faker.internet.userName() : null,
		};
		users.push(user);
	}
	return users;
}

type Props = {};

const SidebarActivityList = (props: Props) => {
	const { worker } = useWorker();
	const activities = Array.from(worker?.activities.values() ?? []);
	const testUsers = generateTestUsers(10);

	const activityColors: Record<string, string> = {
		Available: 'bg-green-500',
		Unavailable: 'bg-red-500',
		Offline: 'bg-gray-500',
	};

	return (
		<div className='grid gap-1.5 px-1.5 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-1.5 group-[[data-collapsed=true]]:py-1.5'>
			{activities?.map((activity) => (
				<Popover key={activity.sid}>
					<PopoverTrigger asChild>
						{/* <Tooltip delayDuration={0}>
							<TooltipTrigger asChild> */}
						<Button
							variant='ghost'
							size='smIcon'
							className='h-9 w-9'
						>
							<Circle className={cn('stroke-none rounded-full', activityColors[activity.name])} />
						</Button>
						{/* </TooltipTrigger>

							<TooltipContent
								side='right'
								className='flex items-center gap-3'
							>
								{activity.name}
							</TooltipContent>
						</Tooltip> */}
					</PopoverTrigger>

					<PopoverContent
						side='right'
						align='center'
						sideOffset={6}
						className='p-0'
					>
						<Command>
							<CommandInput placeholder={'Search users'} />
							<CommandEmpty>Nothing found.</CommandEmpty>
							<CommandList>
								{testUsers.map((user) => (
									<CommandItem
										key={user.id}
										value={user.name}
										className='flex items-center gap-1.5'
									>
										<Avatar className='w-3.5 h-3.5'>
											<AvatarFallback className='w-3.5 h-3.5'>{user.name.charAt(0)}</AvatarFallback>
											<AvatarImage
												className='w-3.5 h-3.5'
												src={user.imageUrl}
											/>
										</Avatar>

										<span>{user.name}</span>

										{user.isOnCall && (
											<Button
												variant='default'
												size='smIcon'
												className='ml-auto animate-pulse'
											>
												<Phone />
											</Button>
										)}
									</CommandItem>
								))}
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			))}
		</div>
	);
};

export default SidebarActivityList;
