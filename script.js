// Pine Box: https://www.eventbrite.com/venue/api/feeds/venue/426.json Pete's
// https://www.eventbrite.com/venue/api/feeds/venue/424.json
// squarespace image links are /s/

const bandImages = new Array()
bandImages[0] = '/s/img1.jpg'
bandImages[1] = '/s/img2.jpg'
bandImages[2] = '/s/img3.jpg'
bandImages[3] = '/s/img4.jpg'
bandImages[4] = '/s/img5.jpg'
bandImages[5] = '/s/img6.jpg'
bandImages[6] = '/s/img7.jpg'
bandImages[7] = '/s/img8.jpg'
bandImages[8] = '/s/img9.jpg'
bandImages[9] = '/s/img10.jpg'
bandImages[10] = '/s/img11.jpg'

$
  .getJSON('https://www.eventbrite.com/venue/api/feeds/venue/424.json', (data) => {
    // create a global array that stores every date
    const dateArray = []
    // this counter keeps track of the iterations.  This is used to determine
    // whether the same date text has already been rendered.
    let dateArrayCounter = 0

    // populate the dateArray with dates from the JSON feed
    $.each(data, (key, val) => {
      dateArray.push(val.starts_at)
    })

    // these variable are for making sure "today" is the first date to be listed, as
    // the JSON feed often incorrectly lists yesterday as the first date.
    let today = new Date()
    today = moment.utc(today).format('YYYY-MM-DD')
    const yesterday = moment.utc(today).subtract(1, 'day').format('YYYY-MM-DD')

    // the first addition to "output"
    let output = '<div class="queue-events-wrapper layout-standard"><ul id="queue-event-list" class="queue-events">'

    // loop through each item in json feed and create html
    $.each(data, (key, val) => {

      if (val.starts_at == yesterday) {
        dateArrayCounter++
        return true
      }
      // format the starts_at value to display a better output (using moment.js)
      const myDate = moment.utc(val.starts_at).format('MMMM Do (dddd)')

      output += '<li class="queue-event">'
      // date overlay
      if (dateArray[dateArrayCounter] !== dateArray[dateArrayCounter - 1]) {
        output += '<div class="newDateArea">'
        output += myDate
        // end newDateArea div
        output += '</div>'
      }
      
      dateArrayCounter++
      output += '<div class="figure">'
      // fancybox link:
      if (val.poster !== null) {
        output += '<a data-fancybox href="'
        output += val.poster
        output += '"><img class="lazyload" data-original="'
        output += val.poster
        output += '" /></a>'
        // end figure div
        output += '</div>'
      }
      else {
        // local address for Pete's image is petes.jpg squarespace address is
        // /s/petes.jpg
        const randomNum = Math.floor(Math.random() * bandImages.length)
        output += '<a data-fancybox href="'
        output += bandImages[randomNum]
        output += '"><img class="lazyload" data-original="'
        output += bandImages[randomNum]
        // end figure div
        output +=  '"/></a></div>'
      }

      output += '<div class="event-details">'
      output += '<div class="header">'
      if (val.external_url !== null) {
        output += '<h3 class="title event-title"><a href="'
        output += val.external_url
        output += '" target="_blank">'
        output += val.title
        // end header div
        output += '</a></h3></div>'
      }
      else {
        output += '<h3 class="title event-title">'
        output += val.title
        // end header div
        output += '</h3></div>'
      }
      output += '<div class="footer">'
      output += '<ol>'
      
      
      if (val.presents !== null) {
        output += '<a class="btn-details btn-primary" href="'
        output += 'http://www.eventbrite.com/e/'
        output += val.eventbrite_id
        output += '" target="_blank">Click Here To Buy Tickets</a>'
      }
      if (val.description !== null) {
        output += '<div class="description"><li>'
        output += val.description
        // end description div
        output += '</li></div>'
        // end footer div
        // output += '</div>'
      }


      if (val.external_url !== null) {
        output += '<div class="external-link"><li><a href="'
        output += val.external_url
        // end external-link div
        output += '">Go to artist website</a></li></div>'
      }
      // end footer div, end 
      output += '</ol></div></div>'
    })
    // end queue-events-wrapper div
    output += '</ul></div>'

    // render to the DOM
    $('#update').html(output)
    // add the readmore element
    $('.description').readmore({moreLink: '<a href="#" class="readMoreLink">Read more </a>', lessLink: '<a href="#" class="readLessLink">Close</a>', embedCSS: false, collapsedHeight: 200})
    $('img.lazyload').lazyload()
  })
