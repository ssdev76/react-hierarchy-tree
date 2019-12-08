export const GRAPH_PADDING = 40;
export const SVG_GRAPH_ID = "graph";
export const SVG_G_ELEM_ID = "tree";
export const STATUS_DELETED = "DELETED";
export const STATUS_RENAMED = "RENAMED";

export const getCircleStatusTheme = (status) => {
	switch (status) {
		case STATUS_DELETED:
			return { stroke: "#ccc", strokeDasharray: 3 }
		case STATUS_RENAMED:
			return { stroke: "#0000ff" }
		default:
			return {}
	}
}

export const getTextStatusTheme = (status) => {
	switch (status) {
		case STATUS_DELETED:
			return { fill: "#ccc" }
		case STATUS_RENAMED:
			return { fill: "#0000ff" }
		default:
			return {}
	}
}

export const statusList = [
	{ id: 0, hasComment: true, text: "has comment" },
	{ id: 1, status: "DELETED", text: "deleted node" },
	{ id: 2, status: "RENAMED", text: "renamed node" }
];