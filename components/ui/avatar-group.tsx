import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type Props = {
	avatars: { fallback: string; src?: string }[];
	className?: string;
};

const AvatarGroup = ({ avatars, className }: Props) => {
	return (
		<div className={cn('flex -space-x-3 *:ring *:ring-background', className)}>
			{avatars.map(({ fallback, src }, index) => (
				<Avatar key={`${index}-${fallback}`}>
					{src && <AvatarImage src={src} />}
					<AvatarFallback>{fallback}</AvatarFallback>
				</Avatar>
			))}
		</div>
	);
};

export default AvatarGroup;
