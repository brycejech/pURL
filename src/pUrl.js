/*
	URL Parser

	Author: Bryce Jech
	Date: 	3/9/17
*/

var pUrl = (function(){

	var loc = window.location;

	var query = {
		string: loc.search.replace('\?', ''),
		obj: {},
		hasKey: function(name){ return name in query.obj; },
		get: function(name){ return (name in query.obj) ? query.obj[name] : undefined; }
	}

	query.obj = query.string.split('&').reduce(function(obj, part){
		if(!part){ return obj; }
		var pieces = part.split('=');
		obj[pieces[0]] = pieces[1];
		return obj;
	}, query.obj);

	return {
		protocol: loc.protocol.replace(':', ''),
		hostname: loc.hostname,
		query: query,
		q: query,
		path: loc.pathname,
		fullUrl: loc.href
	}

})();

pUrl.Parser = function(url){

	this.url = url;

	var rgx = /^(?:(https?):\/\/)?(?:([^\s:]+):?(\S+)?@)?([\w\-\.]+)(?::(\d+))?(\/[^\?#]*)?(?:\?)?([^#]+)?(#\S+)?$/
	var urlParts = url.match(rgx);

	this.protocol		= (urlParts[1] === undefined) ? '' : urlParts[1];
	this.username 		= (urlParts[2] === undefined) ? '' : urlParts[2];
	this.password 		= (urlParts[3] === undefined) ? '' : urlParts[3];
	this.hostname		= (urlParts[4] === undefined) ? '' : urlParts[4];
	this.port 			= (urlParts[5] === undefined) ? '' : urlParts[5];
	this.path			= (urlParts[6] === undefined) ? '' : urlParts[6];
	this.queryString 	= (urlParts[7] === undefined) ? '' : urlParts[7];
	this.hash			= (urlParts[8] === undefined) ? '' : urlParts[8];


	this.q = this.query = {

		obj: this.queryString.split('&').reduce(function(obj, part){

			if(!part){ return obj; }

			var pieces = part.split('=');

			pieces.length > 1
				? obj[pieces[0]] = pieces[1]
				: obj[pieces[0]] = '';

			return obj;
		}, {}),

		add: function(obj){
			for(var key in obj){
				this.obj[encodeURIComponent(key)] = encodeURIComponent(obj[key]);
			}
		},
		del: function(key){
			return this.hasKey(key) ? delete this.obj[key] : undefined;
		},
		unset: function(key){
			if(this.hasKey(key)) this.obj[key] = '';
		},
		hasKey: function(name){ return name in this.obj; },
		get: function(name){ return (name in this.obj) ? this.obj[name] : undefined; },
		toString: function(){ 
			var arr = [];

			for(var key in this.obj){
				arr.push(key + '=' + this.obj[key]);
			}

			return arr.length ? '?' + arr.join('&') : '';
		}	
	};

	this.toString = function(){
		return (this.protocol ? this.protocol + '://' : '')  + 
			(this.username ? this.username + (this.password ? ':' + this.password + '@' : '@') : '') + 
			this.hostname + 
			(this.port ? ':' + this.port : '') + 
			this.path + 
			this.q.toString() + 
			this.hash;
	}
}