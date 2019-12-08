import uuid from "uuid/v4";
import { STATUS_DELETED, STATUS_RENAMED } from "./applicationParams";

const getUniqId = (id, uniqueId, statusObj) => 
    ([STATUS_DELETED].indexOf(statusObj[id] && statusObj[id].status) > -1)
        ? uniqueId + id
        : id;

export const csvParse = (data, delimeter) => {
    try {
        const result = (data || "")
            .split("\n")
            .reduce((res, item) => (res.push(item.split(delimeter)) && res), []);
        
        return { result };
    } catch (err) {
        return { error: err };
    }
}

export const diagonal = (x1, y1, x2, y2) =>
	`M${y1},${x1}C${(y1 + y2) / 2},${x1} ${(y1 + y2) / 2},${x2} ${y2},${x2}`;

export const isEmpty = (value) =>
    value === undefined ||
    value === null ||
    (typeof value === 'string' && value.trim().length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0);

export const isEmptyObject = obj => Object.keys(obj).length > 0;

export const isHasClass = (node, className = "") => node &&
    (node.getAttribute("class") || "")
    .split(" ")
    .indexOf(className) > -1;

export const flatArrayToHierarchy = (arr = [], parentId = -1, idIndex = 0, nameIndex = 1, parentIndex = 2, statusIndex = 3) => {
    const result = [];
    let children, node;

    for (const elem of arr) {
        node = {
            id: elem[idIndex],
            name: elem[nameIndex],
            status: elem[statusIndex],
            children: []
        };

        if (Number(elem[parentIndex]) === Number(parentId)) {
            children = flatArrayToHierarchy(arr, elem[idIndex]);
            children.length && (node.children = children);

            result.push(node);
        }
    }

    return result;
}

export const flatArrayToTreeObject = (arr = [], elemIndex = 0, nameIndex = 1, parentIndex = 2) => 
    arr.reduce((res, arrItem) => arrItem[parentIndex]
        ? ({
            ...res,
            [arrItem[parentIndex].toString()]: {
                ...res[arrItem[parentIndex]],
                [arrItem[elemIndex].toString()]: {
                    name: arrItem[nameIndex]
                }
            }
        })
        : res,
    {});

export const prepareTreeData = ({
    addedNodesArray = [],
    addedTreeObj = {},
    comments = {},
    initialNodesArray = [],
    initialTreeObj = {}
}) => {
    const rootOldTreeIndex = getRootIndexTreeElement(initialTreeObj);
    const rootNewTreeIndex = getRootIndexTreeElement(addedTreeObj)
    
    return (rootOldTreeIndex && (rootOldTreeIndex === rootNewTreeIndex))
        ? mergeNodesArraysWithStatus({ addedNodesArray, addedTreeObj, comments, initialNodesArray, initialTreeObj })
        : { treeData: addedNodesArray, comments: {} };
}

export const mergeNodesArraysWithStatus = ({
    addedNodesArray,
    addedTreeObj,
    comments,
    initialNodesArray,
    initialTreeObj
}) => {
    const uniqueId = uuid();
    const treeObjectWithStatus = setNameStatusTreeObject(initialTreeObj, addedTreeObj);
    const nodesStatusObj = getNodesStatusObj(treeObjectWithStatus);
    const nodesArrayWithStatus = addStatusToArray(initialNodesArray, nodesStatusObj, uniqueId);
    const filteredNodesArray = filterNodesArrayByStatus(addedNodesArray, nodesStatusObj, 0, STATUS_RENAMED);

    return !isEmpty(nodesArrayWithStatus)
        ? {
            comments: changeCommentsIdByNodeStatus(comments, nodesStatusObj, STATUS_DELETED, uniqueId),
            treeData: [...filteredNodesArray, ...nodesArrayWithStatus]
        }
        : { comments, treeData: initialNodesArray };
}

const addStatusToArray = (initialArray, statusObj, uniqueId) => initialArray
    .map(initItem => ([
        getUniqId(initItem[0], uniqueId, statusObj),
        initItem[1],
        getUniqId(initItem[2], uniqueId, statusObj),
        statusObj[initItem[0]] && statusObj[initItem[0]].status
    ]), []);

const changeCommentsIdByNodeStatus = (comments, nodesStatusObj, nodeStatus, uniqueId) => 
    Object.keys(comments)
        .reduce((res, commentKey) => ({
                ...res,
                [
                    (nodesStatusObj[commentKey].status === nodeStatus)
                        ? uniqueId + commentKey
                        : commentKey
                ]: comments[commentKey]
            }),
        {});

const filterNodesArrayByStatus = (addedNodesArray = [], nodesStatusObj, idIndex, filterStatus) => addedNodesArray
    .filter(node => (!nodesStatusObj[node[idIndex]] ||
        (nodesStatusObj[node[idIndex]].status !== filterStatus)) && node
    );

const setNameStatusTreeObject = (oldTreeObj, newTreeObj) =>
    Object.keys(oldTreeObj)
        .reduce((parentRes, parentKey) => ({
                ...parentRes,
                [parentKey]: {
                    ...Object.keys(oldTreeObj[parentKey])
                        .reduce((elemRes, elemKey) => ({
                                ...elemRes,
                                [elemKey]: {
                                    name: getOldElemName(oldTreeObj, newTreeObj, parentKey, elemKey),
                                    status: getOldElemStatus(newTreeObj, parentKey, elemKey)
                                }
                            }),
                        {})
                }
            }),
        {});

export const getNodesStatusObj = (treeObj) => Object.keys(treeObj)
    .reduce((res, key) => 
        ({
            ...res,
            ...treeObj[key]
        })
    , {});

const getRootIndexTreeElement = (treeData = {}) => {
    const rootId = getMinArrayItem(Object.keys(treeData), 0);

    return !isEmpty(treeData) && !isEmpty(treeData[rootId]) && Object.keys(treeData[rootId])[0];
}

const getMinArrayItem = (arr, initMin) => {
    let minValue = initMin || 0;

    arr.forEach(item => (Number(minValue) > Number(item)) && (minValue = item));
    return minValue;
}
    
const getOldElemName = (oldTreeObj, newTreeObj, parentIndex, elemIndex) =>
    (newTreeObj && newTreeObj[parentIndex] &&
    newTreeObj[parentIndex][elemIndex] &&
    newTreeObj[parentIndex][elemIndex].name) ||
    oldTreeObj[parentIndex][elemIndex].name;

const getOldElemStatus = (newTreeObj, oldParentIndex, oldElemIndex) =>
    ((isEmpty(newTreeObj[oldParentIndex]) || isEmpty(newTreeObj[oldParentIndex][oldElemIndex])) &&
    STATUS_DELETED) || STATUS_RENAMED;
