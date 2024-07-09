import { signIn } from '@/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LabeledInput from '@/components/ui/labeled-input';
import Image from 'next/image';

const Page = () => {
	return (
		<div className='grid w-screen h-screen place-items-center bg-muted/40'>
			<form
				action={async () => {
					'use server';
					await signIn('microsoft-entra-id', { redirectTo: '/' });
				}}
				className='grid place-items-center'
			>
				<Image
					src='/velo-logo-black.svg'
					alt='Velo Logo'
					height={150}
					width={150}
					className='object-contain'
				/>

				<Card className='w-full max-w-sm'>
					<CardHeader>
						<CardTitle className='text-2xl'>Login</CardTitle>

						<CardDescription>Enter your email below to login to your account.</CardDescription>
					</CardHeader>

					<CardContent className='grid gap-4'>
						{/* <LabeledInput
							label='Email'
							type='email'
							placeholder='m@example.com'
							required
						/>

						<LabeledInput
							label='Password'
							name='password'
							type='password'
							placeholder='•••••••••'
							required
						/> */}
					</CardContent>
					<CardFooter>
						<Button className='w-full'>Sign in</Button>
					</CardFooter>
				</Card>
			</form>
		</div>
	);
};

export default Page;
