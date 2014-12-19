define([
    "./core"
], function( radic ) {

    /**
     * @mixin
     * @alias radic/template
     */
    var template = Handlebars;

    /**
     * Get a template
     *
     * @param name
     * @param data
     * @returns {*}
     */
    template.get = function(name, data){
        var template = template[name];
        if(radic.isUndefined(data)){
            return template;
        }
        var html = template(data);
        return $($(html).html().trim());
    };


    radic.template = template;

});
