'use client';
import { Button } from '@/components/ui/button';
import { Input } from './ui/input';
import { useRef, useState } from 'react';
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input';

type DialpadItem = {
	name: string;
	value: string;
};

const digitButtons: DialpadItem[] = [
	{ name: '1', value: '1' },
	{ name: '2', value: '2' },
	{ name: '3', value: '3' },
	{ name: '4', value: '4' },
	{ name: '5', value: '5' },
	{ name: '6', value: '6' },
	{ name: '7', value: '7' },
	{ name: '8', value: '8' },
	{ name: '9', value: '9' },
	{ name: '*', value: '*' },
	{ name: '0', value: '0' },
	{ name: '#', value: '#' },
];

export function Dialpad() {
	const textInput = useRef<HTMLInputElement>(null);
	const [phoneNumber, setPhoneNumber] = useState('+19015988651');

	const insertMyText = (text: string) => {
		// console.log(e);
		if (!textInput.current) return;
		const input = textInput.current;
		let textToInsert = ' this is the inserted text ';

		let cursorPosition = input.selectionStart;
		let textBeforeCursorPosition = input.value.substring(0, cursorPosition ?? input.value.length);
		let textAfterCursorPosition = input.value.substring(cursorPosition ?? input.value.length, input.value.length);
		setPhoneNumber(textBeforeCursorPosition + text + textAfterCursorPosition);

		console.log(cursorPosition, textBeforeCursorPosition, textAfterCursorPosition);
		// e.target.value = textBeforeCursorPosition + textToInsert + textAfterCursorPosition;
	};

	const isValidKey = (key: string) => digitButtons.some((digit) => digit.value === key);

	return (
		<div className='flex flex-col items-center space-y-6'>
			{/* <PhoneInput
					placeholder='Enter phone number'
					defaultCountry='US'
					value={phoneNumber}
					onChange={setPhoneNumber}
					className='flex h-10 w-full px-4 py-3 text-center text-2xl font-medium text-primary rounded-md border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
				/> */}
			<Input
				value={phoneNumber}
				// onChange={(e) => {
				// 	setPhoneNumber(e.currentTarget.value);
				// }}
				onKeyDown={(e) => {
					console.log(isValidKey(e.key));
					if (isValidKey(e.key)) {
						insertMyText(e.key);
						// console.log(e.currentTarget.value);
						// setPhoneNumber(e.currentTarget.value);
					}
				}}
				autoFocus
				ref={textInput}
				className='border-none px-4 py-3 w-full text-center text-2xl font-medium text-primary'
			/>

			<div className='grid grid-cols-3 gap-4'>
				{digitButtons.map((d) => (
					<Button
						variant='ghost'
						key={`${d.name}-${d.value}`}
						onClick={() => insertMyText(d.value)}
						// onClick={() => setPhoneNumber(oldValue => )}
					>
						{d.name}
					</Button>
				))}
			</div>
			<div className='flex items-center space-x-4'>
				<Button
					variant='outline'
					className='bg-primary text-primary-foreground'
				>
					Call
				</Button>
				<Button
					variant='outline'
					className='bg-red-500 text-white'
				>
					End
				</Button>
				<Button
					variant='outline'
					className='bg-yellow-500 text-white'
				>
					Delete
				</Button>
			</div>
		</div>
	);
}
