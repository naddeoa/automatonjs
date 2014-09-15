var Identifiable = require("./Identifiable");
var State = require("./State");


/**
 * A Transition for a State, on a given input to another State.
 * @param {State} toState
 * @param {string} min 
 * @param {string} [max] 
 */
function Transition(toState, min, max){
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
 * @returns {string}
 */
Transition.prototype.toString = function(){
    return this.min + ":" + this.max + " -> " + this.toState;
};

module.exports = Transition;
