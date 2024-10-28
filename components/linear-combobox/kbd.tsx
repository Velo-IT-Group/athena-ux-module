export const Kbd = ({ letter }: { letter: string }) => {
	return (
		<span className='border rounded-sm flex items-center justify-center size-[18px] text-xs text-primary'>
			<kbd className='uppercase'>{letter}</kbd>
		</span>
	);
};
