var app = app || {};
app.todos = Backbone.model.extend({
    defaults:{
        title:'',
        complete: false
    },
    toggle: function(){
        "use strict";
        this.save({
            complete: !this.get(complete)
        });
    }
});
