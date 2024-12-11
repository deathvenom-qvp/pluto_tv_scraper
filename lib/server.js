(function() {
	const server = require('awebserver');
	const path = require('path');
	const fs = require('fs');
	const utils = require('#lib/utils.js');

	const getUUID = (config) => {
		if (config.get('randomClientid') || config.get('uniqueClientid')) return utils.uuid();
		return false;
	}

	const serve = (config) => {
		server.addRoute('/{filename}', 'GET', (req, res) => {
			try {
				const outdir = config.get('outdir');
				const filename = path.basename(req.query.filename);
				const fullpath = `${outdir}/${filename}`;
				const { ext } = path.parse(fullpath);

				let contents = fs.readFileSync(fullpath, 'utf-8');
				let mimetype = "text/plain";
				switch (ext) {
					case '.m3u8':
						const lines = contents.split('\n');
						contents = lines.map(line => {
							if (line.startsWith('#EXTINF')) {
								const uuid = getUUID(config);
								if (uuid) {
									line = line.replace(new RegExp(config.get('clientID'), 'ig'), uuid);
								}
							}
							return line;
						}).join('\n');
						mimetype = 'application/x-mpegURL; charset=UTF-8';
						break;
					case '.xml':
						mimetype = 'text/xml';
						break;
				}

				res.response(200, `${contents}`, { 'Content-Type': mimetype });
			} catch (ex) {
				res.response(500, 'something bad happened');
			}
		});

		server.serve(config.get('PORT'));
	}

	exports = module.exports = {
		serve
	}
})();
