import {initAxios} from '../common/tools';

//获得权限tree
export const getTreeList = params => {
    return initAxios().post(`/v1/getPermissionList`, params).then(res => res.data);
};

export const getRoleList = params => {
  return initAxios().post(`/v1/getRoleList`, params).then(res => res.data);
}

export const getRoleDetail = params => {
  return initAxios().post(`/v1/getRoleDetail`, params).then(res => res.data);
}

export const addRolePermission = params => {
  return initAxios().post(`/v1/addRolePermission`, params).then(res => res.data);
}

export const getBackendApiAuthList = params => {
  return initAxios().post(`/v1/getBackendApiAuthList`, params).then(res => res.data);
}

export const setPermission = (params) => {
  return initAxios().post(`/v1/setPermission`, params).then(res => res.data);
}

export const getParentList = (params) => {
  return initAxios().post(`/v1/getParentList`, params).then(res => res.data);
}

export const getPermissionList = (params) => {
  return initAxios().post(`/v1/getPermissionList`, params).then(res => res.data);
}

export const getPermissionDetail = (params) => {
  return initAxios().post(`/v1/getPermissionDetail`, params).then(res => res.data);
}
