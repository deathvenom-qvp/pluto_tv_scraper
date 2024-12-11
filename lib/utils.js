(function() {
	const fs = require('fs');
	const converter = require('xml-js');

	const escapeHTML = str => str.replace(/[&<>'"]/g,
		tag => ({
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			"'": '&#39;',
			'"': '&quot;'
		}[tag]));

	const mergeM3U8 = (playlists, xTvgUrl) => {
		let res = "#EXTM3U\n";
		if (xTvgUrl) {
			res = `#EXTM3U x-tvg-url="${xTvgUrl}"\n\n`;
		}

		for (let region in playlists) {
			const playlist = playlists[region];
			const lines = playlist.split('\n');
			for (let line of lines) {
				if (line.indexOf("#EXTM3U") === 0) continue;
				res += `${line}\n`;
			}
		}
		return res;
	}

	const mergeXMLTV = (epgs) => {
		let res = null;
		for (let region in epgs) {
			const contents = epgs[region];
			const json = JSON.parse(converter.xml2json(contents, {compact: true, spaces: 4}));
			if (!res) {
				res = json;
				continue;
			}
			res.tv.channel = res.tv.channel.concat(json.tv.channel);
			res.tv.programme = res.tv.programme.concat(json.tv.programme);
		}

		// need to manually escape the '&' characters in the src attribute of the icon nodes
		const attributesFn = (attribs, name, element) => {
			if (name === 'icon' && attribs.src) {
				attribs.src = escapeHTML(attribs.src);
			}
			return attribs;
		}

		return res ? converter.json2xml(
			JSON.stringify(res),
			{compact: true, ignoreComment: true, spaces: 4, attributesFn}
		) : null;
	}

	const hex = (len, src) => {
		const chrs = src ? src : '1234567890abcdef';
		const rnd = !src;
		let rv = "";
		for (let i = 0; i < len; i++) {
			const index = rnd ? Math.floor(Math.random() * chrs.length) : (len + i) % chrs.length;
			rv += chrs[index];
		}
		return rv;
	};

	const uuid = () => {
		return hex(8) + '-' +
			hex(4) + '-4' +
			hex(3) + '-a' +
			hex(3) + '-' +
			hex(12);
	};

	const getTimeStr = (d) => {
		let timeStr = "";
		const year = d.getUTCFullYear();
		const mon = d.getUTCMonth() + 1;
		const day = d.getUTCDate();
		const hour = d.getUTCHours();
		const min = d.getUTCMinutes();
		const sec = d.getUTCSeconds();

		timeStr += year;
		timeStr += mon < 10 ? '0' + mon : mon;
		timeStr += day < 10 ? '0' + day : day;
		timeStr += hour < 10 ? '0' + hour : hour;
		timeStr += min < 10 ? '0' + min : min;
		timeStr += sec < 10 ? '0' + sec : sec;
		return timeStr;
	}

	exports = module.exports = {
		escapeHTML,
		mergeM3U8,
		mergeXMLTV,
		uuid,
		getTimeStr
	}
})();
