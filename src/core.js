define(function () {

    var version = "@VERSION";

    /**
     * @name radic
     * @constructor
     * @mixes radic/storage
     * @mixes radic/template
     * @mixes radic/template/comparisons
     */
    function radic(){

    }


    /**
     * Extends the base radic object
     *
     * @param {Object} obj - The object to extend radic with
     * @example
     * radic.extend({
     *      storage: {
     *          print: function(what){
     *              console.log(what);
     *          }
     *      }
     * });
     */
    radic.extend = function(obj){
        $.extend(radic, obj);
    };

    return radic;
});
