var request = require('superagent');

function Xhr() {
}

function _executor(resolve, reject) {
    var req = request[this.method](this.uri);

    _setHeaders(req, this.header);
    req.end(function(err, res){
        if (err) {
            reject(res);
        } else {
            resolve(res)
        }
    });
}

function _setHeaders(req, headers) {
    for (var val in headers) {
        req.set(val, headers[val])
    }
}

function _createPromisedRequest(params) {
    var boundExecutor = _executor.bind(params);

    return new Promise(boundExecutor);
}

Xhr.prototype._constructParams = function (uri, method, header, payload) {
    return {
        uri: uri,
        method: method,
        header: header,
        payload: payload
    }
}

Xhr.prototype.get = function(uri, header) {
    return _createPromisedRequest(this._constructParams(uri, 'get', header, payload));
}

Xhr.prototype.post = function(uri, header, payload) {
    return _createPromisedRequest(this._constructParams(uri, 'post', header, payload));
}

Xhr.prototype.put = function(uri, header, payload) {
    return _createPromisedRequest(this._constructParams(uri, 'put', header, payload));
}

Xhr.prototype.del = function(uri, header, payload) {
    return _createPromisedRequest(this._constructParams(uri, 'del', header, payload));
}

Xhr.prototype.fetch = function(uri) {
    return _createPromisedRequest(this._constructParams(uri, 'get', {
        'Accept-Type': 'text/html',
        'Content-Type': 'text/html'
    }));
};

Xhr.prototype.fetchJson = function(uri) {
    return _createPromisedRequest(this._constructParams(uri, 'get', {
        'Accept-Type': 'application/json',
        'Content-Type': 'application/json'
    }));
};

Xhr.prototype.fetchXml = function(uri) {
    return _createPromisedRequest(this._constructParams(uri, 'get', {
        'Accept-Type': 'application/xml',
        'Content-Type': 'application/xml'
    }));
};

Xhr.prototype.send = function(uri, payload) {
    return _createPromisedRequest(this._constructParams(uri, 'post', {
        'Accept-Type': 'text/html',
        'Content-Type': 'text/html'
    }, payload));
};

Xhr.prototype.sendJson = function(uri, payload) {
    return _createPromisedRequest(this._constructParams(uri, 'post', {
        'Accept-Type': 'application/json',
        'Content-Type': 'application/json'
    }, payload));
};

Xhr.prototype.sendXml = function(uri, payload) {
    return _createPromisedRequest(this._constructParams(uri, 'post', {
        'Accept-Type': 'application/xml',
        'Content-Type': 'application/xml'
    }, payload));
};

module.exports = new Xhr();
