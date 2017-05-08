zip: lint
	cd addon; zip ../timelist.zip *

lint:
	jshint addon/blockif.js
