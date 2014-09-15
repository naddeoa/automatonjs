var Identifiable = require("./Identifiable");
var Transition = require("./Transition");

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
    var transition = new Transition(toState, min, max);
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

