'use client';
import React, { useEffect, useState } from 'react';
import { MinimalTiptapEditor } from '@/components/tiptap';
import { PathOperation, updateCompanyNote } from '@/lib/manage/update';
import { CompanyNote } from '@/types/manage';
import { useMutation } from '@tanstack/react-query';
import { Content } from '@tiptap/core';
import { formatDate, relativeDate } from '@/utils/date';
import { toast } from 'sonner';
import { createCompanyNote } from '@/lib/manage/create';

type Props = {
	note?: CompanyNote;
	companyId: number;
};

const SOPExceptions = ({ note, companyId }: Props) => {
	const [value, setValue] = useState<Content>(note?.text ?? '');

	return (
		<div className='space-y-1.5'>
			<MinimalTiptapEditor
				editable={!updateCompanyNote.isPending}
				content={note?.text}
				onBlur={(e) => {
					if (e !== note?.text && !note) {
						createCompanyNote.mutate({
							companyId,
							body: {
								text: e?.toString() ?? '',
								type: { id: 6 },
							},
						});
					} else if (e !== note?.text && note) {
						updateCompanyNote.mutate({
							companyId,
							id: note.id,
							operation: [
								{
									op: 'replace',
									path: '/text',
									value: e?.toString() ?? '',
								},
							],
						});
					}
				}}
				output='html'
				// shouldRerenderOnTransaction
				placeholder='Type your description here...'
				editorClassName='focus:outline-none text-sm'
				// immediatelyRender
			/>
			{note && (
				<p className='text-xs text-muted-foreground'>
					Last updated by{' '}
					<span className='font-semibold text-black'>
						{note._info?.updatedBy} {relativeDate(new Date(note._info.lastUpdated))}
					</span>
				</p>
			)}
		</div>
	);
};

export default SOPExceptions;
