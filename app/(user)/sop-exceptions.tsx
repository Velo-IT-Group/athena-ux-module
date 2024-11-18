'use client';
import React, { useState } from 'react';
import { MinimalTiptapEditor } from '@/components/tiptap';
import { updateCompanyNote } from '@/lib/manage/update';
import { CompanyNote } from '@/types/manage';
import { relativeDate } from '@/utils/date';
import { createCompanyNote } from '@/lib/manage/create';
import { revalidatePath } from 'next/cache';
import { useMutation } from '@tanstack/react-query';

type Props = {
	note?: CompanyNote;
	companyId: number;
};

const SOPExceptions = ({ note, companyId }: Props) => {
	const createCompanyNoteMutation = useMutation({
		mutationKey: ['companyNotes'],
		mutationFn: async () => createCompanyNote(),
	});
	const updateCompanyNoteMutation = useMutation({
		mutationKey: ['companyNotes'],
		mutationFn: async (value) =>
			updateCompanyNote({
				companyId: companyId,
				id: note?.id ?? 0,
				operation: [
					{
						op: 'replace',
						path: '/text',
						value,
					},
				],
			}),
	});

	return (
		<div className="space-y-1.5">
			<MinimalTiptapEditor
				editable={!updateCompanyNoteMutation.isPending}
				content={note?.text}
				onBlur={(e) => {
					if (e !== note?.text && !note) {
						// createCompanyNoteMutation.mutate({
						// 	text: e?.toString() ?? '',
						// 	type: { id: 6 },
						// });
					} else if (e !== note?.text && note) {
						// updateCompanyNoteMutation.mutate(e?.toString() ?? '');
					}
				}}
				output="html"
				shouldRerenderOnTransaction
				placeholder="Type your description here..."
				editorClassName="focus:outline-none text-sm"
				immediatelyRender
			/>
			{note && (
				<p className="text-xs text-muted-foreground">
					Last updated by{' '}
					<span className="font-semibold text-black">
						{note._info?.updatedBy}{' '}
						{relativeDate(new Date(note._info.lastUpdated))}
					</span>
				</p>
			)}
		</div>
	);
};

export default SOPExceptions;
