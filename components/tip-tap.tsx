'use client';

import { cn } from '@/lib/utils';
import type { Transaction } from '@tiptap/pm/state';
import { useEditor, EditorContent, Content, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';

type Props = {
	className?: string;
	content?: Content;
	onBlur?: (props: { editor: Editor; event: FocusEvent; transaction: Transaction }) => void;
};

const Tiptap = ({ className, content, onBlur }: Props) => {
	const editor = useEditor({
		editorProps: {
			attributes: {
				class: cn(
					'min-h-[60px] max-w-none grow rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 prose text-muted-foreground',
					className
				),
			},
		},
		onBlur: (props) => onBlur?.(props),
		extensions: [StarterKit, Markdown],
		enablePasteRules: true,
		content:
			content ??
			'<p>IOT devices</p><ul class="tight" data-tight="true"><li><p>MAAS 360 is used for Mobile Device Management (MDM) of all IOS devices that are used for VIP Mobile apps</p></li><li><p>Karen Richard main POC for IOS devices</p></li><li><p>iPads and iPhones are company assigned and enrolled in MaaS360</p></li><li><p>DO NOT give out the iTunes account information. Inevitably, this will lead to issues.</p></li></ul><p>Apple IDs for Maas</p><ul class="tight" data-tight="true"><li><p>Drivers have an Apple ID that is in Manage</p></li><li><p>Salesmen have their own email accounts</p></li><li><p>Users authorized to use their own Apple IDs</p><ul class="tight" data-tight="true"><li><p>Tyone Cormier, Theron Pitre, Chris Robicheaux</p></li></ul></li></ul><p>Drivers</p><ul class="tight" data-tight="true"><li><p>They NO LONGER share an email accout (drivers@acadianabottling.com)</p></li><li><p>Each Driver needs to have their own individual Driver accounts </p><ul class="tight" data-tight="true"><li><p>e.g. Driver1@acadianabottling.com , Driver2@acadianabottling.com</p></li></ul></li><li><p>Drivers previously shared a single account (Drivers@acadianabottling.com)</p><ul class="tight" data-tight="true"><li><p>DO NOT RESET THIS ACCOUNT. This is shared across all devices, and any change will have a huge impact on their day to day operations. DO NOT RESET THIS ACCOUNT.</p></li></ul></li></ul>',
	});

	return (
		<>
			<EditorContent
				className='flex w-full grow text-muted-foreground'
				editor={editor}
			/>
		</>
	);
};

export default Tiptap;
