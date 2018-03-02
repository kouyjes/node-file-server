(function () {
    function highlight(el,keyword){
        if(!keyword){
            keyword = '';
        }
        var text = el.innerText;
        el.innerHTML = text.replace(keyword,'<i class="mg-text-highlight">' + keyword + '</i>');
    }
    Vue.directive('highlight',{
        inserted: function (el,binding) {
            var keyword = binding.value;
            highlight(el,keyword);
        },
        update: function (el,binding) {
            var keyword = binding.value;
            highlight(el,keyword);
        }
    });
})();