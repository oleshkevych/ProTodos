var app = app || {};
(function() {
    app.todo = Backbone.Model.extend({


        defaults: {
            title: '',
            complete: false,
            order: 0

        },
        toggle: function () {
            "use strict";
            this.save({
                complete: !this.get('complete')
            });
        }
    });
})();
