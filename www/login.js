function check_server() {
    window.serwer = localStorage.getItem("server");
    window.serwer_display = localStorage.getItem("server_name");
    if (window.serwer) {
        $("#serwer_name").empty();
        $("#login_form").css("display", "block");
        $("#serwer_form").css("display", "none");
        $("#serwer_name").append(window.serwer_display);
    } else {
        $("#serwer_form").css("display", "block");
        $("#login_form").css("display", "none");
    }
}

function add_serwer() {
    $("#server_error").css("display", "none");
    $("#no_server").css("display", "none");
    localStorage.removeItem('server');
    localStorage.removeItem('server_name');
    window.serwer_data = $("#serwer_form").serializeArray();
    /*nazwa serwera*/
    var server_name = serwer_data[0].value;
    server_name = server_name.toLowerCase();


    if (server_name.indexOf("https://") > -1) {
        localStorage.setItem("server", server_name);
        localStorage.setItem("server_name", server_name);
        console.log(server_name);
        check_server();
        $("#load_assign_gif").css("display", "none");

    } else {
        $.ajax({
            type: 'GET',
            contentType: "text/xml",
            url: "http://www.fastdata.com.pl/kontrahenci/config.xml",
            success: function(data) {
                var url_port = 0;
                console.log(data);

                var kontrahents = data.getElementsByTagName("kontrahent");
                var server_name_upper = server_name.toUpperCase();

                for (i = 0; i < kontrahents.length; i++) {

                    if (server_name_upper == kontrahents[i].getElementsByTagName("kod")[0].textContent) {
                        url_port = kontrahents[i].getElementsByTagName("port")[0].textContent;
                    }
                }

                /*jezelei istnieje taki kod to*/
                if (url_port) {
                    var full_server_url = "https://" + server_name_upper + ".fastdata.com.pl:" + url_port;
                    console.log(full_server_url);
                    localStorage.setItem("server", full_server_url);
                    localStorage.setItem("server_name", server_name);
                    check_server();
                    $("#load_assign_gif").css("display", "none");


                } else {
                    $("#no_server").css("display", "block");

                }
            },
            error: function(xhr, status, error) {
                $("#server_error").css("display", "block");
            }
        });
    }

}

function change_serwer() {
    $("#load_assign_gif").css("display", "none");
    $("#serwer_form").css("display", "block");
    $("#login_form").css("display", "none");
    $("#login_error").css("display", "none");
    if (window.serwer) {
        $("#back-button").css("display", "inline-block");
    } else {
        $("#back-button").css("display", "none");
    }
}


function back_to_login() {
    $("#serwer_form").css("display", "none");
    $("#login_form").css("display", "block");

}


function log_in() {
    $("#login_error").css("display", "none");
    load_start();

    /*pobranie serwera*/
    window.serwer = localStorage.getItem("server");

    var index = window.serwer.indexOf("/");
    index = index + 1;
    window.header = window.serwer.substr(0, index);
    window.rest_url = window.serwer.substr(index + 1);

    window.login_data = $("#login_form").serializeArray();
    window.username = login_data[0].value.toUpperCase();
    window.password = login_data[1].value;
    if (window.password == "" && window.username == "") {
        window.username = "a";
        window.password = "a";
    }


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            $("#contact_info_load").remove();
            window.test = JSON.parse(xhttp.responseText);
            console.log(window.test);
            $("#login_error").css("display", "none");
            $("#leeds-content").load('auth_app.html');
            $("#leeds-content").css("display", "block");
            $("#login").css('display', "none");
            $("#contact_info_load").remove();

        } else if (xhttp.status == 401 || xhttp.status == 403) {
            $("#contact_info_load").remove();
            $("#login_error").empty();
            $("#login_error").append("Wprowadzono bledna nazwe uzytkownika lub haslo lub dane serwera. Wprowadz poprawne dane!");
            $("#login_error").css("display", "block");

        } else if (xhttp.status == 500) {
            $("#contact_info_load").remove();
            $("#login_error").empty();
            $("#login_error").append("Wystapil bład na serwerze. Skontaktuj sie z administracja.");
            $("#login_error").css("display", "block");
        }
    };

    xhttp.open("GET", window.header + window.rest_url + "/rin/mob_leady?resultsPerPage=1000", true);
    console.log(window.header + window.rest_url + "/rin/mob_leady?resultsPerPage=1000");
    xhttp.setRequestHeader("Authorization", "Basic " + Base64.encode(window.username + ":" + window.password));
    xhttp.send();

}

function load_start() {
    $("#login_form").append(' <div id="contact_info_load" class="col-centered" style="text-align: center; padding-top: 15px;"><img src="ajax-loader.gif" ></div>');
}

var Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode: function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode: function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode: function(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}