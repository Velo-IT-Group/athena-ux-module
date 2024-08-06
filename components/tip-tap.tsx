'use client';

import { cn } from '@/lib/utils';
import type { Transaction } from '@tiptap/pm/state';
import { useEditor, EditorContent, Content, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import BulletList from '@tiptap/extension-bullet-list';
import Mention from '@tiptap/extension-mention';
import Document from '@tiptap/extension-document';
import ListItem from '@tiptap/extension-list-item';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Placeholder from '@tiptap/extension-placeholder';
import { Badge } from './ui/badge';

type Props = {
	className?: string;
	content?: Content;
	onBlur: (props: { editor: Editor; event: FocusEvent; transaction: Transaction }) => void;
};

const Tiptap = ({ className, content, onBlur }: Props) => {
	const editor = useEditor({
		editorProps: {
			attributes: {
				class: cn(
					'min-h-[60px] grow w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 prose',
					className
				),
			},
		},
		onBlur: (props) => onBlur(props),
		extensions: [
			StarterKit,
			Document,
			Paragraph,
			Text,
			BulletList,
			ListItem,
			Mention.configure({
				HTMLAttributes: {
					class: 'mention',
				},
				// suggestion,
			}),
			,
			Placeholder.configure({
				// Use a placeholder:
				placeholder: 'Add a description …',
				// Use different placeholders depending on the node type:
				// placeholder: ({ node }) => {
				//   if (node.type.name === 'heading') {
				//     return 'What’s the title?'
				//   }

				//   return 'Can you add some further context?'
				// },
			}),
		],
		enablePasteRules: true,
		content: `
        <p>Hi everyone! Don’t forget the daily stand up at 8 AM.</p>
        <p><span data-type="mention" data-id="Jennifer Grey"></span> Would you mind to share what you’ve been working on lately? We fear not much happened since Dirty Dancing.
        <p><span data-type="mention" data-id="Winona Ryder"></span> <span data-type="mention" data-id="Axl Rose"></span> Let’s go through your most important points quickly.</p>
        <p>I have a meeting with <span data-type="mention" data-id="Christina Applegate"></span> and don’t want to come late.</p>
        <p>– Thanks, your big boss</p>
      `,
	});

	return (
		<EditorContent
			className='grow w-full'
			editor={editor}
		/>
	);
};

export default Tiptap;
