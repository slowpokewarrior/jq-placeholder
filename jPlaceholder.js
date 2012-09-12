// Generated by CoffeeScript 1.3.3
(function() {
  var $;

  $ = jQuery;

  $.fn.placeholder = function(options) {
    var field_padding, pixels_to_int;
    pixels_to_int = function(pixels) {
      return parseInt(pixels.replace("px", ""));
    };
    field_padding = function($fld) {
      var result;
      result = {};
      $.each(["top", "left", "right", "bottom"], function(index, area) {
        result[area] = 0;
        return $.each(["margin", "border", "padding"], function(index, kind) {
          var selector;
          selector = "" + kind + "-" + area;
          if (kind === "border") {
            selector += "-width";
          }
          return result[area] += pixels_to_int($fld.css(selector));
        });
      });
      return result;
    };
    return this.each(function() {
      var $field, $label, active_ele, current_length, field_pos, field_surround, keystroke_handler, label_left, label_right, label_rightmost_left, label_top, name_or_id, opts, placeholder_text, read_value, tagname;
      opts = $.extend({}, $.fn.placeholder.defaults, options);
      $field = $(this);
      if ($field.data("placeholder_active")) {
        keystorke_handler();
        return;
      } else {
        $field.data("placeholder_active", true);
      }
      placeholder_text = $field.data("placeholder");
      if (placeholder_text) {
        name_or_id = $field.attr('id') || $field.attr('name');
        if (!name_or_id) {
          $field.attr('name', 'placeheld');
          name_or_id = 'placeheld';
        }
        $label = $(("<label class='placeholder' for='" + name_or_id + "'>") + placeholder_text + '</label>');
      } else {
        $label = $field.prev("label");
        placeholder_text = $label.text();
      }
      if (!placeholder_text) {
        return;
      }
      $field.parent().css({
        position: "relative"
      });
      $field.after($label);
      $label.css({
        position: "absolute"
      });
      field_pos = $field.position();
      field_surround = field_padding($field);
      label_top = field_pos.top + field_surround.top + opts.padding_top;
      label_left = field_pos.left + field_surround.left + opts.padding_left;
      label_right = field_pos.left + $field.outerWidth(true) - field_surround.right - opts.padding_right;
      label_rightmost_left = label_right - $label.outerWidth(true);
      if (label_rightmost_left < label_left) {
        label_rightmost_left = label_left;
        opts.slide = false;
      }
      if (!opts.slide) {
        opts.vanishing_length = 0;
      }
      current_length = 0;
      tagname = $field.get(0).tagName.toLowerCase();
      read_value = $field.val;
      if (!(tagname === "input" || tagname === "textarea")) {
        read_value = $field.text;
      }
      keystroke_handler = function(e) {
        current_length = read_value.call($field).length;
        if (e && e.type === "keypress") {
          current_length += 1;
        }
        if (current_length > opts.vanishing_length) {
          if (opts.slide) {
            return $label.fadeOut();
          } else {
            return $label.hide();
          }
        } else {
          return $label.show();
        }
      };
      $label.css({
        top: label_top,
        left: label_left
      }).mousedown(function(e) {
        e.preventDefault();
        if (opts.label_click) {
          opts.label_click.apply(this, e);
        }
        return $field.focus();
      });
      $field.addClass("placeholding").focus(function() {
        if (opts.slide) {
          return $label.stop().animate({
            left: label_rightmost_left
          }, opts.focus_speed);
        }
      }).blur(function() {
        if (!current_length && opts.slide) {
          return $label.stop().animate({
            left: label_left
          }, opts.blur_speed);
        }
      }).bind("keyup keypress", keystroke_handler);
      keystroke_handler();
      active_ele = document.activeElement;
      if (active_ele ? active_ele === this : void 0) {
        return $field.focus();
      }
    });
  };

  $.fn.placeholder.defaults = {
    focus_speed: 600,
    blur_speed: 600,
    padding_top: 0,
    padding_left: 1,
    padding_right: 0,
    padding_bottom: 0,
    vanishing_length: 5,
    slide: true,
    wrapper_class: 'placeheld',
    holder_class: 'placeholder',
    holdee_class: 'placeholding',
    label_click: null
  };

}).call(this);
