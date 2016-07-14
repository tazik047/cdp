/* emulate loading of education block*/
(function ($) {
    setTimeout(function () {
        $('#education .loader').hide();
        $('#education>ul').show(500);
    }, 5000);
})(jQuery);

(function ($) {
    $('#add-skill-btn').click(function () {
        $('#add-skill').toggle(500);
    });
})(jQuery);

(function ($) {
    $('#skills ul.skills li').each(function() {
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
})(jQuery)