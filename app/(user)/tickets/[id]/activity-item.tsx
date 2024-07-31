import { AuditTrailEntry } from '@/types/manage';
import { relativeDate } from '@/utils/date';
import {
	ArrowLeftRight,
	Calendar,
	Circle,
	Clock,
	Kanban,
	Mail,
	Pencil,
	Phone,
	Shield,
	ShieldHalf,
	Tag,
	ThumbsUp,
	User,
	UserCircle,
} from 'lucide-react';
import React from 'react';

type Props = {
	entry: AuditTrailEntry;
};

const ActivityItem = ({ entry }: Props) => {
	return (
		<div className='flex items-center gap-3 px-2'>
			<div className='w-5 h-5 bg-background rounded-full grid place-items-center'>
				{entry.auditType === 'Record' && entry.auditSubType === 'Created' && <User />}
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
				{entry.auditType === 'SLA' && <Clock />}
			</div>

			<div className='text-xs leading-5 break-words line-clamp-6'>
				<span className='font-medium whitespace-nowrap text-ellipsis overflow-hidden min-w-0 text-black'>
					{entry.enteredBy}
				</span>

				<span> {entry.text}</span>

				<span className='w-3 pl-0.5 text-center inline-block font-semibold'>·</span>

				<span aria-label={entry.enteredDate}>{relativeDate(new Date(entry.enteredDate))}</span>
			</div>
		</div>
	);
};

export default ActivityItem;
