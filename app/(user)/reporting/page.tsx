import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/server';
import { format, subDays } from 'date-fns';
import { Phone, PhoneIncoming, PhoneOutgoing, Voicemail } from 'lucide-react';
import { DatePickerWithPresets } from '@/components/ui/date-picker';
import { AreaChart } from '@/components/charts/area-chart';
import Navbar from '@/components/navbar';

type Props = {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const Page = async ({ searchParams }: Props) => {
	const params = await searchParams;
	const supabase = await createClient();

	const today = new Date();
	const startDate =
		(params['start_date'] as string) ?? subDays(today, 20).toISOString();
	const endDate = (params['end_date'] as string) ?? today.toISOString();

	const { data: conversations_summary_by_day } = await supabase
		.schema('reporting')
		.from('conversations_summary_by_day')
		.select()
		.gte('conversation_date', startDate)
		.lte('conversation_date', endDate);

	const numOfConversations = conversations_summary_by_day?.reduce(
		(accumulator, currentValue) =>
			accumulator + (currentValue.total_conversations ?? 0),
		0
	);
	const numOfInbound = conversations_summary_by_day?.reduce(
		(accumulator, currentValue) =>
			accumulator + (currentValue.inbound_conversations ?? 0),
		0
	);
	const numOfOutbound = conversations_summary_by_day?.reduce(
		(accumulator, currentValue) =>
			accumulator + (currentValue.outbound_conversations ?? 0),
		0
	);
	const numOfVoicemails = conversations_summary_by_day?.reduce(
		(accumulator, currentValue) =>
			accumulator + (currentValue.voicemail_count ?? 0),
		0
	);

	return (
		<>
			<Navbar title="Reporting">
				<div className="ml-auto">
					<DatePickerWithPresets
						from={new Date(startDate)}
						to={new Date(endDate)}
					/>
				</div>
			</Navbar>

			<div className="p-3 grid items-start gap-3">
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Calls
							</CardTitle>

							<Phone className="text-muted-foreground" />
						</CardHeader>

						<CardContent>
							<div className="text-2xl font-bold">
								{numOfConversations}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Voicemails
							</CardTitle>
							<Voicemail className="text-muted-foreground" />
						</CardHeader>

						<CardContent>
							<div className="text-2xl font-bold">
								{numOfVoicemails}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Inbound Calls
							</CardTitle>

							<PhoneIncoming className="text-muted-foreground" />
						</CardHeader>

						<CardContent>
							<div className="text-2xl font-bold">
								{numOfInbound}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Outgoing Callers
							</CardTitle>

							<PhoneOutgoing className="text-muted-foreground" />
						</CardHeader>

						<CardContent>
							<div className="text-2xl font-bold">
								{numOfOutbound}
							</div>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Inbound vs. Outbound</CardTitle>
					</CardHeader>
					<CardContent>
						<AreaChart
							data={
								conversations_summary_by_day?.map((c) => ({
									name: format(
										new Date(c.conversation_date ?? ''),
										'do'
									),
									value1: c.inbound_conversations ?? 0,
									value2: c.outbound_conversations ?? 0,
								})) ?? []
							}
						/>
						{/* <ChartContainer config={chartConfig}>
						<AreaChart
							accessibilityLayer
							data={
								conversations_summary_by_day?.map((c) => ({
									name: format(
										new Date(c.conversation_date ?? ''),
										'do'
									),
									value1: c.inbound_conversations ?? 0,
									value2: c.outbound_conversations ?? 0,
								})) ?? []
							}
							margin={{
								left: 12,
								right: 12,
							}}>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="name"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tickFormatter={(value) => value.slice(0, 3)}
							/>
							<ChartTooltip
								cursor={false}
								content={
									<ChartTooltipContent indicator="dot" />
								}
							/>
							<Area
								dataKey="value1"
								type="natural"
								fill="var(--color-mobile)"
								fillOpacity={0.4}
								stroke="var(--color-mobile)"
								stackId="a"
							/>
							<Area
								dataKey="value2"
								type="natural"
								fill="var(--color-desktop)"
								fillOpacity={0.4}
								stroke="var(--color-desktop)"
								stackId="a"
							/>
						</AreaChart>
					</ChartContainer> */}
					</CardContent>
				</Card>
			</div>
		</>
	);
};

export default Page;
