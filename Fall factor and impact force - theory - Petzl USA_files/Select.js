// Select component
$.Select = function(){

	$(".InputSelect").each(function(index, element){
		var $select = $('select', element);

		// On change, update the custom input
		$select.change(function(event){
            $('.InputSelect_value', element).text($('option:selected', event.target).text());
		});

		// Select element with "selected" attribute by default
        $select.find('option').each(function(oIndex, oElement){
            if($(oElement).attr('selected')){
                $('.InputSelect_value', element).text($(oElement).text());
            }
        });
	});
};