import { Switch } from '@/components/ui/switch';
import type { ComponentPropsWithoutRef } from 'react';
import type { NotToggleProps } from 'react-querybuilder';

export type ChakraNotToggleProps = NotToggleProps & ComponentPropsWithoutRef<typeof Switch>;

export const NotToggle = ({ className, handleOnChange, checked, disabled, label }: ChakraNotToggleProps) => {
	return (
		<div className='flex space-x-2 text-sm items-center'>
			<Switch
				className={className}
				disabled={disabled}
				checked={checked}
				onCheckedChange={handleOnChange}
			/>
			<span>{label}</span>
		</div>
	);
};

NotToggle.displayName = 'NotToggle';
