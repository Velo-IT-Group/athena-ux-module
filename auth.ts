import Entra from 'next-auth/providers/microsoft-entra-id';
import NextAuth, { type NextAuthConfig, type DefaultSession } from 'next-auth';
import { findWorker } from './lib/twilio/taskrouter/helpers';
import { createAccessToken } from './lib/twilio';
import { getContacts, getSystemMembers } from './lib/manage/read';

declare module 'next-auth' {
	/**
	 * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: {
			/** The user's postal address. */
			workerSid: string;
			twilioToken: string;
			referenceId: number;
			contactId: number;
			microsoftToken: string;
			/**
			 * By default, TypeScript merges new interface properties and overwrites existing ones.
			 * In this case, the default session user properties will be overwritten,
			 * with the new ones defined above. To keep the default session user properties,
			 * you need to add them back into the newly declared interface.
			 */
		} & DefaultSession['user'];
	}
}

export const config: NextAuthConfig = {
	providers: [
		Entra({
			clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
			clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
			tenantId: process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID,
			authorization: {
				params: {
					scope: 'openid profile email User.Read Calendars.ReadBasic Calendars.Read Calendars.ReadWrite',
				},
			},
			profilePhotoSize: 120,
			async profile(profile, tokens) {
				// https://learn.microsoft.com/en-us/graph/api/profilephoto-get?view=graph-rest-1.0&tabs=http#examples
				const response = await fetch(`https://graph.microsoft.com/v1.0/me/photos/${120}x${120}/$value`, {
					headers: { Authorization: `Bearer ${tokens.access_token}` },
				});

				const calendarResponse = await fetch(`https://graph.microsoft.com/v1.0/me/calendar/events`, {
					headers: { Authorization: `Bearer ${tokens.access_token}` },
				});

				console.log(await calendarResponse.json());

				// Confirm that profile photo was returned
				let image;
				// TODO: Do this without Buffer
				if (response.ok && typeof Buffer !== 'undefined') {
					try {
						const pictureBuffer = await response.arrayBuffer();
						const pictureBase64 = Buffer.from(pictureBuffer).toString('base64');
						image = `data:image/jpeg;base64, ${pictureBase64}`;
					} catch {}
				}

				const worker = await findWorker(profile.email);

				const newProfile = {
					...profile,
					id: profile.sub,
					name: profile.name,
					email: profile.email,
					image: image ?? null,
					workerSid: worker?.sid,
				};

				return newProfile;
			},
		}),
	],
	callbacks: {
		async session({ session, token }) {
			const [worker, members, contacts] = await Promise.all([
				findWorker(session.user.email),
				getSystemMembers({ conditions: [{ parameter: { officeEmail: `'${session.user.email}'` } }] }),
				getContacts({ childConditions: [{ parameter: { 'communicationItems/value': `'${session.user.email}'` } }] }),
			]);

			const twilioToken = await createAccessToken(
				process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID as string,
				process.env.NEXT_PUBLIC_TWILIO_API_KEY_SID as string,
				process.env.NEXT_PUBLIC_TWILIO_API_KEY_SECRET as string,
				process.env.NEXT_PUBLIC_WORKSPACE_SID as string,
				worker.sid ?? (process.env.NEXT_PUBLIC_WORKER_SID as string),
				worker.friendlyName ?? 'nblack@velomethod.com'
			);
			session.user.workerSid = worker.sid;
			session.user.twilioToken = twilioToken;
			session.user.referenceId = members[0].id;
			session.user.contactId = contacts[0].id;
			return session;
		},
	},
};

export const { signIn, signOut, handlers, auth } = NextAuth(config);
