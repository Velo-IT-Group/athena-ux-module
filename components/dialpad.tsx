'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRef, useState } from 'react';
import { formatPhoneNumber } from 'react-phone-number-input';

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
];

export function Dialpad() {
	const textInput = useRef<HTMLInputElement>(null);
	const [phoneNumber, setPhoneNumber] = useState(formatPhoneNumber('+19015988651'));

	const insertMyText = (text: string) => {
		if (!textInput.current) return;
		const input = textInput.current;

		let cursorPosition = input.selectionStart;
		let textBeforeCursorPosition = input.value.substring(0, cursorPosition ?? input.value.length);
		let textAfterCursorPosition = input.value.substring(cursorPosition ?? input.value.length, input.value.length);
		setPhoneNumber(textBeforeCursorPosition + text + textAfterCursorPosition);

		console.log(cursorPosition, textBeforeCursorPosition, textAfterCursorPosition);
		// e.target.value = textBeforeCursorPosition + textToInsert + textAfterCursorPosition;
	};

	const isValidKey = (key: string) => digitButtons.some((digit) => digit.value === key);

	return (
		<>
			<Input
				value={phoneNumber}
				onChange={(e) => {
					setPhoneNumber(e.currentTarget.value);
				}}
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
				name='phoneNumber'
				placeholder='(123) 456-7890'
				className='border-none px-4 py-3 w-full text-center text-xl font-medium text-primary'
			/>

			<div className='w-full grid grid-cols-3 gap-1.5'>
				{digitButtons.map((d) => (
					<Button
						size='lg'
						variant='ghost'
						type='button'
						key={`${d.name}-${d.value}`}
						onClick={() => insertMyText(d.value)}
						className='text-xl'
					>
						{d.name}
					</Button>
				))}
			</div>
		</>
	);
}
