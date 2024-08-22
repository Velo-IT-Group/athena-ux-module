'use client';

import React from 'react';
import { useWorker } from '@/providers/worker-provider';
import { Circle, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { faker } from '@faker-js/faker';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from './ui/command';

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

	return (
		<div className='flex flex-col gap-1.5'>
			{activities?.map((activity) => (
				<Popover key={activity.sid}>
					<PopoverTrigger asChild>
						<Button>
							<Circle />
						</Button>
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
