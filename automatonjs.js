!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.automatonjs=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Identifiable = require("app/Identifiable");
var State = require("app/State");

function Automaton(){

    /**
     * The initial state of this Automaton.
     * @type {State} initial
     */
    this.initial = null;

    /**
     * Set of all of the states that this automaton has.
     * @type {Object.<string,State>}
     */
    this._states = {};

}

Automaton.prototype = Object.create(Identifiable.prototype);

/**
 * @inheritDoc
 */
Automaton.prototype.toJSON = function(replacer, space){
    var states = [];
    var transitions = [];

    // Add each state to the state JSON
    for(var key in this._states){
        if(this._states.hasOwnProperty(key)){
            var state = this._states[key];
            states.push(state);

            // Add each of the transitions to the transition JSON 
            for(var t in state._transitions){
                if(state._transitions.hasOwnProperty(t)){
                    var transition = state._transitions[t];
                    transitions.push(transition);
                }
            }
        }
    }
    return JSON.stringify({
        states: states,
        transitions : transitions
    },replacer, space);
};


/**
 * @param {State} state
 * @returns {num} the id of the state added.
 */
Automaton.prototype.addState = function(state){
    this._states[state.id] = state;
};

/**
 * @param {{State|num}} stateOrId
 */
Automaton.prototype.removeState = function(stateOrId){
    if(stateOrId instanceof State){
        delete this._states[stateOrId.id];
    }else{
        delete this._states[stateOrId];
    }
};

/**
 * Get the amount of states in this automaton.
 * @returns {num}
 */
Automaton.prototype.length = function(){
    return Object.keys(this._states).length;
};


/**
 * Run some input against this Automaton.
 * @param {string} input - the input to run
 * @returns {bool} true if this Automaton accepts the input
 */
Automaton.prototype.run = function(input){
    var letters = input.split("");

    if(letters.length === 0){
        return false;
    }

    var state = this.initial;
    var letter = null;
    while(letter = letters.shift()){
        if(!(state = state.run(letter))){
            return false;
        }
    }

    return state.accept;
};


module.exports = Automaton;

},{"app/Identifiable":3,"app/State":5}],2:[function(require,module,exports){
var Identifiable = require("app/Identifiable");
var State = require("app/State");
var Transition = require("app/Transition");
var Automaton = require("app/Automaton");
var Input = require("app/Input");

var AutomatonBuilder = {

    /**
     * Generate an automaton that accepts a single character.
     * @param {string} input - the character that this automaton
     * accepts.
     * @return {Automaton}
     */
    singleChar : function(input){
        if(input.length !== 1){
            throw "input must be a single character";
        }

        var startState = new State;
        startState.start = true;

        var endState = new State;
        endState.accept = true;
        
        // create transitions
        startState.addTransition(endState, input);

        var automaton = new Automaton;
        automaton.addState(startState);
        automaton.initial = startState;
        automaton.addState(endState);
        return automaton;
    },

    /**
     * Generate an automaton that accepts a string that starts
     * with first and ends with last.
     * @param {string} first
     * @param {string} last
     * @returns {Automaton}
     */
    firstAndLastChar : function(first, last){
        if(first.length !== 1 || last.length !== 1){
            throw "input must be a single character";
        }

        var startState = new State;
        startState.start = true;

        var middleState = new State;

        var endState = new State;
        endState.accept = true;

        // create transitions
        startState.addTransition(middleState, first);

        middleState.addTransition(endState, last);

        // generate transitions that accept everything besides 'last'
        var withoutLast = Input.without(last);
        var beforeLast = withoutLast[0];
        var afterLast = withoutLast[1];
        middleState.addTransition(middleState, beforeLast[0], beforeLast[beforeLast.length-1]);
        middleState.addTransition(middleState, afterLast[0], afterLast[afterLast.length-1]);

        // create the automaton
        var automaton = new Automaton;
        automaton.addState(startState);
        automaton.initial = startState;
        automaton.addState(middleState);
        automaton.addState(endState);
        return automaton;
    }

};


module.exports = AutomatonBuilder;

},{"app/Automaton":1,"app/Identifiable":3,"app/Input":4,"app/State":5,"app/Transition":6}],3:[function(require,module,exports){
function Identifiable(){

    /** The unique id of this object.
     * @param {num} id
     */
    this.id = this.nextId();

}

Identifiable.prototype = {

    _currentId : 0,

    /**
     * @returns {number} The next serial, unique id. This is
     * is used in the constructor to set `this.id`
     */
    nextId : function(){
        return ++ Identifiable.prototype._currentId;
    },

    /**
     * @inheritDoc
     */
    toJSON : function(replacer, space){
        return JSON.stringify({id: this.id});
    }
};


module.exports = Identifiable;

},{}],4:[function(require,module,exports){


var Input = {

    // the empty string
    EMPTY : "-1",

    // *
    WILDCARD : "-2",

    ALPHABET : Object.freeze([
        "a", "b", "c", "d", "e", "f", "g", "h", "i",
        "j", "k", "l", "m", "n", "o", "p", "q", "r",
        "s", "t", "u", "v", "w", "x", "y", "z"
    ]),

    /**
     * @input {string} input - the character to split on
     * @return <Array.<Array.<string>> an array where the first
     * index is everything before 'input' and the second index is 
     * everything after it. Either one could be empty arrays.
     */
    without : function(input){
        var copy = Input.ALPHABET.slice(0);
        var index = Input.ALPHABET.indexOf(input);
        var split = [];
        if(index > -1){
            split.push(copy.slice(0, index));
            split.push(copy.slice(index+1));
        }
        return split;
    }

};

Object.freeze(Input);
module.exports = Input;

},{}],5:[function(require,module,exports){
var Identifiable = require("app/Identifiable");
var Transition = require("app/Transition");

/**
 * A State of a DFA
 */
function State(){
    // super call
    Identifiable.apply(this);

    /**
     * @type {bool} start whether or not this is the starting state.
     */
    this.start = false;

    /**
     * @type {bool} accept whether or not this is an accepting state.
     */
    this.accept = false;

    /**
     * @type {Object.<string,Transition>
     */
    this._transitions = {};

}

State.prototype = Object.create(Identifiable.prototype);

/**
 * @inheritDoc
 */
State.prototype.toJSON = function(replacer, space){
    return JSON.stringify({
        id: this.id,
        start: this.start,
        accept: this.accept
    }, replacer, space);
};

/**
 * @param {string} input - the input to test
 * @returns {?State} the state that results from running the input.
 * Possibly null if no transitions exist for this input.
 */
State.prototype.run = function(input){
    for(var key in this._transitions){
        if(this._transitions.hasOwnProperty(key)){
            var transition = this._transitions[key];
            if(transition.accepts(input)){
                return transition.toState;
            }
        }
    }

    return null;
};

/**
 * Add a Transition for this State.
 * @param {State} toState
 * @param {string} min 
 * @param {string} [max] 
 * @returns {num} The id of the created Transition
 */
State.prototype.addTransition = function(toState, min, max){
    var transition = new Transition(this, toState, min, max);
    this._transitions[transition.id] = transition;
    return transition.id;
};

/**
 * @param {{string|Transition}} transitionOrId - The Transition object
 * to remove, or the id of a Transition.
 */
State.prototype.removeTransition = function(transitionOrId){
    if(transitionOrId instanceof Transition){
        delete this._transitions[transitionOrId.id];
    }else{
        delete this._transitions[transitionOrId];
    }
};

/**
 * @returns {num} The amount of transitions this State has
 */
State.prototype.length = function(){
    return Object.keys(this._transitions).length;
};

module.exports = State;


},{"app/Identifiable":3,"app/Transition":6}],6:[function(require,module,exports){
var Identifiable = require("app/Identifiable");
var State = require("app/State");


/**
 * A Transition for a State, on a given input to another State.
 * @constructor
 * @param {State} fromState
 * @param {State} toState
 * @param {string} min 
 * @param {string} [max] 
 */
function Transition(fromState, toState, min, max){
    // super call
    Identifiable.apply(this);

    /**
     * @type {string} min
     */
    this.min = min;

    /**
     * @type {string}
     */
    this.max = max || min;

    /**
     * The state that this transition leads to.
     * @type {State}
     */
    this.toState = toState;

    /**
     * The state that this transition comes from.
     * @type {State}
     */
    this.fromState = fromState;
}

Transition.prototype = Object.create(Identifiable.prototype);


/**
 * @param {string} input - The input to test
 * @returns {bool} true if the input applies to this Transition 
 */
Transition.prototype.accepts = function(input){
    return this.min <= input && input <= this.max;
};


/**
 * @inheritDoc
 */
Transition.prototype.toJSON = function(replacer, space){
    return JSON.stringify({
        id: this.id,
        min: this.min,
        max: this.max,
        toState: this.toState.id,
        fromState: this.fromState.id
    },replacer, space);
};

/**
 * @returns {string}
 */
Transition.prototype.toString = function(){
    return this.fromState + "(" + this.min + ":" + this.max + ") -> " + this.toState;
};

module.exports = Transition;

},{"app/Identifiable":3,"app/State":5}],"automatonjs":[function(require,module,exports){
/**
 * This file tells browserify which submodules to expose to
 * other modules that depend on Automatonjs
 */

exports.Automaton           = require("app/Automaton");
exports.AutomatonBuilder    = require("app/AutomatonBuilder");
exports.State               = require("app/State");
exports.Input               = require("app/Input");
exports.Transition          = require("app/Transition");

},{"app/Automaton":1,"app/AutomatonBuilder":2,"app/Input":4,"app/State":5,"app/Transition":6}]},{},[])("automatonjs")
});