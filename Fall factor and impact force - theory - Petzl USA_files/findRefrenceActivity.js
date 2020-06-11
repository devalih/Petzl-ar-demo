
var loadReference = function (){

	
	var map = new Object();
	//var set = [];
	var pageName = $('#PageName').text();
	var options = $('.theForm select option'); 
	if ( options.length == 0  ){
		setTimeout(function(){loadReference();},500);
	}
	else {
		
		var translatedReferences = [];
		$('.theForm select option').each(
			function(index,elem){
				var name = $(elem).attr('value');
				var label =  $(elem).text();
				if (name != ''){
					map[name]=label;
				}
				//map[name]= label ;
			}
		);
					
		var currentReferences = {};
		$('#theGoods .radio span , #theGoods span').each (function (index, elem){
			var t = $(elem).text();
			if (t in map)
				translatedReferences.push({"legend":map[t],"title":t.replace(/ /g,'_'),"url":""});
		});
		
		
			
		
		if (pageName == 'Activity'){
			
			/*Web_ActivityDetail.searchForReferences(map,set,  function(result, event) {
				
				if(event.status){
				
		*/
			UTILS.dustRender('tmpl_reference',translatedReferences, $('#referenceList'));	
			
			var activityCtrl = new petzl.controllers.Activity;
			layout.listener();

				/*}
			},
			{escape:false});*/
		}
		else if (pageName == 'Technical'){
			/*Web_TechnicalContent.searchForReferences(map,set,  function(result, event) {
				if(event.status){*/
					
			$('.technicalContentRight .technicalMenu p.menuTitle ').each(function(index, elem){
				var newName = translatedReferences[index].legend;
				if ($(elem).parent().hasClass('closed'))
					$(elem).html('<span class="sprite inlineblock bigArrowBottom" style="-webkit-transform: rotate(-90deg);"></span> ' + newName);
				else
					$(elem).html('<span class="sprite inlineblock bigArrowBottom" style="-webkit-transform: rotate(0deg);"></span> ' + newName);
				$(elem).show();
			});
				/*}
	
			},
			{escape:false});*/
		}
		else{
			/*Web_Product.searchForReferences(map,set,  function(result, event) {
				if(event.status){
					*/	
					var i =0;

					$('.productExperience .productExperienceContainer .productExperienceColumn h3 ').each(function(index, elem){
						var newName = translatedReferences[index].legend;
						$(elem).text(newName);
						$(elem).show();
						i++;
					});
				/*}
	
			},
			{escape:false});*/
		
		}
	}
}
function pictoClick(){
	$('.pictoPhoto').click(function(){
			// On récupère la taille selon si c'est ouvert ou fermé
			var width = $(this).hasClass('opened') ? 32 : $(this).parent().find('.copyrightContent').data('width');
			var padding = $(this).hasClass('opened') ? 0 : $(this).parent().find('.copyrightContent').data('padding');
			var opacity = $(this).hasClass('opened') ? 0 : 1;
			
			// On anime
			$(this).parent().find('.copyrightContent').stop().animate({
				width : width + 10,
				padding : padding,
				opacity  : opacity
			});
			
			// On toggle la classe opened
			$(this).toggleClass('opened');
		});
}


function SearchReference (){
	UTILS.compileDustTemplates();
	loadReference();
	pictoClick();
}