import { AuditType } from '@/types/manage';
import {
	AppWindow,
	Calendar,
	Circle,
	Clock,
	Image,
	LucideIcon,
	Mail,
	MonitorSmartphone,
	Network,
	Pencil,
	Phone,
	Printer,
	Router,
	Server,
	Shield,
	Tablet,
	Tag,
	ThumbsUp,
	User,
	UserCircle,
} from 'lucide-react';

type AuditTrailIcon = { type: AuditType; subType?: string; icon: LucideIcon };

export const auditTrailIcons: Array<AuditTrailIcon> = [
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

export const configurationIcons: Array<{ type: string; icon: LucideIcon }> = [
	{
		type: 'Server',
		icon: Server,
	},
	{
		type: 'Application',
		icon: AppWindow,
	},
	{
		type: 'Diagram',
		icon: Image,
	},
	{
		type: 'Mobile',
		icon: Phone,
	},
	{
		type: 'Tablet',
		icon: Tablet,
	},
	{
		type: 'Network',
		icon: Network,
	},
	{
		type: 'Printer',
		icon: Printer,
	},
	{
		type: 'Router',
		icon: Router,
	},
	{
		type: 'Workstation',
		icon: MonitorSmartphone,
	},
];
