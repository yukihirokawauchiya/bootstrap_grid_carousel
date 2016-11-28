(function( $ ) {
  "use strict";
  var settings;
  var elem_map = {};
  var rtimer = false; // timer for resize

  $.fn.grid_carousel = function(options) {
    settings = $.extend(true, {
      'interval': 5000,
      'grid': 12,
      'col': {
        'xs' : 1,
        'sm' : 2,
        'md' : 3,
        'lg' : 4, }
    }, options);

    var _this = $(this);
    init(_this);
  };

  var init = function (car) {
    set_item_container(car);
    set_slid_process(car);

    $(window).resize(function(){if(rtimer !== false){clearTimeout(rtimer);}rtimer=setTimeout(function(){
      // set_indicator(car);
      set_carousel_items(car);
    },200);});

    car.carousel({interval: settings.interval});
  }

  var set_slid_process = function (car) {
    elem_map[car.attr('id')] = [];
    var elems = car.find('.item > .row > div');

    for (var i = 0; i < elems.length; i += 1) {
      var tmp = elems.eq(i).clone().removeClass('hidden-xs').removeClass('hidden-sm').removeClass('hidden-md').removeClass('hidden-lg');
      elem_map[car.attr('id')][i] = $.trim($('<div>').append(tmp).html().replace(/(\s+|\t|\n)/g, ' ').replace(/>\s</g, '><'));
    }

    set_carousel_items(car);
    set_indicator(car);
    car.on('slid.bs.carousel', function() {
      set_carousel_items(car);
    });
  }

  var set_indicator = function (car) {
    var indi_container = car.find('.carousel-indicators:first'),
        indis = indi_container.find('li'),
        item_length = car.find('.item').length,
        loop_count = (indis.length > item_length) ? indis.length : item_length;

    if (indi_container.length) {
      for (var i = 0; i < loop_count; i += 1) {
        if (i < item_length && ! indis.eq(i).length) {
          indi_container.append(indis.eq(0).clone().removeClass('active').attr('data-slide-to', i));
        } else if (i >= item_length && indis.eq(i).length) {
          indis.eq(i).remove();
        }
      }
    }
  }

  var set_carousel_items = function (car) {
    var env = findEnv(),
        curr_item = car.find('div.item.active:first'),
        tmp_next = curr_item.next(),
        next_item = (tmp_next.length) ? tmp_next : curr_item.siblings(':first'),
        next_row = next_item.children('.row:first'),
        tmp_prev = curr_item.prev(),
        prev_item = (tmp_prev.length) ? tmp_prev : curr_item.siblings(':last'),
        prev_row = prev_item.children('.row:first'),
        item_first_elem_id = car.find('div.item.active > .row:first > div:first').data('elem-id');

    next_row.empty();
    for (var i = 0; i < settings.col.lg; i += 1) {
      var sum = item_first_elem_id + settings.col[env] + i,
          next_num = (elem_map[car.attr('id')].length > sum) ? sum : sum % elem_map[car.attr('id')].length,
          tmp = $(elem_map[car.attr('id')][next_num]);

      if (i >= settings.col.xs) tmp.addClass('hidden-xs');
      if (i >= settings.col.sm) tmp.addClass('hidden-sm');
      if (i >= settings.col.md) tmp.addClass('hidden-md');
      if (i >= settings.col.lg) tmp.addClass('hidden-lg');
      next_row.append(tmp);
    }

    prev_row.empty();
    for (var i = 0; i < settings.col.lg; i += 1) {
      var sum = item_first_elem_id - settings.col[env] + i,
          prev_num = (0 <= sum) ? sum : elem_map[car.attr('id')].length + sum,
          tmp = $(elem_map[car.attr('id')][prev_num]);

      if (i >= settings.col.xs) tmp.addClass('hidden-xs');
      if (i >= settings.col.sm) tmp.addClass('hidden-sm');
      if (i >= settings.col.md) tmp.addClass('hidden-md');
      if (i >= settings.col.lg) tmp.addClass('hidden-lg');
      prev_row.append(tmp);
    }
  }

  var set_item_container = function (car) {
    var items = car.find('.item'),
        item_count = items.length,
        indicators = car.find('ol.carousel-indicators > li'),
        item_strs = [];

    for (var i = 0; i < items.length; i += 1) {
      var item = items.eq(i);
      item_strs.push(item.html().replace(/(\s+|\t|\n)/g, ' ').replace(/>\s</g, '><'));
    }

    var class_str = '';
    class_str += 'col-xs-' + (settings.grid / settings.col.xs);
    class_str += ' col-sm-' + (settings.grid / settings.col.sm);
    class_str += ' col-md-' + (settings.grid / settings.col.md);
    class_str += ' col-lg-' + (settings.grid / settings.col.lg);

    for (var i = 0; i < items.length; i += 1) {
      item = items.eq(i);
      if (item_strs.length > 0) {
        var tmp = '<div class="row">';
        for (var j = 0; j < settings.col.lg; j += 1) {
          var hidden_str = '';
          if (j >= settings.col.xs) hidden_str += ' hidden-xs';
          if (j >= settings.col.sm) hidden_str += ' hidden-sm';
          if (j >= settings.col.md) hidden_str += ' hidden-md';
          if (j >= settings.col.lg) hidden_str += ' hidden-lg';

          tmp += '<div class="' + class_str + hidden_str + '" data-elem-id="' + (item_count - item_strs.length) + '">';
          tmp += item_strs.shift();
          tmp += '</div>';
          if (item_strs.length == 0) break;
        }
        tmp += '</div>';
        item.html(tmp);
      } else {
        item.remove();
      }
    }

    if (car.find('.item').length == 2) {
      car.find('.carousel-inner:first').append(car.find('.item:last').clone().empty().append('<div class="row"></div>'));
    }
  }

  function findEnv() {
    var envs = ['xs', 'sm', 'md', 'lg'];
    var $el = $('<div>');

    $el.appendTo($('body'));

    for (var i = envs.length - 1; i >= 0; i--) {
      var env = envs[i];

      $el.addClass('hidden-' + env);
      if ($el.is(':hidden')) {
        $el.remove();
        return env;
      }
    }
  }

})( jQuery );
