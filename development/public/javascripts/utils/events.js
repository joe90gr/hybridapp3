var eventAction = {
    DO_ONCE: true,
    DO_CONTINUOUS: false
};

function Events(events) {
    this._eventRegister = events ? events._eventRegister : {};
}

function recursiveExecute(eventRegister, arrayOfTypes, args, handler, once) {
    var isFail = false;
    if (arrayOfTypes.length > 0 && eventRegister) {
        if(!args) {
            populateEventHandlers(eventRegister, arrayOfTypes, handler, once);
            recursiveExecute(eventRegister[arrayOfTypes[0]], arrayOfTypes.slice(1), args, handler, once);
        } else {
            isFail = recursiveExecute(eventRegister[arrayOfTypes[0]], arrayOfTypes.slice(1), args, handler, once);
            isFail = executeEventHandlers(eventRegister, arrayOfTypes, args, isFail);
        }
    }

    return isFail;
}

function recursiveDelete(eventRegister, arrayOfTypes) {
    if (arrayOfTypes.length > 0 && eventRegister) {
        recursiveDelete(eventRegister[arrayOfTypes[0]], arrayOfTypes.slice(1));

        if (arrayOfTypes.length === 1) {
            for (var key in eventRegister[arrayOfTypes[0]].parent) {
                eventRegister[arrayOfTypes[0]].parent.splice(0);
            }
            delete eventRegister[arrayOfTypes[0]].parent;
            delete eventRegister[arrayOfTypes[0]];
        }

    }
}

function populateEventHandlers(eventRegister, arrayOfTypes, handler, once) {
    if(!eventRegister[arrayOfTypes[0]]) {
        eventRegister[arrayOfTypes[0]] = {parent: []};
    }

    if (arrayOfTypes.length === 1) {
        handler.once = once;
        eventRegister[arrayOfTypes[0]].parent.push(handler);
    }
}

function executeEventHandlers(eventRegister, arrayOfTypes, args, isFail) {
    var isFailed = false;
    if (eventRegister[arrayOfTypes[0]]) {
        if (!isFail) {
            for (var key in eventRegister[arrayOfTypes[0]].parent) {
                var argsa = arrayOfTypes.length === 1 ? args : undefined;
                eventRegister[arrayOfTypes[0]].parent[key].apply(this, argsa);

                if(eventRegister[arrayOfTypes[0]].parent[key].once){
                    eventRegister[arrayOfTypes[0]].parent.splice(key, 1);
                }
            }
        } else {
            isFailed = isFail;
        }

    } else {
        console.log('%c not registered: ', 'background:red;',arrayOfTypes[0]);
        isFailed = true;
    }

    return isFailed;
}

function parseEventTypes(type) {
    var splitTypes = type.split(':');
    return splitTypes.length > 1 ? splitTypes : [type];
}

Events.prototype.on = function(type, handler) {
    var types = parseEventTypes(type);
    var noArguments;
    recursiveExecute(this._eventRegister, types, noArguments, handler, eventAction.DO_CONTINUOUS);
};

Events.prototype.off = function(type, handler) {
    var types = parseEventTypes(type);
    recursiveDelete(this._eventRegister, types);
};

Events.prototype.once = function(type, handler) {
    var types = parseEventTypes(type);
    var noArguments;
    recursiveExecute(this._eventRegister, types, noArguments, handler, eventAction.DO_ONCE);
};

Events.prototype.trigger = function(type) {
    var args = Array.prototype.slice.call(arguments);
    var noHandler;
    args = args.slice(1).length === 0 ? undefined : args.slice(1);

    var types = parseEventTypes(type);
    recursiveExecute(this._eventRegister, types, args, noHandler, eventAction.DO_CONTINUOUS);
};

module.exports = Events;