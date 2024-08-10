import React from 'react';
import { Separator } from './ui/separator';
import ActivityItem, { ActivityItemProps } from '@/app/(user)/tickets/[id]/activity-item';

type Props = {
	activities: ActivityItemProps[];
};

const ActivityList = ({ activities }: Props) => {
	return (
		<div className='relative'>
			<Separator
				orientation='vertical'
				className='absolute top-0 bottom-3 left-[18px] -z-10'
			/>

			<div className='space-y-3 flex flex-col'>
				{activities?.map((activity) => (
					<ActivityItem
						key={activity.text}
						icon={activity.icon}
						text={activity.text}
						date={activity.date}
					/>
				))}
			</div>
		</div>
	);
};

export default ActivityList;
