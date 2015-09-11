/**
 * Created by vova on 08.09.2015.
 */
var app = app || {};
app.downDivView = Backbone.View.extend({
    el: "#buttons",

    events: {
        'click #delete': 'deleteChecked',
        'click #deleteDone': 'deleteDone',
        'click #Toggle': 'toggleAll',
        'click #ToggleCompleted': 'toggleCompleted'
    },

    initialize: function () {
        "use strict";
        this.listenTo(app.todos, 'all', this.render);
        this.render();
    },

    render: function () {
        "use strict";
        var all = app.todos.length;
        var completedTodos = app.todos.where({complete: true}).length;
        var uncompleted = all - completedTodos;
        $("#compl").html(completedTodos);
        $("#uncompl").html(uncompleted);

    },

    deleteChecked: function (event) {
        "use strict";
        if (event.which !== 1) {
            return;
        }
        var element = ($('input:checked'));
        var classId = app.todos.pluck("order");

        _.each(classId, function (classI) {

            if (element.hasClass("a" + classI)) {

                app.todos.findWhere({order: classI}).destroy();

            }
        });
        $('input:checkbox').prop({"checked": false});
    },

    deleteDone: function (event) {
        "use strict";
        if (event.which !== 1) {
            return;
        }

        _.each(app.todos, function () {
            if (app.todos.findWhere({complete: true})) {
                app.todos.findWhere({complete: true}).destroy();
            }

        });

    },

    toggleAll: function (event) {
        "use strict";
        if ((event.target.checked)) {
            _.each(app.todos, function () {
                $('input:checkbox').prop({"checked": true});
            });
        }
        else {
            _.each(app.todos, function () {
                $('input:checkbox').prop({"checked": false});
            });
        }
    }

});
