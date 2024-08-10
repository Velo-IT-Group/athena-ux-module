import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import React from 'react';

type Props = {};

const Page = (props: Props) => {
	return (
		<>
			<form className='max-w-[768px] mx-auto w-full pt-16'>
				<div
					className='sc-beySPh kHJrcM'
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
						gap: '24px',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<section className='border rounded-sm'>
						<ul
							className='sc-fOBchY fSbiTf'
							style={{
								boxSizing: 'border-box',
								touchAction: 'pan-x pan-y',
								border: '0px',
								fontSize: 'inherit',
								fontFamily: 'inherit',
								fontWeight: 'inherit',
								lineHeight: 'inherit',
								verticalAlign: 'baseline',
								margin: '0px',
								padding: '0px',
								listStyle: 'none',
								marginTop: '0px',
								marginBottom: '0px',
							}}
						>
							<li className='sc-cxgeGX sc-jiBcEi izkQNA ezupdm p-3 relative bg-muted h-48 grid place-items-center w-full'>
								<label
									className='text-sm font-medium w-full'
									htmlFor='avatarUrl'
								>
									Profile picture
								</label>

								<Avatar className='w-36 h-36 justify-self-center '>
									<input
										id='avatarUrl'
										type='file'
										autoComplete='off'
										accept='image/png, image/jpeg'
										multiple
										tabIndex={-1}
										className='absolute z-10 w-36 h-36 opacity-0 hover:cursor-pointer'
									/>
									<AvatarFallback className='text-6xl bg-background'>NB</AvatarFallback>
								</Avatar>
							</li>

							<li
								className='sc-cxgeGX izkQNA'
								style={{
									boxSizing: 'border-box',
									touchAction: 'pan-x pan-y',
									margin: '0px',
									border: '0px',
									fontSize: 'inherit',
									fontFamily: 'inherit',
									fontWeight: 'inherit',
									lineHeight: 'inherit',
									verticalAlign: 'baseline',
									padding: '16px 16px',
									gap: '16px',
									display: 'flex',
									WebkitBoxPack: 'justify',
									justifyContent: 'space-between',
									WebkitBoxAlign: 'center',
									alignItems: 'center',
									position: 'relative',
								}}
							>
								<label
									className='sc-lfUnul iQjhPO'
									htmlFor='email'
									style={{
										boxSizing: 'border-box',
										touchAction: 'pan-x pan-y',
										margin: '0px',
										padding: '0px',
										border: '0px',
										fontFamily: 'inherit',
										verticalAlign: 'baseline',
										lineHeight: 'normal',
										fontSize: '0.8125rem',
										fontWeight: 500,
									}}
								>
									Email
								</label>
								<div
									className='sc-AqqLW sc-iwMegK kAfPuD jaxDeD'
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
										position: 'relative',
									}}
								>
									<svg
										className='sc-cJFaGT eiTYVp'
										height='16'
										width='16'
										aria-hidden='true'
										fill='#969799'
										focusable='false'
										role='img'
										viewBox='0 0 16 16'
										style={{
											boxSizing: 'border-box',
											touchAction: 'pan-x pan-y',
											flexShrink: 0,
											position: 'absolute',
											right: '8px',
											top: '50%',
											transform: 'translateY(-50%)',
											opacity: 0,
											pointerEvents: 'none',
										}}
									>
										<path
											d='M10.1805 3.34195L4.14166 9.416C5.32948 9.77021 6.29238 10.6629 6.74008 11.8184L12.6877 5.8425C11.6642 5.22123 10.8043 4.36352 10.1805 3.34195Z'
											style={{
												boxSizing: 'border-box',
												touchAction: 'pan-x pan-y',
											}}
										/>
										<path
											d='M13.7391 4.71631C14.1575 4.02948 14.0727 3.11738 13.4846 2.5219C12.8908 1.92072 11.9784 1.83892 11.298 2.27649C11.8547 3.31132 12.7037 4.15999 13.7391 4.71631Z'
											style={{
												boxSizing: 'border-box',
												touchAction: 'pan-x pan-y',
											}}
										/>
										<path
											d='M3.03104 10.7502C4.30296 10.7658 5.36645 11.7423 5.49783 13.0114C4.83268 13.426 3.40197 13.7922 2.53114 13.9886C2.2001 14.0632 1.92026 13.7602 2.02075 13.4373C2.25326 12.6902 2.64592 11.5136 3.03104 10.7502Z'
											style={{
												boxSizing: 'border-box',
												touchAction: 'pan-x pan-y',
											}}
										/>
									</svg>
									<Input
										name='email'
										className='sc-brSamD sc-dGOjYX bAqrBY cuAThe'
										defaultValue='nicholas.black98@icloud.com'
									/>
									{/* <input
										id='email'
										className='sc-brSamD sc-dGOjYX bAqrBY cuAThe'
										defaultValue='nicholas.black98@icloud.com'
										style={{
											boxSizing: 'border-box',
											touchAction: 'pan-x pan-y',
											fontFamily:
												'"Inter UI","SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif',
											padding: '6px 12px',
											background: 'rgb(15, 16, 17)',
											border: '1px solid rgb(44, 46, 51)',
											borderRadius: '5px',
											transition: 'border 0.15s',
											height: '32px',
											fontSize: '0.8125rem',
											color: 'rgb(255, 255, 255)',
											appearance: 'none',
											appRegion: 'no-drag',
											outlineOffset: '-1px',
											margin: '2px 0px',
										}} */}
									{/* /> */}
								</div>
							</li>

							<li
								className='sc-cxgeGX izkQNA'
								style={{
									boxSizing: 'border-box',
									touchAction: 'pan-x pan-y',
									margin: '0px',
									border: '0px',
									fontSize: 'inherit',
									fontFamily: 'inherit',
									fontWeight: 'inherit',
									lineHeight: 'inherit',
									verticalAlign: 'baseline',
									padding: '16px 16px',
									gap: '16px',
									display: 'flex',
									WebkitBoxPack: 'justify',
									justifyContent: 'space-between',
									WebkitBoxAlign: 'center',
									alignItems: 'center',
									position: 'relative',
								}}
							>
								<div
									className='sc-beySPh eeCOvM'
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
										gap: '2px',
										display: 'flex',
										flexDirection: 'column',
									}}
								>
									<label
										className='sc-lfUnul iQjhPO'
										htmlFor='name'
										style={{
											boxSizing: 'border-box',
											touchAction: 'pan-x pan-y',
											margin: '0px',
											padding: '0px',
											border: '0px',
											fontFamily: 'inherit',
											verticalAlign: 'baseline',
											lineHeight: 'normal',
											fontSize: '0.8125rem',
											fontWeight: 500,
										}}
									>
										Full name
									</label>
									<span
										className='sc-dmyCSP sc-dFHMZU iSzVqX'
										style={{
											boxSizing: 'border-box',
											touchAction: 'pan-x pan-y',
											margin: '0px',
											padding: '0px',
											border: '0px',
											fontFamily: 'inherit',
											verticalAlign: 'baseline',
											fontStyle: 'normal',
											textAlign: 'left',
											color: 'rgb(255, 112, 109)',
											lineHeight: 'normal',
											fontSize: '0.8125rem',
											fontWeight: 500,
										}}
									/>
								</div>
								<input
									id='name'
									className='sc-brSamD sc-dGOjYX bAqrBY cuAThe'
									name='name'
									autoComplete='off'
									defaultValue='nicholas.black98@icloud.com'
									placeholder='Full name'
									style={{
										boxSizing: 'border-box',
										touchAction: 'pan-x pan-y',
										fontFamily:
											'"Inter UI","SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif',
										padding: '6px 12px',
										background: 'rgb(15, 16, 17)',
										border: '1px solid rgb(44, 46, 51)',
										borderRadius: '5px',
										transition: 'border 0.15s',
										height: '32px',
										fontSize: '0.8125rem',
										color: 'rgb(255, 255, 255)',
										appearance: 'none',
										appRegion: 'no-drag',
										outlineOffset: '-1px',
										margin: '2px 0px',
									}}
								/>
							</li>

							<li
								className='sc-cxgeGX izkQNA'
								style={{
									boxSizing: 'border-box',
									touchAction: 'pan-x pan-y',
									margin: '0px',
									border: '0px',
									fontSize: 'inherit',
									fontFamily: 'inherit',
									fontWeight: 'inherit',
									lineHeight: 'inherit',
									verticalAlign: 'baseline',
									padding: '16px 16px',
									gap: '16px',
									display: 'flex',
									WebkitBoxPack: 'justify',
									justifyContent: 'space-between',
									WebkitBoxAlign: 'center',
									alignItems: 'center',
									position: 'relative',
									borderRadius: '0 0 6px 6px',
								}}
							>
								<div
									className='sc-beySPh eeCOvM'
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
										gap: '2px',
										display: 'flex',
										flexDirection: 'column',
									}}
								>
									<label
										className='sc-lfUnul iQjhPO'
										htmlFor='displayName'
										style={{
											boxSizing: 'border-box',
											touchAction: 'pan-x pan-y',
											margin: '0px',
											padding: '0px',
											border: '0px',
											fontFamily: 'inherit',
											verticalAlign: 'baseline',
											lineHeight: 'normal',
											fontSize: '0.8125rem',
											fontWeight: 500,
										}}
									>
										Username
									</label>
									<span
										className='sc-dmyCSP gpOAgR'
										style={{
											boxSizing: 'border-box',
											touchAction: 'pan-x pan-y',
											margin: '0px',
											padding: '0px',
											border: '0px',
											fontFamily: 'inherit',
											verticalAlign: 'baseline',
											fontStyle: 'normal',
											textAlign: 'left',
											color: 'rgb(150, 151, 153)',
											lineHeight: 'normal',
											fontSize: '0.8125rem',
											fontWeight: 'normal',
										}}
									>
										Nickname or first name, however you want to be called in Linear
									</span>
								</div>
								<input
									id='displayName'
									className='sc-brSamD sc-dGOjYX sc-hvXtdC bAqrBY cuAThe jDOIJw'
									name='displayName'
									defaultValue='nicholas.black98'
									placeholder='username'
									style={{
										boxSizing: 'border-box',
										touchAction: 'pan-x pan-y',
										fontFamily:
											'"Inter UI","SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif',
										padding: '6px 12px',
										background: 'rgb(15, 16, 17)',
										border: '1px solid rgb(44, 46, 51)',
										borderRadius: '5px',
										transition: 'border 0.15s',
										height: '32px',
										fontSize: '0.8125rem',
										color: 'rgb(255, 255, 255)',
										appearance: 'none',
										appRegion: 'no-drag',
										outlineOffset: '-1px',
										margin: '2px 0px',
										textTransform: 'lowercase',
									}}
								/>
							</li>
						</ul>
					</section>

					<button
						type='submit'
						style={{
							boxSizing: 'border-box',
							touchAction: 'pan-x pan-y',
							fontFamily:
								'"Inter UI","SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif',
							cursor: 'pointer',
							display: 'none',
						}}
					>
						Update
					</button>

					<section
						className='sc-iFvklb hWdQYt'
						style={{
							boxSizing: 'border-box',
							touchAction: 'pan-x pan-y',
							margin: '0px',
							padding: '0px',
							fontSize: 'inherit',
							fontFamily: 'inherit',
							fontWeight: 'inherit',
							lineHeight: 'inherit',
							verticalAlign: 'baseline',
							display: 'block',
							borderRadius: '6px',
							border: '1px solid rgb(35, 37, 42)',
							backgroundColor: 'rgb(15, 16, 17)',
						}}
					>
						<header
							className='sc-ggVnwW edyoQg'
							style={{
								boxSizing: 'border-box',
								touchAction: 'pan-x pan-y',
								margin: '0px',
								border: '0px',
								fontSize: 'inherit',
								fontFamily: 'inherit',
								fontWeight: 'inherit',
								lineHeight: 'inherit',
								verticalAlign: 'baseline',
								gap: '16px',
								padding: '6px 16px',
								borderRadius: '4px',
								display: 'flex',
								WebkitBoxPack: 'justify',
								justifyContent: 'space-between',
								WebkitBoxAlign: 'center',
								alignItems: 'center',
								backgroundColor: 'rgb(27, 28, 32)',
							}}
						>
							<div
								className='sc-beySPh eeCOvM'
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
									gap: '2px',
									display: 'flex',
									flexDirection: 'column',
								}}
							>
								<h3
									className='sc-dmyCSP CopoT'
									style={{
										boxSizing: 'border-box',
										touchAction: 'pan-x pan-y',
										margin: '0px',
										padding: '0px',
										border: '0px',
										fontFamily: 'inherit',
										verticalAlign: 'baseline',
										marginTop: '0px',
										marginBottom: '0em',
										fontStyle: 'normal',
										textAlign: 'left',
										color: 'rgb(150, 151, 153)',
										lineHeight: 'normal',
										fontSize: '0.8125rem',
										fontWeight: 500,
									}}
								>
									Personal integrations
								</h3>
							</div>
							<div
								className='sc-beySPh bsiKCa'
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
									gap: '4px',
									display: 'flex',
									flexDirection: 'row',
								}}
							/>
						</header>
						<ul
							className='sc-fOBchY fSbiTf'
							style={{
								boxSizing: 'border-box',
								touchAction: 'pan-x pan-y',
								border: '0px',
								fontSize: 'inherit',
								fontFamily: 'inherit',
								fontWeight: 'inherit',
								lineHeight: 'inherit',
								verticalAlign: 'baseline',
								margin: '0px',
								padding: '0px',
								listStyle: 'none',
								marginTop: '0px',
								marginBottom: '0px',
							}}
						>
							<li
								className='sc-cxgeGX izkQNA'
								style={{
									boxSizing: 'border-box',
									touchAction: 'pan-x pan-y',
									margin: '0px',
									border: '0px',
									fontSize: 'inherit',
									fontFamily: 'inherit',
									fontWeight: 'inherit',
									lineHeight: 'inherit',
									verticalAlign: 'baseline',
									padding: '16px 16px',
									gap: '16px',
									display: 'flex',
									WebkitBoxPack: 'justify',
									justifyContent: 'space-between',
									WebkitBoxAlign: 'center',
									alignItems: 'center',
									position: 'relative',
									borderRadius: '6px 6px 0 0',
								}}
							>
								<div
									className='sc-beySPh btmjkt'
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
										gap: '16px',
										display: 'flex',
										flexDirection: 'row',
										WebkitBoxAlign: 'center',
										alignItems: 'center',
										minWidth: '0px',
									}}
								>
									<figure
										className='sc-hPnoVK bvVve'
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
											borderRadius: '6px',
											overflow: 'hidden',
											placeItems: 'center',
											width: '32px',
											height: '32px',
											flexShrink: 0,
											backgroundColor: 'rgb(27, 28, 32)',
											display: 'grid',
										}}
									>
										<svg
											className='color-override'
											height='16'
											width='16'
											aria-hidden='true'
											focusable='false'
											role='img'
											viewBox='0 0 16 16'
											style={{
												boxSizing: 'border-box',
												touchAction: 'pan-x pan-y',
												flexShrink: 0,
											}}
										>
											<path
												d='M3.95144 9.85024C3.95144 10.6639 3.29432 11.3216 2.48128 11.3216C1.66823 11.3216 1.01111 10.6639 1.01111 9.85024C1.01111 9.03655 1.66823 8.37891 2.48128 8.37891H3.95144V9.85024ZM4.68653 9.85024C4.68653 9.03655 5.34365 8.37891 6.15669 8.37891C6.96974 8.37891 7.62686 9.03655 7.62686 9.85024V13.5286C7.62686 14.3423 6.96974 14.9999 6.15669 14.9999C5.34365 14.9999 4.68653 14.3423 4.68653 13.5286V9.85024Z'
												fill='var(--icon-color, #E01E5A)'
												style={{
													boxSizing: 'border-box',
													touchAction: 'pan-x pan-y',
												}}
											/>
											<path
												d='M9.84333 12.0573C10.6564 12.0573 11.3135 12.7149 11.3135 13.5286C11.3135 14.3423 10.6564 14.9999 9.84333 14.9999C9.03029 14.9999 8.37317 14.3423 8.37317 13.5286V12.0573H9.84333ZM9.84333 11.3216C9.03029 11.3216 8.37317 10.6639 8.37317 9.85024C8.37317 9.03655 9.03029 8.37891 9.84333 8.37891H13.5299C14.3429 8.37891 15.0001 9.03655 15.0001 9.85024C15.0001 10.6639 14.3429 11.3216 13.5299 11.3216H9.84333Z'
												fill='var(--icon-color, #ECB22E)'
												style={{
													boxSizing: 'border-box',
													touchAction: 'pan-x pan-y',
												}}
											/>
											<path
												d='M12.0486 6.16083C12.0486 5.34713 12.7057 4.68949 13.5188 4.68949C14.3318 4.68949 14.9889 5.34713 14.9889 6.16083C14.9889 6.97452 14.3318 7.63217 13.5188 7.63217H12.0486V6.16083ZM11.3135 6.16083C11.3135 6.97452 10.6564 7.63217 9.84334 7.63217C9.03029 7.63217 8.37317 6.97452 8.37317 6.16083V2.47134C8.37317 1.65764 9.03029 1 9.84334 1C10.6564 1 11.3135 1.65764 11.3135 2.47134V6.16083Z'
												fill='var(--icon-color, #2EB67D)'
												style={{
													boxSizing: 'border-box',
													touchAction: 'pan-x pan-y',
												}}
											/>
											<path
												d='M6.15672 3.94268C5.34368 3.94268 4.68655 3.28503 4.68655 2.47134C4.68655 1.65764 5.34368 1 6.15672 1C6.96977 1 7.62689 1.65764 7.62689 2.47134V3.94268H6.15672ZM6.15672 4.68949C6.96977 4.68949 7.62689 5.34713 7.62689 6.16083C7.62689 6.97452 6.96977 7.63217 6.15672 7.63217H2.47017C1.65712 7.63217 1 6.97452 1 6.16083C1 5.34713 1.65712 4.68949 2.47017 4.68949H6.15672Z'
												fill='var(--icon-color, #36C5F0)'
												style={{
													boxSizing: 'border-box',
													touchAction: 'pan-x pan-y',
												}}
											/>
										</svg>
									</figure>
									<div
										className='sc-beySPh iqqTdD'
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
											gap: '2px',
											display: 'flex',
											flexDirection: 'column',
											minWidth: '0px',
										}}
									>
										<div
											className='sc-beySPh jSNbJn'
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
												gap: '6px',
												display: 'flex',
												flexDirection: 'row',
												WebkitBoxAlign: 'center',
												alignItems: 'center',
											}}
										>
											<span
												className='sc-dmyCSP kXjuCK'
												style={{
													boxSizing: 'border-box',
													touchAction: 'pan-x pan-y',
													margin: '0px',
													padding: '0px',
													border: '0px',
													fontFamily: 'inherit',
													verticalAlign: 'baseline',
													fontStyle: 'normal',
													textAlign: 'left',
													color: 'rgb(255, 255, 255)',
													lineHeight: 'normal',
													fontSize: '0.8125rem',
													fontWeight: 500,
												}}
											>
												Slack account
											</span>
										</div>
										<span
											className='sc-dmyCSP gpOAgR'
											style={{
												boxSizing: 'border-box',
												touchAction: 'pan-x pan-y',
												margin: '0px',
												padding: '0px',
												border: '0px',
												fontFamily: 'inherit',
												verticalAlign: 'baseline',
												fontStyle: 'normal',
												textAlign: 'left',
												color: 'rgb(150, 151, 153)',
												lineHeight: 'normal',
												fontSize: '0.8125rem',
												fontWeight: 'normal',
											}}
										>
											Link your Slack account to your Linear account and receive personal notifications
										</span>
									</div>
								</div>
								<div
									className='sc-dxRmzR liEjyV'
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
										gap: '4px',
										opacity: 1,
										display: 'flex',
										position: 'relative',
									}}
								>
									<div
										className='sc-beySPh kGpKyG sc-cQXfRj fNueca'
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
											minWidth: '0px',
											userSelect: 'none',
											cursor: 'pointer',
										}}
									>
										<button
											className='sc-blmEgr gnBkEv sc-keSDAH hcJBeP'
											type='button'
											aria-label='Connect personal Slack account'
											style={{
												boxSizing: 'border-box',
												touchAction: 'pan-x pan-y',
												fontFamily:
													'"Inter UI","SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif',
												cursor: 'pointer',
												whiteSpace: 'nowrap',
												margin: '0px',
												borderRadius: '5px',
												border: '1px solid transparent',
												padding: '0px 14px',
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
												minWidth: '32px',
												height: '32px',
												fontSize: '0.8125rem',
												color: 'rgb(114, 129, 255)',
												marginRight: '-4px',
												paddingRight: '10px',
											}}
										>
											Connect
											<svg
												height='16'
												width='16'
												aria-hidden='true'
												fill='#7281ff'
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
													width: '12px',
													marginLeft: '4px',
												}}
											>
												<path
													d='M5.46967 11.4697C5.17678 11.7626 5.17678 12.2374 5.46967 12.5303C5.76256 12.8232 6.23744 12.8232 6.53033 12.5303L10.5303 8.53033C10.8207 8.23999 10.8236 7.77014 10.5368 7.47624L6.63419 3.47624C6.34492 3.17976 5.87009 3.17391 5.57361 3.46318C5.27713 3.75244 5.27128 4.22728 5.56054 4.52376L8.94583 7.99351L5.46967 11.4697Z'
													style={{
														boxSizing: 'border-box',
														touchAction: 'pan-x pan-y',
													}}
												/>
											</svg>
										</button>
									</div>
								</div>
							</li>
							<li
								className='sc-cxgeGX izkQNA'
								style={{
									boxSizing: 'border-box',
									touchAction: 'pan-x pan-y',
									margin: '0px',
									border: '0px',
									fontSize: 'inherit',
									fontFamily: 'inherit',
									fontWeight: 'inherit',
									lineHeight: 'inherit',
									verticalAlign: 'baseline',
									padding: '16px 16px',
									gap: '16px',
									display: 'flex',
									WebkitBoxPack: 'justify',
									justifyContent: 'space-between',
									WebkitBoxAlign: 'center',
									alignItems: 'center',
									position: 'relative',
								}}
							>
								<div
									className='sc-beySPh btmjkt'
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
										gap: '16px',
										display: 'flex',
										flexDirection: 'row',
										WebkitBoxAlign: 'center',
										alignItems: 'center',
										minWidth: '0px',
									}}
								>
									<figure
										className='sc-hPnoVK bvVve'
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
											borderRadius: '6px',
											overflow: 'hidden',
											placeItems: 'center',
											width: '32px',
											height: '32px',
											flexShrink: 0,
											backgroundColor: 'rgb(27, 28, 32)',
											display: 'grid',
										}}
									>
										<svg
											height='16'
											width='16'
											aria-hidden='true'
											fill='#969799'
											focusable='false'
											role='img'
											viewBox='0 0 16 16'
											style={{
												boxSizing: 'border-box',
												touchAction: 'pan-x pan-y',
												flexShrink: 0,
											}}
										>
											<path
												d='M11.5127 1.96272C10.4401 1.32091 9.27013 1 7.99946 1C6.72987 1 5.5588 1.32091 4.48573 1.96272C3.41428 2.60397 2.56465 3.47445 1.939 4.57358C1.31228 5.67383 1 6.87359 1 8.17567C1 9.73883 1.44527 11.1443 2.33528 12.3933C3.22529 13.64 4.37482 14.5066 5.78494 14.9846C5.94862 15.0159 6.0703 14.9941 6.14891 14.9192C6.22806 14.8437 6.26736 14.7515 6.26736 14.6396L6.26306 14.1337C6.25983 13.8161 6.25767 13.5394 6.25767 13.3023L6.04877 13.3392C5.91524 13.3644 5.74617 13.375 5.54265 13.3717C5.33967 13.3689 5.12807 13.3471 4.90947 13.3063C4.69249 13.266 4.4895 13.1732 4.30105 13.0267C4.11261 12.8802 3.97908 12.6885 3.89993 12.452L3.8084 12.2362C3.7481 12.0931 3.65226 11.9343 3.52196 11.761C3.39112 11.5854 3.25921 11.4669 3.12568 11.4049L3.06107 11.3585C3.01908 11.3271 2.98031 11.2902 2.94262 11.2466C2.90655 11.203 2.87962 11.1594 2.86186 11.1158C2.84355 11.0711 2.85809 11.0359 2.90655 11.0079C2.955 10.9788 3.0433 10.966 3.17037 10.966L3.35343 10.9939C3.47404 11.0185 3.6248 11.0935 3.80409 11.2176C3.98339 11.3428 4.13091 11.5044 4.2456 11.704C4.38559 11.9589 4.55411 12.1535 4.75171 12.2876C4.94931 12.4218 5.14853 12.4889 5.34936 12.4889C5.54857 12.4889 5.72248 12.4721 5.86839 12.4419C6.01377 12.4106 6.15107 12.3637 6.27759 12.3022C6.33359 11.884 6.48219 11.5631 6.72448 11.3389C6.37882 11.3009 6.06761 11.245 5.7914 11.17C5.51465 11.0957 5.22929 10.9744 4.93531 10.8055C4.63918 10.6378 4.39528 10.4298 4.20091 10.1794C4.00708 9.93227 3.84717 9.60353 3.72333 9.201C3.59949 8.79456 3.5365 8.32885 3.5365 7.79885C3.5365 7.04579 3.77556 6.40397 4.25583 5.87397C4.03077 5.30708 4.05123 4.67197 4.32044 3.96755C4.49542 3.91164 4.75656 3.95357 5.1033 4.09334C5.4495 4.2331 5.70256 4.3533 5.86355 4.45226C6.02507 4.55289 6.1543 4.63675 6.25121 4.70496C6.81494 4.54618 7.39751 4.46624 7.99946 4.46624C8.60142 4.46624 9.18399 4.5473 9.74933 4.70887L10.0955 4.48413C10.3324 4.33485 10.6124 4.199 10.9344 4.07321C11.2574 3.9491 11.504 3.91499 11.6742 3.9709C11.9472 4.67533 11.9719 5.30987 11.7469 5.87733C12.2261 6.40621 12.4662 7.04802 12.4662 7.80165C12.4662 8.33053 12.4037 8.79959 12.2794 9.20771C12.1555 9.61583 11.994 9.94457 11.7959 10.19C11.5988 10.436 11.3533 10.6428 11.0582 10.8117C10.7637 10.9794 10.4767 11.1007 10.2021 11.1751C9.92539 11.25 9.61526 11.3059 9.26744 11.3428C9.58349 11.6223 9.74125 12.064 9.74125 12.6695V14.6413C9.74125 14.7531 9.77894 14.8459 9.8554 14.9208C9.93077 14.9952 10.0508 15.0176 10.2151 14.9863C11.6257 14.5055 12.7747 13.6423 13.6647 12.3922C14.5547 11.1454 15 9.73827 15 8.17567C15 6.87415 14.6866 5.67383 14.061 4.57414C13.4348 3.475 12.5857 2.60453 11.5143 1.96328L11.5127 1.96272Z'
												fill='var(--icon-color, #969799)'
												style={{
													boxSizing: 'border-box',
													touchAction: 'pan-x pan-y',
												}}
											/>
										</svg>
									</figure>
									<div
										className='sc-beySPh iqqTdD'
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
											gap: '2px',
											display: 'flex',
											flexDirection: 'column',
											minWidth: '0px',
										}}
									>
										<div
											className='sc-beySPh jSNbJn'
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
												gap: '6px',
												display: 'flex',
												flexDirection: 'row',
												WebkitBoxAlign: 'center',
												alignItems: 'center',
											}}
										>
											<span
												className='sc-dmyCSP kXjuCK'
												style={{
													boxSizing: 'border-box',
													touchAction: 'pan-x pan-y',
													margin: '0px',
													padding: '0px',
													border: '0px',
													fontFamily: 'inherit',
													verticalAlign: 'baseline',
													fontStyle: 'normal',
													textAlign: 'left',
													color: 'rgb(255, 255, 255)',
													lineHeight: 'normal',
													fontSize: '0.8125rem',
													fontWeight: 500,
												}}
											>
												GitHub connected
											</span>
										</div>
										<span
											className='sc-dmyCSP gpOAgR'
											style={{
												boxSizing: 'border-box',
												touchAction: 'pan-x pan-y',
												margin: '0px',
												padding: '0px',
												border: '0px',
												fontFamily: 'inherit',
												verticalAlign: 'baseline',
												fontStyle: 'normal',
												textAlign: 'left',
												color: 'rgb(150, 151, 153)',
												lineHeight: 'normal',
												fontSize: '0.8125rem',
												fontWeight: 'normal',
											}}
										>
											Your GitHub account is associated with your Linear account
										</span>
									</div>
								</div>
								<div
									className='sc-dxRmzR liEjyV'
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
										gap: '4px',
										opacity: 1,
										display: 'flex',
										position: 'relative',
									}}
								>
									<div
										className='sc-beySPh kGpKyG sc-fgisPL iyVSmR'
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
											minWidth: '0px',
											userSelect: 'none',
											cursor: 'pointer',
										}}
									>
										<div
											className='sc-fWsWcn depaAx'
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
												cursor: 'pointer',
											}}
										>
											<button
												className='sc-blmEgr gnBkEv sc-hpmCTx hKmiiG'
												type='button'
												style={{
													boxSizing: 'border-box',
													touchAction: 'pan-x pan-y',
													fontFamily:
														'"Inter UI","SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif',
													cursor: 'pointer',
													whiteSpace: 'nowrap',
													margin: '0px',
													borderRadius: '5px',
													border: '1px solid transparent',
													padding: '0px 14px',
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
													color: 'rgb(227, 228, 230)',
													minWidth: '32px',
													height: '32px',
													fontSize: '0.8125rem',
													marginRight: '-4px',
													paddingRight: '10px',
												}}
											>
												<div
													className='sc-beySPh jSNbJn'
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
														gap: '6px',
														display: 'flex',
														flexDirection: 'row',
														WebkitBoxAlign: 'center',
														alignItems: 'center',
													}}
												>
													<div
														className='sc-fmJrrp guddSu'
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
															borderRadius: '50%',
															width: '6px',
															height: '6px',
															backgroundColor: 'rgb(38, 165, 68)',
														}}
													/>
													<span
														className='sc-dmyCSP pWdDU'
														style={{
															boxSizing: 'border-box',
															touchAction: 'pan-x pan-y',
															margin: '0px',
															padding: '0px',
															border: '0px',
															fontFamily: 'inherit',
															verticalAlign: 'baseline',
															fontStyle: 'normal',
															textAlign: 'left',
															color: 'rgb(255, 255, 255)',
															lineHeight: 'normal',
															fontSize: '0.8125rem',
															fontWeight: 'normal',
														}}
													>
														nickblack26
													</span>
													<svg
														height='16'
														width='16'
														aria-hidden='true'
														fill='currentColor'
														focusable='false'
														role='img'
														viewBox='0 0 16 16'
														style={{
															boxSizing: 'border-box',
															touchAction: 'pan-x pan-y',
															flexShrink: 0,
															transitionProperty: 'fill',
															transitionDuration: '0.15s',
															width: '12px',
														}}
													>
														<path
															d='M4.53 5.47a.75.75 0 0 0-1.06 1.06l4 4a.75.75 0 0 0 1.054.007l4-3.903a.75.75 0 0 0-1.048-1.073l-3.47 3.385L4.53 5.47Z'
															style={{
																boxSizing: 'border-box',
																touchAction: 'pan-x pan-y',
															}}
														/>
													</svg>
												</div>
											</button>
										</div>
									</div>
								</div>
							</li>
							<li
								className='sc-cxgeGX izkQNA'
								style={{
									boxSizing: 'border-box',
									touchAction: 'pan-x pan-y',
									margin: '0px',
									border: '0px',
									fontSize: 'inherit',
									fontFamily: 'inherit',
									fontWeight: 'inherit',
									lineHeight: 'inherit',
									verticalAlign: 'baseline',
									padding: '16px 16px',
									gap: '16px',
									display: 'flex',
									WebkitBoxPack: 'justify',
									justifyContent: 'space-between',
									WebkitBoxAlign: 'center',
									alignItems: 'center',
									position: 'relative',
									borderRadius: '0 0 6px 6px',
								}}
							>
								<div
									className='sc-beySPh btmjkt'
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
										gap: '16px',
										display: 'flex',
										flexDirection: 'row',
										WebkitBoxAlign: 'center',
										alignItems: 'center',
										minWidth: '0px',
									}}
								>
									<figure
										className='sc-hPnoVK bvVve'
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
											borderRadius: '6px',
											overflow: 'hidden',
											placeItems: 'center',
											width: '32px',
											height: '32px',
											flexShrink: 0,
											backgroundColor: 'rgb(27, 28, 32)',
											display: 'grid',
										}}
									>
										<svg
											height='16'
											width='16'
											aria-hidden='true'
											fill='#969799'
											focusable='false'
											role='img'
											viewBox='0 0 16 16'
											style={{
												boxSizing: 'border-box',
												touchAction: 'pan-x pan-y',
												flexShrink: 0,
											}}
										>
											<path
												d='M11.684 4.316 8.37 3.947l-4.053.369L3.947 8l.369 3.684 3.684.46 3.684-.46.369-3.776-.369-3.592Z'
												fill='#fff'
												style={{
													boxSizing: 'border-box',
													touchAction: 'pan-x pan-y',
												}}
											/>
											<path
												d='M5.827 10.033c-.275-.186-.466-.458-.57-.817l.64-.264a.97.97 0 0 0 .303.514.783.783 0 0 0 .524.182c.209 0 .388-.064.538-.191a.61.61 0 0 0 .226-.485c0-.201-.08-.365-.238-.492a.922.922 0 0 0-.595-.191h-.369v-.633h.332a.808.808 0 0 0 .516-.165c.14-.111.21-.262.21-.455a.502.502 0 0 0-.188-.41.728.728 0 0 0-.476-.153c-.188 0-.337.05-.447.15a.88.88 0 0 0-.242.37l-.632-.264c.083-.238.237-.448.463-.63.226-.18.514-.272.864-.272.259 0 .492.05.698.15.206.1.368.24.485.417.117.177.175.376.175.597a.979.979 0 0 1-.163.573 1.124 1.124 0 0 1-.4.36v.038c.209.088.38.221.514.4.133.18.2.395.2.646 0 .25-.063.474-.19.67a1.32 1.32 0 0 1-.526.463c-.224.113-.476.17-.755.17-.323 0-.621-.092-.897-.278ZM9.75 6.86l-.698.507-.351-.532 1.259-.908h.483v4.284H9.75V6.86Z'
												fill='#1A73E8'
												style={{
													boxSizing: 'border-box',
													touchAction: 'pan-x pan-y',
												}}
											/>
											<path
												d='M11.684 15 15 11.684l-1.658-.737-1.658.737-.737 1.658.737 1.658Z'
												fill='#EA4335'
												style={{
													boxSizing: 'border-box',
													touchAction: 'pan-x pan-y',
												}}
											/>
											<path
												d='M3.579 13.342 4.316 15h7.368v-3.315H4.316l-.737 1.657Z'
												fill='#34A853'
												style={{
													boxSizing: 'border-box',
													touchAction: 'pan-x pan-y',
												}}
											/>
											<path
												d='M2.105 1C1.495 1 1 1.495 1 2.105v9.58l1.658.736 1.658-.737V4.316h7.368l.737-1.658L11.684 1H2.105Z'
												fill='#4285F4'
												style={{
													boxSizing: 'border-box',
													touchAction: 'pan-x pan-y',
												}}
											/>
											<path
												d='M1 11.685v2.21C1 14.505 1.495 15 2.105 15h2.21v-3.315H1Z'
												fill='#188038'
												style={{
													boxSizing: 'border-box',
													touchAction: 'pan-x pan-y',
												}}
											/>
											<path
												d='M11.684 4.316v7.368H15V4.316l-1.658-.737-1.658.737Z'
												fill='#FBBC04'
												style={{
													boxSizing: 'border-box',
													touchAction: 'pan-x pan-y',
												}}
											/>
											<path
												d='M15 4.316v-2.21C15 1.494 14.505 1 13.895 1h-2.21v3.316H15Z'
												fill='#1967D2'
												style={{
													boxSizing: 'border-box',
													touchAction: 'pan-x pan-y',
												}}
											/>
										</svg>
									</figure>
									<div
										className='sc-beySPh iqqTdD'
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
											gap: '2px',
											display: 'flex',
											flexDirection: 'column',
											minWidth: '0px',
										}}
									>
										<div
											className='sc-beySPh jSNbJn'
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
												gap: '6px',
												display: 'flex',
												flexDirection: 'row',
												WebkitBoxAlign: 'center',
												alignItems: 'center',
											}}
										>
											<span
												className='sc-dmyCSP kXjuCK'
												style={{
													boxSizing: 'border-box',
													touchAction: 'pan-x pan-y',
													margin: '0px',
													padding: '0px',
													border: '0px',
													fontFamily: 'inherit',
													verticalAlign: 'baseline',
													fontStyle: 'normal',
													textAlign: 'left',
													color: 'rgb(255, 255, 255)',
													lineHeight: 'normal',
													fontSize: '0.8125rem',
													fontWeight: 500,
												}}
											>
												Google Calendar
											</span>
										</div>
										<span
											className='sc-dmyCSP gpOAgR'
											style={{
												boxSizing: 'border-box',
												touchAction: 'pan-x pan-y',
												margin: '0px',
												padding: '0px',
												border: '0px',
												fontFamily: 'inherit',
												verticalAlign: 'baseline',
												fontStyle: 'normal',
												textAlign: 'left',
												color: 'rgb(150, 151, 153)',
												lineHeight: 'normal',
												fontSize: '0.8125rem',
												fontWeight: 'normal',
											}}
										>
											Display your out of office status in Linear
										</span>
									</div>
								</div>
								<div
									className='sc-dxRmzR liEjyV'
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
										gap: '4px',
										opacity: 1,
										display: 'flex',
										position: 'relative',
									}}
								>
									<div
										className='sc-beySPh kGpKyG sc-cQXfRj fNueca'
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
											minWidth: '0px',
											userSelect: 'none',
											cursor: 'pointer',
										}}
									>
										<button
											className='sc-blmEgr gnBkEv sc-keSDAH hcJBeP'
											type='button'
											aria-label='Connect Google Calendar integration'
											style={{
												boxSizing: 'border-box',
												touchAction: 'pan-x pan-y',
												fontFamily:
													'"Inter UI","SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif',
												cursor: 'pointer',
												whiteSpace: 'nowrap',
												margin: '0px',
												borderRadius: '5px',
												border: '1px solid transparent',
												padding: '0px 14px',
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
												minWidth: '32px',
												height: '32px',
												fontSize: '0.8125rem',
												color: 'rgb(114, 129, 255)',
												marginRight: '-4px',
												paddingRight: '10px',
											}}
										>
											Connect
											<svg
												height='16'
												width='16'
												aria-hidden='true'
												fill='#7281ff'
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
													width: '12px',
													marginLeft: '4px',
												}}
											>
												<path
													d='M5.46967 11.4697C5.17678 11.7626 5.17678 12.2374 5.46967 12.5303C5.76256 12.8232 6.23744 12.8232 6.53033 12.5303L10.5303 8.53033C10.8207 8.23999 10.8236 7.77014 10.5368 7.47624L6.63419 3.47624C6.34492 3.17976 5.87009 3.17391 5.57361 3.46318C5.27713 3.75244 5.27128 4.22728 5.56054 4.52376L8.94583 7.99351L5.46967 11.4697Z'
													style={{
														boxSizing: 'border-box',
														touchAction: 'pan-x pan-y',
													}}
												/>
											</svg>
										</button>
									</div>
								</div>
							</li>
						</ul>
					</section>
				</div>
			</form>
			<style
				dangerouslySetInnerHTML={{
					__html: `
html {
  box-sizing: border-box;
  touch-action: pan-x pan-y;
  background-color: #080808;
  height: 100%;
  border: 0px;
  font-size: inherit;
  font-family: inherit;
  font-weight: inherit;
  line-height: inherit;
  vertical-align: baseline;
  margin: 0px;
  padding: 0px;
  width: 100%;
  -webkit-tap-highlight-color: transparent;
  position: fixed;
  overflow: hidden;
}

body {
  box-sizing: border-box;
  touch-action: pan-x pan-y;
  height: 100%;
  border: 0px;
  font-size: inherit;
  font-weight: inherit;
  vertical-align: baseline;
  margin: 0px;
  padding: 0px;
  width: 100%;
  -webkit-tap-highlight-color: transparent;
  font-family: "Inter UI","SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizelegibility;
  text-size-adjust: 100%;
  position: fixed;
  overflow: hidden;
  user-select: none;
  cursor: default;
}
`,
				}}
			/>
		</>
	);
};

export default Page;
