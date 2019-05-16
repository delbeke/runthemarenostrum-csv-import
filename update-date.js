const AWS = require('aws-sdk')
const moment = require('moment')

const TABLENAME = 'runthemarenostrum-api-production-stages'

AWS.config.update({region: 'eu-west-1'})
const ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'})

const update = (item, cb) => {
    // const newDate = moment(item.startDate.S, 'DD-MM-YYYY').add(65, 'days').format('DD/MM/YYYY')
    const newDate = moment(item.startDate.S, 'DD/MM/YYYY').format('DD-MM-YYYY')
    console.log(item.stageId.S + '\t\t' + item.startDate.S + ' -> ' + newDate)

    ddb.updateItem({
        Key: { stageId: { S: item.stageId.S } },
        AttributeUpdates: {
            startDate: {
                Action: 'PUT',
                Value: {
                    S: newDate
                }
            }
        },
        ReturnConsumedCapacity: 'TOTAL',
        TableName: TABLENAME
    }, (err, data) => {
        if (err) {
            console.error(err)
        } else {
            cb()
        }
    })
}

ddb.scan({ TableName: TABLENAME }, (err, data) => {
    const items = data.Items.filter(i => {
        const id =  i.stageId.S
        if (id.includes('BUFFER ')) {
            const cleanId = parseInt(id.replace('BUFFER ', ''))
            return (cleanId > 2)
        } else {
            const cleanId = parseInt(id)
            return (cleanId > 25)
        }
    })

    let item = null
    const doUpdate = () => {
        if (items.length > 0) {
            item = items.pop()
            update(item, doUpdate)
        } else {
            console.log('done')
        }
    }
    doUpdate()
})