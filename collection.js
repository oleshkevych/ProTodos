/**
 * Created by vova on 31.08.2015.
 */
var app = app || {};

(function () {
    'use strict';

    var Todos = Backbone.Collection.extend({
        model: app.todo,
        //localStorage: new Backbone.LocalStorage('todos-backbone'),
        completed: function () {
            return this.where({complete: true});
        },
        remaining: function () {
            return this.where({complete: false});
        },
        nextOrder: function () {
            return this.length ? this.last().get('order') + 1 : 1;
        },
        comparator: function() {
            return this.get('order');
        }
    });

    app.todos = new Todos();
})();
