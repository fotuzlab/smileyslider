(function( $ ){
  var MIN = 0;
  var MAX = 10;
  
  function moveSmileyForVal(slider, val) {
    var smiley = slider.data('smiley');
    var width = slider.width() - smiley.width();
    var x = (val/MAX)*width;
    smiley.css({'left': x});
    moveMouth(slider, val);
  }
  
  function moveSmileyForX(slider, x) {
    var smiley = slider.data('smiley');
    var width = slider.width() - smiley.width();
    if (x > width) x = width;
    if (x < 0) x = 0;
    smiley.css({'left': x});
    
    var val = Math.round((x/width)*MAX);
    moveMouth(slider, val);
  }
  
  function moveMouth(slider, val) {
    slider.data('value', val);
    var command, direction, radius, y = 25, x = 11, width = 28;

    if (val == (MAX-MIN)/2) {
      y = 25 + ((11-val)*1);
      command = 'M ' + x + ' ' + y + ' L ' + (x+width) + ',' + y;
    } else {
      if (val > (MAX-MIN)/2) {
        direction = 0;
        radius = (14 - val) * 4;
        y = 25 + ((11-val)*1);
      } else {
        direction = 1;
        radius = (val+4) * 4;
        y = 25 + ((11-val)*1);
      }
      command = 'M ' + x + ' ' + y + ' a ' + radius + ',' + radius + ' 0 0,' + direction + ' ' + width + ',0';
    }
    var mouth = slider.data('mouth');
    mouth.attr('path', command);
  }
  
  var methods = {
    init: function(options) {
      var width = 50;
   
      this.css({height: width + 'px', width: '200px', background: '#eee', '-webkit-border-radius': '2em', position: 'relative'});   
      var smiley = $('<div class="smileyslider-smiley"></div>');
      smiley.css({cursor: 'pointer', width: width + 'px', height: width + 'px', position: 'absolute'});
      this.append(smiley);
      this.data('smiley', smiley);

      var paper = Raphael(smiley[0], width, width);
      var face = paper.circle(width/2, width/2, (width/2-5)).attr("fill", "#fff300").attr("stroke", "#000");
      var eyeL = paper.circle(width/2 - 8, width/2 - 5, Math.floor(width/15)).attr('fill', '#000');
      var eyeR = paper.circle(width/2 + 8, width/2 - 5, Math.floor(width/15)).attr('fill', '#000');
      var mouth = paper.path('M 16 35 a 20,20 0 0,0 16,0');
      this.data('mouth', mouth);
      
      var slider = this;
      smiley.mousedown(function(event) {
        slider.data('dragging', true);
        document.onselectstart = function(){ return false; }
      });

      $('body').mousemove(function(event) {
        if (slider.data('dragging')) {
          var newX = event.pageX - slider.offset().left;
          moveSmileyForX(slider, newX);
        }
      });

      $('body').mouseup(function(event) {
        slider.data('dragging', false);
        document.onselectstart = function(){ return true; }
      });

      moveSmileyForVal(this, 5);
      return this;
    },
    val: function(v) { 
      return this.data('value');  
    }
  };
    
  $.fn.smileySlider = function(method) {
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
    }
  };

})( jQuery );
