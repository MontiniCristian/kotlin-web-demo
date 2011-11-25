/**
 * Created by IntelliJ IDEA.
 * User: Natalia.Ukhorskaya
 * Date: 11/10/11
 * Time: 12:12 PM
 * To change this template use File | Settings | File Templates.
 */

var kotlinVersion;

function setKotlinVersion(version) {
    kotlinVersion = version;
   document.getElementById("kotlinVersion").innerHTML = kotlinVersion;
   document.getElementById("kotlinVersionTop").innerHTML = "(" + kotlinVersion + ")";
}



(function () {
    var isLeftSideShow = true;
    var isRightSideShow = true;

    $("#hideLeft").click(function () {
        $("#left").toggle();
        isLeftSideShow = !isLeftSideShow;
        if (isLeftSideShow) {
            document.getElementById("hideLeft").src = "/icons/togglel.png";
            document.getElementById("hideLeft").title = "Hide left side";
            document.getElementById("left").style = "width: 20%; *width: 230px;";
            if (isRightSideShow) {
                document.getElementById("center").style.width = "60%";
            } else {
                document.getElementById("center").style.width = "79%";
            }
        } else {
            document.getElementById("hideLeft").src = "/icons/toggler.png";
            document.getElementById("hideLeft").title = "Show left side";
            if (isRightSideShow) {
                document.getElementById("center").style.width = "80%";
            } else {
                document.getElementById("center").style.width = "99%";
            }
        }
    });

    $("#hideRight").click(function () {
        $("#right").toggle();
        isRightSideShow = !isRightSideShow;
        if (isRightSideShow) {
            document.getElementById("hideRight").src = "/icons/toggler.png";
            document.getElementById("hideRight").title = "Hide right side";
            document.getElementById("right").style.width = "19%";
            if (isLeftSideShow) {
                document.getElementById("center").style.width = "60%";
            } else {
                document.getElementById("center").style.width = "80%";
            }
        } else {
            document.getElementById("hideRight").src = "/icons/togglel.png";
            document.getElementById("hideRight").title = "Show right side";
            if (isLeftSideShow) {
                document.getElementById("center").style.width = "79%";
            } else {
                document.getElementById("center").style.width = "99%";
            }
        }
    });

    $("#tabs").tabs();

    /*$("#editorinput").resizable({
        handles:"s",
        alsoResize:".CodeMirror-scroll"
    });*/


    $('.accordion .head').click(
        function () {
            $(this).next().toggle();
            return false;
        }).next().hide();


})();

function loadAccordionContent() {
    var acc = document.createElement("div");
    acc.id = "accordion";
    $.ajax({
        url:document.location.href + "?sessionId=" + sessionId + "&allExamples=true",
        context:document.body,
        success:onLoadingExamplesSuccess,
        dataType:"json",
        type:"GET",
        //data:{text:i},
        timeout: 10000,
        error:function () {
            document.getElementById("statusbar").innerHTML = "Loading examples failed.";
        }
    });
    document.getElementById("examplesaccordion").appendChild(acc);
}

function onLoadingExamplesSuccess(data) {
    var acc = document.getElementById("accordion");
    var i = 0;
    while (typeof data[i] != "undefined") {
        var lastHeadName;
        if (data[i].type == "head") {
            var head = document.createElement("h3");
            var headA = document.createElement("a");
            headA.href = "#";

            headA.innerHTML = data[i].text;
            lastHeadName = data[i].text
            head.appendChild(headA);
            acc.appendChild(head);
            var cont = document.createElement("div");
        }
        if (data[i].type == "content") {
            var contA = document.createElement("p");
            contA.id = i + "&head=" + lastHeadName;
            contA.style.cursor = "pointer";
            contA.onclick = function (event) {
                loadExample(this.id);
                loadExamplesHelp(this.innerHTML);
            };
            contA.innerHTML = data[i].text;
            cont.appendChild(contA);
        }
        acc.appendChild(cont);
        i++;
    }
    $("#accordion").accordion({
        autoHeight:false,
        navigation:true
    });
//    document.getElementById("accordion").style.width = "100%";
}

var loadingExample = false;

var lastSelectedExample = 0;

function loadExample(id) {
    removeStyles();
    var el = document.getElementById(lastSelectedExample);
    if (el != null) {
        el.className = "";
    }

    lastSelectedExample = id;
    document.getElementById(id).className = "selectedExample";
    document.getElementById("statusbar").innerHTML = "Loading example...";
    loadingExample = true;
    $.ajax({
        url:document.location.href + "?sessionId=" + sessionId + "&exampleId=" + id,
        context:document.body,
        success:onLoadingExampleSuccess,
        dataType:"json",
        type:"GET",
//        data:{text: i},
        timeout:10000,
        error:function () {
            loadingExample = false;
            document.getElementById("statusbar").innerHTML = "Loading example failed.";
        }
    });
}

function onLoadingExampleSuccess(data) {
    editor.focus();
    loadingExample = false;
    if (typeof data[0] != "undefined") {
        editor.setValue(data[0].text);
        document.getElementById("statusbar").innerHTML = "Example is loaded.";
    }
}