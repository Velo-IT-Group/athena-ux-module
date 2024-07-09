import Entra from 'next-auth/providers/microsoft-entra-id';
import NextAuth, { type NextAuthConfig, type DefaultSession, type Account } from 'next-auth';
import { findWorker } from './lib/twilio/taskrouter/helpers';

declare module 'next-auth' {
	/**
	 * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: {
			/** The user's postal address. */
			address: string;
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

			async profile(profile) {
				const worker = await findWorker(profile.email);
				console.log(profile, worker);
				return { ...profile, workerSid: worker?.sid };
			},
			profilePhotoSize: 120,
		}),
	],
	pages: {
		signIn: '/login',
	},
	// callbacks: {
	// 	async session({ session, token, user }) {
	// const worker = await findWorker(session.user.email);
	// console.log(worker);
	// 		// `session.user.address` is now a valid property, and will be type-checked
	// 		// in places like `useSession().data.user` or `auth().user`
	// 		return {
	// 			...session,
	// 			user: {
	// 				...session.user,
	// 				workerSid: worker.sid,
	// 			},
	// 		};
	// 	},
	// },
};

export const { signIn, signOut, handlers, auth } = NextAuth(config);
