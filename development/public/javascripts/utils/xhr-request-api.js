var XHR_PARAM_TYPES = require('./XHR-param-types');
var Promise = require('./promise');
var promise;

function XHRRequestAPI() {
    bindPromise = bindPromise.bind(this);
    xhrRequest = xhrRequest.bind(this);
}

function retrieveResponse() {
    var _arguments = Array.prototype.slice.call(arguments);
    if( this.readyState === 4 && this.status == 200){
        /*DONE*/
        _arguments[0](this, 'success');
    }
}

function responseError() {
    var _arguments = Array.prototype.slice.call(arguments);
    _arguments[0](this.statusText, 'fail');
}

function isGET(requestTypes) {
    return requestTypes.method.toLowerCase() === 'get';
}

function hasQueryParamsAndIsNotGet(requestTypes) {
    return requestTypes.params && !isGET(requestTypes) ? requestTypes.params : undefined;
}

function setHeaderParams(xhr, requestTypes) {
    var hasRequestType;
    for(var val in requestTypes){
        hasRequestType = XHR_PARAM_TYPES[val];
        if (hasRequestType){
            xhr.setRequestHeader(hasRequestType, requestTypes[val]);
        } else if (val !== 'params' && val !== 'method') {
            throw new Error('unrecognisable mime type: ' + hasRequestType);
        }
    }
}

function isMethodSetReturnElseDefaultToGet(requestTypes) {
    return requestTypes.method ? requestTypes.method.toLowerCase() : 'get' ;
}

function bindXHREvents(xhr, callback) {
    var retrieveResponseBind = retrieveResponse.bind(xhr, callback);
    var responseErrorBind = responseError.bind(xhr, callback);
    xhr.addEventListener('readystatechange', retrieveResponseBind, false);
    xhr.addEventListener('error', responseErrorBind, false);
}

function xhrRequest(url, requestTypes, callback) {
    var xhr = new XMLHttpRequest();
    var method = isMethodSetReturnElseDefaultToGet(requestTypes);
    var paramsforPost = hasQueryParamsAndIsNotGet(requestTypes);

    bindXHREvents(xhr, callback);
    xhr.open(method, url, true);
    setHeaderParams(xhr, requestTypes);

    try{
        xhr.send(paramsforPost);
    } catch(e){
        console.warn(e);
    }
}

function bindPromise(url, requestTypes) {
    var _arguments = Array.prototype.slice.call(arguments);
    promise = new Promise();
    promise.resolveRecursive(_arguments[0], requestTypes, xhrRequest);

    return promise;
}

function constructRequest(method, url, requestTypes) {
    var assembledRequestTypes = requestTypes || {};
    if (method === 'GET_JSON') {
        assembledRequestTypes['Accept-Type'] =  assembledRequestTypes['Accept-Type'] || 'application/json';
        assembledRequestTypes['Content-Type'] = assembledRequestTypes['Content-Type'] || 'application/json';
    } else {
        assembledRequestTypes['Accept-Type'] =  assembledRequestTypes['Accept-Type'] || 'text/html';
        assembledRequestTypes['Content-Type'] = assembledRequestTypes['Content-Type'] || 'text/html; charset=utf-8';
    }
    assembledRequestTypes.method = method;

    return bindPromise(url, assembledRequestTypes);
}

XHRRequestAPI.prototype.post = function(url, requestTypes){
    return constructRequest('POST', url, requestTypes);
};

XHRRequestAPI.prototype.get = function(url, requestTypes){
    return constructRequest('GET', url, requestTypes);
};

XHRRequestAPI.prototype.put = function(url, requestTypes){
    return constructRequest('PUT', url, requestTypes);
};

XHRRequestAPI.prototype.del = function(url, requestTypes){
    return constructRequest('DELETE', url, requestTypes);
};

XHRRequestAPI.prototype.getJSON = function(url, requestTypes){
    return constructRequest('GET_JSON', url, requestTypes);
};

module.exports = new XHRRequestAPI();