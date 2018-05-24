const http = require('http-call').HTTP
const maxRetries = 10

async function call (url, out, retries) {
  try {
    let {response} = await http.stream(url)
    response.on('data', function (d) {
      out.write(d)
    })
    return await new Promise(function (resolve, reject) {
      response.on('error', reject)
      response.on('end', resolve)
    })
  } catch (err) {
    if (err.statusCode === 404 && retries <= maxRetries) {
      return call(url, out, retries + 1)
    }
    throw err
  }
}

module.exports = function (url, out) {
  return call(url, out, 0)
}