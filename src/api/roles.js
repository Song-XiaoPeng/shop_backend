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
