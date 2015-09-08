var app = app || {};
app.bigDivView = Backbone.View.extend({
    el: '#todosList',

    events: {
        'mousedown': 'onANewLi',
        'keydown #todo-list': 'addOne',
        'contextmenu': 'onContextMenu',
        'blur .asList:text': 'outInput'
    },

    initialize: function () {
        "use strict";

        this.listenTo(app.todos, 'add', this.render),
        this.listenTo(app.todos, 'change', this.render)
    },

    onANewLi: function (event) {
        "use strict";


            var clicked = event.target.tagName;
            console.log(clicked);
            if ((event.which === 1) && (clicked === "INPUT")){
                $(this).focus();
            }
            if ((event.which === 1) && (clicked !== "INPUT")) //&& (clickedId !== "todotext") && (clickedId !== "todo-list"))
            {

                if ($(".asList").css('display') === 'none') {

                    $(".asList").css('display', 'inline');
                }
                event.stopPropagation();
                event.preventDefault();
                $("#todotext").focus();
                return true;
            }


        return;
    },

    addOne: function (event) {
        "use strict";

        if ((event.which !== 13) || (!$("#todotext").val().trim())) {
            return;
        }

        var newTodo = new app.todo({
            title: $("#todotext").val().trim(),
            order: app.todos.nextOrder(),
            complete: false,
            _id: app.todos.nextOrder()
        });

        app.todos.add(newTodo);

        $("#todotext").val('');
        $(".asList").css('display', 'none');
    },

    render: function () {
        "use strict";
        var titlesChecked = [];
        var element = ($( 'input:checked'));
        var classId = app.todos.pluck("title");
        _.each(classId, function(classI){
                if (element.hasClass(classI)){
                    titlesChecked.push(classI);
                }
        });
        $("#newTodoList").empty();
        var title = app.todos.pluck("title");
        var completed = app.todos.pluck("complete");
        var titleCompleted = [];

        while (_.include(completed, true)) {

            titleCompleted.push(title[_.indexOf(completed, true)]);

            title.splice(_.indexOf(completed, true), 1);

            completed.splice(_.indexOf(completed, true), 1);
        }
        console.log(title.length);
        console.log(completed.length);



        _.each(title, function (text) {

            $("#newTodoList").prepend('<ul class="insert"><input type="checkbox" class="in"><input type="text" class="in" style="display: none"><label for=text class="in"></label><button id="destroy" class="in1"></button></ul>');
            $(".in").html(text).removeClass("in").addClass(text);
            $(".in1").html("X").removeClass("in1").addClass(text);
        });

        _.each(titleCompleted, function(text){

            $("#newTodoList").append('<ul class="insert"><input type="checkbox" class="in"><input type="text" class="in" style="display: none"><label for=text class="in" style="background-color: aquamarine"></label><button id="destroy" class="in1"></button></ul>');
            $(".in").html(text).removeClass("in").addClass(text);
            $(".in1").html("X").removeClass("in1").addClass(text);

        });

        _.each(titlesChecked, function(classI){
            $('input:checkbox.'+classI).prop({"checked": true});
        });

        return;
    },

    onContextMenu: function(event){
        "use strict";
        event.stopPropagation();
        event.preventDefault();
        return false;
    },
    outInput: function(){
        "use strict";
        console.log("bla!!!!!!!!!");
        if  ($(".asList").css('display')==='inline') {
            $("#todotext").val('');
            $(".asList").css('display', 'none');
        }
    }

});

app.smallDivView = Backbone.View.extend({
    el: "#newTodoList",

    events: {
        'mousedown': 'changeToComplete',
        'dblclick ul': 'edit',
        'keyup .edit': 'updateEnter',
        'blur .edit:text': 'close',
        'mousedown #destroy': 'destroy'
    },

    changeToComplete: function (event) {
        "use strict";

        if ((event.which === 1) && (event.target.tagName !== "INPUT")) {
            var view = new app.bigDivView();
            view.onANewLi(event);
        }
        if ((event.which === 1) && (event.target.tagName === "INPUT")){
            $(this).focus();
        }


        if ((event.which === 3) ) {

            var text = $(event.target).text();
            app.todos.map(function (model) {
                //console.log(model.values());
                if (model.values()[0] === text) {

                    model.set({
                        complete: !model.get('complete')
                    });


                }

            });

        }

    },
    edit: function(event) {
        "use strict";
        var clickedId = event.target.className;
        console.log(clickedId);
        $("." + clickedId).each(function () {
            $(this).addClass("edit");
        });
        $(".edit").each(function (index, element) {
            console.log(element.tagName);

            if (element.tagName === "LABEL") {
                $(this).css("display", "none");
            }
            if ((element.tagName === "INPUT")) {
                console.log(true);

                $(this).css("display", "inline");

                $(this).val(clickedId);
                $(this).focus();
            }

        });

    },

    updateEnter: function(event){
        "use strict";

        var text = $(".edit").val();
        var text1 = $(".edit:odd").val().trim();



        if ((event.which !== 13) && (event.which !== 27)) {
            return;
        }
        if ((text1 === text) || (event.which === 27)){
            console.log("close");
            this.close();
            return;
        }

        app.todos.map(function (model){
            console.log(model.values());

            if (model.values()[0] === text) {
                model.set({
                    title: text1
                });

            }

        });
    },

    close: function(){
        "use strict";

        var text = $(".edit").val();console.log("close1");

        $(".edit").each(function (index, element) {


            if (element.tagName === "INPUT") {
                $(".edit:text").css("display", "none");
            }
            if ((element.tagName === "LABEL")) {
                $(this).css("display", "inline");
            }
            $(".edit").removeClass("edit").addClass(text);
        });
    },

    destroy: function(event){
        "use strict";
        var classname = $(event.target).prop("class");

        app.todos.remove(app.todos.findWhere({title: classname}));
        app.todos.trigger("change");
    }

});
