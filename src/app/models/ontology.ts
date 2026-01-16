export type TopicData = {
	_id: string;
	qcode: string;
	uri: string;
	definition: string;
	prefLabel: string;
	broader?: string[];
	narrower?: string[];
};
