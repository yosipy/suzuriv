async function oauth() {
  let res = await axios.get('https://suzuri.jp/oauth/authorize?client_id=5h4E1jWnJDWgPBnxwgR_m_R-2UxiRlNl7yARrbhHlMk&scope=read&redirect_uri=https://yosipy.github.io/suzuriv/&response_type=code')
	console.log(res)
	res = await axios.post('https://suzuri.jp/oauth/token', {
		params: {
			grant_type: 'authorization_code',
			code: ''
		}
	})
}
oauth()