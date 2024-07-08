'use client';

import { Bar as RBar, BarChart as RBarChart } from 'recharts';

import { type ChartConfig, ChartContainer } from '@/components/ui/chart';

type Props<T extends ChartConfig> = {
	config: T;
	data: any;
	dataKey: Array<keyof T>;
};

const BarChart = <T extends ChartConfig>({ config, dataKey, data }: Props<T>) => {
	return (
		<ChartContainer
			config={config}
			className='min-h-[200px] w-full'
		>
			<RBarChart
				accessibilityLayer
				data={data}
			>
				{dataKey.map((key) => (
					<RBar
						key={key.toString()}
						dataKey={key}
						fill='var(--color-desktop)'
						radius={4}
					/>
				))}
			</RBarChart>
		</ChartContainer>
	);
};

export default BarChart;
