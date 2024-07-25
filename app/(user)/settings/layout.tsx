import Link from 'next/link';
import { ReactNode } from 'react';
import { cookies, headers } from 'next/headers';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NavLink } from '@/components/side-nav';
import { Home } from 'lucide-react';

type Props = {
	children: ReactNode;
};

const links: NavLink[] = [
	{
		href: '/settings',
		name: 'General',
		icon: Home,
	},
	{
		href: '/settings/schedule',
		name: 'Schedule',
		icon: Home,
	},
	{
		href: '/settings/caller-ids',
		name: 'Caller IDs',
		icon: Home,
	},
];

const Layout = (props: Props) => {
	const headersList = headers();
	const domain = headersList.get('host') || '';
	const fullUrl = headersList.get('referer') || '';
	const proto = headersList.get('x-forwarded-proto') || '';
	const length = domain.length + proto?.length + 3;
	const path = fullUrl.substring(length);

	return (
		<main className='flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10'>
			<div className='mx-auto grid w-full max-w-6xl gap-2'>
				<h1 className='text-3xl font-semibold'>Settings</h1>
			</div>

			<div className='mx-auto grid w-full items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]'>
				<nav className='grid text-sm text-muted-foreground'>
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={cn(
								buttonVariants({
									variant: path === link.href ? 'secondary' : 'ghost',
									className: 'font-semibold justify-start',
								})
							)}
						>
							{link.name}
						</Link>
					))}
				</nav>

				<div className='grid gap-6'>{props.children}</div>
			</div>
		</main>
	);
};

export default Layout;
