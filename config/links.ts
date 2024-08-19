import { NavItem, NavItemWithChildren } from '@/types/nav';
import {
	Building2,
	FileText,
	Headset,
	Home,
	LineChart,
	ListEnd,
	Notebook,
	Route,
	Settings,
	Tags,
	Workflow,
} from 'lucide-react';

export interface LinksConfig {
	modules: NavItem[];
	mainNav: NavItem[];
	sidebarNav: NavItem[];
	settingsNav: NavItemWithChildren[];
}

export const linksConfig: LinksConfig = {
	modules: [
		{
			title: 'User Experience',
			href: '/ux',
			icon: Headset,
		},
		{
			title: 'Proposal',
			href: '/proposal',
			icon: FileText,
		},
	],
	mainNav: [],
	sidebarNav: [
		{
			title: 'Dashboard',
			href: '/',
			icon: Home,
		},
		{
			title: 'Contacts',
			href: '/contacts',
			icon: Notebook,
		},
		{
			title: 'Tickets',
			href: '/tickets',
			icon: Tags,
		},
		{
			title: 'Companies',
			href: '/companies',
			icon: Building2,
		},
		{
			title: 'Analytics',
			href: '/analytics',
			icon: LineChart,
		},
		{
			title: 'Settings',
			href: '/settings',
			icon: Settings,
		},
	],
	settingsNav: [
		{
			title: 'Getting Started',
			items: [
				{
					title: 'General',
					href: '/settings',
					icon: Home,
					items: [],
				},
				{
					title: 'Paths',
					href: '/settings/paths',
					icon: Route,
					items: [],
				},
				{
					title: 'Queues',
					href: '/settings/queues',
					icon: ListEnd,
					items: [],
				},
				{
					title: 'Workflows',
					href: '/settings/workflows',
					icon: Workflow,
					items: [],
				},
				{
					title: 'Schedule',
					href: '/settings/schedule',
					icon: Home,
					items: [],
				},
				{
					title: 'Caller IDs',
					href: '/settings/caller-ids',
					icon: Home,
					items: [],
				},
			],
		},
	],
};
