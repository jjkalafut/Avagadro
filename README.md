# Avogadro Presentation mode

The goal of this project is to create a web-based presentation console for presenting the scores out of the Avogaro scoring software, updated to take advantage of modern browser capabilities, where possible.

The rest of the Avogadro site uses jQuery (2.1.1) and Bootstrap (3.2.0), so both those libraries are fine to use. Feel free to utilize a web presentation framework like [deck.js](http://imakewebthings.com/deck.js/), [impress.js](http://bartaz.github.io/impress.js/#/title), [reveal.js](http://lab.hakim.se/reveal-js/#/) if you find one useful.

## Requirements

* Backwards compatible with IE 9 (and current version of Chrome, Firefox, or Safari)
  * Following [Microsoft's current guideline](http://support2.microsoft.com/gp/microsoft-internet-explorer) of supporting the most current version of IE on a specific OS, IE 9 is the oldest IE version targeted (excluding embedded OS's)
* Assume flaky internet connection: In many of the venues where academics are using these presentations, they may be on wireless networking that's spotty.
  * Cache the scoring results, so presentation can continue if internet drops
  * Periodically fetch for updated results, and if that fails, exponentially fade back the polling frequency
  * Allow a toggle for presenter to override poll timeout, force-checking for updated results
* Result data fetched from an API endpoint that will return a JSON-structured data object with the scores (sample in `js/results.json`).
  * JSON result is an Object with Properties for each event in the tournament (a unique "slug" name for each of them), and one `overall` entry.
  * Event objects have a `name` property for the full name of the Event, and a `result` property with an array of Team result objects
  * Events that are not yet complete will have their `result` property set to `null`, and should not be able to be presented.
  * Team objects have a `team` property containing the name of the Team.
    * Team objects for individual events may have a `students` property containing a string of student names who competed in that Event, for that Team.
    * Team objects for the Overall "event" have a `score` property that needs to be displayed along with their name
  * Team objects in the `result` array are in ascending place order; index zero is first place, index 1 is second place, index 2 is third place, etc. Each tournament might have a different number of places to show for each event/overall (typically top six places per event, and top ten overall scores).
* "Presenter" mode: manned presentation mode, where a presenter using a computer hooked up to a projector can have one browser on their local monitor to control the presentation, while a second browser window can be positioned (full-screen) on the projector display to show the results.
  * Presenters should be able to pick-and-choose which event to present next (not necessarily the order they are in the score JSON)
  * Presenters should be able to control the whole presentation from the display on their local computer (current presentation mode has the "Next" button on the popup window instead)
  * When presenting an individual event's scores, start with a slide showing just the event name, and then reveal the team places one-by-one (presenter-controlled) starting with the highest place, and ending with first place.
  * Allow presenters to go backwards; in case they mis-click and reveal a place too soon, they can undo that and hide it again.

### Stretch goals
* "Kiosk" mode: unmanned presentation mode, where the presentation auto-advances through all available events in a loop, adding in new events as they become available.
* Multi-tournament option: In many cases, there are actually two tournaments going on at once, "Division B" for middle-schoolers, and "Division C" for high-schoolers. Add the ability to fetch two (or more) results JSON objects and list all the events from all the tournaments so a presenter could jump from presenting a Division B event, to presenting a few Division C events, and then back to Division B events, all from one screen.
* Highlight first, second, and third places as "gold", "silver", and "bronze" in a unique way (icons, colors, etc.)

## Examples/References
* [Google I/O slide framework](https://code.google.com/p/io-2012-slides/), especially their [presenter mode](http://youtu.be/WRvECXyWj80?t=5m34s)
* [HTML5 Rocks Presentation](http://slides.html5rocks.com/#landing-slide)
* [Current presentation mode example](https://avogadro.ws/hosted/skel/public/results/present) (login `demo`/`demo1234`) Example of the Avogadro v3.1 presentation mode, made with antiquated Dojo library
