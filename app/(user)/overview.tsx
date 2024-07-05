'use client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export type DataItem = {
	name: string;
	value: number;
};

type Props = {
	data: DataItem[];
};

export function Overview({ data }: Props) {
	return (
		<ResponsiveContainer
			width='100%'
			height={450}
		>
			<BarChart data={data}>
				<XAxis
					dataKey='name'
					stroke='#888888'
					fontSize={12}
					tickLine={false}
					axisLine={false}
				/>

				<YAxis
					stroke='#888888'
					fontSize={12}
					tickLine={false}
					axisLine={false}
					tickFormatter={(value) => `${value}`}
				/>

				<Bar
					dataKey='value'
					fill='currentColor'
					radius={[4, 4, 0, 0]}
					className='fill-primary'
				/>
			</BarChart>
		</ResponsiveContainer>
	);
}
