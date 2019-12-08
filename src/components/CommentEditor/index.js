import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const propTypes = {
    applyCallBack: PropTypes.func,
    buttonTitle: PropTypes.string.isRequired,
    closeCallBack: PropTypes.func,
    comment: PropTypes.string.isRequired,
	commentId: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string
	]).isRequired
};

const defaultProps = {
    buttonTitle: "Apply",
    comment: "",
    commentId: 0
}

class CommentEditor extends Component {
    modalRef = createRef();

    state = {
        comment: this.props.comment || ""
    }

    render() {
        const { component } = this.props;

        return (
            <ModalWrapper ref={ (node) => { this.modalRef = node } } onClick={ this.closeWindowHandler }>
                <ModalPlate>
                    <IconClose id="closeButton" onClick={ this.closeWindowHandler }/>

                    <Title>{ this.props.title }</Title>

                    {
                        component &&
                        <component.element {...component.props}/>
                    }

                    <CustomTextArea
                        onChange={ e => this.changeCommentHandler(e) }
                        value={ this.state.comment }
                    />

                    <CustomButton
                        id="applyButton"
                        onClick={ this.applyEditCommentHandler }
                    >{ this.props.buttonTitle }</CustomButton>
                </ModalPlate>
            </ModalWrapper>
        );
    }

    applyEditCommentHandler = e => this.props.applyCallBack &&
        this.props.applyCallBack({ id: this.props.commentId, value: this.state.comment});

    changeCommentHandler = e => this.setState({ comment: e.target.value });

    closeWindowHandler = e => 
        (e.target === this.modalRef.current || e.target.id === "closeButton") &&
        this.props.closeCallBack && this.props.closeCallBack();
}

const CustomButton = styled.button`
    background: #396496;    
    border: none;
    color: #fff;
    cursor: pointer;
    font-size: 20px;
    padding: 10px 20px;
`;

const CustomTextArea = styled.textarea`
    border: 1px solid #d3dbe5;
    min-height: 100px;
    padding: 10px;
    width: 100%;
`;

const IconClose = styled.i`
    cursor: pointer;
    display: block;
    height: 14px;
    position: absolute;
    right: 50px;
    top: 50px;
    transition: all .3s ease-in-out;    
    width: 14px;
    &:before, &:after {
        background: #BDBDBD;
        border-radius: 5px;
        content: "";
        display: block;
        left: 50%;
        position: absolute;
        top: 50%;
        transition: all .3s ease-in-out;
    }
    &:hover {
        &:before, &:after {
            background: #396496;
        }
    }
    &:before {
        transform: translate(-50%, -50%) rotate(45deg);
    }
    &:after {
        transform: translate(-50%, -50%) rotate(-45deg);
    }
    &:before, &:after {
        height: 2px;
        width: 19px;
    }
    &:active {
        transform: scale(.90);
    }
`;

const ModalWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(4px);
`;

const ModalPlate = styled.div`
    background: #FFFFFF;
    box-shadow: 0 0 50px rgba(23, 128, 224, 0.4);
    margin: 0 30px;
    max-height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 44px 66px 74px;
    position: relative;
    text-align: right;
    width: 50%;
    ${IconClose} {
        position: absolute;
        right: 23px;
        top: 24px;
    }
`;

const Title = styled.h3`
    color: #396496;
    font-size: 30px;
    font-weight: 500;
    line-height: normal;
    text-align: center;
    width: 100%;
`;

CommentEditor.propTypes = propTypes;
CommentEditor.defaultProps = defaultProps;

export default CommentEditor;
