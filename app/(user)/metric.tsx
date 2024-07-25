import { ReactNode } from 'react';

type Props = {
	icon: ReactNode;
	title: string;
	subtitle: string;
	timeline: string;
	value: string;
	prevValue: string;
};

const Metric = ({ icon, title, subtitle, timeline, value, prevValue }: Props) => {
	return (
		<div className='flex flex-col border-b-[3px] pb-6 border-primary space-y-3 h-full'>
			<div className='bg-background h-10 w-10 rounded-full grid place-items-center shadow'>{icon}</div>

			<div>
				<h3 className='font-semibold text-lg'>{title}</h3>
				<p className='text-xs text-muted-foreground'>{timeline}</p>
			</div>

			<div>
				<p className='text-4xl font-semibold'>{value}</p>
				<p className='text-sm '>
					vs <span className='font-medium'>{prevValue}</span> {timeline}
				</p>
			</div>
		</div>
	);
};

export default Metric;
