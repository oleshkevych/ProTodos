var app = app || {};
app.bigDivView = Backbone.View.extend({
    el: '#todosList',

    events: {
        'mousedown': 'onANewLi',
        'keydown #todo-list': 'addOne',
        'contextmenu': 'onContextMenu',
        'blur .asList': 'outInput'
    },

    initialize: function () {
        "use strict";
        this.listenTo(app.todos, 'all', this.render);
        app.todos.fetch();
    },

    onANewLi: function (event) {
        "use strict";
        var clicked = event.target.tagName;
        if ((event.which === 1) && (clicked === "INPUT")) {
            $(this).focus();
            return;
        }
        if ((event.which === 1) && (clicked !== "INPUT") && (clicked !== "LABEL")) {
            if ($(".asList").css('display') === 'none') {
                $(".asList").css('display', 'inline');
            }
            event.stopPropagation();
            event.preventDefault();
            $("#todotext").focus();
            return true;
        }

    },

    addOne: function (event) {
        "use strict";
        if ((event.which !== 13) || (!$("#todotext").val().trim())) {
            return;
        }
        var newTodo = new app.todo({
            title: $("#todotext").val().trim(),
            order: app.todos.nextOrder(),
            complete: false
        });
        app.todos.add(newTodo);
        newTodo.save();
        $("#todotext").val('');
        $(".asList").css('display', 'none');
    },

    render: function () {
        "use strict";
        var titlesChecked = [];
        var element = ($('input:checked'));
        var classId = app.todos.pluck("order");
        _.each(classId, function (classI) {
            if (element.hasClass("a" + classI)) {
                titlesChecked.push("a" + classI);
            }
        });
        $("#newTodoList").empty();
        var oldTitle = app.todos.pluck("title");
        var title = app.todos.pluck("order");
        var completed = app.todos.pluck("complete");
        var titleCompleted = [];
        var oldTitleCompleted = [];

        while (_.include(completed, true)) {
            oldTitleCompleted.push(oldTitle[_.indexOf(completed, true)]);
            titleCompleted.push(title[_.indexOf(completed, true)]);
            title.splice(_.indexOf(completed, true), 1);
            oldTitle.splice(_.indexOf(completed, true), 1);
            completed.splice(_.indexOf(completed, true), 1);
        }

        _.each(title, function (text) {
            $("#newTodoList").prepend('<ul class="insert"><input type="checkbox" class="in"><input type="text" class="in" style="display: none"><label for=text class="in"></label><button id="destroy" class="in1"></button></ul>');
            $(".in").html(oldTitle[_.indexOf(title, text)]).removeClass("in").addClass("a" + text);
            $(".in1").removeClass("in1").addClass("a" + text);
        });

        _.each(titleCompleted, function (text) {
            $("#newTodoList").append('<ul class="insert"><input type="checkbox" class="in"><input type="text" class="in" style="display: none"><label for=text class="in" style="background-color: aquamarine"></label><button id="destroy" class="dest"></button></ul>');
            $(".in").html(oldTitleCompleted[_.indexOf(titleCompleted, text)]).removeClass("in").addClass("a" + text);
            $(".dest").removeClass("dest").addClass("a" + text);
        });

        _.each(titlesChecked, function (classI) {
            $('input:checkbox.' + classI).prop({"checked": true});
        });
        event.stopPropagation();
        event.preventDefault();

    },

    onContextMenu: function (event) {
        "use strict";
        event.stopPropagation();
        event.preventDefault();
        return false;
    },
    outInput: function () {
        "use strict";
        $("#todotext").val('');
        $(".asList").css('display', 'none');

    }

});

app.smallDivView = Backbone.View.extend({
    el: "#newTodoList",
    events: {
        'blur .edit:text': 'close',
        'mousedown': 'changeToComplete',
        'keyup .edit': 'updateEnter',
        'mousedown #destroy': 'destroy'
    },

    changeToComplete: function (event) {
        "use strict";
        if ((event.which === 1) && (event.target.tagName !== "INPUT") && (event.target.tagName !== "LABEL")) {
            var view = new app.bigDivView();
            view.onANewLi(event);
            return;
        }
        if ((event.which === 2) && (event.target.tagName === "LABEL")) {
            this.edit(event);
            return;
        }
        if ((event.which === 3)) {
            var text = $(event.target).text();
            app.todos.map(function (model) {
                if (model.values()[0] === text) {
                    model.save({
                        complete: !model.get('complete')
                    });
                }
            });
        }

    },
    edit: function (event) {
        "use strict";
        var view = new app.bigDivView();
        view.render();
        if (event.which === 2) {
            var clickedId = $(event.target).prop("class");
            $("." + clickedId).each(function () {
                $(this).addClass("edit");
            });
            var text1 = $("label.edit").text();
            $(".edit").each(function (index, element) {
                if (element.tagName === "LABEL") {
                    $(this).css("display", "none");
                }
                if ((element.tagName === "INPUT")) {
                    $(this).val(text1);
                    $(this).css("display", "inline");
                    $(this).css("background-color", "red");
                    event.stopPropagation();
                    event.preventDefault();
                    $(this).focus();
                }
            });
        }

    },

    updateEnter: function (event) {
        "use strict";
        var text = $("label.edit").text();
        var text1 = $(".edit:odd").val().trim();
        if ((event.which !== 13) && (event.which !== 27)) {
            return;
        }
        if ((text1 === text) || (event.which === 27)) {
            this.close();
            return;
        }
        app.todos.map(function (model) {
            if (model.values()[0] === text) {
                model.save({
                    title: text1
                });

            }

        });
    },

    close: function () {
        "use strict";
        var text = $("label.edit").text();
        var order = "a" + app.todos.findWhere({title: text}).get("order");
        if ($(".edit")) {
            $(".edit").each(function (index, element) {

                if (element.tagName === "INPUT") {
                    $(".edit:text").css("display", "none");
                }
                if ((element.tagName === "LABEL")) {
                    $(this).css("display", "inline");
                }
                $(".edit").removeClass("edit").addClass(order);
            });
        }
    },

    destroy: function (event) {
        "use strict";
        var classname = $(event.target).prop("class");
        var classname1 = parseInt(classname.substring(1, classname.length), 10);
        app.todos.findWhere({order: classname1}).destroy();

    }

});
