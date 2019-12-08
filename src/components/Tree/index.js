import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { hierarchy, tree } from "d3-hierarchy";
import clone from "clone";
import Container from "../Container";
import { isEmptyObject } from "../../helpers/utils";

const propTypes = {
	treeData: PropTypes.object.isRequired,
	comments: PropTypes.object,
	children: PropTypes.node,
	isUpdated: PropTypes.func,
	steps: PropTypes.number.isRequired,
	height: PropTypes.number,
	width: PropTypes.number,
	keyProp: PropTypes.string.isRequired,
	labelProp: PropTypes.string.isRequired,
	getChildren: PropTypes.func.isRequired,
	nodeRadius: PropTypes.number.isRequired,
	nodeSize: PropTypes.object.isRequired,
	circleProps: PropTypes.object.isRequired,
	gProps: PropTypes.object.isRequired,
	pathProps: PropTypes.object.isRequired,
	svgProps: PropTypes.object.isRequired,
	textProps: PropTypes.object.isRequired
};

const defaultProps = {
	getChildren: n => n.children,
	steps: 20,
	keyProp: 'name',
	labelProp: 'name',
	nodeRadius: 5,
	nodeSize: {
		height: 140,
		width: 140
	},
	circleProps: {},
	gProps: {},
	pathProps: {},
	svgProps: {},
	textProps: {}
};

export default class Tree extends PureComponent {
	componentDidMount() {
		this.props.onUpdated && this.props.onUpdated();
	}

	componentDidUpdate() {
		this.props.onUpdated && this.props.onUpdated();
	}

	render() {
		const data = isEmptyObject(this.props.treeData) &&
			hierarchy(clone(this.props.treeData), this.props.getChildren);
		const root = data && tree().nodeSize([
				this.props.nodeSize.width,
				this.props.nodeSize.height
			])(data);
		const nodes = root && root.descendants();
		const links = root && root.links();

		return (
			nodes && links &&
			<Container
				comments={ this.props.comments }
				getChildren={ this.props.getChildren }
				height={ this.props.height }
				keyProp={ this.props.keyProp }
				labelProp={ this.props.labelProp }
				links={ links }
				nodes={ nodes }
				nodeOffset={ this.props.nodeOffset }
				nodeRadius={ this.props.nodeRadius }
				onClick={ this.clickNodeHandler }
				steps={ this.props.steps }
				width={ this.props.width }
				circleProps={ this.props.circleProps }
				gProps={{ className: 'node', ...this.props.gProps }}
				pathProps={{ className: 'link', ...this.props.pathProps }}
				svgProps={ this.props.svgProps }
				textProps={ this.props.textProps }>
				{ this.props.children }
			</Container>);
	}
}

Tree.propTypes = propTypes;
Tree.defaultProps = defaultProps;