/* emulate loading of education block*/
(function ($) {
    setTimeout(function () {
        $('#education .loader').hide();
        $('#education>ul').show(500);
        $('#education').addClass('loaded');
    }, 5000);
})(jQuery);

(function ($) {
    $('#add-skill-btn').click(function () {
        $('#add-skill').toggle(500);
    });
})(jQuery);

(function ($) {
    $('body>nav .toggle-menu').click(function () {
        $('body').toggleClass('hide-menu');
    });
})(jQuery);

(function ($) {
    $('#portfolio .tags li').click(function (e) {
        e.preventDefault();
        $('#portfolio .tags li').removeClass('active');
        $(this).addClass('active');

        var tag = $(this).data('tag');
        if (tag == undefined || tag == "") {
            $('#portfolio .portfolio article').show(500);
            return;
        }

        $('#portfolio .portfolio article:not([data-tag=' + tag + '])').hide(500);
        $('#portfolio .portfolio article[data-tag=' + tag + ']').show(500);
    });
})(jQuery);

(function ($) {
    $(window).scroll(function () {
        $('main section').each(function (i) {
            var windscroll = $(window).scrollTop();
            if ($(this).position().top <= windscroll) {
                $('nav a.active').removeClass('active');
                $('nav a').eq(i).addClass('active');
            }
        });
    }).scroll();

    $('nav ul a').on('click', function() {

        var scrollAnchor = $(this).attr('href'),
            scrollPoint = $(scrollAnchor).offset().top;

        $('body,html').animate({
            scrollTop: scrollPoint
        }, 500);

        return false;

    });
})(jQuery);

(function($) {
    $('.to-top').click(function (e) {
        e.preventDefault();
        $('body,html').animate({
            scrollTop: 0
        }, 500);
    });
})(jQuery);

(function ($) {
    $('#skills ul.skills li').each(function () {
        prepareSkill($(this).find('article'));
    });

    $('#add-skill').submit(function (event) {
        event.preventDefault();
        if (!this.checkValidity()) {
            return;
        }

        var skillName = $('#skill-name').val();
        var skillRange = +$('#skill-range').val();
        if (skillRange < 10) {
            skillRange = 10;
        } else if (skillRange > 100) {
            skillRange = 100;
        }


        var skill = $('#skills ul.skills li').first().clone();
        skill.find('article').text(skillName);
        skill.find('article').attr('data-value', skillRange);
        $('#skills ul.skills').append(skill);
        prepareSkill(skill.find('article'));
    });

    function prepareSkill($itemArticle) {
        var range = $itemArticle.data('value');
        $itemArticle.css('width', range + '%');
    }
})(jQuery);