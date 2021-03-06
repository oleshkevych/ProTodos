/**
 * Created by vova on 31.08.2015.
 */
var app = app || {};

(function () {
    'use strict';

    var Todos = Backbone.Collection.extend({
        model: app.todo,

        localStorage: new Backbone.LocalStorage('todos'),

        completed: function () {
            return this.filter(function (todo) {
                return todo.get('completed');
            });
        },

        nextOrder: function () {
            return this.length ? this.last().get('order') + 1 : 1;
        },
        comparator: function () {
            return this.get('order');
        }
    });

    app.todos = new Todos();
})();
