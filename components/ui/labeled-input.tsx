import React, { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { Input, InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Props extends InputProps {
	label?: string;
	description?: string;
	children?: ReactNode;
}

const LabeledInput = React.forwardRef<HTMLInputElement, Props>(
	({ children, className, type, description, label, ...props }, ref) => {
		return (
			<div className={cn('grid gap-1.5', className)}>
				{label && (
					<Label htmlFor={props.name || props.id}>
						{label}
						{props.required && <span className='text-red-500'>*</span>}
					</Label>
				)}
				{!children ? (
					<Input
						ref={ref}
						{...props}
						className={className}
					/>
				) : (
					children
				)}
				{description && <p className='text-[0.8rem] text-muted-foreground'>{description}</p>}
			</div>
		);
	}
);

LabeledInput.displayName = 'LabeledInput';

export default LabeledInput;
