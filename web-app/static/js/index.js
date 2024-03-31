//globals
var LAST_MODE = null;
var LAST_SETTING = null;
var COUNT = 0;
var NUM_ROOMS = 0;
var INIT = false;
var MAX_SCHEDULE = 0;
var MAX_HYBRID = 0;
var SCHEDULE_ID = null;
var HYBRID_ID = null;
/** TODO
     * Clean and group code
     * Comments
     */

$(document).ready(function(){

    //Server calls here to update any content before calling load functions
    connect();
    loadInputs();
    

    //Click functions
    $("#activeAdd").click(function() {
        if (Number($("#activePoint").text().split("°")[0]) < 35.0) {
            mode = $("#mode").text();
            var values = $("input")[0].value.split(",");
            if (mode == "Heat") {
                $("#slider").data("roundSlider").setValue(values[0] + "," + String(Number(values[1])+ 1));
                values = $("input")[0].value.split(",");
                $("#activePoint").text((Number(values[1]) / 10).toFixed(1) + "°");
            } else if (mode == "Cool"  && values[0] != values[1]) {
                $("#slider").data("roundSlider").setValue(String(Number(values[0]) + 1) + "," + values[1]);
                values = $("input")[0].value.split(",");
                $("#activePoint").text((Number(values[0]) / 10).toFixed(1) + "°");
            } else {
                $("#activeAdd").parent("div").effect("shake");
            }
        } else {
            $("#activeAdd").parent("div").effect("shake");
        }
    });

    $("#activeRem").click(function() {
        if (Number($("#activePoint").text().split("°")[0]) > 10.0) {
            mode = $("#mode").text();
            var values = $("input")[0].value.split(",");
            if (mode == "Heat" && values[0] != values[1]) {
                $("#slider").data("roundSlider").setValue(values[0] + "," + String(Number(values[1])- 1));
                values = $("input")[0].value.split(",");
                $("#activePoint").text((Number(values[1]) / 10).toFixed(1) + "°");
            } else if (mode == "Cool") {
                $("#slider").data("roundSlider").setValue(String(Number(values[0]) - 1) + "," + values[1]);
                values = $("input")[0].value.split(",");
                $("#activePoint").text((Number(values[0]) / 10).toFixed(1) + "°");
            } else {
                $("#activeRem").parent("div").effect("shake");
            }
        } else {
            $("#activeRem").parent("div").effect("shake");
        }
    });

    $("#inactiveAdd").click(function() {
        var values = $("input")[0].value.split(",");
        if (Number($("#inactivePoint").text().split("°")[0]) < 35.0) {
            mode = $("#mode").text();
            values = $("input")[0].value.split(",");
            if (mode == "Heat"  && values[0] != values[1]) {
                $("#slider").data("roundSlider").setValue(String(Number(values[0]) + 1) + "," + values[1]);
                values = $("input")[0].value.split(",");
                $("#inactivePoint").text((Number(values[0]) / 10).toFixed(1) + "°");
            } else if (mode == "Cool") {
                $("#slider").data("roundSlider").setValue(values[0] + "," + String(Number(values[1])+ 1));
                values = $("input")[0].value.split(",");
                $("#inactivePoint").text((Number(values[1]) / 10).toFixed(1) + "°");
            } else {
                $("#inactiveAdd").parent("div").effect("shake");
            }
        } else {
            $("#inactiveAdd").parent("div").effect("shake");
        }
    });

    $("#inactiveRem").click(function() {
        if (Number($("#inactivePoint").text().split("°")[0]) > 10.0) {
            mode = $("#mode").text();
            var values = $("input")[0].value.split(",");
            if (mode == "Heat") {
                $("#slider").data("roundSlider").setValue(String(Number(values[0]) - 1) + "," + values[1]);
                values = $("input")[0].value.split(",");
                $("#inactivePoint").text((Number(values[0]) / 10).toFixed(1) + "°");
            } else if (mode == "Cool" && values[0] != values[1]) {
                $("#slider").data("roundSlider").setValue(values[0] + "," + String(Number(values[1])- 1));
                values = $("input")[0].value.split(",");
                $("#inactivePoint").text((Number(values[1]) / 10).toFixed(1) + "°");
            } else {
                $("#inactiveRem").parent("div").effect("shake");
            }
        } else {
            $("#inactiveRem").parent("div").effect("shake");
        }
    });

    $("#addConst").click(function() {
        var values = $("input")[0].value;
        if (Number($("#activePointConst").text().split("°")[0]) < 35.0) {
            $("#slider").data("roundSlider").setValue(String(Number(values) + 1));
            values = $("input")[0].value;
            $("#activePointConst").text((Number(values) / 10).toFixed(1) + "°");
        } else {
            $("#addConst").parent("div").effect("shake");
        }
    });

    $("#remConst").click(function() {
        var values = $("input")[0].value;
        if (Number($("#activePointConst").text().split("°")[0]) > 10.0) {
            $("#slider").data("roundSlider").setValue(String(Number(values) - 1));
            values = $("input")[0].value;
            $("#activePointConst").text((Number(values) / 10).toFixed(1) + "°");
        } else {
            $("#remConst").parent("div").effect("shake");
        }
    });


    $("#addConstSched").click(function() {
        if (Number($("#activePointConstSched").text().split("°")[0]) < 35.0) {
            let mode = $("#mode").text();
            let value = (Number($("#activePointConstSched").text().split("°")[0]) + 0.1).toFixed(1)
            $("#activePointConstSched").text((Number($("#activePointConstSched").text().split("°")[0]) + 0.1).toFixed(1) + "°");
            if (!(value.length > 0)) {
                return;
            }
            $.ajax({
                url : '/api/changeConstant',
                type : 'POST',
                contentType: "application/json",
                data: '{"mode": "' + mode + '", "value":' + value + '}',
                dataType: "json",
            });
        } else {
            $("#addConstSched").parent("div").effect("shake");
        }
    });

    $("#remConstSched").click(function() {
        if (Number($("#activePointConstSched").text().split("°")[0]) > 10.0) {
            let mode = $("#mode").text();
            let value = (Number($("#activePointConstSched").text().split("°")[0]) - 0.1).toFixed(1)
            $("#activePointConstSched").text((Number($("#activePointConstSched").text().split("°")[0]) - 0.1).toFixed(1) + "°");
            if (!(value.length > 0)) {
                return;
            }
            $.ajax({
                url : '/api/changeConstant',
                type : 'POST',
                contentType: "application/json",
                data: '{"mode": "' + mode + '", "value":' + value + '}',
                dataType: "json",
            });
        } else {
            $("#remConstSched").parent("div").effect("shake");
        }
    });


    $("#activeAddHybrid").click(function() {
        if (Number($("#activePointConstSched").text().split("°")[0]) < 35.0) {
            let mode = $("#mode").text();
            let value = Number($("#activePointHybrid").text().split("°")[0]) + 0.1
            let inactive = Number($("#inactivePointHybrid").text().split("°")[0])
            if (mode == "Cool" && parseFloat(value.toFixed(1)) > parseFloat(inactive.toFixed(1))) {
                $("#activeAddHybrid").parent("div").effect("shake");
            } else {
                $("#activePointHybrid").text((Number($("#activePointHybrid").text().split("°")[0]) + 0.1).toFixed(1) + "°");
                $.ajax({
                    url : '/api/changeMotionActive',
                    type : 'POST',
                    contentType: "application/json",
                    data: '{"mode": "' + mode + '", "value":' + value + '}',
                    dataType: "json",
                });
            }
        } else {
            $("#activeAddHybrid").parent("div").effect("shake");
        }
    });

    $("#inactiveAddHybrid").click(function() {
        if (Number($("#inactivePointHybrid").text().split("°")[0]) < 35.0) {
            let mode = $("#mode").text();
            let value = Number($("#inactivePointHybrid").text().split("°")[0]) + 0.1
            let inactive = Number($("#activePointHybrid").text().split("°")[0])
            if (mode == "Heat" && parseFloat(value.toFixed(1)) > parseFloat(inactive.toFixed(1))) {
                $("#inactiveAddHybrid").parent("div").effect("shake");
            } else {
                $("#inactivePointHybrid").text((Number($("#inactivePointHybrid").text().split("°")[0]) + 0.1).toFixed(1) + "°");
                $.ajax({
                    url : '/api/changeMotionInactive',
                    type : 'POST',
                    contentType: "application/json",
                    data: '{"mode": "' + mode + '", "value":' + value + '}',
                    dataType: "json",
                });
            }
        } else {
            $("#inactiveAddHybrid").parent("div").effect("shake");
        }
    });


    $("#activeRemHybrid").click(function() {
        if (Number($("#activePointHybrid").text().split("°")[0]) > 10.0) {
            let mode = $("#mode").text();
            let value = Number($("#activePointHybrid").text().split("°")[0]) - 0.1
            let inactive = Number($("#inactivePointHybrid").text().split("°")[0])
            if (mode == "Heat" && parseFloat(value.toFixed(1)) < parseFloat(inactive.toFixed(1))) {
                $("#activeRemHybrid").parent("div").effect("shake");
            } else {
                $("#activePointHybrid").text((Number($("#activePointHybrid").text().split("°")[0]) - 0.1).toFixed(1) + "°");
                $.ajax({
                    url : '/api/changeMotionActive',
                    type : 'POST',
                    contentType: "application/json",
                    data: '{"mode": "' + mode + '", "value":' + value + '}',
                    dataType: "json",
                });
            }
        } else {
            $("#activeRemHybrid").parent("div").effect("shake");
        }
    });

    $("#inactiveRemHybrid").click(function() {
        if (Number($("#inactivePointHybrid").text().split("°")[0]) > 10.0) {
            let mode = $("#mode").text();
            let value = Number($("#inactivePointHybrid").text().split("°")[0]) - 0.1
            let inactive = Number($("#activePointHybrid").text().split("°")[0])
            if (mode == "Cool" && parseFloat(value.toFixed(1)) < parseFloat(inactive.toFixed(1))) {
                $("#inactiveRemHybrid").parent("div").effect("shake");
            } else {
                $("#inactivePointHybrid").text((Number($("#inactivePointHybrid").text().split("°")[0]) - 0.1).toFixed(1) + "°");
                $.ajax({
                    url : '/api/changeMotionInactive',
                    type : 'POST',
                    contentType: "application/json",
                    data: '{"mode": "' + mode + '", "value":' + value + '}',
                    dataType: "json",
                });
            }
        } else {
            $("#inactiveRemHybrid").parent("div").effect("shake");
        }
    });

    //mode modals

    $("#modeBox").click(function() {
        $("#modeModal").addClass("is-active");
    });

    $(".modal-background").click(function() {
        closeModals();
    });

    $(".modal-close").click(function() {
        closeModals();
    });

    $("#modeSel p").click(function() {
        var value = $(this).text();
        if (value == $("#mode").text()) {
            closeModals();
        } else {
            $("#modeSel").hide(0);
            $("#modeConf").show(0);
            LAST_MODE = $(this).text();
        }
    });

    $("#modeConf button").click(function() {
        var value = $(this).text();
        if (value == "Confirm") {
            $("#mode").text(LAST_MODE);
            updateMode();
            loadValues();
            closeModals();
        } else {
            $("#modeSel").show(0);
            $("#modeConf").hide(0);
        }
    });


    //setting modals

    $("#settingBox").click(function() {
        $("#settingModal").addClass("is-active");
    });

    $("#settingSel p").click(function() {
        var value = $(this).text();
        if (value == $("#setting").text()) {
            closeModals();
        } else {
            $("#settingSel").hide(0);
            $("#settingConf").show(0);
            LAST_SETTING = $(this).text();
        }
    });

    $("#settingConf button").click(function() {
        var value = $(this).text();
        if (value == "Confirm") {
            $("#setting").text(LAST_SETTING);
            updateSetting();
            loadValues();
            closeModals();
        } else {
            $("#settingSel").show(0);
            $("#settingConf").hide(0);
        }
    });

    //Room stuff

    $(".myNav").click(function() {
        loadValues();
        if (NUM_ROOMS > 0) {
            if (COUNT % 2 == 0) {
                $("#roomPage").hide(0);
                $("#mainPage").fadeIn(600);
            } else {
                $("#mainPage").hide(0);
                $("#roomPage").slideDown(400);
            }
            COUNT++;
        } else {
            $("#addRoomBut").effect("shake");
        }
    });

    $("#removeRoomCog").click(function() {
        $("#roomSettingModal").addClass("is-active");
    });

    $("#removeRoomConf button").click(function() {
        var value = $(this).text();
        if (value == "Confirm") {
            //todo backend room removal
            closeModals();
        } else {
            closeModals();
        }
    });

    $("#addRoomBut").click(function() {
        $("#addRoomModal").addClass("is-active");
    });

    $("#addRoomConf button").click(function() {
        $("#wrongFormat").hide(0);
        $("#existsAlready").hide(0);
        var value = $(this).text();
        if (value == "Confirm") {
            if ($("#newNameInput").val().length <= 0 || $("#newNameInput").val() > 20) {
                $("#newNameInput").effect("shake");
                $("#wrongFormat").show(0);
                return;
            }

            if (!isValid($("#newNameInput").val())) {
                $("#newNameInput").effect("shake");
                $("#wrongFormat").show(0);
                return;
            }
            
            $.ajax({
                url : '/api/addRoom',
                contentType: "application/json",
                type : 'POST',
                data : JSON.stringify({"name":  $("#newNameInput").val()}),
                dataType: "json",
                success : function(data) {             
                    if (data.error != null && data.error == 1) {
                        $("#newNameInput").effect("shake");
                        $("#wrongFormat").hide(0);
                        $("#existsAlready").show(0);
                    } else {
                        console.log(data)
                        addListItems(data);
                        $("#currentRoom").text(data[0].name.toUpperCase());
                        $("#currentRoom").removeClass("has-text-danger");
                        closeModals();
                    }
                },
            });
        } else {
            closeModals();
        }
    });

    //delete room
    

    /*SORTABLE LIST STUFF*/
    var ul = document.getElementById('sortable-list');

    ul.addEventListener('slip:beforereorder', function(e){
    if (/demo-no-reorder/.test(e.target.className)) {
        e.preventDefault();
    }
    }, false);

    ul.addEventListener('slip:beforeswipe', function(e){
    if (e.target.nodeName == 'INPUT' || /no-swipe/.test(e.target.className)) {
        e.preventDefault();
    }
    }, false);

    ul.addEventListener('slip:beforewait', function(e){
    if (e.target.className.indexOf('instant') > -1) e.preventDefault();
    }, false);

    ul.addEventListener('slip:reorder', function(e){
    e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
    adjustListOrder();
    return false;
    }, false);

    new Slip(ul);


    //send data changes to server
    //active motion point changed
    $("#activePoint").on('DOMSubtreeModified', function(){
        let mode = $("#mode").text();
        let value = $("#activePoint").text().substring(0, $("#activePoint").text().length - 1);
        if (!(value.length > 0)) {
            return;
        }
        $.ajax({
            url : '/api/changeMotionActive',
            type : 'POST',
            contentType: "application/json",
            data: '{"mode": "' + mode + '", "value":' + value + '}',
            dataType: "json",
        });
    });

    //inactive motion point changed
    $("#inactivePoint").on('DOMSubtreeModified', function(){
        let mode = $("#mode").text();
        let value = $("#inactivePoint").text().substring(0, $("#inactivePoint").text().length - 1);
        if (!(value.length > 0)) {
            return;
        }
        $.ajax({
            url : '/api/changeMotionInactive',
            type : 'POST',
            contentType: "application/json",
            data: '{"mode": "' + mode + '", "value":' + value + '}',
            dataType: "json",
        });
    });

    //active constant point changed
    $("#activePointConst").on('DOMSubtreeModified', function(){
        let mode = $("#mode").text();
        let value = $("#activePointConst").text().substring(0, $("#activePointConst").text().length - 1);
        if (!(value.length > 0)) {
            return;
        }
        $.ajax({
            url : '/api/changeConstant',
            type : 'POST',
            contentType: "application/json",
            data: '{"mode": "' + mode + '", "value":' + value + '}',
            dataType: "json",
        });
    });


    //Schedule funcs
    $("#scheduleCols td").click(function() {
        let check = false;
        let mode = $("#mode").text().toLowerCase();
        if ($(this).is(':first-child')) {
            return;
        }
        if (MAX_SCHEDULE >= 10) {
            $("#tooManySchedules").show(0);
            $("#scheduleSel").hide(0);
        }
        if ($(this).children("div").length) {
            let scheduleID = $(this).children("div").attr('class').replace("time", "");
            SCHEDULE_ID = scheduleID;
            let json = null;
            check = true;
            $.ajax({
                async: false,
                url : '/api/getSchedule',
                type : 'POST',
                contentType: "application/json",
                data: '{"id": ' + scheduleID + ', "mode": "' + mode + '"}',
                success : function(data) {              
                    json = JSON.parse(data);
                    $("#startTime").val(json['start']);
                    $("#endTime").val(json['end']);
                    for (const el of $('#endTime')[0]){
                        $(el).addClass("hidden");
                    }
            
                    let selectedIndex = $("#startTime").prop('selectedIndex');
                    for (let i = selectedIndex; i < $('#endTime')[0].length; i++) {
                        $($('#endTime')[0][i]).removeClass("hidden");
                    }
                    let j = 0;
                    for (const el of $("#repeat li")) {
                        if (json['days'].includes(j+1)) {
                            $(el).addClass("clickedDay");
                        }
                        j++;
                    }
                    $("#constantRange").val(Number(json['temp'])*10);
                    $("#tempSlider").text(json['temp'] + "°");
                },
            });
            $("#defaultSched").text("EDIT SCHEDULE " + scheduleID);
            $("#tooManySchedules").hide(0);
            $("#scheduleSel").show(0);
            $("#deleteSchedule").show(0);
        }
        $("#scheduleModal").addClass("is-active");
        if (check == false) {
            $("#startTime").val($(this).parent("tr").children(":first").text());
            $("#startTime").trigger("change");
        }
    });


    $("#hybridCols td").click(function() {
        let check = false;
        let mode = $("#mode").text().toLowerCase();
        if ($(this).is(':first-child')) {
            return;
        }
        if (MAX_HYBRID >= 10) {
            $("#tooManyHybrids").show(0);
            $("#HybridSel").hide(0);
        }
        if ($(this).children("div").length) {
            let hybridID = $(this).children("div").attr('class').replace("time", "");
            HYBRID_ID = hybridID;
            let json = null;
            check = true;
            $.ajax({
                async: false,
                url : '/api/getHybrid',
                type : 'POST',
                contentType: "application/json",
                data: '{"id": ' + hybridID + ', "mode": "' + mode + '"}',
                success : function(data) {              
                    json = JSON.parse(data);
                    $("#startTimeHybrid").val(json['start']);
                    $("#endTimeHybrid").val(json['end']);
                    for (const el of $('#endTimeHybrid')[0]){
                        $(el).addClass("hidden");
                    }
            
                    let selectedIndex = $("#startTimeHybrid").prop('selectedIndex');
                    for (let i = selectedIndex; i < $('#endTimeHybrid')[0].length; i++) {
                        $($('#endTimeHybrid')[0][i]).removeClass("hidden");
                    }
                    let j = 0;
                    for (const el of $("#repeatHybrid li")) {
                        if (json['days'].includes(j+1)) {
                            $(el).addClass("clickedDay");
                        }
                        j++;
                    }
                    $("#constantRangeHybrid").slider("values", 0, Number(json['temp_inactive'])*10);
                    $("#constantRangeHybrid").slider("values", 1, Number(json['temp_active'])*10);
                    $("#tempSliderHybridInactive").text(json['temp_inactive'] + "°");
                    $("#tempSliderHybridActive").text(json['temp_active'] + "°");
                },
            });
            $("#defaultHybrid").text("EDIT HYBRID " + hybridID);
            $("#tooManyHybrids").hide(0);
            $("#HybridSel").show(0);
            $("#deleteHybrid").show(0);
        }
        $("#hybridModal").addClass("is-active");
        if (check == false) {
            $("#startTimeHybrid").val($(this).parent("tr").children(":first").text());
            $("#startTimeHybrid").trigger("change");
        }
    });


    $("#repeat li").click(function() {
        $(this).toggleClass("clickedDay");
    });

    $("#repeatHybrid li").click(function() {
        $(this).toggleClass("clickedDay");
    });


    $("#startTime").on("change", function() {
        for (const el of $('#endTime')[0]){
            $(el).addClass("hidden");
        }

        let selectedIndex = $("#startTime").prop('selectedIndex');
        for (let i = selectedIndex; i < $('#endTime')[0].length; i++) {
            $($('#endTime')[0][i]).removeClass("hidden");
        }

        $('#endTime').val($($('#endTime')[0][selectedIndex]).val());

    });

    $("#startTimeHybrid").on("change", function() {
        for (const el of $('#endTimeHybrid')[0]){
            $(el).addClass("hidden");
        }

        let selectedIndex = $("#startTimeHybrid").prop('selectedIndex');
        for (let i = selectedIndex; i < $('#endTimeHybrid')[0].length; i++) {
            $($('#endTimeHybrid')[0][i]).removeClass("hidden");
        }

        $('#endTimeHybrid').val($($('#endTimeHybrid')[0][selectedIndex]).val());

    });

    $("#scheduleSel button").click(function() {
        let mode = $("#mode").text().toLowerCase();
        if ($(this).text() == "Confirm") {
            if ($("#deleteSchedule").is(":visible")) {
                confirmSchedule(SCHEDULE_ID, mode);
            } else {
                confirmSchedule(null, mode);
            }
        } else {
            $.ajax({
                url : '/api/removeSchedule',
                type : 'POST',
                contentType: "application/json",
                data: '{"id": ' + SCHEDULE_ID + ', "mode": "' + mode +'"}',
                success : function(data) {              
                },
            });
            $("#scheduleCols .time" + SCHEDULE_ID).remove();
            adjustBorder();
            MAX_SCHEDULE--;
            closeModals();
        }
    });




    $("#HybridSel button").click(function() {
        let mode = $("#mode").text().toLowerCase();
        if ($(this).text() == "Confirm") {
            if ($("#deleteHybrid").is(":visible")) {
                confirmHybrid(HYBRID_ID, mode);
            } else {
                confirmHybrid(null, mode);
            }
        } else {
            $.ajax({
                url : '/api/removeHybrid',
                type : 'POST',
                contentType: "application/json",
                data: '{"id": ' + HYBRID_ID + ', "mode": "' + mode + '"}',
                success : function(data) {              
                },
            });
            $("#hybridCols .time" + HYBRID_ID).remove();
            adjustBorder();
            MAX_HYBRID--;
            closeModals();
        }
    });



    $("#constantRange").on("input", function() {
        let value = ($("#constantRange").val() / 10).toFixed(1);
        $("#tempSlider").text(value + "°");
    });



    $("#constantRangeHybrid").slider({
        range: true,
        min: 100,
        max: 350,
        step: 1,
        values: [180, 200], 
        slide: function(event, ui) {
            $("#tempSliderHybridInactive").text((ui.values[0]/10).toFixed(1) + "°");
            $("#tempSliderHybridActive").text((ui.values[1]/10).toFixed(1) + "°");
        }
    });

});


function closeModals() {
    if ($("#scheduleModal").hasClass("is-active")) {
        $("#tooManySchedules").hide(0);
        $("#scheduleSel").show(0);
        for (const el of $("#repeat li")) {
            $(el).removeClass("clickedDay");
        }
        $('#startTime').val($($('#startTime')[0][0]).val());
        for (let i = 0; i < $('#endTime')[0].length; i++) {
            $($('#endTime')[0][i]).removeClass("hidden");
        }
        $('#endTime').val($($('#endTime')[0][0]).val());
    }
    if ($("#hybridModal").hasClass("is-active")) {
        $("#tooManyHybrids").hide(0);
        $("#HybridSel").show(0);
        for (const el of $("#repeatHybrid li")) {
            $(el).removeClass("clickedDay");
        }
        $('#startTimeHybrid').val($($('#startTimeHybrid')[0][0]).val());
        for (let i = 0; i < $('#endTimeHybrid')[0].length; i++) {
            $($('#endTimeHybrid')[0][i]).removeClass("hidden");
        }
        $('#endTimeHybrid').val($($('#endTimeHybrid')[0][0]).val());
    }
    $("#dayError").hide(0);
    $("#overlapError").hide(0);
    $("#deleteSchedule").hide(0);
    $("#dayErrorHybrid").hide(0);
    $("#overlapErrorHybrid").hide(0);
    $("#deleteHybrid").hide(0);
    $("#hybridModal").removeClass("is-active");
    $("#deleteSchedule").hide(0);
    $("#defaultSched").text("SCHEDULE");
    $("#defaultHybrid").text("HYBRID");
    $("#scheduleDetailModal").removeClass("is-active");
    $("#modeSel").show(0);
    $("#modeConf").hide(0);
    $("#modeModal").removeClass("is-active");
    $("#settingSel").show(0);
    $("#settingConf").hide(0);
    $("#settingModal").removeClass("is-active");
    $("#roomSettingModal").removeClass("is-active");
    $("#addRoomModal").removeClass("is-active");
    $("#scheduleModal").removeClass("is-active");
    $("#newNameInput").val("");
    $("#constantRangeHybrid").slider("values", 0, 180);
    $("#constantRangeHybrid").slider("values", 1, 200);
    $("#tempSliderHybridInactive").text("18.0" + "°");
    $("#tempSliderHybridActive").text("20.0" + "°");
}

function getValueDrag_Range(e) {
    var value = e.value.split(",");
    //value[0] -> TOP SLIDER (inactive point in heat / active when cool)
    //value[1] -> BOTTOM SLIDER (inactive point in heat / active when cool)
    mode = $("#mode").text();
    if (mode == "Heat") {
        $("#inactivePoint").text((value[0]/10).toFixed(1) + "°");
        $("#activePoint").text((value[1]/10).toFixed(1) + "°");
    } else if (mode == "Cool") {
        $("#inactivePoint").text((value[1]/10).toFixed(1) + "°");
        $("#activePoint").text((value[0]/10).toFixed(1) + "°");
    }
}

function getValueDrag(e) {
    var value = e.value;
    $("#activePointConst").text((value/10).toFixed(1) + "°");
}


function checkSettingDiv() {
    $("#sliderCols").hide(0);
    $("#scheduleCols").hide(0);
    $("#hybridCols").hide(0);
    $("#constantDiv").hide(0);
    $("#motionDiv").hide(0);
    $("#offCol").hide(0);
    if ($("#mode").text() == "Off") {
        $("#offCol").show(0);
        return;
    }
    setting = $("#setting").text();
    if (setting == "Motion") {
        $("#sliderCols").show(0);
        $("#motionDiv").show(0);
    } else if (setting == "Constant") {
        $("#sliderCols").show(0);
        $("#constantDiv").show(0);
    } else if (setting == "Schedule") {
        $(".weekContent").animate({
            scrollTop: 0 + 350
        }, 10);
        adjustBorder();
        $("#scheduleCols").show(0);
    } else if (setting == "Hybrid") {
        $(".weekContent").animate({
            scrollTop: 0 + 350
        }, 10);
        adjustBorder();
        $("#hybridCols").show(0);
    } else {
        console.log("ERROR: did not load setting properly");
    }
}


function adjustBorder() {
    for (const el of $("td")) {
        $(el).css({"border-color": "#363636", 
                "border-width":"1px", 
                "border-style":"solid",
                "color":"grey"});
    }

    for (const el of $("td div").parent("td")) {
        $(el).css({"border-top": "none", "border-bottom": "none", "border": "none", "border-width": "0", "color": "transparent"});
    }

}


function loadSlider(valueString) {
    setting = $("#setting").text();
    if (setting == "Motion") {
        $("#slider").roundSlider({
            circleShape: "half-left",
            sliderType: "range", //Change to range when motion / regular
            handleShape: "dot",
            radius: 120,
            width: 10,
            handleSize: "+16",
            value: valueString,
            min: 100,
            max: 350, 
            svgMode: true,
            pathColor: "transparent",
            rangeColor: "transparent",
            borderWidth: 0,
            beforeCreate: "traceEvent",
            create: "traceEvent",
            start: "traceEvent",
            stop: "traceEvent",
            change: "getValueDrag_Range",
            drag: "getValueDrag_Range",
            showTooltip: false,
        }); 
        $("#slider").roundSlider("setValue", valueString);
    } else if (setting == "Constant") {
        $("#slider").roundSlider({
            circleShape: "half-left",
            sliderType: "default", //Change to range when motion / regular
            handleShape: "dot",
            radius: 120,
            width: 10,
            handleSize: "+16",
            value: valueString,
            min: 100,
            max: 350, 
            svgMode: true,
            pathColor: "transparent",
            rangeColor: "transparent",
            borderWidth: 0,
            beforeCreate: "traceEvent",
            create: "traceEvent",
            start: "traceEvent",
            stop: "traceEvent",
            change: "getValueDrag",
            drag: "getValueDrag",
            showTooltip: false,
        }); 
        $("#slider").roundSlider("setValue", valueString);
    } else if (setting == "Schedule") {
        
    } else if (setting == "Hybrid") {
        let value1 = Number(valueString.split(",")[0]);
        let value2 = Number(valueString.split(",")[1]);
    } else {
        console.log("ERROR: did not load setting properly");
    }
}



function clickPress(event) {
    if (event.key == "Enter") {
        $(event.srcElement).blur();
        return false;
    }
}


function clickNewName(event) {
    if (event.key == "Enter") {
        $(event.srcElement).blur();
        $("#confirmNewName").click();
        return false;
    }
}



function isValid(str){
    return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
}

//Server call funcs
function connect() {
    $.ajax({
        async: false,
        url : '/api/connect',
        type : 'GET',
        dataType: "json",
        success : function(data) {              
            if (data.error != null && data.error == 0) { //handle no rooms stored on server
                $("#mainPage").hide(0);
                $("#roomPage").show(0);
                $("#currentRoom").text("NO ROOMS ADDED YET.");
                $("#currentRoom").addClass("has-text-danger");
            } else {
                loadValues();
                addListItems(data);
                $("#mainPage").show(0);
                $("#roomPage").hide(0); 
                COUNT++;
                $("#currentRoom").text(data[0].name.toUpperCase());
                $("#currentRoom").removeClass("has-text-danger");
            }
        },
    });
}

function addListItems(listArray) {
    $("#sortable-list").empty()
    for (const e of listArray) {
        listItem = `<li class="no-swipe"><i class="level-item material-icons md-36 deleteX" onclick="deleteRoom(event)">close</i><input maxlength="20" minLength="1" type="text" value="${e.name}" onkeypress="clickPress(event)"/><i class="level-item material-icons md-36 handle instant">menu</i></li>`;
        $("#sortable-list").append(listItem);
    }
    NUM_ROOMS = listArray.length;

    $('#sortable-list li input').on('input', function() {
        let name = $(this).val();
        let index = $(this).parent('li').index();
        $.ajax({
            url : '/api/adjustName',
            type : 'POST',
            contentType: "application/json",
            data: '{"index": ' + index + ', "name": "' + name + '"}',
            success : function(data) {           
                $("#currentRoom").text($($("#sortable-list li input")[0]).val().toUpperCase());
                $("#currentRoom").removeClass("has-text-danger");
            },
        });
    });
}


function adjustListOrder() {
    listItems = $("#sortable-list li");
    let itemArray = []
    for (const e of listItems) {
        let name = $(e).children("input").val();
        itemArray.push(name);
    }
    
    $.ajax({
        url : '/api/adjustRooms',
        type : 'POST',
        contentType: "application/json",
        data: JSON.stringify(itemArray),
        success : function(data) {
            $("#currentRoom").text($($("#sortable-list li input")[0]).val().toUpperCase());
            $("#currentRoom").removeClass("has-text-danger");
        },
    });
}


function loadValues() {
    //load mode
    //load setting
    let valueString = null;
    $.ajax({
        async: false,
        url : '/api/loadData',
        type : 'POST',
        dataType: "json",
        success : function(data) {
            if (data.length == 0) {
                return;
            }
            data = data[0];
            MAX_HYBRID = 0;
            MAX_SCHEDULE = 0;
            $("#mode").text(data['current_mode']);
            $("#setting").text(data['current_setting']);
            if (data['current_setting'] == "Constant") {
                if (data['current_mode'] == "Cool") {
                    $("#activePointConst").text(Number(data['cool_constant_sp']).toFixed(1) + "°");
                    valueString = String(Number(data['cool_constant_sp']) * 10);
                } else {
                    $("#activePointConst").text(Number(data['heat_constant_sp']).toFixed(1) + "°");
                    valueString = String(Number(data['heat_constant_sp']) * 10);
                } 
            } else if (data['current_setting'] == "Motion") {
                if (data['current_mode'] == "Cool") {
                    $("#inactivePoint").text(Number(data['cool_motion_isp']).toFixed(1) + "°");
                    $("#activePoint").text(Number(data['cool_motion_asp']).toFixed(1) + "°");
                    valueString = String(Number(data['cool_motion_asp']) * 10) + ',' + String(Number(data['cool_motion_isp']) * 10);
                } else {
                    $("#inactivePoint").text(Number(data['heat_motion_isp']).toFixed(1) + "°");
                    $("#activePoint").text(Number(data['heat_motion_asp']).toFixed(1) + "°");
                    valueString = String(Number(data['heat_motion_isp']) * 10) + ',' + String(Number(data['heat_motion_asp']) * 10);
                } 
            } else if (data['current_setting'] == "Schedule") {
                clearTables("scheduleCols");
                let mode = $("#mode").text().toLowerCase();
                if (data['current_mode'] == "Cool") {
                    $("#activePointConstSched").text(Number(data['cool_constant_sp']).toFixed(1) + "°");
                    valueString = String(Number(data['cool_constant_sp']) * 10);
                } else {
                    $("#activePointConstSched").text(Number(data['heat_constant_sp']).toFixed(1) + "°");
                    valueString = String(Number(data['heat_constant_sp']) * 10);
                }
                for (let i = 0; i < 10; i++) {
                    try {
                        fillTableSlots(JSON.parse(data['schedule_' + String(i+1) + "_" + mode]), i, "scheduleCols");
                    } catch (error) {
                        //console.log(i);
                    }
                }
            } else {
                clearTables("hybridCols");
                let mode = $("#mode").text().toLowerCase();
                if (data['current_mode'] == "Cool") {
                    $("#inactivePointHybrid").text(Number(data['cool_motion_isp']).toFixed(1) + "°");
                    $("#activePointHybrid").text(Number(data['cool_motion_asp']).toFixed(1) + "°");
                    valueString = String(Number(data['cool_motion_asp']) * 10) + ',' + String(Number(data['cool_motion_isp']) * 10);
                } else {
                    $("#inactivePointHybrid").text(Number(data['heat_motion_isp']).toFixed(1) + "°");
                    $("#activePointHybrid").text(Number(data['heat_motion_asp']).toFixed(1) + "°");
                    valueString = String(Number(data['heat_motion_isp']) * 10) + ',' + String(Number(data['heat_motion_asp']) * 10);
                }
                for (let i = 0; i < 10; i++) {
                    try {
                        fillTableSlots(JSON.parse(data['hybrid_' + String(i+1) + "_" + mode]), i, "hybridCols");
                    } catch (error) {
                        //console.log(i);
                    }
                }
            }

            checkSettingDiv();
            loadSlider(valueString);
        },
    });
}



function updateMode() {
    let mode = $("#mode").text();
    $.ajax({
        async: false,
        url : '/api/changeMode',
        type : 'POST',
        contentType: "application/json",
        data: '{"mode": "' + mode + '"}',
        dataType: "json",
    });
}

function updateSetting() {
    let setting = $("#setting").text();
    $.ajax({
        async: false,
        url : '/api/changeSetting',
        type : 'POST',
        contentType: "application/json",
        data: '{"setting": "' + setting + '"}',
        dataType: "json",
    });
}


function loadInputs() {
    let times = $("td:first-child");

    let i = 0;
    for (const el of times) {
        $("#startTime").append("<option>" + $(el).text() + "</option>");
        $("#startTimeHybrid").append("<option>" + $(el).text() + "</option>");
        if (i > 0) {
            $("#endTime").append("<option>" + $(el).text() + "</option>");
            $("#endTimeHybrid").append("<option>" + $(el).text() + "</option>");
        }
        i++;
    }
    $("#endTime").append("<option>12:00 AM</option>");
    $("#endTimeHybrid").append("<option>12:00 AM</option>");

    let td = $("#startTime")[0];
    for (const el of td) {
        $(el).val($(el).text());
    }

}




function deleteRoom(event) {
    let remName = $(event.srcElement).parent("li").children("input").val();
    let remove = $(event.srcElement).parent("li");
    $.ajax({
        url : '/api/removeRoom',
        type : 'POST',
        contentType: "application/json",
        data: JSON.stringify(remName),
        success : function(data) {              
            $(remove).remove();
            
            if ($("#sortable-list li").length == 0) {
                $("#mainPage").hide(0);
                $("#roomPage").show(0);
                $("#currentRoom").text("NO ROOMS ADDED YET.");
                $("#currentRoom").addClass("has-text-danger");
            } else {
                $("#currentRoom").text($($("#sortable-list li input")[0]).val().toUpperCase());
                $("#currentRoom").removeClass("has-text-danger");
            }

        },
    });
}


function fillTableSlots(json, index, tableID) {
    let times = []
    let start = false;
    for (const el of $("#" + tableID + " td:first-child")) {
        if ($(el).text() == json['start']) {
            start = true;
        }
        if ($(el).text() == json['end'] && json['end'] != "12:00 AM") {
            break;
        }
        if (start) {
            times.push($(el).text() );
        }
    }


    let column = 8;
    let currTime = 0;
    let item = '<div class="time' + String(index+1) + '"></div>';
    for (const el of $("#" + tableID +  " td")) {
        if (column == 8) {
            column = 0;
            currTime = $(el).text();
        } else if (column == 1 && json['days'].includes(1) && times.includes(currTime)) { //sun
            $(el).append(item);
        } else if (column == 2 && json['days'].includes(2) && times.includes(currTime)) { //mon
            $(el).append(item);
        } else if (column == 3 && json['days'].includes(3) && times.includes(currTime)) { //tues
            $(el).append(item);
        } else if (column == 4 && json['days'].includes(4) && times.includes(currTime)) { //wed
            $(el).append(item);
        } else if (column == 5 && json['days'].includes(5) && times.includes(currTime)) { //thurs
            $(el).append(item);
        } else if (column == 6 && json['days'].includes(6) && times.includes(currTime)) { //fri
            $(el).append(item);
        } else if (column == 7 && json['days'].includes(7) && times.includes(currTime)) { //sat
            $(el).append(item);
        }
        column++;
    }

    adjustBorder();
    if (tableID == "scheduleCols") {
        MAX_SCHEDULE++;
    } else {
        MAX_HYBRID++;
    }
}


function confirmSchedule(elementID, mode) {
    $("#dayError").hide(0);
    $("#overlapError").hide(0);
    $("#deleteSchedule").hide(0);
    let days = [];
    let i = 0;
    for (const el of $("#repeat li")) {
        if ($(el).hasClass("clickedDay")) {
            days.push(i+1);
        }
        i++;
    }
    if (days.length == 0) {
        $("#dayError").show(0);
        $($("#scheduleModal .toCentre button")[1]).effect("shake");
        return;
    }
    let start = $("#startTime").val();
    let end = $("#endTime").val();
    let times = [];
    let selectedIndexStart = $("#startTime").prop('selectedIndex');
    let selectedIndexEnd = $("#endTime").prop('selectedIndex') + 1;
    for (i = selectedIndexStart; i < selectedIndexEnd; i++) {
        times.push($($('#startTime')[0][i]).text());
    }
    let temp = $("#tempSlider").text().split("°")[0];
    let json = '{"start": "' + start + '", "end": "' + end + '", "days": [' + days + '], "temp": "' + temp + '"}';
    
    //brute force check to make sure no overlap
    let column = 8;
    let currTime = 0;
    for (const el of $("#scheduleCols td")) {
        if (column == 8) {
            column = 0;
            currTime = $(el).text();
        } else if (column == 1 && days.includes(1) && times.includes(currTime)) { //sun
            if($(el).children("div").length && !($(el).children("div").hasClass("time"+elementID))) {
                $("#overlapError").show(0);
                $("#scheduleModal .toCentre button").effect("shake");
                return;
            }
        } else if (column == 2 && days.includes(2) && times.includes(currTime)) { //mon
            if($(el).children("div").length && !($(el).children("div").hasClass("time"+elementID))) {
                $("#overlapError").show(0);
                $("#scheduleModal .toCentre button").effect("shake");
                return;
            }
        } else if (column == 3 && days.includes(3) && times.includes(currTime)) { //tues
            if($(el).children("div").length && !($(el).children("div").hasClass("time"+elementID))) {
                $("#overlapError").show(0);
                $("#scheduleModal .toCentre button").effect("shake");
                return;
            }
        } else if (column == 4 && days.includes(4) && times.includes(currTime)) { //wed
            if($(el).children("div").length && !($(el).children("div").hasClass("time"+elementID))) {
                $("#overlapError").show(0);
                $("#scheduleModal .toCentre button").effect("shake");
                return;
            }
        } else if (column == 5 && days.includes(5) && times.includes(currTime)) { //thurs
            if($(el).children("div").length && !($(el).children("div").hasClass("time"+elementID))) {
                $("#overlapError").show(0);
                $("#scheduleModal .toCentre button").effect("shake");
                return;
            }
        } else if (column == 6 && days.includes(6) && times.includes(currTime)) { //fri
            if($(el).children("div").length && !($(el).children("div").hasClass("time"+elementID))) {
                $("#overlapError").show(0);
                $("#scheduleModal .toCentre button").effect("shake");
                return;
            }
        } else if (column == 7 && days.includes(7) && times.includes(currTime)) { //sat
            if($(el).children("div").length && !($(el).children("div").hasClass("time"+elementID))) {
                $("#overlapError").show(0);
                $("#scheduleModal .toCentre button").effect("shake");
                return;
            }
        }
        column++;
    }
    //store on server and decide what cells to highlight
    if (elementID == null) {
        $.ajax({
            async: false,
            url : '/api/addSchedule',
            type : 'POST',
            contentType: "application/json",
            data: '[{"mode": "' + mode + '"},' + json + ']',
            success: function(data) {
                fillTableSlots(JSON.parse(json), getAvailableSched("scheduleCols"), "scheduleCols");
            },
        });
    } else {
        $.ajax({
            async: false,
            url : '/api/editSchedule',
            type : 'POST',
            contentType: "application/json",
            data: '[{"id":' + elementID + ', "mode": "' + mode + '"},' + json + ']',
            success: function(data) {
                $("#scheduleCols .time" + elementID).remove();
                fillTableSlots(JSON.parse(json), elementID-1, "scheduleCols");
                adjustBorder();
            },
        });
    }

    closeModals();
}


function getAvailableSched(tableID) {
    for (let i = 0; i < 10; i++) {
        if ($("#" + tableID + " .time" + String(i+1)).length == 0) {
            return i;
        }
    }
}



function confirmHybrid(elementID, mode) {
    $("#dayErrorHybrid").hide(0);
    $("#overlapErrorHybrid").hide(0);
    $("#deleteHybrid").hide(0);
    let days = [];
    let i = 0;
    for (const el of $("#repeatHybrid li")) {
        if ($(el).hasClass("clickedDay")) {
            days.push(i+1);
        }
        i++;
    }
    if (days.length == 0) {
        $("#dayErrorHybrid").show(0);
        $($("#hybridModal .toCentre button")[1]).effect("shake");
        return;
    }
    let start = $("#startTimeHybrid").val();
    let end = $("#endTimeHybrid").val();
    let times = [];
    let selectedIndexStart = $("#startTimeHybrid").prop('selectedIndex');
    let selectedIndexEnd = $("#endTimeHybrid").prop('selectedIndex') + 1;
    for (i = selectedIndexStart; i < selectedIndexEnd; i++) {
        times.push($($('#startTimeHybrid')[0][i]).text());
    }

    let temp_inactive = $("#tempSliderHybridInactive").text().split("°")[0];
    let temp_active = $("#tempSliderHybridActive").text().split("°")[0];
    let json = '{"start": "' + start + '", "end": "' + end + '", "days": [' + days + '], "temp_inactive": "' + temp_inactive + '", "temp_active": "' + temp_active + '"}';

    
    //brute force check to make sure no overlap
    let column = 8;
    let currTime = 0;
    for (const el of $("#hybridCols td")) {
        if (column == 8) {
            column = 0;
            currTime = $(el).text();
        } else if (column == 1 && days.includes(1) && times.includes(currTime)) { //sun
            if($(el).children("div").length && !($(el).children("div").hasClass("time"+elementID))) {
                $("#overlapErrorHybrid").show(0);
                $("#hybridModal .toCentre button").effect("shake");
                return;
            }
        } else if (column == 2 && days.includes(2) && times.includes(currTime)) { //mon
            if($(el).children("div").length && !($(el).children("div").hasClass("time"+elementID))) {
                $("#overlapErrorHybrid").show(0);
                $("#hybridModal .toCentre button").effect("shake");
                return;
            }
        } else if (column == 3 && days.includes(3) && times.includes(currTime)) { //tues
            if($(el).children("div").length && !($(el).children("div").hasClass("time"+elementID))) {
                $("#overlapErrorHybrid").show(0);
                $("#hybridModal .toCentre button").effect("shake");
                return;
            }
        } else if (column == 4 && days.includes(4) && times.includes(currTime)) { //wed
            if($(el).children("div").length && !($(el).children("div").hasClass("time"+elementID))) {
                $("#overlapErrorHybrid").show(0);
                $("#hybridModal .toCentre button").effect("shake");
                return;
            }
        } else if (column == 5 && days.includes(5) && times.includes(currTime)) { //thurs
            if($(el).children("div").length && !($(el).children("div").hasClass("time"+elementID))) {
                $("#overlapErrorHybrid").show(0);
                $("#hybridModal .toCentre button").effect("shake");
                return;
            }
        } else if (column == 6 && days.includes(6) && times.includes(currTime)) { //fri
            if($(el).children("div").length && !($(el).children("div").hasClass("time"+elementID))) {
                $("#overlapErrorHybrid").show(0);
                $("#hybridModal .toCentre button").effect("shake");
                return;
            }
        } else if (column == 7 && days.includes(7) && times.includes(currTime)) { //sat
            if($(el).children("div").length && !($(el).children("div").hasClass("time"+elementID))) {
                $("#overlapErrorHybrid").show(0);
                $("#hybridModal .toCentre button").effect("shake");
                return;
            }
        }
        column++;
    }
    //store on server and decide what cells to highlight
    if (elementID == null) {
        $.ajax({
            async: false,
            url : '/api/addHybrid',
            type : 'POST',
            contentType: "application/json",
            data: '[{"mode": "' + mode + '"},' + json + ']',
            success: function(data) {
                fillTableSlots(JSON.parse(json), getAvailableSched("hybridCols"), "hybridCols");
            },
        });
    } else {
        $.ajax({
            async: false,
            url : '/api/editHybrid',
            type : 'POST',
            contentType: "application/json",
            data: '[{"id":' + elementID + ', "mode": "' + mode + '"},' + json + ']',
            success: function(data) {
                $("#hybridCols .time" + elementID).remove();
                fillTableSlots(JSON.parse(json), elementID-1, "hybridCols");
                adjustBorder();
            },
        });
    }

    closeModals();
}


function clearTables(tableID) {
    for (let i = 1; i < 11; i++) {
        $("#" + tableID + " .time" + i).remove();
    }
    adjustBorder();
}