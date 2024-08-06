'use client';
import { ReactNode } from 'react';
import { JabraProvider } from '@/providers/jabra-provider';
import RecoilProvider from '@/providers/recoil-provider';
import { TwilioProvider } from '@/providers/twilio-provider';
import { DeviceProvider } from '@/providers/device-provider';
import { WorkerProvider } from '@/providers/worker-provider';
import { NotificationProvider } from '@/providers/notification-provider';

type Props = {
	token: string;
	children: ReactNode;
};

const UserLayout = ({ token, children }: Props) => {
	return (
		<RecoilProvider>
			<NotificationProvider>
				<JabraProvider>
					<TwilioProvider authToken={token}>
						<DeviceProvider authToken={token}>
							<WorkerProvider authToken={token}>{children}</WorkerProvider>
						</DeviceProvider>
					</TwilioProvider>
				</JabraProvider>
			</NotificationProvider>
		</RecoilProvider>
	);
};

export default UserLayout;
