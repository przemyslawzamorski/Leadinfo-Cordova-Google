/* ----funkcje fraeworka --*/

/*funkcja framework - pobiera okreslony typ danych*/
function get_date_type(asyncvalue, type, succesfunction, errorfunction) {
    $.ajax({
        type: 'GET',
        async: asyncvalue,
        url: window.serwer + "/rin/" + type,
        processData: true,
        data: {},
        crossDomain: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(window.username + ":" + window.password));
        },
        success: function (data) {
            succesfunction(data);
        },
        error: function (data) {
            errorfunction(data);
        }
    });
}

/*funkcja framework - wykonuje operacje z podanymi danymi typu data: "{\"LEADYLEADID\":" + window.object.LEADID + " }\n" */
function execute_given_operation(operation, operation_data, succes_function, error_function, complete_function, done_function) {
    $.ajax({
        async: true,
        url: window.serwer + "/ope/" + operation,
        method: "POST",
        dataType: 'json',
        data: operation_data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(window.username + ":" + window.password));
        },
        success: function (data) {
            succes_function(data);
        },
        error: function (data) {
            error_function(data);
        },
        complete: function (data) {
            complete_function(data);
        }

    }).done(function (data) {
        done_function(data);
    });
}

/*funkcja framework -  obliczajaca roznice czasowo*/
function time_difference(time_given) {

    var leed_date = time_given;
    leed_date = leed_date.split(/(?:-| |:)+/);
    var correct_month = leed_date[1] - 1;
    var lead_time = new Date(leed_date[0], correct_month, leed_date[2],
        leed_date[3], leed_date[4], leed_date[5]);
    var current_time = new Date(Date.now());
    var diffMs = (lead_time - current_time );

    var diffSeconds = diffMs / 1000;
    var HH = diffSeconds / 3600;
    var MM = (diffSeconds % 3600) / 60;
    var DD = HH / 24;
    console.log(DD + '' + HH + ' ' + MM);

    if (DD != 0) {
        var time_status = parseInt(DD) + " dni";
    } else if (DD == 0 && HH != 0) {
        var time_status = parseInt(HH) + " godzin";
    } else {
        var time_status = parseInt(MM) + " minut";
    }
    return time_status;
}

var Base64 = {

// private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

// public method for encoding
    encode: function (input) {
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
    decode: function (input) {
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
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

// private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}