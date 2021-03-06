jQuery(document).ready(function($) {
	/**
	 * Get the value of a cookie
	 * Source: https://gist.github.com/wpsmith/6cf23551dd140fb72ae7
	 * @param  {String} name  The name of the cookie
	 * @return {String}       The cookie value
	 */
	var getCookie = function (name) {
		var value = "; " + document.cookie;
		var parts = value.split("; " + name + "=");
		if (parts.length == 2) return parts.pop().split(";").shift();
	};
	var thisCookie = getCookie('pmpro_lpv_count');
	if (thisCookie == null) {
		count = 0;
		limit = 5;
	} else {
		var cookieArray = thisCookie.split("|");
		var count = Number(cookieArray[1]);
		var limit = cookieArray[2];
	}
	if ( isNaN(count) ) {
		count = 0;
	}
	// if ( count == 0 ) {
		// $('#lpv-footer').css( 'display','none'); 
	// } else {
		// $('#lpv-footer').css( 'display','block'); 
	// } 
	$.ajax({
		type: "POST",
		url: lpv_diagnostics_object.lpv_diagnostics_ajaxurl,
		data: {
			// Variables defined from form 
			action      : 'tie_into_lpv_diagnostics',
			serialize   : $('#lpv-diagnostics-form').serialize(),
			hidden      : $('input[name=hidden]').val(),
			token       : $('input[name=token]').val(),
			expires     : $('input[name=expires]').val(),

			// Localized stuff lpv_diagnostics_action
			userlevel    : lpv_diagnostics_object.lpv_diagnostics_user_level,
			cookie_values: lpv_diagnostics_object.lpv_diagnostics_cookie_values,
			limit        : lpv_diagnostics_object.lpv_diagnostics_limit,
			redirect     : lpv_diagnostics_object.lpv_diagnostics_redirect,
			phpexpire    : lpv_diagnostics_object.lpv_diagnostics_php_expire,
			response     : lpv_diagnostics_object.lpv_diagnostics_action,

			// Admin stuff
			script_name  : 'lpv-diagnostics.js',
			ajaxurl      : lpv_diagnostics_object.lpv_diagnostics_ajaxurl,
			nonce        : lpv_diagnostics_object.lpv_diagnostics_nonce,
		},
		// dataType: "JSON",
		success:function( data ) {
			// $('.modal-body').html(data).css({'color':'salmon'});
			var obj = JSON.parse(data);
			var d = new Date(obj.phpexpire);
			var exp = d.toUTCString();

			elem = $('body');
			if (elem.hasClass('single')){
				var upcount = Number(count) + Number(1);
			} else {
				var upcount = count;
			}
			if ( obj.limit == upcount ) {
				var upcount = 0;
			}
			var lpv_array = obj.userlevel + '|' + upcount + '|' + obj.limit;
			console.log( data );
			var remaining = obj.limit - upcount;
			document.cookie="pmpro_lpv_count=" + lpv_array + '; expires=' + exp + ';path=/';

			$('#data-returned').html('Need to calculate expiration<br>Set cookie at 0, separately increment<br>Cookie Set ' + "pmpro_lpv_count=" + upcount + '; expires=' + exp );
			// if ( upcount == 0 ) {
			if ( upcount > 0 ) {
				$('#lpv_count').html(remaining);
				$('#lpv_limit').html(obj.limit);
			}  else {
				$('#lpv_count').html(obj.limit);
				$('#lpv_limit').html(obj.limit);
			}
			if ( 1 == remaining && 'footer' == obj.response ) {
				$('#lpv-footer').css({'padding':'10rem 0','font-size':'3rem',}).append('response ' + obj.response);
				$('#footer-break').css({'display':'block'}).delay(1500);
			}
			if ( 1 == remaining && 'popup' == obj.response ) {
				$('.modal').css({'display':'block'});
			}
			 // else {
				// $('#lpv-footer').css( 'display','none'); 
			// }
			// window.location = obj.redirect;
		},
		error: function( jqXHR, textStatus, errorThrown ){
			console.log( errorThrown );
		}
	});
	// });
});