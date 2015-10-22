var React = require('react');
var ReactDom = require('react-dom');

describe('testuu', function() {
    it('testyy', function(){
        var div = document.createElement('div');
        div.id = 'test';
        div.innerHTML = 'testing this div for react js';
        document.body.appendChild(div);
        ReactDom.render(<h1>Hello, world!</h1>, document.getElementById('test'));
        expect(true).to.be.true;
    })
})

