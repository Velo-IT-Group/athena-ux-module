import { X, Copy, Unlock, Lock, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import type { Classnames, Controls, FullField, Translations } from 'react-querybuilder';
import { getCompatContextProvider } from 'react-querybuilder';
import { ActionElement } from './action-element';
import { ActionElementIcon } from './action-element-icon';
import { ValueEditor } from './value-editor';
import { ValueSelector } from './value-selector';
import { NotToggle } from './not-toggle';
import { DragHandle } from './drag-handle';

import './styles.scss';

export * from './action-element';
export * from './value-selector';

export const controlClassnames = {
	ruleGroup: 'rounded-lg shadow-sm border bg-background',
} satisfies Partial<Classnames>;

export const controlElements = {
	actionElement: ActionElement,
	removeGroupAction: ActionElementIcon,
	removeRuleAction: ActionElementIcon,
	valueSelector: ValueSelector,
	valueEditor: ValueEditor,
	notToggle: NotToggle,
	dragHandle: DragHandle,
} satisfies Partial<Controls<FullField, string>>;

export const translations = {
	addRule: {
		label: (
			<>
				<Plus className='w-4 h-4 mr-2' /> Rule
			</>
		),
	},
	addGroup: {
		label: (
			<>
				<Plus className='w-4 h-4 mr-2' /> Group
			</>
		),
	},
	removeGroup: { label: <X className='w-4 h-4' /> },
	removeRule: { label: <X className='w-4 h-4' /> },
	cloneRuleGroup: { label: <Copy className='w-4 h-4' /> },
	cloneRule: { label: <Copy className='w-4 h-4' /> },
	lockGroup: { label: <Unlock className='w-4 h-4' /> },
	lockRule: { label: <Unlock className='w-4 h-4' /> },
	lockGroupDisabled: { label: <Lock className='w-4 h-4' /> },
	lockRuleDisabled: { label: <Lock className='w-4 h-4' /> },
	shiftActionDown: { label: <ChevronDown className='w-4 h-4' /> },
	shiftActionUp: { label: <ChevronUp className='w-4 h-4' /> },
} satisfies Partial<Translations>;

export const QueryBuilder = getCompatContextProvider({
	controlClassnames: controlClassnames,
	controlElements: controlElements,
	translations: translations,
});
