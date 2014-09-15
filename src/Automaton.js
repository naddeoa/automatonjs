var Identifiable = require("./Identifiable");
var State = require("./State");

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
