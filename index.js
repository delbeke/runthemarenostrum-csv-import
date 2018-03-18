const parseAsync = require('./util/parseAsync')
const readFileAsync = require('./util/readFileAsync')
const createDdbInsert = require('./util/createDdbInsert')
const AWS = require('aws-sdk')

const TABLENAME = 'runthemarenostrum-api-dev-stages'

AWS.config.update({region: 'eu-central-1'})
const ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'})

readFileAsync('stages.csv')
    .then(parseAsync)
    .then((data) => {
        console.log('parsed csv')
        const batchPromises = []
        while(data.length > 0) {
            const insert = createDdbInsert(TABLENAME, data.splice(0, 10))
            batchPromises.push(ddb.batchWriteItem(insert).promise())
        }
        return Promise.all(batchPromises)
    })
    .then(() => { console.log('Done!') })
    .catch((reason) => { console.error('Failed...', reason) })
