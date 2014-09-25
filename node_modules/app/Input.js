

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
