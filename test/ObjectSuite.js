/* globals describe, it */

var assert = require("assert");
var Identifiable = require("../src/Identifiable");
var State = require("../src/State");
var Transition = require("../src/Transition");
var Automaton = require("../src/Automaton");
var AutomatonBuilder = require("../src/AutomatonBuilder");

describe("Inheritance", function(){

    it("Serial ids on base class.", function(){
        var i1 = new Identifiable;
        var i2 = new Identifiable;
        var i3 = new Identifiable;
        var i4 = new Identifiable;

        assert(i1.id < i2.id < i3.id < i4.id);
    });

    it("State correctly inherits from Identifiable.", function(){
        var s1 = new State;
        var s2 = new State;
        var s3 = new State;
        var s4 = new State;

        assert(s1.id < s2.id < s3.id < s4.id);
    });

    it("Transition correctly inherits from Identifiable.", function(){
        var t1 = new Transition;
        var t2 = new Transition;
        var t3 = new Transition;
        
        assert(t1.id < t2.id < t3.id);
    });
});

describe("State functionality", function(){

    it("Add transitions", function(){
        var fromState = new State;
        var toState = new State;
        
        assert.equal(fromState.length(), 0);

        var t1 = fromState.addTransition(toState, "a");
        assert.equal(fromState.length(), 1);

        var t2 = fromState.addTransition(toState, "b");
        assert.equal(fromState.length(), 2);

        fromState.removeTransition(t2);
        assert.equal(fromState.length(), 1);
    });

    it("Add transitions", function(){
        var fromState = new State;
        var toState = new State;
        var t1 = fromState.addTransition(toState, "a");
        var t2 = fromState.addTransition(toState, "b");
        
        assert.equal(fromState.run("c"), null);
        assert.equal(fromState.run("a"), toState);

    });
});

describe("Transition functionality", function(){

    it("accepting certain inputs", function(){
        var t1 = new Transition(null, "a");
        assert(t1.accepts("a"));
        assert(!t1.accepts("b"));

        var t2 = new Transition(null, "a", "y");
        assert(t2.accepts("b"));
        assert(t2.accepts("w"));
        assert(!t2.accepts("z"));
    });
});

describe("Automaton functionality", function(){

    it("Adding and removing states", function(){
        var s1 = new State;
        var s2 = new State;
        var s3 = new State;

        var auto = new Automaton;

        assert.equal(auto.length(), 0);

        auto.addState(s1);
        auto.addState(s2);
        // try to add a duplicate
        auto.addState(s2);

        assert.equal(auto.length(), 2);

        auto.addState(s3);
        assert.equal(auto.length(), 3);

        // Remove
        auto.removeState(s2);
        assert.equal(auto.length(), 2);

        // Remove by id
        auto.removeState(s3.id);
        assert.equal(auto.length(), 1);
    });

});


describe("AutomatonBuilder", function(){

    it("single character automaton", function(){
        var automaton = new AutomatonBuilder.singleChar("a");
        assert.equal(automaton.length(), 2);
        assert(automaton.run("a"));
        assert.notEqual(automaton.run("b"));
        assert.notEqual(automaton.run("aaaa"));
        assert.notEqual(automaton.run(""));
    });

});
