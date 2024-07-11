import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

type Avatar = {
	id: string | number;
	fallback: string;
	src: string;
};

type Props = {
	users: Avatar[];
};

const GroupedAvatar = ({ users }: Props) => {
	const bigGroup = users.length > 3;

	return (
		<div className='flex -space-x-2.5 rtl:space-x-reverse'>
			{users.slice(0, bigGroup ? 3 : users.length).map((user) => (
				<Avatar
					key={user.id}
					className='border-2 border-white w-7 h-7'
				>
					<AvatarFallback>{user.fallback}</AvatarFallback>
					<AvatarImage src={user.src} />
				</Avatar>
			))}

			{bigGroup && (
				<Avatar className='border-2 border-white w-7 h-7'>
					<AvatarFallback className='text-xs bg-gray-700 text-white'>+{users.length - 3}</AvatarFallback>
				</Avatar>
			)}
		</div>
	);
};

export default GroupedAvatar;
