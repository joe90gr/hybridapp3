var React = require('react');
var ReactDom = require('react-dom');
var timer = require('./joe');
var ajax = require('../utils/xhr-request-api');


function success(res){
    console.log(res.response);
    //console.log(res.getAllResponseHeaders())
}

function reject(error){
    console.log(error);
}

ajax.get(['/'],{'Content-Type': 'application/json'}).then(success, reject);

var put = { params:'{"put":"success"}'};
var del = {"Content-Type": "application/json", params:'{"del":"success"}'};
ajax.put(['/rest/somelist'],put).then(success, reject);
ajax.del(['/rest/somelist'],del).then(success, reject);


window.onload = function() {
var comp = ReactDom.render(React.createElement(timer, null), document.getElementById('test'));

}