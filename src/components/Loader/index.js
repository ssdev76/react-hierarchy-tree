import React from "react";
import styled, { keyframes } from "styled-components";
import loader from "../../assets/images/icons/loading.svg";

const Loader = () => (
    <StyledLoader>
        <LoaderImg
            src={ loader }
            alt="loader"
        />
    </StyledLoader>
);

const rotate = keyframes`
    100% {
        transform: rotate(360deg);
    }
`;

const StyledLoader = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: inherit;
    z-index: 99;
`;


const LoaderImg = styled.img`
    width: 60px;
    height: auto;
    animation: ${rotate} 1s infinite linear;
`;

export default Loader;
