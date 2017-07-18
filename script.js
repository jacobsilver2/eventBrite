// Pine Box: https://www.eventbrite.com/venue/api/feeds/venue/426.json
// Pete's https://www.eventbrite.com/venue/api/feeds/venue/424.json

//create a global array that stores every date
$.getJSON("https://www.eventbrite.com/venue/api/feeds/venue/424.json", function(data) {
    //populate the dateArray with dates from the JSON feed
    var dateArray = [];
    $.each(data, function(key, val) {
    dateArray.push(val.starts_at);
      });

    var dateArrayCounter = 0;
    var output = '<div class="queue-events-wrapper layout-standard"><ul id="queue-event-list" class="queue-events">';

    //loop through each item in json feed and create html
    $.each(data, function(key, val) {
        //format the starts_at value to display a better output using moment.js
        var myDate = moment.utc(val.starts_at).format("MMMM Do (dddd)");
        output += '<li class="queue-event">';
        //date overlay
        if ((dateArray[dateArrayCounter]) !== (dateArray[dateArrayCounter - 1])) {
            output += '<div class="newDateArea">';
            output += myDate;
            output += '</div>';
        }
        dateArrayCounter++;
        output += '<div class="figure">';
        //fancybox link:
        if (val.poster !== null) {
            output += '<a data-fancybox href="';
            output += val.poster;
            output += '"><img src="';
            output += val.poster;
            output += '" /></a>';
            output += '</div>';
        } else {
            //using the image address for the squarespace image
            output += '<a data-fancybox href="/s/petes.jpg"><img src="/s/petes.jpg" /></a></div>';
        }
        output += '<div class="event-details">';
        output += '<div class="header">';
        if (val.external_url !== null) {
            output += '<h3 class="title event-title"><a href="';
            output += val.external_url;
            output += '" target="_blank">';
            output += val.title;
            output += '</a></h3></div>';
        } else {
            output += '<h3 class="title event-title">';
            output += val.title;
            output += '</h3></div>';
        }
        output += '<div class="footer">';
        output += '<ol>';
        if (val.description !== null) {
            output += '<li class="description">';
            output += val.description;
        }
        output += '</li></ol></div></div>';
    });
    output += '</ul></div>';
    //render to the DOM
    $('#update').html(output);
    //add the readmore element
    $('.description').readmore({
        moreLink: '<a href="#" class="readMoreLink">Read more </a>',
        lessLink: '<a href="#" class="readLessLink">Close</a>',
        embedCSS: false,
        collapsedHeight: 30,
    });
    jQuery(function($) {
        // Grab whatever we need to paginate
        var pageParts = $(".queue-event");
        // How many parts do we have?
        var numPages = pageParts.length;
        // How many parts do we want per page?
        var perPage = 30;
        // When the document loads we're on page 1
        // So to start with... hide everything else
        pageParts.slice(perPage).hide();
        // Apply simplePagination to our placeholder
        $(".page-nav").pagination({
            items: numPages,
            itemsOnPage: perPage,
            displayedPages: 3,
            // prevText: myMonth,
            // nextText: '',
            cssStyle: "dark-theme",
            // We implement the actual pagination
            //   in this next function. It runs on
            //   the event that a user changes page
            onPageClick: function(pageNum) {
                // Which page parts do we show?
                var start = perPage * (pageNum - 1);
                var end = start + perPage;
                // First hide all page parts
                // Then show those just for our page
                pageParts.hide()
                    .slice(start, end).show();
            }
        });
    });
});
