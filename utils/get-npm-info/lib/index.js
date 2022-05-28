'use strict';

const axios = require('axios');
const urlJoin = require('url-join');
const semver = require('semver');

function getNpmInfo(npmName, registry) {
   console.log(npmName);
    if (!npmName) {
        return null;
    }
    const registryUrl = registry || getDefaultRegistry();
    const npmInfoUrl = urlJoin(registryUrl, npmName);
    console.log(npmInfoUrl)
    return axios.get(npmInfoUrl).then(response => {
        if (response.status == 200) {
            return response.data
        }
        return null;
    }).catch(error => {
        return Promise.reject(error);
    })
}
// TODO: 不确定发布成功没有,找不到线上包
function getDefaultRegistry(isOriginal = false) {
    return isOriginal ? 'https://registry.npm.org' : 'https://registry.npm.taobao.org'
}
module.exports = {
    getNpmInfo
};