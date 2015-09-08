/**
 * Created by vova on 08.09.2015.
 */
var app = app||{};
app.downDivView = Backbone.View.extend({
    el:"#buttons",

    events:{
        'click #delete': 'deleteChecked',
        'click #deleteDone': 'deleteDone',
        'click #Toggle': 'toggleAll',
        'click #ToggleCompleted': 'toggleCompleted'
    },

    initialize: function(){
        "use strict";
        this.listenTo(app.todos, 'add', this.render),
        this.listenTo(app.todos, 'change', this.render)
    },

    render: function(){
        "use strict";
        console.log("new render");
        /*var all = app.todos.length;
        var completed = app.todos.pluck("complete");
        var completedTodos = 0;
        console.log(completed);
        console.log(_.include(completed, true));
        while (_.include(completed, true)){

            completedTodos++;
            completed.splice(_.indexOf(completed, true), 1);

        }*/
        var all = app.todos.length;
        var completedTodos = app.todos.where({complete: true}).length;
        var uncompleted = all-completedTodos;
        $("#compl").html(completedTodos);
        $("#uncompl").html(uncompleted);
    },

    deleteChecked: function(event){
        "use strict";
        if (event.which !== 1){
            return;
        }
        var element = ($( 'input:checked'));
        var classId = app.todos.pluck("title");
        _.each(classId, function(classI){
            if (element.hasClass(classI)){
                app.todos.remove(app.todos.findWhere({title: classI}));
                app.todos.trigger("change");

            }
        });
    },

    deleteDone: function(event){
        "use strict";
        if (event.which !== 1) {
            return;
        }

        _.each(app.todos, function(){
            app.todos.remove(app.todos.findWhere({complete: true}));

        });
        app.todos.trigger("change");
    },

    toggleAll: function(event){
        "use strict";
        if ((event.target.checked)){
            _.each(app.todos, function () {
                $('input:checkbox').prop({"checked": true});
            });
        }
        else{
            _.each(app.todos, function () {
                $('input:checkbox').prop({"checked": false});
            });
        }
    }

});
