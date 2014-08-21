

// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
													question.owner.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};


// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {
		tagged: tags,
		site: 'stackoverflow',
		order: 'desc',
		sort: 'creation'
		};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
		});

	result
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};



// function showAnswerer() {
// 	var template = 
// }


function createTopAnswerers(displayName, linkURL, numAns, rep) {
	var template = $(".topAnswerers").clone();

	template.find(".name").text(displayName);
	template.find(".link").text(linkURL);
	template.find(".numAns").text(numAns);
	template.find(".rep").text(rep);
	template.css("display", "block");

	$(".results").append(template);

	console.log("fired createTopAnswers function");
}


function inspire(tags) {

	console.log("fired inspire with the " + tags + " parameter");

	var request = {
		tag: tags,
		period: 'all_time',
		site: 'stackoverflow',
		order: 'desc',
		sort: 'creation'
		};

	var result = $.ajax({
		// url: "http://api.stackexchange.com/2.2/tags/javascript/top-answerers/all_time",
		url: "http://api.stackexchange.com/2.2/tags/"+ request.tag +"/top-answerers/" + request.period,
		data: request,
		dataType: "json",
		type: "GET",
	})
	.done(function(){

		console.log(result.responseJSON.items[0]);
		// createTopAnswerers(1,2,3,4);


		for(var i = 0; i < result.responseJSON.items.length; i++) {

			var displayName = result.responseJSON.items[i].user.display_name;
			var link = result.responseJSON.items[i].user.link;
			var numAns = result.responseJSON.items[i].post_count;
			var rep = result.responseJSON.items[i].user.reputation;

			createTopAnswerers(displayName, link, numAns, rep);

			console.log(i);

		}

	});


}


$(document).ready( function() {

	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});

	$(".inspiration-getter").on("submit", function(){
		console.log("hello");
		$(".results").empty();

		var tags = $(this).find("input[name='answerers']").val();
		inspire(tags);
		

	});

});