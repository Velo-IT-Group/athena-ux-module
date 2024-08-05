import { GripVertical } from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';
import { forwardRef } from 'react';
import type { DragHandleProps as DragHandleQueryBuilderProps } from 'react-querybuilder';

export type DragHandleProps = DragHandleQueryBuilderProps & ComponentPropsWithRef<'span'>;

export const DragHandle = forwardRef<HTMLSpanElement, DragHandleProps>(({ className, title }, dragRef) => (
	<span
		ref={dragRef}
		className={className}
		title={title}
	>
		<GripVertical className='w-5 h-5 text-input' />
	</span>
));

DragHandle.displayName = 'DragHandle';
