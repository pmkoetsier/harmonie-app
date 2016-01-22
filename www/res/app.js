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
    $('#myTabs a').click(function (e) {
        e.preventDefault()
        $(this).tab('show')
    })

	//Nieuwsberichten inladen
	$.getFeed({
		url: 'http://deharmoniebarneveld.nl/?cat=10&feed=rss2',
		success: function(feed) {
			
			var html = '';
			
			for(var i = 0; i < feed.items.length && i < 3; i++) {
			
				var item = feed.items[i];

				var updated = new Date(item.updated);

				html += '<a href="'
				+ 'javascript: $(\'#nieuwsmodal' + i + '\').modal()'
				+ '"><div class="nieuwsitem"><h2>'
				+ item.title
				+ '</h2>';
				
				html += '<div class="updated">'
				+ updated.getDate() + "-" + (updated.getMonth() + 1) + "-" + updated.getFullYear()
				+ '</div>';
				
				html += '<div>'
				+ item.description.substring(0,50)+"..."
				+ '</div></div></a>';
				
				html += 
				 '<div class="modal" id="nieuwsmodal' + i + '" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">'
				+ '  <div class="modal-dialog" role="document">'
				+ '	<div class="modal-content">'
				+ '	  <div class="modal-header">'
				+ '		<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
				+ '		<h4 class="modal-title" id="myModalLabel">' + item.title + '</h4>'
				+ '	  </div>'
				+ '	  <div class="modal-body">'
				+ item.content
				+ '	  </div>'
				+ '	</div>'
				+ '</div>'
				+ '</div>';
			}
			
			localStorage.setItem("nieuwsberichten", html);
			$('#nieuwsberichten').html(html);
			
			$('.modal-body img').attr("height", "").attr("width", "");
			$( "p[style='text-align: center;'], h2[style='text-align: center;']").attr("style", "");
		},
		error: function(feed) {
			var html = localStorage.getItem("nieuwsberichten");
			if (html == null) {
				html = '<div class="nieuwsitem">'
				+ "Geen internetverbinding beschikbaar. Probeer het later nog eens."
				+ '</div>';
			}
			$('#nieuwsberichten').html(html);
		}   
	});
    
	//Handling van nieuwsbrief modal
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
    
    // Retrieve
    if (localStorage.getItem("nieuwbrief_popup") == "1") {
        //Nieuwsbrief-popup al gehad...
    } else {
        //Nieuwsbrief-popup nog niet gehad!
        localStorage.setItem("nieuwbrief_popup", "1");
        //$('#nieuwsbrief_modal').modal('show');
    }
});

$( window ).resize(function() {
  var height = $('#menu_img1').height();
  var stemheight = $('div.menu>img.menu_stemmen').height();
  $('body').css('height', (height*2+100+stemheight));
});

var getAgenda = function() {
	$.getFeed({
		url: 'http://deharmoniebarneveld.nl/?eme_rss=main&scope=future&order=ASC&category=&author=&contact_person=&limit=5&location_id=&title=',
		success: function(feed) {
			
			var html = '';
			
			for(var i = 0; i < feed.items.length && i < 3; i++) {
				var item = feed.items[i];

				html += ''
				//+ '<a href="'
				//+ item.link
				//+ '" target="_blank">'
				+ '<div class="nieuwsitem"><h2>'
				+ item.title
				+ '</h2>'
				
				html += '<div>'
				+ item.description
				+ '</div></div>'
				//+ '</a>'
			}
			
			localStorage.setItem("agenda", html);
			$('#agenda').html(html);
		},
		error: function(feed) {
			var html = localStorage.getItem("agenda");
			if (html == null) {
				html = '<div class="nieuwsitem">'
				+ "Geen internetverbinding beschikbaar. Probeer het later nog eens."
				+ '</div>';
			}
			$('#agenda').html(html);
		}   
	});
}