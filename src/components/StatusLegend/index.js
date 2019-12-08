import React from "react";
import styled from "styled-components";
import { Circle } from "../TreeNode";
import { statusList } from "../../helpers/applicationParams";

const StatusLegend = () => statusList
    .map(({ id, hasComment, status, text }) => 
        <Status key={ id }>
            <svg viewBox="0 0 16 16" width="16px" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <Circle
                    className="node_circle"
                    cx="8"
                    cy="8"
                    hasComment={ hasComment }
                    r={ 5 }
                    status={ status }
                />
            </svg>
            - { text }
        </Status>
    );

const Status = styled.div`
    align-items: center;
    display: flex;
`;

export default StatusLegend;