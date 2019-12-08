import React, { Component, Fragment } from "react";
import {
    csvParse,
    flatArrayToHierarchy,
    flatArrayToTreeObject,
    isHasClass,
    prepareTreeData
} from "./helpers/utils";
import CommentEditor from "./components/CommentEditor";
import Loader from "./components/Loader";
import StatusLegend from "./components/StatusLegend";
import Tree from "./components/Tree";
import Uploader from "./components/Uploader";
import { Title } from "./components/styled/Title";

class App extends Component {
    state = {
        editableCommentId: null,
        editableCommentValue: "",
        error: null,
        resourceData: [],
        treeElements: {},
        treeData: {},
        comments: {},
        isEditComment: false,
        isFileUploaded: false,
        isShowLoader: false
    }

	componentDidMount() {
		window.addEventListener("click", this.clickNodeHandler, false);
	}

	componentWillUnmount() {
		window.removeEventListener("click", this.clickNodeHandler, false);
    }

    render() {
        return (
            <Fragment>
                <Title>Test hierarchy tree from .csv</Title>

                <Uploader
                    onChange={ this.changeFileHandler }
                    onFileUploadSuccess={ this.fileUploadSuccessHandler }
                    onFileUploadFail={ this.fileUploadFailHandler }
                    fileType="csv"
                />

                {
                    this.state.isShowLoader &&
                    <Loader/>
                }

                {
                    this.state.isEditComment &&
                    <CommentEditor
                        applyCallBack={ this.applyEditCommentHandler }
                        closeCallBack={ this.closeEditCommentHandler }
                        commentId={ this.state.editableCommentId }
                        comment={ this.state.editableCommentValue }
                        title="Comment"
                    />
                }

                <StatusLegend/>

                <Tree
                    comments={ this.state.comments }
                    treeData={ this.state.treeData }
                    keyProp="id"
                    nodeOffset="-10"
                    onUpdated={ this.onTreeUpdated }
                    // svgProps={{
                    //     transform: "rotate(90)"
                    // }}
                />
            </Fragment>
        );
    }

    applyEditCommentHandler = ({ id, value }) => this.setState({
        comments: {
            ...this.state.comments,
            [id]: value
        },
        isEditComment: false
    });

    changeFileHandler = () => this.setState({ isShowLoader: true });

	clickNodeHandler = event => {
        const node = event && event.target;

        node && node.id && isHasClass(node, "node_circle") &&
        this.setState({
            editableCommentId: node.id,
            editableCommentValue: this.getCommentById(node.id),
            isEditComment: true
        });
    }

    closeEditCommentHandler = () => this.setState({ isEditComment: false });

    createTreeGraph = (data, elements) => {
        const { treeData, comments } = prepareTreeData({
            addedNodesArray: data,                
            addedTreeObj: elements,
            comments: this.state.comments,
            initialNodesArray: this.state.resourceData,
            initialTreeObj: this.state.treeElements
        }) || [];
        const hierarchy = flatArrayToHierarchy(treeData, -1, 0 , 1, 2, 3)[0] || {};

        this.setState({
            comments,
            resourceData: treeData,
            treeData: hierarchy,
            treeElements: elements || {}
        });
    }

    fileUploadFailHandler = () => this.setState({ isShowLoader: false });

    fileUploadSuccessHandler = (file) => {
        const { result, error } = csvParse(file, ",");
        const treeElements = result && flatArrayToTreeObject(result);

        result && !error && this.createTreeGraph(result, treeElements);
    }

    getCommentById = commentId => this.state.comments[commentId];

    onTreeUpdated = () => this.setState({ isShowLoader: false });
}

export default App;
