var groupIds = inputParams.groupIds;
	var resultSet = [];
    if (groupIds.indexOf("") !== -1) {
        resultSet.push("000-000-000-000");
    }
    if (groupIds.indexOf("000-000-000-000") !== -1) {
        resultSet.push("100-000-000-000", "200-000-000-000");
    }
    return {resultSet : resultSet };