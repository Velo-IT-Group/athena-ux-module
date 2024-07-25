'use client';

import { cn } from '@/lib/utils';
import type { Transaction } from '@tiptap/pm/state';
import { useEditor, EditorContent, Content, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

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
					'min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 prose',
					className
				),
			},
		},
		onBlur: (props) => onBlur(props),
		extensions: [
			StarterKit,
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
		immediatelyRender: false,
		enablePasteRules: true,
		content,
	});

	return <EditorContent editor={editor} />;
};

export default Tiptap;
