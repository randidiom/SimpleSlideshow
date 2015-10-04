/* 
 * The MIT License
 *
 * Copyright 2015 randidiom
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


/**
 * The Slide object contains image, description and allows to
 * display/hide it easily with animation.
 * 
 * @param {jQuery_Image} image
 * @param {jQuery_Div} description
 * @param {jQuery_Div} groupDiv
 * @returns {Slide}
 */
var Slide = function (image, description, groupDiv) {
    this.image = image;
    this.description = description;
    this.groupDiv = groupDiv;
    
    /**
     * Time used for fading between images
     */
    this.effectTime = 700;
};

Slide.prototype.show = function () {
    this.groupDiv.fadeIn(this.effectTime);
};

Slide.prototype.hide = function () {
    this.groupDiv.fadeOut(this.effectTime);
};


/**
 * Creates a Slideshow object from a given slideshow divID's content.
 * 
 * @param {String} divID
 * @returns {undefined}
 */
var Slideshow = function (divID) {
    /**
     * List of all {slides}
     */
    this.allSlides = [];
    
    /**
     * Current slide number
     */
    this.curSlide = 0;
    
    /**
     * last change was nextSlide(+1) or previousSlide(-1)
     */
    this.lastDirection = 1;
    
    
    
    try {
        var panels = $('#' + divID + '>div');
        var thisSlideshow = this;

        panels.each(function () {
                var jQueryThis = $(this);
                var slide = new Slide(jQueryThis.find('img').first(),
                                      jQueryThis.find('div').first(),
                                      jQueryThis);


                slide.hide();
                thisSlideshow.allSlides.push(slide);
            });

        this.allSlides[0].show();
        
        //configure the slideshow panel
        var panel = $('#' + divID);
        this.addControls(panel);
        panel.css('display', 'block');
    } catch (err)
    {
        console.warn('Slideshow initialization failed with error:\n'+err);
    }
};

/**
 * Adds controls to panel, registers event handlers and initializes 
 * slideshow control logic.
 * 
 * @param {jQuery_Div} panel
 * @returns {undefined}
 */
Slideshow.prototype.addControls = function (panel) {
    var _this = this;
    
    panel.append(
        '<div id="slideshow-arrow-left" style="display: none">&lt;</div>'+
        '<div id="slideshow-arrow-right" style="display: none">&gt;</div>');
    
    
    panel.hover(
        function () {
            $('#slideshow-arrow-left').fadeIn(500);
            $('#slideshow-arrow-right').fadeIn(500);
        },
        function () {
            $('#slideshow-arrow-left').fadeOut(500);
            $('#slideshow-arrow-right').fadeOut(500);
        }
    );

    $('#slideshow-arrow-left').click(function() {
        _this.previousSlide();
    });

    $('#slideshow-arrow-right').click(function() {
        _this.nextSlide();
    });
    
    this.timer = setInterval(function () {
        _this.changeSlide(_this.lastDirection);
    }, 6500);
};

/**
 * Changes the displayed slide to the previous slide.
 * 
 * @returns {undefined}
 */
Slideshow.prototype.previousSlide = function () {
    this.lastDirection = -1;
    this.changeSlide(-1);

};

/**
 * Changes the displayed slide to the next slide.
 * 
 * @returns {undefined}
 */
Slideshow.prototype.nextSlide = function () {
    this.lastDirection = 1;
    this.changeSlide(1);
};

/**
 * Jumps the number of slides given by direction (forward +x/backwards -x)
 * 
 * (requires: Math.abs(direction) <= this.allSlides.length)
 * 
 * @param {int} direction
 * @returns {undefined}
 */
Slideshow.prototype.changeSlide = function (direction) {
    this.allSlides[this.curSlide].hide();
    
    this.curSlide = (this.curSlide + this.allSlides.length + direction) % 
                        this.allSlides.length;
                
    this.allSlides[this.curSlide].show();
};




$(document).ready(function () {
    new Slideshow('slideshow');
});

