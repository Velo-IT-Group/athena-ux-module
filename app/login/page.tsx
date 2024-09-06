'use server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LabeledInput from '@/components/ui/labeled-input';
import Image from 'next/image';
import { signInWithAzure } from './action';
import { createClient } from '@/utils/supabase/server';

const Page = async () => {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		await supabase.auth.signOut();
	}

	return (
		<div className='grid place-items-center w-screen h-screen bg-muted/50'>
			<form className='flex flex-col justify-center items-center gap-3 pb-28'>
				<Image
					src='/velo-logo-black.svg'
					alt='Velo logo'
					height={208}
					width={208}
					className='object-contain'
				/>

				<Card className='w-full max-w-sm'>
					<CardHeader>
						<CardTitle className='text-2xl'>Login</CardTitle>
						<CardDescription>Enter your email below to login to your account.</CardDescription>
					</CardHeader>

					<CardContent className='grid gap-4'>
						<LabeledInput
							label='Email'
							name='email'
							type='email'
							placeholder='m@example.com'
							required
						/>
					</CardContent>

					<CardFooter>
						<Button
							variant='outline'
							className='text-card-foreground w-full'
							formAction={signInWithAzure}
						>
							<Image
								src='/microsoftLogo.png'
								alt='Microsoft logo'
								height={12}
								width={12}
								className='inline-block mr-1.5 rounded-sm'
							/>
							Login With Microsoft
						</Button>
					</CardFooter>
				</Card>
			</form>
		</div>
	);
};

export default Page;
