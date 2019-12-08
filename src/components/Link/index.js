import PropTypes from "prop-types";
import React from "react";
import { diagonal } from "../../helpers/utils";

const propTypes = {
	source: PropTypes.object.isRequired,
	target: PropTypes.object.isRequired,
	keyProp: PropTypes.string.isRequired,
	x1: PropTypes.number.isRequired,
	x2: PropTypes.number.isRequired,
	y1: PropTypes.number.isRequired,
	y2: PropTypes.number.isRequired,
	pathProps: PropTypes.object.isRequired
};

const Link = ({ pathProps, x1, x2, y1, y2 }) =>
	<path
		{ ...pathProps }
		d={ diagonal(x1, y1, x2, y2 ) }
	/>;

Link.propTypes = propTypes;

export default Link;