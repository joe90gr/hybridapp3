var React = require('react');
var ReactDom = require('react-dom');
var timer = require('./joe');
var request = require('../utils/Xhr');
var Dispatcher = require('flux').Dispatcher;
var AppDispatcher = new Dispatcher();

function success(res){
    console.log(res);
}

function reject(error){
    console.log(error);
}

request.fetch('/').then(success, reject)

request.put('/rest/somelist',{
    'Accept-Type': 'application-json',
    'Content-Type': 'application/json'
},{"put":"success"}).then(success, reject)

request.del('/rest/somelist',{
    'Accept-Type': 'application-json',
    'Content-Type': 'application/json'
},{"del":"success"}).then(success, reject)

var comp = ReactDom.render(React.createElement(timer, null), document.getElementById('test'));
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case "JOE":
            console.log("JOE Triggered");
            break;
        case "JOE90":
            console.log("JOE90 Triggered");
            break;
        default:
        // no op
    }
});

AppDispatcher.dispatch({
    actionType: "JOE",
    text:""
});