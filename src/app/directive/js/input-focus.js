(function () {
    var timeout;
    function inputFocus(el,focus){
        if(focus && typeof el.focus === 'function'){
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                el.focus();
            },100);
        }
    }
    Vue.directive('inputFocus',{
        inserted: function (el,binding) {
            inputFocus(el,binding.value);
        },
        update: function (el,binding) {
            inputFocus(el,binding.value);
        }
    });
})();
