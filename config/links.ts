import { NavItem, NavItemWithChildren } from '@/types/nav';

export interface LinksConfig {
	modules: NavItem[];
	mainNav: NavItem[];
	sidebarNav: NavItem[];
	settingsNav: NavItemWithChildren[];
}

export const linksConfig: LinksConfig = {
	modules: [],
	mainNav: [],
	sidebarNav: [],
	settingsNav: [],
};
