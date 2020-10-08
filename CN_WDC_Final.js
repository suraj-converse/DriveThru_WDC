(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
		// Define Columns
        var cols = [{
            id: "uuid",
			alis:"UUID",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "user_name",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "personalization_key",
            dataType: tableau.dataTypeEnum.string
        } ,{
            id: "status",
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
            id: "is_pushed",
            dataType: tableau.dataTypeEnum.bool
        },{
            id: "items_number",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "feedback",
            dataType: tableau.dataTypeEnum.string
        },        
        {
            id: "coupons_applied",
            dataType: tableau.dataTypeEnum.float
        }];

        var tableSchema = {
            id: "DriveThru",
            alias: "Converse Now DriveThru Data",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://radagast.staging.v2.conversenow.ai/v1/metrics/trackers?from=2020-08-01&to=2020-08-08", function(resp) {
            var feat = resp.trackers,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "uuid": feat[i].uuid,
                    "user_name": feat[i].user_name,
                    "items_number": feat[i].items_numbers,
					"status":feat[i].status,
					"personalization_key":feat[i].personalization_key,
					"start_time":feat[i].start_time,
					"end_time":feat[i].end_time,
					"is_pushed":feat[i].is_pushed,
					"item numbers":feat[i].items_numbers,
					"coupons_applied":feat[i].coupons_applied,
					"feedback":feat[i].feedback
                });
            }
		var feats = resp.trackers.dishes;
	    for (var j = 0, len = feats.length; j < len; j++) {
                tableData.push({
   			"dishes":feats[j]
                });
            }
	

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "ConverseNow DriveThru"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
