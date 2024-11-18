import React from 'react';
import { TabsContent } from '../ui/tabs';
import SOPExceptions from '@/app/(user)/sop-exceptions';
import { getCompanyNotes } from '@/lib/manage/read';

type Props = {
	companyId: number;
};

const CompanyOverviewTab = async ({ companyId }: Props) => {
	const { data: notes } = await getCompanyNotes(companyId, {
		conditions: {
			'type/id': 6,
		},
		fields: ['id', 'text', '_info'],
	});

	return (
		<TabsContent
			value="Company"
			className="grid grid-cols-[3fr_2fr] gap-3">
			<div className="space-y-3">
				<h2 className="text-xl font-bold tracking-tight">
					SOP Exceptions
				</h2>
				<SOPExceptions
					note={notes?.[0]}
					companyId={companyId!}
				/>
			</div>

			<div className="space-y-3">
				<h2 className="text-xl font-bold tracking-tight">
					Active Projects
				</h2>
				{/* {projects.length === 0 && (
							<div className='max-h-60 grid place-items-center h-full text-muted-foreground'>
								<div className='grid place-items-center gap-1.5'>
									<Box className='w-9 h-9' />
									<p className='text-lg text-center font-semibold'>No active projects</p>
								</div>
							</div>
						)} */}
				{/* {projects.map((project) => (
							<Card key={project.id}>
								<CardHeader>
									<CardTitle className='text-base'>{project?.name}</CardTitle>
									<CardDescription className='text-sm'>
										<Textarea
											value={project?.description?.trim()}
											readOnly
											className='border-none px-0 focus-visible:ring-0 shadow-none'
										/>
									</CardDescription>
								</CardHeader>

								<CardContent className='space-y-3'>
									<Separator className='' />
								</CardContent>

								<CardFooter>
									<div className='grid gap-1.5 w-full'>
										<div className='grid gap-3'>
											<div className='flex items-center justify-between gap-1.5'>
												<Label>Status</Label>
												<Badge className='rounded-sm'>{project.status?.name}</Badge>
											</div>

											<Progress
												value={(project?.percentComplete ?? 0) * 100}
												max={100}
												className='w-full'
											/>
										</div>

										<div className='text-secondary-foreground text-xs'>
											{(project?.percentComplete ?? 0) * 100}% complete
										</div>
									</div>
								</CardFooter>
							</Card>
						))} */}
			</div>
		</TabsContent>
	);
};

export default CompanyOverviewTab;
