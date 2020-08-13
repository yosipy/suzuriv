async function oauth() {
  /*let res = await axios.get('https://suzuri.jp/oauth/authorize', {
		params: {
			client_id: '5h4E1jWnJDWgPBnxwgR_m_R-2UxiRlNl7yARrbhHlMk', 
			scope: 'read', 
			redirect_uri: 'https://yosipy.github.io/suzuriv/', 
			response_type: 'code'
		}
	})
	console.log(res)*/
	/*res = await axios.post('https://suzuri.jp/oauth/token', {
		params: {
			grant_type: 'authorization_code',
			code: ''
		}
	})*/
}
oauth()

function getParam(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

let code = getParam('code')
console.log(code)