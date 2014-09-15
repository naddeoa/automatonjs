var Identifiable = require("./Identifiable");
var State = require("./State");
var Transition = require("./Transition");
var Automaton = require("./Automaton");
var Input = require("./Input");



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
