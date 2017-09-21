zip: lint
	cd addon; zip ../timelist.zip *

lint:
	jshint addon/*.js
	python -m json.tool addon/manifest.json > /dev/null
	python -m json.tool addon/schema.json > /dev/null
	tidy -eq addon/blockpage.html

