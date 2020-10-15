(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

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
            id: "upsell",
            alias: "Upsell",
            dataType: tableau.dataTypeEnum.bool
        },{
            id: "items_number",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "restaurant",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "store_id",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "net_price",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "tax",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "is_pushed",
            dataType: tableau.dataTypeEnum.bool
        },{
            id: "ai_assisted",
            dataType: tableau.dataTypeEnum.bool
        },{
            id: "feedback",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "coupons_applied",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "number_of_clicks",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "agent_id",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "dashboard_link",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "add_menu_dish_api",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "edit_cart_dish_customization_api",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "add_all_dishes_api",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "update_price_api",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "finalize_cart_dish_api",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "cancel_order_api",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "delete_cart_dish_api",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "un_finalize_cart_dish_api",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "disambiguate_cart_dish_api",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "add_recommended_dish_api",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "edit_cart_dish_quantity_api",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "disambiguate_combo_api",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "undo_delete_api",
            dataType: tableau.dataTypeEnum.int
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
        $.getJSON("https://radagast.staging.v2.conversenow.ai/v1/metrics/trackers?from=2020-09-01&to=2020-09-09", function(resp) {
            var feat = resp.trackers,
                tableData = [];

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
                    "ai_assisted":feat[i].ai_assisted,
					"tax":feat[i].tax,
					"number_of_clicks":feat[i].number_of_clicks,
					"dashboard_link":feat[i].dashboard_link,
					"add_menu_dish_api":feat[i].add_menu_dish_api,
					"edit_cart_dish_customization_api":feat[i].edit_cart_dish_customization_api,
					"add_all_dishes_api":feat[i].add_all_dishes_api,
					"update_price_api":feat[i].update_price_api,
					"finalize_cart_dish_api":feat[i].finalize_cart_dish_api,
					"cancel_order_api":feat[i].cancel_order_api,
					"delete_cart_dish_api":feat[i].delete_cart_dish_api  ,
					"un_finalize_cart_dish_api":feat[i].un_finalize_cart_dish_api,
					"disambiguate_cart_dish_api":feat[i].disambiguate_cart_dish_api,
					"add_recommended_dish_api":feat[i].add_recommended_dish_api,
					"edit_cart_dish_quantity_api":feat[i].edit_cart_dish_quantity_api,
					"disambiguate_combo_api":feat[i].disambiguate_combo_api,
					"undo_delete_api":feat[i].undo_delete_api,
					"restaurant":feat[i].restaurant,
					"store_id":feat[i].store_id
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
