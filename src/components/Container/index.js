import PropTypes from "prop-types";
import React from "react";
import Link from "../Link";
import TreeNode from "../TreeNode";
import {
	GRAPH_PADDING,
	SVG_GRAPH_ID,
	SVG_G_ELEM_ID
} from "../../helpers/applicationParams";

const propTypes = {
	comments: PropTypes.object.isRequired,
	children: PropTypes.node,
	height: PropTypes.number,
	keyProp: PropTypes.string.isRequired,
	labelProp: PropTypes.string.isRequired,
	links: PropTypes.array.isRequired,
	nodes: PropTypes.array.isRequired,
	nodeClassName: PropTypes.string,
	nodeOffset: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string
	]).isRequired,
	nodeRadius: PropTypes.number.isRequired,
	width: PropTypes.number,
	circleProps: PropTypes.object.isRequired,
	gProps: PropTypes.object.isRequired,
	pathProps: PropTypes.object.isRequired,
	svgProps: PropTypes.object.isRequired,
	textProps: PropTypes.object.isRequired
};

const setGraphGeometryParams = () => {
	const svgGElement = document.getElementById(SVG_G_ELEM_ID);
	const { height, width } = svgGElement.getBoundingClientRect();
	const svgGraphElement = document.getElementById(SVG_GRAPH_ID);

	height && svgGraphElement &&
	(svgGraphElement.setAttribute("height", `${height + GRAPH_PADDING}px`));
	
	width && svgGraphElement &&
	(svgGraphElement.setAttribute("width", `${width + GRAPH_PADDING}px`));

	svgGElement && (svgGElement.style.transform = 
		`translate(20px, ${Math.abs(svgGElement.getBBox().y) + GRAPH_PADDING / 2}px)`
	);
}

export default class Container extends React.PureComponent {
	componentDidMount() {
		setGraphGeometryParams();
	}

	componentDidUpdate() {
		setGraphGeometryParams();
	}

	render() {
		return (
			<svg id={ SVG_GRAPH_ID } height={ this.props.height } width={ this.props.width }>
				<g id={ SVG_G_ELEM_ID }>
					{ this.props.children }
					{ this.props.links.map(link =>
						<Link
							key={ link.target.data[this.props.keyProp] }
							keyProp={ this.props.keyProp }
							source={ link.source }
							target={ link.target }
							x1={ link.source.x }
							x2={ link.target.x }
							y1={ link.source.y }
							y2={ link.target.y }
							pathProps={{ ...this.props.pathProps, ...link.target.data.pathProps }}/>)
					}
					{ this.props.nodes.map(node =>
						<TreeNode
							comment={ this.props.comments[node.data[this.props.keyProp]] }
							key={ node.data[this.props.keyProp] }
							keyProp={ this.props.keyProp}
 							labelProp={ this.props.labelProp }
							offset={ this.props.nodeOffset }
							radius={ this.props.nodeRadius }
							x={ node.x }
							y={ node.y }
							circleProps={{ ...this.props.circleProps, ...node.data.circleProps }}
							gProps={{ ...this.props.gProps, ...node.data.gProps }}
							textProps={{ ...this.props.textProps, ...node.data.textProps }}
							{...node.data}/>)
					}
				</g>
			</svg>);
	}
}

Container.propTypes = propTypes;