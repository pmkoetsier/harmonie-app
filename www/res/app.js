function stem(kleur) {
    var $stem_scherm = $("<div>", {id: "stem_scherm", style: "height: 100%; width: 100%; background-color: "+kleur+"; z-index: 9999; position: absolute; top: 0;"});
    var $sluit_knop = $("<a>", {href: "#"});
    $($sluit_knop).append("Sluiten");
    $($stem_scherm).append($sluit_knop);
    $("#harmonie_body").append($stem_scherm);
    window.scrollTo(0, 0);
}

$( document ).ready(function() {
	$("button#back").on("click", function() {
        window.location = 'index.html';
    });
    $("#harmonie_body").on("click", "div#stem_scherm", function() {
        $(this).remove();
    });
    $(".stemmen, .menu_stemmen").on("click", function() {
        $('#stem_modal').modal('show');
    });

    // Retrieve
    if (localStorage.getItem("nieuwbrief_popup") == "1") {
        //Nieuwsbrief-popup al gehad...
    } else {
        //Nieuwsbrief-popup nog niet gehad!
        localStorage.setItem("nieuwbrief_popup", "1");
        $('#nieuwsbrief_modal').modal('show');
    }
    
    jQuery(function() {
        jQuery.getFeed({
            url: 'http://deharmoniebarneveld.nl/?cat=10&feed=rss2',
            //url: 'http://',
            success: function(feed) {
                
                var html = '';
                
                for(var i = 0; i < feed.items.length && i < 3; i++) {
                
                    var item = feed.items[i];
                    
                    html += '<div class="nieuwsitem"><h4>'
                    + item.title
                    + '</h4>';
                    
                    html += '<div class="updated">'
                    + item.updated
                    + '</div>';
                    
                    html += '<div>'
                    + item.description.substring(0,24)+"..."
                    + '</div></div>';
                }
                
                localStorage.setItem("nieuwsberichten", html);
                jQuery('#nieuwsberichten').append(html);
            },
            error: function(feed) {
                var html = localStorage.getItem("nieuwsberichten");
                var html = 'test123';
                jQuery('#nieuwsberichten').append(html);
            }   
        });

    });
    
    $('#nieuwsbrief_modal .btn-success').click(function() {
    	setTimeout(function(){ 
    		$('#nieuwsbrief_modal .input-group:first').after('<span class="text-danger" id="nieuwsbrief_msg">De server laat op zich wachten. Probeer het later nog eens!</div>');
    		setTimeout(function(){ 
    			$('#nieuwsbrief_modal').modal('hide');
    			$('#nieuwsbrief_modal button').prop('disabled', false);
    			$('#nieuwsbrief_msg').remove(); 
    		}, 3000); 
    	}, 8000);
    	var email = $('#nieuwsbrief_modal input:first').val();
    	
    	$('#nieuwsbrief_modal button').prop('disabled', true);
    	
    	$.post('http://www.famouslast.net/meistro/res/server.php', {'email': email}, function(data) {
    		data = $.parseJSON(data);
    		$('#nieuwsbrief_modal button').prop('disabled', false);
    		$('#nieuwsbrief_msg').remove();
    		if (data.success) {
    			$('#nieuwsbrief_modal .input-group:first').after('<span class="text-success" id="nieuwsbrief_msg">'+data.message+'</div>');
    			setTimeout(function(){ $('#nieuwsbrief_modal').modal('hide'); }, 1000);
    		} else {
    			$('#nieuwsbrief_modal .input-group:first').after('<span class="text-danger" id="nieuwsbrief_msg">'+data.message+'</div>');
    		}
    	});
    });
});

$( window ).resize(function() {
  var height = $('#menu_img1').height();
  var stemheight = $('div.menu>img.menu_stemmen').height();
  $('body').css('height', (height*2+100+stemheight));
});