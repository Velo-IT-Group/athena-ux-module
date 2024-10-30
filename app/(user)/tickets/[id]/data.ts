import { AuditType } from '@/types/manage';
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

export const auditTrailIcons: Array<{ type: AuditType; subType?: string; icon: LucideIcon }> = [
	{
		type: 'Record',
		subType: 'Created',
		icon: User,
	},
	{
		type: 'Resource',
		subType: 'Record',
		icon: Calendar,
	},
	{
		type: 'Tickets',
		subType: 'Status',
		icon: Circle,
	},
	{
		type: 'Tickets',
		subType: 'Team',
		icon: Shield,
	},
	{
		type: 'Tickets',
		subType: 'Type',
		icon: Tag,
	},
	{
		type: 'Company',
		subType: 'Contact',
		icon: User,
	},
	{
		type: 'Company',
		subType: 'Email',
		icon: Mail,
	},
	{
		type: 'Company',
		subType: 'Phone',
		icon: Phone,
	},
	{
		type: 'Resource',
		subType: 'Owner',
		icon: UserCircle,
	},
	{
		type: 'Resource',
		subType: 'Acknowledged',
		icon: ThumbsUp,
	},
	{
		type: 'Notes',
		icon: Pencil,
	},
	{
		type: 'SLA',
		icon: Clock,
	},
];
