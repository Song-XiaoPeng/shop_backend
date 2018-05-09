import {initAxios} from '../common/tools';


//获取协议列表
export const protocolList = params => {
    return initAxios().get(`/v1/protocolList`, params).then(res => res.data);
};

//获取协议类型列表
export const protocolTypeList = params => {
    return initAxios().get(`/v1/protocolTypeList`, params).then(res => res.data);
};

//编辑协议
export const protocolEdit = params => {
    return initAxios().post(`/v1/protocolEdit`, params).then(res => res.data);
};

//删除协议
export const protocolDelete = params => {
    return initAxios().post(`/v1/protocolDelete`, params).then(res => res.data);
};

//获取协议详情
export const getProtocolInfo = params => {
    return initAxios().post(`/v1/getProtocolInfo`, params).then(res => res.data);
};

//获取帮助文章列表
export const helpList = params => {
    return initAxios().get(`/v1/helpList`, params).then(res => res.data);
};

//编辑帮助文章
export const helpEdit = params => {
    return initAxios().post(`/v1/helpEdit`, params).then(res => res.data);
};

//删除帮助文章
export const helpDelete = params => {
    return initAxios().post(`/v1/helpDelete`, params).then(res => res.data);
};

//获取帮助的内容
export const getHelpInfo = params => {
    return initAxios().post(`/v1/getHelpInfo`, params).then(res => res.data);
};

//获取文章的列表
export const articleList = params => {
    return initAxios().get(`/v1/articleList`, params).then(res => res.data);
};

//获取文章的类型列表
export const articleTypeList = params => {
    return initAxios().get(`/v1/articleTypeList`, params).then(res => res.data);
};

//编辑文章
export const articleEdit = params => {
    return initAxios().post(`/v1/articleEdit`, params).then(res => res.data);
};

//删除文章
export const articleDelete = params => {
    return initAxios().post(`/v1/articleDelete`, params).then(res => res.data);
};

//获取文章详情
export const getArticleInfo = params => {
    return initAxios().post(`/v1/getArticleInfo`, params).then(res => res.data);
};

//获取其他列表
export const otherList = params => {
    return initAxios().get(`/v1/otherList`, params).then(res => res.data);
};

//获取其他类型列表
export const otherTypeList = params => {
    return initAxios().get(`/v1/otherTypeList`, params).then(res => res.data);
};

//编辑其他
export const otherEdit = params => {
    return initAxios().post(`/v1/otherEdit`, params).then(res => res.data);
};

//删除其他
export const otherDelete = params => {
    return initAxios().post(`/v1/otherDelete`, params).then(res => res.data);
};

//获取其他详情
export const getOtherInfo = params => {
    return initAxios().post(`/v1/getOtherInfo`, params).then(res => res.data);
};
