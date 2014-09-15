

function Identifiable(){

    /** The unique id of this object.
     * @param {num} id
     */
    this.id = this.nextId();

}

Identifiable.prototype = {

    _currentId : 0,

    nextId : function(){
        return ++ Identifiable.prototype._currentId;
    }

};


module.exports = Identifiable;
