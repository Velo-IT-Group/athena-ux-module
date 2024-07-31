export interface Content {
	_expandable: {
		ancestors?: string;
		body?: string;
		childTypes?: string;
		children?: string;
		container?: string;
		descendants?: string;
		history?: string;
		metadata?: string;
		operations?: string;
		restrictions?: string;
		space?: string;
		version?: string;
	};
	_links?: Record<string, any>;
	ancestors?: Content[];
	body?: {
		_expandable: {
			anonymous_export_view?: string;
			atlas_doc_format?: string;
			editor?: string;
			editor2?: string;
			export_view?: string;
			storage?: string;
			styled_view?: string;
			view?: string;
		};
		anonymous_export_view?: ContentBody;
		atlas_doc_format?: ContentBody;
		editor2?: ContentBody;
		export_view?: ContentBody;
		storage?: ContentBody;
		styled_view?: ContentBody;
		view?: ContentBody;
	};
	// childTypes?: ServerModels.ContentChildType;
	// children?: ServerModels.ContentChildren;
	// container?: ServerModels.Container;
	// descendants?: ServerModels.ContentChildren;
	// history?: ServerModels.ContentHistory;
	id: string;
	// operations?: ServerModels.OperationCheckResult[];
	// restrictions?: {
	// 	_links: Record<string, any>;
	// 	read?: ServerModels.ContentRestriction;
	// 	update?: ServerModels.ContentRestriction;
	// };
	// space?: ServerModels.Space;
	status: string;
	title: string;
	type: string;
	// version?: ServerModels.Version;
}

export interface ContentBody {
	_expandable: {
		content?: string;
	};
	embeddedContent?: EmbeddedContent[];
	representation: string;
	value: string;
	// webresource?: WebResourceDependencies;
}

export interface EmbeddedContent {
	entity?: Record<string, any>;
	entityId?: number;
}
