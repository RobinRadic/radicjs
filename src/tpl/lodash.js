define(function(){

    function getlodash() {

        /**
         * @ignore
         */

        // @include _lodash.js

        delete lodash.VERSION;
        delete lodash.extend;

        return lodash;
    }



    return getlodash;
});
