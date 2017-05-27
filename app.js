Vue.component('Modal',{
    template : '#doc-modal-template',
    props : ['modal','item']
})


Vue.component('Sidebar',{
    template : '#sidebar-template',
    props : ['categories']
})

Vue.component('Results',{
    template : '#results-template',
    props: ['results','categories']
})

var app = new Vue({
  el: '#app',
  created : function(){
    //   console.log('in the root')
    var vm = this;
    this.getItems().done(function(){
        vm.buildCategories();
        vm.item = vm.results[0]; //setting modal item to first
    });

  },
  data : {
      results : [],
      categories : [],
      modal : false,
      item : {}
  },
  methods : {
      capitalize : function(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
      },
      makeHash : function(str){
          return str.replace(/\s+/g, '-').toLowerCase();
      },
      getItems : function(){
        var vm = this;
        return $.get('data/data.txt')
            .done(function(d){
                var results = JSON.parse(d);
                $.each(results,function(i,item){
                    item.Category = vm.capitalize(item.Category);
                    item.Title = vm.capitalize(item.Title);
                    item.Description = vm.capitalize(item.Description);
                    item.categoryHash = '';
                    item.categoryHash = vm.makeHash(item.Category);
                })
            vm.results = results;
        });
      },
      launch : function(event){

        var id = event.target.getAttribute("data-id");
        var currentItem = {}
        // this.item = //current item from key
        $.each(this.results,function(i,item){
            if(item.id == id){
                currentItem = item;
            }
        })
        this.item = currentItem;
        this.modal = true;


      },
      filterCats : function(event){
        var vm = this;
        var hash = event.target.getAttribute("data-hash");
        var filtered = [];
        this.getItems().done(function(){ //puts results back to original
            $.each(vm.results,function(i,item){
                if(item.categoryHash == hash){
                    filtered.push(item);
                }
            })
            vm.results = filtered;
        })
      },
      buildCategories : function(){
        var cats = [];
        var vm = this;
        for(var i=0; i<this.results.length; i++){
            cats.push(this.results[i].Category)
        }

        var uniqueCats = [];
        $.each(cats, function(i, el){
            if($.inArray(el, uniqueCats) === -1) uniqueCats.push(el);
        });
        var final = [];

        $.each(uniqueCats,function(i,el){
            var finalObj = {};
            finalObj['categoryName'] = el;
            finalObj['categoryHash'] = vm.makeHash(el);
            final.push(finalObj);
        })
        vm.categories = final;
      }
  }
})
