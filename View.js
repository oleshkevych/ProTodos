var app = app || {};
app.bigDivView = Backbone.View.extend({
    el:'#todosList',

    events: {
        'mousedown': 'onANewLi',
        'keydown #todo-list': 'addOne',
        'dblclick ul': 'edit',
        'keypress .edit': 'updateEnter',
        'blur .edit': 'close'
    },

    initalize: function(){
        "use strict";

        addEventListener(app.todos, 'add', this.addNewOne),
        addEventListener(app.todos, 'change: complete', this.filterOne)
    },

    onANewLi: function(event){
        "use strict";
        $(document).ready(function() {

            var clickedId = event.target.id;
            if ((event.which === 1) && (clickedId !== "toggle") && (clickedId !== "todotext") && (clickedId !== "todo-list")) {

                if ($(".asList").css('display') === 'none') {

                    $(".asList").css('display', 'inline');
                }
                event.stopPropagation();
                event.preventDefault();
                $("#todotext").focus();
                return true;
            }
            return;

        });
        return;


    },

    addOne: function(event){
        "use strict";
        if ( (event.which !== 13) || (!$("#todotext").val().trim()) ) {
            return;
        }

        var newTodo = new app.todo({
            title: $("#todotext").val().trim(),
            order: app.todos.nextOrder(),
            completed: false
        });


        app.todos.add(newTodo);

        $("#todotext").val('');

        console.log(app.todos.length);
    },

    addNewOne: function(){
        "use strict";
        alert("rgfergf");

    }





})
