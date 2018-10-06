"use strict";
var _this = void 0,
	queue = window.fathom.q || [],
	trackerUrl = "",
	commands = {
		trackPageview: trackPageview,
		setTrackerUrl: setTrackerUrl
	};

function stringifyObject(t) {
	return "?" + Object.keys(t).map(function(e) {
		return encodeURIComponent(e) + "=" + encodeURIComponent(t[e])
	}).join("&")
}

function randomString(e) {
	var t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	return Array(e).join().split(",").map(function() {
		return t.charAt(Math.floor(Math.random() * t.length))
	}).join("")
}

function getCookie(e) {
	for(var t = document.cookie ? document.cookie.split("; ") : [], r = 0; r < t.length; r++) {
		var n = t[r].split("=");
		if(decodeURIComponent(n[0]) === e) {
			var i = n.slice(1).join("=");
			return decodeURIComponent(i)
		}
	}
	return ""
}

function setCookie(e, t, r) {
	var n = (e = encodeURIComponent(e)) + "=" + (t = encodeURIComponent(String(t)));
	r.path && (n += ";path=" + r.path), r.expires &&
	(n += ";expires=" + r.expires.toUTCString()), document.cookie = n
}

function newVisitorData() {
	return {
		isNewVisitor: !0,
		isNewSession: !0,
		pagesViewed: [],
		previousPageviewId: "",
		lastSeen: +new Date
	}
}

function getData() {
	var e = new Date;
	e.setMinutes(e.getMinutes() - 30);
	var t = getCookie("_fathom");
	if(!t) return newVisitorData();
	try {
		t = JSON.parse(t);
	} catch(e) {
		return console.error(e), newVisitorData();
	}
	return t.lastSeen < +e && (t.isNewSession = !0), t;
}

function findTrackerUrl() {
	var e = document.getElementById("fathom-script");
	return e ? e.src.replace("tracker.js", "collect") : "";
}

function setTrackerUrl(e) {
	trackerUrl = e;
}

function trackPageview() {
	if("" === trackerUrl && (trackerUrl = findTrackerUrl()), 
	!("doNotTrack" in navigator && "1" === navigator.doNotTrack ||
	"visibilityState" in document && "prerender" === document.visibilityState)) {
		var e = window.location,
			t = document.querySelector('link[rel="canonical"][href]');
		if(t) {
			var r = document.createElement("a");
			r.href = t.href, e = r;
		}
		var n = e.pathname + e.search,
			i = e.protocol + "//" + e.hostname;
		n || (n = "/");
		var o = "";
		document.referrer.indexOf(location.hostname) < 0 && (o = document.referrer);
		var a = getData(),
			c = {
				id: randomString(20),
				pid: a.previousPageviewId || "",
				p: n,
				h: i,
				r: o,
				u: -1 == a.pagesViewed.indexOf(n) ? 1 : 0,
				nv: a.isNewVisitor ? 1 : 0,
				ns: a.isNewSession ? 1 : 0
			},
			s = document.createElement("img");
		s.src = trackerUrl + stringifyObject(c), s.addEventListener("load", function() {
			var e = new Date,
				t = new Date(e.getFullYear(), e.getMonth(), e.getDate(), 24, 0, 0); 
				- 1 == a.pagesViewed.indexOf(n) && a.pagesViewed.push(n),
				a.previousPageviewId = c.id, a.isNewVisitor = !1, a.isNewSession = !1,
				a.lastSeen = +new Date, setCookie("_fathom", JSON.stringify(a), {
					expires: t,
					path: "/"
				})
		}), document.body.appendChild(s), window.setTimeout(function() {
			document.body.removeChild(s)
		}, 1e3)
	}
}
window.fathom = function() {
	var e = [].slice.call(arguments),
		t = e.shift();
	commands[t].apply(this, e);
}, queue.forEach(function(e) {
	return fathom.apply(_this, e)
});

