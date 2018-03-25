const onlyUnique = (value, index, self) => { 
    return self.indexOf(value) === index;
}

const split = (text) => {
    if ((typeof text === 'string') && (text.length > 0)) {
        return text.split(/\/|,|;/)
            .map(i => i.trim())
            .filter(onlyUnique)
            .filter(i => i.length > 0)
            
    } else {
        return []
    }
}

const add = (obj, key, type, value) => {
    if (value == null || value.length === 0) {
        return
    }
    obj[key] = {}
    obj[key][type] = value
    return obj
}

module.exports = (tableName, data) => {
    const putRequests = data
        .filter(i => i['Stage'])
        .map(i => {
            const item = {}
            add(item, 'stageId', 'S', i['Stage'])
            add(item, 'startDate', 'S', i['Start Date'])
            add(item, 'startCity', 'S', i['Start Closest City'])
            add(item, 'stopCity', 'S', i['Stop Name'])
            add(item, 'startPos', 'S', i['Start Lat Long'])
            add(item, 'stopPos', 'S', i['Stop Lat Long'])
            add(item, 'surface', 'SS', split(i['Main Surface']))
            add(item, 'difficulty', 'S', i['Level - Difficulty'])
            add(item, 'country', 'SS', split(i['Country']))
            add(item, 'highlights', 'SS', split(i['Highlights']))
            return { PutRequest: { Item: item } }
        })

    const requestItems = {}
    requestItems[tableName] = putRequests
    return { RequestItems: requestItems }
}