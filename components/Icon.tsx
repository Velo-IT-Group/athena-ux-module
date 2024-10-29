import { icons } from 'lucide-react';

type Props = {
	name: string;
	className?: string;
};

const Icon = ({ name, className }: Props) => {
	// @ts-ignore
	const LucideIcon = icons[name];

	return <LucideIcon className={className} />;
};

export default Icon;
