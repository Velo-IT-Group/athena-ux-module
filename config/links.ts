import { NavItem, NavItemWithChildren } from '@/types/nav';
import {  CircleDotDashed, Inbox } from 'lucide-react';

export interface LinksConfig {
	modules: NavItem[];
	mainNav: NavItem[];
	sidebarNav: NavItemWithChildren[];
	settingsNav: NavItemWithChildren[];
}

export const linksConfig: LinksConfig = {
	modules: [],
	mainNav: [],
	sidebarNav: [
		{
			title: '',
			items: [
				{
					title: 'Inbox',
					icon: Inbox, 
					href: '/inbox',
					items: []
				},
				{
					title: 'My issues',
					icon: CircleDotDashed, 
					href: '/my-issues',
					items: []
				},
			]
		}
	],
	settingsNav: [],
};
