import React from 'react';
import ActivityItem from './activity-item';
import { getAuditTrail, getTicketNotes } from '@/lib/manage/read';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default async function ActivityFeed({ id }: { id: number }) {
	const [entries, notes] = await Promise.all([
		getAuditTrail('Ticket', id, { orderBy: { key: 'enteredDate', order: 'desc' } }),
		getTicketNotes(id),
	]);

	console.log(notes);

	return (
		<div>
			<Accordion type='multiple'>
				<AccordionItem value='activity'>
					<AccordionTrigger className='flex items-center justify-between'>
						<h4 className='font-medium text-sm'>Audit Trail</h4>
					</AccordionTrigger>

					<AccordionContent>
						<div className='text-muted-foreground grid gap-6'>
							<div className='relative'>
								<Separator
									orientation='vertical'
									className='absolute top-0 bottom-4 left-[18px] -z-10'
								/>

								<div className='space-y-3'>
									{entries.map((entry) => (
										<ActivityItem
											key={entry.text}
											entry={entry}
										/>
									))}
								</div>
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value='notes'>
					<AccordionTrigger className='flex items-center justify-between'>
						<h4 className='font-medium text-sm'>Notes</h4>
					</AccordionTrigger>

					<AccordionContent>
						<Tabs defaultValue='all'>
							<TabsList>
								<TabsTrigger value='all'>All (1)</TabsTrigger>
								<TabsTrigger value='discussion'>Discussion (1)</TabsTrigger>
								<TabsTrigger value='internal'>Internal</TabsTrigger>
								<TabsTrigger value='resolution'>Resolution</TabsTrigger>
							</TabsList>

							<TabsContent
								value='all'
								className='space-y-3'
							>
								{notes.map((note) => (
									<Card>
										<CardContent className='p-3'>
											<p>{note.text}</p>
										</CardContent>
									</Card>
								))}
							</TabsContent>
						</Tabs>
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			<form
				className='sc-cqnWLZ kxoLGg sc-fnutvn kuuWGS'
				style={{
					boxSizing: 'border-box',
					touchAction: 'pan-x pan-y',
					padding: '0px',
					border: '0px',
					fontSize: 'inherit',
					fontFamily: 'inherit',
					fontWeight: 'inherit',
					lineHeight: 'inherit',
					verticalAlign: 'baseline',
					position: 'relative',
					margin: '0px -8px',
				}}
			>
				<div
					className='sc-beySPh fjOiCc'
					style={{
						boxSizing: 'border-box',
						touchAction: 'pan-x pan-y',
						margin: '0px',
						padding: '0px',
						border: '0px',
						fontSize: 'inherit',
						fontFamily: 'inherit',
						fontWeight: 'inherit',
						lineHeight: 'inherit',
						verticalAlign: 'baseline',
						flex: '1 1 auto',
						gap: '16px',
						display: 'flex',
						flexDirection: 'row',
					}}
				>
					<div
						className='sc-beySPh sc-hhxwqX dvohAp kXCcYJ sc-dMlkvz jXhNfa'
						style={{
							boxSizing: 'border-box',
							touchAction: 'pan-x pan-y',
							fontSize: 'inherit',
							fontFamily: 'inherit',
							fontWeight: 'inherit',
							lineHeight: 'inherit',
							verticalAlign: 'baseline',
							display: 'flex',
							flexShrink: 'initial',
							flexBasis: 'initial',
							flexDirection: 'row',
							WebkitBoxFlex: '1',
							flexGrow: 1,
							border: '1px solid rgb(235, 235, 235)',
							backgroundColor: 'rgb(255, 255, 255)',
							boxShadow: 'rgba(0, 0, 0, 0.02) 0px 4px 4px -1px, rgba(0, 0, 0, 0.06) 0px 1px 1px 0px',
							padding: '12px 16px',
							margin: '0px',
							borderRadius: '8px',
							minWidth: '300px',
							transitionProperty: 'box-shadow, border-color',
							transitionTimingFunction: 'ease-in-out',
							transitionDuration: '0.15s',
							cursor: 'text',
						}}
					>
						<div
							className='sc-beySPh dLuCWe'
							style={{
								boxSizing: 'border-box',
								touchAction: 'pan-x pan-y',
								margin: '0px',
								padding: '0px',
								border: '0px',
								fontSize: 'inherit',
								fontFamily: 'inherit',
								fontWeight: 'inherit',
								lineHeight: 'inherit',
								verticalAlign: 'baseline',
								gap: '8px',
								display: 'flex',
								flexShrink: 'initial',
								flexBasis: 'initial',
								flexDirection: 'column',
								WebkitBoxFlex: '1',
								flexGrow: 1,
								minWidth: '0px',
							}}
						>
							<Select defaultValue='discussion'>
								<SelectTrigger className='w-1/5'>
									<SelectValue placeholder='Select a note type...' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='discussion'>Discussion</SelectItem>
									<SelectItem value='internal'>Internal</SelectItem>
									<SelectItem value='resolution'>Resolution</SelectItem>
								</SelectContent>
							</Select>

							<Textarea
								placeholder='Add a comment...'
								className='border-none shadow-none resize-none'
								minRows={2}
							/>

							<div
								className='sc-beySPh joSxxe'
								style={{
									boxSizing: 'border-box',
									touchAction: 'pan-x pan-y',
									margin: '0px',
									padding: '0px',
									border: '0px',
									fontSize: 'inherit',
									fontFamily: 'inherit',
									fontWeight: 'inherit',
									lineHeight: 'inherit',
									verticalAlign: 'baseline',
									flex: 'initial',
									flexDirection: 'row',
									alignItems: 'flex-end',
									WebkitBoxPack: 'end',
									justifyContent: 'flex-end',
									paddingBottom: '2px',
									paddingRight: '2px',
									display: 'flex',
								}}
							>
								<div
									className='sc-beySPh fHGXFQ'
									style={{
										boxSizing: 'border-box',
										touchAction: 'pan-x pan-y',
										margin: '0px',
										padding: '0px',
										border: '0px',
										fontSize: 'inherit',
										fontFamily: 'inherit',
										fontWeight: 'inherit',
										lineHeight: 'inherit',
										verticalAlign: 'baseline',
										gap: '12px',
										display: 'flex',
										flexShrink: 'initial',
										flexBasis: 'initial',
										flexDirection: 'row-reverse',
										WebkitBoxAlign: 'center',
										alignItems: 'center',
										WebkitBoxFlex: '1',
										flexGrow: 1,
									}}
								>
									<div
										className='sc-beySPh kSEYzt'
										style={{
											boxSizing: 'border-box',
											touchAction: 'pan-x pan-y',
											margin: '0px',
											padding: '0px',
											border: '0px',
											fontSize: 'inherit',
											fontFamily: 'inherit',
											fontWeight: 'inherit',
											lineHeight: 'inherit',
											verticalAlign: 'baseline',
											flex: 'initial',
											flexFlow: 'wrap',
											gap: '8px',
											display: 'flex',
										}}
									>
										<div
											className='sc-beySPh kGpKyG'
											style={{
												boxSizing: 'border-box',
												touchAction: 'pan-x pan-y',
												margin: '0px',
												padding: '0px',
												border: '0px',
												fontSize: 'inherit',
												fontFamily: 'inherit',
												fontWeight: 'inherit',
												lineHeight: 'inherit',
												verticalAlign: 'baseline',
												flex: 'initial',
												display: 'flex',
												flexDirection: 'row',
											}}
										>
											<button
												className='sc-fsYfdN jnpIPQ sc-jesuKm ftCrHm'
												type='submit'
												tabIndex='-1'
												style={{
													boxSizing: 'border-box',
													touchAction: 'pan-x pan-y',
													fontFamily:
														'"Inter UI","SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif',
													cursor: 'pointer',
													whiteSpace: 'nowrap',
													margin: '0px',
													border: '1px solid rgb(216, 216, 216)',
													padding: '0px 2px',
													display: 'inline-flex',
													verticalAlign: 'top',
													WebkitBoxAlign: 'center',
													alignItems: 'center',
													WebkitBoxPack: 'center',
													justifyContent: 'center',
													flexShrink: 0,
													fontWeight: 500,
													lineHeight: 'normal',
													transitionProperty: 'border, background-color, color, opacity',
													transitionDuration: '0.15s',
													userSelect: 'none',
													appRegion: 'no-drag',
													boxShadow: 'rgba(0, 0, 0, 0.02) 0px 4px 4px -1px, rgba(0, 0, 0, 0.06) 0px 1px 1px 0px',
													backgroundColor: 'rgb(255, 255, 255)',
													color: 'rgb(48, 48, 49)',
													fontSize: '0.75rem',
													borderWidth: '1px',
													borderRadius: '0.75rem',
													width: '1.5rem',
													minWidth: '1.5rem',
													height: '1.5rem',
													position: 'relative',
												}}
											>
												<span
													aria-hidden='false'
													style={{
														boxSizing: 'border-box',
														touchAction: 'pan-x pan-y',
														margin: '0px',
														padding: '0px',
														border: '0px',
														fontSize: 'inherit',
														fontFamily: 'inherit',
														fontWeight: 'inherit',
														lineHeight: 'inherit',
														verticalAlign: 'baseline',
														display: 'inline-flex',
														WebkitBoxAlign: 'center',
														alignItems: 'center',
														WebkitBoxPack: 'center',
														justifyContent: 'center',
														maxWidth: '14px',
														maxHeight: '14px',
														transitionProperty: 'fill, stroke',
														transitionDuration: '0.15s',
														fill: 'rgb(160, 160, 162)',
													}}
												>
													<svg
														height='16'
														width='16'
														aria-hidden='true'
														fill='#5e5e5f'
														focusable='false'
														role='img'
														viewBox='0 0 16 16'
														style={{
															boxSizing: 'border-box',
															touchAction: 'pan-x pan-y',
															flexShrink: 0,
															transitionProperty: 'fill',
															transitionDuration: '0.15s',
															fill: 'currentcolor',
														}}
													>
														<path
															d='M11.48 5.674a.75.75 0 1 1-.96 1.152L8.75 5.351v6.899a.75.75 0 0 1-1.5 0V5.351L5.48 6.826a.75.75 0 0 1-.96-1.152l3-2.5a.75.75 0 0 1 .96 0l3 2.5Z'
															style={{
																boxSizing: 'border-box',
																touchAction: 'pan-x pan-y',
															}}
														/>
													</svg>
												</span>
											</button>
										</div>
									</div>
									<div
										className='sc-beySPh kGpKyG'
										style={{
											boxSizing: 'border-box',
											touchAction: 'pan-x pan-y',
											margin: '0px',
											padding: '0px',
											border: '0px',
											fontSize: 'inherit',
											fontFamily: 'inherit',
											fontWeight: 'inherit',
											lineHeight: 'inherit',
											verticalAlign: 'baseline',
											flex: 'initial',
											display: 'flex',
											flexDirection: 'row',
										}}
									>
										<button
											className='sc-fsYfdN dXNKu sc-hZTMsx sc-bunzYb folYCp bcnefB'
											type='button'
											aria-label='Attach images, files or videos'
											tabIndex='-1'
											style={{
												boxSizing: 'border-box',
												touchAction: 'pan-x pan-y',
												fontFamily:
													'"Inter UI","SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif',
												cursor: 'pointer',
												whiteSpace: 'nowrap',
												margin: '0px',
												border: '1px solid transparent',
												display: 'inline-flex',
												verticalAlign: 'top',
												WebkitBoxAlign: 'center',
												alignItems: 'center',
												WebkitBoxPack: 'center',
												justifyContent: 'center',
												flexShrink: 0,
												fontWeight: 500,
												lineHeight: 'normal',
												transitionProperty: 'border, background-color, color, opacity',
												transitionDuration: '0.15s',
												userSelect: 'none',
												appRegion: 'no-drag',
												position: 'relative',
												backgroundColor: 'transparent',
												color: 'rgb(48, 48, 49)',
												minWidth: '24px',
												height: '24px',
												fontSize: '0.75rem',
												padding: '0px 2px',
												boxShadow: 'none',
												borderRadius: '100%',
											}}
										>
											<svg
												height='16'
												width='16'
												aria-hidden='true'
												fill='#a0a0a2'
												focusable='false'
												role='img'
												viewBox='0 0 16 16'
												style={{
													boxSizing: 'border-box',
													touchAction: 'pan-x pan-y',
													flexShrink: 0,
													transitionProperty: 'fill',
													transitionDuration: '0.15s',
												}}
											>
												<path
													d='M12.6429 7.69048L8.92925 11.4041C7.48164 12.8517 5.34347 13.0101 4.16667 11.8333C2.98733 10.654 3.14447 8.52219 4.59216 7.07451L8.00206 3.66461C8.93557 2.73109 10.2976 2.63095 11.0333 3.36667C11.7681 4.10139 11.6658 5.4675 10.7361 6.39727L7.32363 9.8097C6.90202 10.2313 6.32171 10.2741 6.02381 9.97619C5.72651 9.6789 5.76949 9.09718 6.1989 8.66776L9.29048 5.57619C9.56662 5.30005 9.56662 4.85233 9.29048 4.57619C9.01433 4.30005 8.56662 4.30005 8.29048 4.57619L5.1989 7.66776C4.24737 8.6193 4.13865 10.091 5.02381 10.9762C5.9095 11.8619 7.37984 11.7535 8.32363 10.8097L11.7361 7.39727C13.1876 5.94573 13.3564 3.68975 12.0333 2.36667C10.7099 1.04326 8.45782 1.20884 7.00206 2.66461L3.59216 6.07451C1.62229 8.04437 1.39955 11.0662 3.16667 12.8333C4.93146 14.5981 7.9596 14.3737 9.92925 12.4041L13.6429 8.69048C13.919 8.41433 13.919 7.96662 13.6429 7.69048C13.3667 7.41433 12.919 7.41433 12.6429 7.69048Z'
													style={{
														boxSizing: 'border-box',
														touchAction: 'pan-x pan-y',
													}}
												/>
											</svg>
										</button>
									</div>
									<input
										className='sc-gpielE cqrAcI'
										type='file'
										multiple
										style={{
											boxSizing: 'border-box',
											touchAction: 'pan-x pan-y',
											fontFamily:
												'"Inter UI","SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif',
											display: 'none',
											visibility: 'hidden',
										}}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
}
