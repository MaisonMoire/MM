// const Prismic = require('prismic-javascript')
import Prismic from 'prismic-javascript'
require('dotenv').config()
require('encoding') // netlify build error / missing package
const apiEndpoint = process.env.LAMBDA_CLIENTS_PRISMIC_ENDPOINT
const accessToken = process.env.LAMBDA_CLIENTS_PRISMIC_TOKEN
// TODO - add final domain
// const acceptedHosts = ['maisonmoire.com', 'maison-moire.netlify.app', 'localhost']

// Initialize the prismic.io api
function initApi (req) {
  return Prismic.getApi(apiEndpoint, {
    accessToken: accessToken,
    req: req
  })
}

exports.handler = function (event, context, callback) {
  const body = (event.body && JSON.parse(event.body)) ?? {}

  // !! Forbidden host
  // if (!acceptedHosts.includes(event.headers.host.split(':')[0])) {
  //   return callback(null, {
  //     statusCode: 403,
  //     body: JSON.stringify({
  //       status: 403,
  //       message: 'Forbidden host'
  //     })
  //   })
  // }

  // !! missing PIN
  if (!body.pin) {
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        status: 400,
        message: 'Missing PIN'
      })
    })
  }

  // GO !
  initApi(event).then(function (api) {
    api.query(
      Prismic.Predicates.at('my.client.uid', body.pin),
      { pageSize: 1 }
    ).then(function (response) {
      // response is the response object, response.results holds the documents
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(response.results[0] || null)
      })
    })
      .catch(function (error) {
        console.log('API ERROR')
        console.error(error)
        // console.error(error.response.data)
        // return callback(null, {
        //   statusCode: error.response.data.status,
        //   body: JSON.stringify(error.response.data)
        // })
      })
  })
}
