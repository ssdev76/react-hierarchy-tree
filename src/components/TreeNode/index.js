import PropTypes from "prop-types";
import React from "react";
import styled, { css } from "styled-components";
import { getCircleStatusTheme, getTextStatusTheme } from "../../helpers/applicationParams";
import { isEmpty } from "../../helpers/utils";

const propTypes = {
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	circleProps: PropTypes.object.isRequired,
	comment: PropTypes.string,
	gProps: PropTypes.object.isRequired,
	keyProp: PropTypes.string.isRequired,
	labelProp: PropTypes.string.isRequired,
	offset: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string
	]).isRequired,
	radius: PropTypes.number.isRequired,
	textProps: PropTypes.object.isRequired
};

const TreeNode = (props) => {
	const getTransform = () => `translate(${props.y}, ${props.x})`;

	return (
		<g
			{ ...props.gProps }
			className="node"
			transform={ getTransform() }
		>
			<Circle
				{ ...props.circleProps }
				className="node_circle"
				hasComment={ !isEmpty(props.comment) }
				id={ props.id }
				r={ props.radius }
				status={ props.status }
			>
				{
					props.comment &&
					<title className="comment">
						{ props.comment }
					</title>
				}
			</Circle>

			<Text
				{ ...props.textProps }
				dx={ props.radius + 0.5 }
				dy={ props.offset }
				status={ props.status }
			>
				{ props[props.labelProp] }
			</Text>
		</g>
	);
}

export const Circle = styled.circle`
	cursor: pointer;
	fill: #fff;
	stroke: #000;
	${({ status }) => status && css`
		stroke-width: 3px;
		${{...getCircleStatusTheme(status)}}
	`}
	${({ hasComment }) => hasComment && css`
		fill: #000;
	`}
`;

const Text = styled.text`
	${({ status }) => status && css`
		${{...getTextStatusTheme(status)}}
	`}
`;

TreeNode.propTypes = propTypes;

export default TreeNode;