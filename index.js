async function oauth() {
    const res1 = await axios.get('https://suzuri.jp/oauth/authorize?client_id=5h4E1jWnJDWgPBnxwgR_m_R-2UxiRlNl7yARrbhHlMk&scope=read&redirect_uri=https://yosipy.github.io/suzuriv/&response_type=code')
    console.log(res1)
}
oauth()