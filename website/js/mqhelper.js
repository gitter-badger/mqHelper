/* 
 * Author: Kevin Purnelle
 * Forker: Dave Kinsella
*/
"use strict";

var mqHelper = {
	options : {
		stripped : null,
		groups : null,
		normal : true,
		position : "bottom",
		mqRegex : new RegExp(/(@media[^\{]*)\{(([^\{\}]*\{[^\{\}]*\})*)[^\}]*\}/gi)	
	},
	
	/* Process the css source
	--------------------------------------------------------------- */
	process: function(css) {
		var curr_match;
		var matches = [];
		var grouped_queries;
		var stripped = "";
		var mqs = {}

		//get the code stripped from the media queries
		stripped = css.replace(this.options.mqRegex, '').trim()

		//get and group media queries
		while (curr_match = this.options.mqRegex.exec(css)) {

			curr_match[1] = this.normalizeQuery(curr_match[1]);
			matches.push([curr_match[1],curr_match[2]]);
		}

		matches.sort(this.compareQueries);
		grouped_queries = this.groupQueries(matches);

		return {
			mqs : grouped_queries,
			stripped: stripped
		}
	},

	/* Normalize the query declaration
	--------------------------------------------------------------- */
	normalizeQuery: function(str) {
		str = str.toLowerCase().trim().replace(/\s{2,}/g, ' ')
		str = str.replace( /\(\s/g,'(' )
			str = str.replace( /\s\)/g,')' )
			return str
	},

	/* custom compare function for media queries
	--------------------------------------------------------------- */
	compareQueries: function(a,b) {

		return a[0].localeCompare(b[0]);
	},

	/* group the rules that are bound to the same media query
	--------------------------------------------------------------- */
	groupQueries: function(arr) {
		var curr_mediaquery = {};
		var result = [];

		if (arr.length > 0) {

			curr_mediaquery.query = arr[0][0];
			curr_mediaquery.rules = "";

			for (var i = 0, len = arr.length; i < len; i++) {

				if (arr[i][0] === curr_mediaquery.query) {
					curr_mediaquery.rules += arr[i][1];
				}
				else {
					result.push(jQuery.extend({},curr_mediaquery));
					curr_mediaquery.query = arr[i][0];
					curr_mediaquery.rules = arr[i][1];
				}
			}
			result.push(curr_mediaquery);
			//the last media-query needs to be pushed after the loop
		}
		else {
			result = null;
		}
		return result;
	}
};
