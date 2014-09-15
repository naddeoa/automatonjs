var Identifiable = require("./Identifiable");
var State = require("./State");
var Transition = require("./Transition");
var Automaton = require("./Automaton");



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
        
        startState.addTransition(endState, input);

        var automaton = new Automaton;
        automaton.addState(startState);
        automaton.initial = startState;
        automaton.addState(endState);
        return automaton;
    }

};


module.exports = AutomatonBuilder;
