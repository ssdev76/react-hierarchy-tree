import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import check from "../../assets/images/icons/check.svg";

const EMPTY_FILE = "File is empty";
const INVALID_FILE_TYPE = "Type of file is invalid";

const propTypes = {
    onChange: PropTypes.func,
    onFileUploadSuccess: PropTypes.func,
    onFileUploadFail: PropTypes.func,
    fileType: PropTypes.string
}

class Uploader extends React.PureComponent {
    state = {
        error: {},
        errorText: "",
        isFileUploaded: false
    }

    render() {
        return (
            <Fragment>
                <input type="file" onChange={ event => this.changeFileHandler(event) }/>

                {
                    this.state.isFileUploaded && (this.state.errorText === "") &&
                    <div>
                        <img alt="Uploaded" src={ check }/>
                        File is uploaded successfully!
                    </div>
                }

                {
                    (this.state.errorText.length > 0) &&
                    <Error>
                        <IconClose/>
                        { this.state.errorText }
                    </Error>
                }
            </Fragment>
        );
    }

    changeFileHandler = (event) => {
        const file = event.target.files[0];
        const isFileUploaded = file ? true : false;
        const { isValid, errorText } = this.validationFile(event.target.files[0]);

        this.setState({ isFileUploaded, isValid, errorText });
        isFileUploaded && isValid && this.props.onChange && this.props.onChange(file);
        isFileUploaded && isValid && this.uploadFile(file)
            .then(
                (data) => {
                    this.setState({ isFileUploaded: true });
                    this.props.onFileUploadSuccess && this.props.onFileUploadSuccess(data);
                },
                (err) => this.props.onFileUploadFail && this.props.onFileUploadFail(err)
            )
    }

    validationFile = (file) => {
        const { fileType } = this.props;
        let errorText = "";

        (fileType && file && file.name.search(new RegExp(`.${fileType}`, "gi")) === -1) &&
        (errorText = INVALID_FILE_TYPE);

        (file && file.size === 0) && (errorText = EMPTY_FILE);
        
        return { isValid: (errorText.length > 0) ? false: true, errorText };
    }

    uploadFile = (file) => new Promise((resolve, reject) => {
        try {
            const reader = new FileReader();

            reader.addEventListener("load", () => resolve(reader.result), false);
            file && reader.readAsText(file);
        } catch (err) {
            reject(err);
        }
    });

    uploadFileFailHandler = (err) => this.setState({ error: err });
}

const Error = styled.div`
    display: flex;
    position: relative;
    padding-left: 20px;
`;

const IconClose = styled.i`
    display: block;
    height: 14px;
    position: absolute;
    left:2px;
    top: 2px;
    width: 14px;
    &:before, &:after {
        background: #333;
        border-radius: 5px;
        content: "";
        display: block;
        left: 50%;
        position: absolute;
        top: 50%;
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
`;

Uploader.propTypes = propTypes;

export default Uploader;
