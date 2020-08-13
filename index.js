async function oauth() {
	var request = require('request');

	var options = {
		url: 'https://suzuri.jp/oauth/authorize?client_id=5h4E1jWnJDWgPBnxwgR_m_R-2UxiRlNl7yARrbhHlMk&scope=read&redirect_uri=https://yosipy.github.io/suzuriv/&response_type=code'
	};
	
	function callback(error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			console.log(response)
		}
	}
	
	request(options, callback);
	/*res = await axios.post('https://suzuri.jp/oauth/token', {
		params: {
			grant_type: 'authorization_code',
			code: ''
		}
	})*/
}
oauth()