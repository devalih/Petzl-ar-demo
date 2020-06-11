var that = {
	universId : $('#universId').text(),
	//language : $.cookie('apex__language'),
	language : $('#languageNameCode').text(),
	universName : $('#universName').text(),
	//HK FAQ
	universParentName : $('#universParentName').text(),
	//country : $.cookie('apex__country'),
	country : $('#coutryNameCode').text(),

	compileDustTemplates : function () {
		var removeSpaces = function (s) {  
			return s.replace(/^[\t]+|[\t ]+$|[\n\r]+/gm, '').replace(/[\t ]{2,}/gm, ''); 
		};

		$('script[type="text/dust-template"]').each(function () { dust.compileFn(removeSpaces(this.innerHTML), this.id); });
	},

	dustRender : function (template, data, container, callback) {
		dust.render(
	   		template,
	   		data,
	   		function (e, html) {
	            if (e) {
	            	console.error(e, html, template, data);
					return;
				}
		   		if (container) {
					container.append(html);
				}
		   		
		   		if (callback) {
					callback();
				}
	   		}
	   	); 
	}
}
 
window.UTILS = that;