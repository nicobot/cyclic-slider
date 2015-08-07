;(function ( $, window, document, undefined ) {

    "use strict";

    // Create the defaults once
    var pluginName = "cyclicSlider",
        defaults = {
            speed: 1,
            gap: "30px",
        };

    // The actual plugin constructor
    function Plugin ( element, options ) {
        this.element = element;
        this.$element = $(element);

        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function () {
            this.onHover = false;
            this.run(this.$element, this.settings);
        },
        stop: function() {
            this.onHover = true;
        },
        resume: function() {
            this.onHover = false;
        },
        run: function ($element, settings) {

            var onHover = false;

            $element.hover($.proxy(this.stop, this), $.proxy(this.resume, this));
            $element.wrapInner('<div class="items_wrapper"></div>');

            var $wrapper = $element.find('.items_wrapper');

            $element.css('overflow', 'hidden');

            $wrapper.find("> *").css({
                'display': 'inline-block',
                'margin-left': this.settings.gap,
                'margin-right': '0', // when moving from right to left this will avoid jumps
            });

            $wrapper.width("10000000px");

            function step(timestamp) {

                if (!start) start = timestamp;
                var progress = timestamp - start;

                if (!onHover) {
                    // we'll pause on hover

                    var $first = $wrapper.find('> :first-child');

                    var first_width = $first.outerWidth(true);
                    var current_margin = parseInt($wrapper.css('margin-left')) * -1;

                    var speed_step = Math.min(progress/10, settings.speed);

                    $wrapper.css('margin-left', (-1 * (current_margin + speed_step)) + "px");

                    if (current_margin + speed_step > first_width) {
                        // move first to last position
                        $wrapper.css('margin-left', (-1 * (current_margin + speed_step - first_width)) + "px");
                        $first.appendTo($wrapper);
                    }

                }

                window.requestAnimationFrame(step);
            }

            window.requestAnimationFrame(step);
        }
    });

    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
        });
    };

})( jQuery, window, document );