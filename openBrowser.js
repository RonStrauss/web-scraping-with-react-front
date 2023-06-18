const { exec } = require('child_process');
const os = require('os');

const openBrowser = (defaultUrl = 'http://localhost:3000') => {
	let command = '';
	const url = process.argv[2] ? process.argv[2] : defaultUrl;
	switch (os.platform()) {
		case 'darwin':
			command = 'open ';
			break;
		case 'win32':
			command = 'start "" ';
			break;
		case 'linux':
			command = 'xdg-open ';
			break;

		default:
			break;
	}

	exec(command + url);
};

openBrowser();
