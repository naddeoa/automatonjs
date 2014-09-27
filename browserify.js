/**
 * This file tells browserify which submodules to expose to
 * other modules that depend on Automatonjs
 */

exports.Automaton           = require("app/Automaton");
exports.AutomatonBuilder    = require("app/AutomatonBuilder");
exports.State               = require("app/State");
exports.Input               = require("app/Input");
exports.Transition          = require("app/Transition");
