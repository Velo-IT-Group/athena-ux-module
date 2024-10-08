import { AuditTrailEntry } from '@/types/manage';
import { relativeDate } from '@/utils/date';
import {
	Calendar,
	Circle,
	Clock,
	Kanban,
	LucideIcon,
	Mail,
	Pencil,
	Phone,
	Shield,
	Tag,
	ThumbsUp,
	User,
	UserCircle,
} from 'lucide-react';
import React from 'react';

type Props = {
	entry: AuditTrailEntry;
};

export type ActivityItemProps = {
	icon: LucideIcon;
	text: string;
	date: Date;
};

const ActivityItem = (props: ActivityItemProps) => {
	return (
		<div className='flex items-center gap-3 px-2'>
			<div className='w-5 h-5 bg-background rounded-full grid place-items-center'>
				<props.icon />
				{/* {entry.auditType === 'Record' && entry.auditSubType === 'Created' && <User />}
				{entry.auditType === 'Resource' && entry.auditSubType === 'Record' && <Calendar />}
				{entry.auditType === 'Tickets' && entry.auditSubType === 'Board' && <Kanban />}
				{entry.auditType === 'Tickets' && entry.auditSubType === 'Status' && <Circle />}
				{entry.auditType === 'Tickets' && entry.auditSubType === 'Team' && <Shield />}
				{entry.auditType === 'Tickets' && entry.auditSubType === 'Type' && <Tag />}
				{entry.auditType === 'Company' && entry.auditSubType === 'Contact' && <User />}
				{entry.auditType === 'Company' && entry.auditSubType === 'Email' && <Mail />}
				{entry.auditType === 'Company' && entry.auditSubType === 'Phone' && <Phone />}
				{entry.auditType === 'Resource' && entry.auditSubType === 'Owner' && <UserCircle />}
				{entry.auditType === 'Resource' && entry.auditSubType === 'Acknowledged' && <ThumbsUp />}
				{entry.auditType === 'Notes' && <Pencil />}
				{entry.auditType === 'SLA' && <Clock />} */}
			</div>

			<div className='text-xs leading-5 break-words line-clamp-6'>
				<span className='font-medium text-ellipsis overflow-hidden min-w-0'>{props.text}</span>

				{/* <span> {entry.text}</span> */}

				<span className='w-3 pl-0.5 text-center inline-block font-semibold'>·</span>

				<span aria-label={props.date.toISOString()}>{relativeDate(props.date)}</span>
			</div>
		</div>
	);
};

export default ActivityItem;
