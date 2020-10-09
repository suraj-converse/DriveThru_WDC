(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();
​
    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
		// Define Columns
        var cols = [{
            id: "personalization_key",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "user_name",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "start_time",
            dataType: tableau.dataTypeEnum.datetime
        },{
            id: "end_time",
            dataType: tableau.dataTypeEnum.datetime
        },{
            id: "dishes",
            alias: "Ordered Dishes",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "upsell",
            alias: "Upsell",
            dataType: tableau.dataTypeEnum.bool
        },{
            id: "items_number",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "net_price",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "is_pushed",
            dataType: tableau.dataTypeEnum.bool
        },{
            id: "ai_assisted",
            dataType: tableau.dataTypeEnum.bool
        }];
​
        var tableSchema = {
            id: "DriveThru",
            alias: "Converse Now DriveThru Data",
            columns: cols
        };
​
        schemaCallback([tableSchema]);
    };
​
    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://radagast.staging.v2.conversenow.ai/v1/metrics/trackers?from=2020-08-01&to=2020-08-08", function(resp) {
            var feat = resp.trackers,
                tableData = [];
​
            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                var dishlist = feat[i].dishes;
                var items = ""
                for (var j = 0, len1 = dishlist.length; j < len1; j++) {
                    if (items != ""){
                        items = items + ", " + dishlist[j]
                    } else {
                        items = dishlist[j]
                    }
                }
                tableData.push({
                    "uuid": feat[i].uuid,
                    "user_name": feat[i].user_name,
                    "items_number": feat[i].items_numbers,
					"status":feat[i].status,
					"personalization_key":feat[i].personalization_key,
					"start_time":feat[i].start_time,
					"end_time":feat[i].end_time,
					"dishes":items,
                    "net_price":feat[i].sales,
					"is_pushed":feat[i].is_pushed,
					"coupons_applied":feat[i].coupons_applied,
					"feedback":feat[i].feedback,
                    "upsell":feat[i].upsell,
                    "ai_assisted":feat[i].ai_assisted
                });
            }
​
            table.appendRows(tableData);
            doneCallback();
        });
    };
​
    tableau.registerConnector(myConnector);
​
    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "ConverseNow DriveThru"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
