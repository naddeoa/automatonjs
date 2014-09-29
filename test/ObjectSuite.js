/* globals describe, it */

var assert = require("assert");
var Identifiable = require("app/Identifiable");
var State = require("app/State");
var Transition = require("app/Transition");
var Automaton = require("app/Automaton");
var AutomatonBuilder = require("app/AutomatonBuilder");
var Input = require("app/Input");

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
        var t1 = new Transition(null, null, "a");
        assert(t1.accepts("a"));
        assert(!t1.accepts("b"));

        var t2 = new Transition(null, null, "a", "y");
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

describe("Input functionality", function(){

    it("without", function(){
        var withoutD = Input.without("d");
        var beforeD = withoutD[0];
        var afterD = withoutD[1];
        assert.deepEqual(beforeD, [ 'a', 'b', 'c' ]);
        assert.deepEqual(afterD, [ 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
                'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ]);

        var withoutA = Input.without("a");
        var beforeA = withoutA[0];
        var afterA = withoutA[1];
        assert.deepEqual(beforeA, []);
        assert.deepEqual(afterA, [ 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
                'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ]);

        var withoutZ = Input.without("z");
        var beforeZ = withoutZ[0];
        var afterZ = withoutZ[1];
        assert.deepEqual(beforeZ, [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
                'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y' ]);
        assert.deepEqual(afterZ, []);
        
    });
});

describe("AutomatonBuilder", function(){

    it("single character automaton", function(){
        var automaton = AutomatonBuilder.singleChar("a");
        assert.equal(automaton.length(), 2);
        assert(automaton.run("a"), "a");
        assert(!automaton.run("b"), "b");
        assert(!automaton.run("aaaa"), "aaaa");
        assert(!automaton.run(""), "empty string");
    });

    it("first and last character automaton", function(){
        var automaton = AutomatonBuilder.firstAndLastChar("a","b");
        assert.equal(automaton.length(), 3);

        assert(!automaton.run("a"), "a");
        assert(!automaton.run("aaaaaaaaba"), "aaaaaaaaba");
        assert(!automaton.run("zab"), "zab");

        assert(automaton.run("ab"), "ab");
        assert(automaton.run("aasdfasdfb"), "aasdfasdfb");
    });
});


describe("Serialization", function(){
    it("Transition", function(){
        var s1 = new State;
        var s2 = new State;

        var t1 = new Transition(s1, s2, "a");

        var expectedTransition = JSON.stringify({
            id: t1.id,
            min: "a",
            max: "a",
            toState: s2.id,
            fromState: s1.id
        });
        
        assert.deepEqual(JSON.stringify(t1), expectedTransition);

    });

    it("State", function(){
        var s1 = new State;
        s1.accept = false;

        var expectedS1 = JSON.stringify({
            id: s1.id,
            start: s1.start,
            accept: s1.accept
        });

        assert.deepEqual(JSON.stringify(s1), expectedS1);
    });

    it("Automaton", function(){
        var automaton = AutomatonBuilder.singleChar("a");

        var id1 = Object.keys(automaton._states)[0];
        var id2 = Object.keys(automaton._states)[1];

        var state1 = automaton._states[id1];
        var state2 = automaton._states[id2];

        var transitionId = Object.keys(state1._transitions)[0];
        var transition = state1._transitions[transitionId];

        var expected = JSON.stringify({
            states: [ state1, state2 ],
            transitions: [ transition ]
        });

        assert.deepEqual(JSON.stringify(automaton), expected);
    });
});
