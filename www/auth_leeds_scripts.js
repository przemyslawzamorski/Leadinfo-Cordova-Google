window.old_click = 0;
window.click_id = 0;
window.lead_contact = [];

/*logout*/
function log_out() {
    var nohttps_url = window.serwer;
    nohttps_url = nohttps_url.replace("https://", "");
    $.ajax(window.header + "a:a@" + window.rest_url + "/apps/leadinfo/auth_leeds_styles.css", {
        /*wylogowuwyje i czyszczcze dane*/
        statusCode: {
            401: function() {
                $("#username,#password,#modal-title,#modal-content,#main-content ").empty();
                $("#password").empty();
                $("#login").css("display", "block");
                $("#login").css("height", "100vh");
                $("#login").css("width", "100vw");
                $("#leeds-content").css("display", "none");
                $("#password").val('');
                $("#username").val('');
                window.my_leeds = '';
                window.new_leads = '';
                window.open_with = '';
                window.user = '';
                window.usr_short = '';
                window.object = '';
                location.reload();
            }
        }
    });
}

/*podzial leadow po statusie i wywołanie renderowania*/
function leads_divison_and_init_render(leads) {

    $.when(window.new_leads = $.grep(leads, function(e) {
        return e.STATUSCODE == "NEW"
    })).then(function() {
        /*console.log("Nowe ", window.new_leads);*/
        render_leeds_in_place(window.new_leads, "new-leads");
    });

    $.when(window.open_with = $.grep(leads, function(e) {
        return e.STATUSCODE == "OPEN" && !e.UPRAWNIENIA_PRACA

    })).then(function(x) {
        /*console.log("otwarte z ", window.open_with);*/
        render_leeds_in_place(window.open_with, "open-no-attribution");
    });

    $.when(window.my_leeds = $.grep(leads, function(e) {
        return e.UPRAWNIENIA_PRACA == window.usr_short && e.STATUSCODE == "OPEN"
    })).then(function(x) {
        /* console.log("moje ", window.my_leeds);*/
        render_leeds_in_place(window.my_leeds, "my-leeds");
        window.setTimeout(function() {
            $("#refresh-button").removeClass("glyphicon-refresh-animate");
        }, 1000);
    });
}


/*renderuje leady w okreslonym miejscu*/
function render_leeds_in_place(data, destination) {

    /*czyszczenie i dodawania zawarotsci leedow*/
    $("#" + destination).empty();
    //console.log("wszedl");
    if (data.length == 0) {
        switch (destination) {
            case "new-leads":
                $("#" + destination).append("<td class='status-cell red-background' ><i class='fa fa-exclamation-triangle'></i></td><td>Brak nowych leadow</td>");
                break;
            case "open-no-attribution":
                $("#" + destination).append("<td class='status-cell yellow-background' ><i class='fa fa-exclamation-triangle'></i></td><td>Brak otwartch nieprzypisanych leadow</td>");
                break;
            case "my-leeds":
                $("#" + destination).append("<td class='status-cell green-background' ><i class='fa fa-exclamation-triangle'></i></td><td>Brak twoich otwartych leadow</td>");
                break;
        }
    } else {
        for (var i = 0; i < data.length; i++) {
            /*tworzenie wiersza z opcją klikania na niego i wyswietlania info szczeolowych */
            $('<tr>', { id: data[i].LEADID }).appendTo('#' + destination);
            $("#" + data[i].LEADID).attr("onclick", "get_lead_info(this.id)");
            $("#" + data[i].LEADID).attr("data-toggle", "modal");
            $("#" + data[i].LEADID).attr("data-target", "#leedsTable");

            /*dodawanie statusu nowy otwary lub mój*/
            switch (destination) {
                case "new-leads":
                    $("#" + data[i].LEADID).append("<td class='status-cell red-background'><i class='fa fa-exclamation-triangle'></i></td>");
                    break;
                case "open-no-attribution":
                    $("#" + data[i].LEADID).append("<td class='status-cell yellow-background'><i class='fa fa-exclamation-triangle'></i></td>");
                    break;
                case "my-leeds":
                    $("#" + data[i].LEADID).append("<td class='status-cell green-background'><i class='fa fa-exclamation-triangle'></i></td>");
                    break;
            }

            /*dodawanie id leada oraz nazwy od kogo  */
            $("#" + data[i].LEADID).append("<td class='col40 brake-lines' >" + data[i].LEADID + "</br>" + data[i].FIRSTNAME + " " + data[i].LASTNAME + "</td>");

            /*dodawanie kolejnego kroku oraz czasu ktory pozostał*/
            if (data[i].CONTACTDATE && data[i].OPENDATE) {
                render_date(data[i], data[i].TARGETCLOSEDATE, "Zamknięcie");

            } else if (data[i].OPENDATE && !data[i].CONTACTDATE) {
                render_date(data[i], data[i].TARGETCONTACTDATE, "Kontakt");

            } else if (!data[i].OPENDATE) {
                render_date(data[i], data[i].TARGETOPENDATE, "Otwarcie");
            }
            /*dodawanie aktywnosci lini*/
            if (window.old_click == data[i].LEADID) $("#" + window.old_click).addClass("active-line");
        }
    }
}

function render_date(object_data, date, status) {

    $("#" + object_data.LEADID).append("<td class='col30' >" + status + "</td>");
    var time = time_difference(date);

    if (time_difference_number(date) >= 0) {
        $("#" + object_data.LEADID).append("<td class='col30'>" + time + "</td>");
    } else {
        $("#" + object_data.LEADID).append("<td class='warning no-side-padding col30' >" + time.replace("-", "") + " przekroczono</td>");
    }
}

/*informacje szczegolowe leeda*/
function get_lead_info(this_id) {
    $("#" + window.old_click).removeClass("active-line");
    window.click_id = this_id;
    window.old_click = window.click_id;
    $("#" + window.click_id).addClass("active-line");
    /* console.log(this_id);*/

    var single_lead = $.grep(window.new_leads, function(e) {
        return e.LEADID == this_id;
    });
    if (single_lead.length != 0) window.object = single_lead[0];

    single_lead = $.grep(window.open_with, function(e) {
        return e.LEADID == this_id;
    });
    if (single_lead.length != 0) window.object = single_lead[0];

    single_lead = $.grep(window.my_leeds, function(e) {
        return e.LEADID == this_id;
    });
    if (single_lead.length != 0) window.object = single_lead[0];


    console.log('a', object);
    var status = '';
    var nazwa_leedu = '';

    /*dodawanie naglowku do okna modalnego */
    $("#modal-title").empty();
    if (object.KAMPANIA) {
        var nazwa_leedu = object.KAMPANIA
    }
    if (object.STATUSCODE == "NEW") {
        status = nazwa_leedu + ' (' + object.LEADID + ') - <span class="font-red">' + "Nowy" + '</span>';
    } else {
        status = nazwa_leedu + ' (' + object.LEADID + ') - <span class="font-orange">' + "Otwarty";
        if (object.CONTACTDATE) {
            status += ' - skontaktowany</span>';
        } else {
            status += ' - nieskontaktowany</span>';
        }
    }
    $("#modal-title").append(status);

    /*append content to leeds information modal */
    $("#modal-content").empty();
    $("#modal-content").append('<tr><th><i class="fa fa-bars"></i>  Dane podstawowe </th><th>  </th></tr>');
    if (object.PRZYPISANY) {
        $("#modal-content").append("<tr><td>Przypisany do</td><td> " + object.PRZYPISANY + "</td></tr>");
    }
    if (object.TARGETOPENDATE) {
        $("#modal-content").append("<tr><td>Szacowana data otwarcia</td><td> " + object.TARGETOPENDATE.slice(0, 16) + "</td></tr>");
    }
    if (object.OPENDATE) {
        $("#modal-content").append("<tr><td>Data otwarcia</td><td> " + object.OPENDATE.slice(0, 16) + "</td></tr>");
    }
    if (object.TARGETCONTACTDATE) {
        $("#modal-content").append("<tr><td>Szacowana data kontaktu</td><td> " + object.TARGETCONTACTDATE.slice(0, 16) + "</td></tr>");
    }
    if (object.CONTACTDATE) {
        $("#modal-content").append("<tr><td>Data kontaktu</td><td> " + object.CONTACTDATE.slice(0, 16) + "</td></tr>");
    }
    if (object.TARGETCLOSEDATE) {
        $("#modal-content").append("<tr><td>Szacowana data zamkniecia</td><td> " + object.TARGETCLOSEDATE.slice(0, 16) + "</td></tr>");
    }
    if (object.CLOSEDATE) {
        $("#modal-content").append("<tr><td>Data zamkniecia</td><td> " + object.CLOSEDATE.slice(0, 16) + "</td></tr>");
    }
    if (object.OPIS_KAMPANII) {
        $("#modal-content").append('<tr><th><i class="fa fa-bars"></i>  Opis </th><th>  </th></tr>');
        $("#modal-content").append("<tr><td>" + object.OPIS_KAMPANII + "</td><tr>  ");
    }

    if (object.MODEL1) {
        $("#modal-content").append('<tr><td>  Dotyczy </td><td>' + object.MODEL1 + ' </td></tr>');
    }


    /* //Dane kontaktowe //*/
    $("#modal-content").append('<tr><th class="normal-font"><i class="fa fa-bars"></i>  Dane kontaktowe </th><th>  </th></tr>');

    /*gif doładowywania danych kontaktowych */
    $("#contact_info_load").remove();
    $("#modal-content").append(' <div id="contact_info_load" class="col-centered loader-inner" ><img src="ajax-loader.gif" ></div>');

    if (object.FIRSTNAME && object.LASTNAME) {
        $("#modal-content").append('<tr><td class="normal-font"><i class="fa fa-user"> </i> ' +
            object.POZDROWIENIE + ' ' + object.FIRSTNAME + ' ' + object.LASTNAME + '</td><td>  </td></tr>');
    }

    /*pobieranie albo z serwera albo z tablicy danych kontaktowych*/
    $.when(
        window.lead_contact_info = $.grep(window.lead_contact, function(e) {
            return e.LEADID == object.LEADID;
        })
    ).then(function() {
        if (window.lead_contact_info.length != 0) {
            window.lead_contact_info = lead_contact_info[0];
            append_contact_info(window.lead_contact_info);
        } else {
            var contact_info_link = window.serwer + "/rin/lead_con/" + object.LEADID;

            get_date_type(true, "lead_con/" + object.LEADID, function(data) {
                window.lead_contact_info = data;
                window.lead_contact.push(data);
                append_contact_info(window.lead_contact_info);
            }, function() {
                /* console.log("nie mozna zaladowac danych szczegolowych");*/
            });
        }
    });

    /*button przypisania*/
    $("#assign").remove();
    if (!window.object.PRZYPISANY || window.object.STATUSCODE == "NEW") {
        $('<button>', { id: 'assign' }).appendTo("#modal-footer");
        $("#assign").attr("class", "btn btn-default");
        $("#assign").text("Przypisz sobie");
        $("#assign").attr("onclick", "assign_lead()");
    }
}


function append_contact_info(data) {
    /*usuniecie gifu doladowania*/
    $("#contact_info_load").css("display", "None");

    /*dodanie do tablicy danych konaktowych*/
    window.lead_contact.push(data);

    /* dodawanie numeru telefonu kom */
    if (data.PHONEMOBILE || data.PHONEHOME) {
        $("#modal-content").append('</tr><tr><td><i class="fa fa-mobile"></i><strong> Numer telefonu</strong></td><td> </td></tr>');

        if (data.PHONEMOBILE) {
            $('<tr>', { id: "numberCell" }).appendTo('#modal-content');
            $("#numberCell").append("<td>" + data.PHONEMOBILE + "</td> ");
            if (window.object.UPRAWNIENIA_PRACA) {
                var button = '<button><a href="tel:' + data.PHONEMOBILE + '" onclick="mod()" >Zadzwon</a></button>';
                $("#numberCell").append(button);
            }
        }

        if (data.PHONEHOME) {

            $('<tr>', { id: "numberCell" }).appendTo('#modal-content');
            $("#numberCell").append("<td>" + data.PHONEHOME + "</td> ");
            if (window.object.UPRAWNIENIA_PRACA) {
                var button = '<button><a href="tel:' + data.PHONEHOME + '" onclick="mod()" >Zadzwon</a></button>';
                $("#numberCell").append(button);
            }
        }
    }

    /* dodawanie email */
    if (data.EMAIL) {
        window.contact_email = data.EMAIL;
        $("#modal-content").append('<tr><td><i class="fa fa-envelope"></i><strong> Adres email</strong></td><td> </td></tr>');
        $('<tr>', { id: "emailCell" }).appendTo('#modal-content');
        $("#emailCell").append("<td>" + data.EMAIL + "</td> ");
        if (window.object.UPRAWNIENIA_PRACA) {
            $('<button>', { id: 'email' }).appendTo("#emailCell");
            $("#email").attr("data-toggle", "modal");
            $("#email").attr("data-target", "#emailTemplate");
            $("#email").attr("onclick", "get_email_content(); get_and_add_templates();");
            $("#email").text("Wyslij wiadomosc");
        }
    }
}

/* ##### FUNKCJIE DOTYCZĄCE PARSOWANIA I PODSTAWIANIA EMAILA ###*/
function getIndicesOf(searchStr, string) {
    /*w wersji serwerowej przeniesc na framework scripts*/
    var startIndex = 0,
        searchStrLen = searchStr.length;
    var index, indices = [];;

    while ((index = string.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}


function get_all_hashed_tags(indicies, string) {
    /*w wersji serwerowej przeniesc na framework scripts*/
    hashed_tags = [];


    for (var i = 0; i < indicies.length; i = i + 2) {
        var hash_index_before = indicies[i];
        var hash_index_after = indicies[i + 1] + 2;

        hashed_tags.push(string.substring(hash_index_before, hash_index_after));
    }

    return hashed_tags;
}

function replace_email_tags(tags, string) {

    console.log(tags);
    var content = string;

    for (var i = 0; i < tags.length; i++) {
        var tag_without_hash = tags[i].replace(/\#/g, "").replace(/\:/g, "").replace(/ /g, '');
        console.log(tag_without_hash);

        /*jezeli lead ma pole to podaj jego dane*/
        if (object.hasOwnProperty(tag_without_hash)) {
            content = content.replace(tags[i], object[tag_without_hash]);
        }

        /*jezeli moj user ma pole takie to podstaw*/
        if (user.hasOwnProperty(tag_without_hash)) {
            content = content.replace(tags[i], user[tag_without_hash]);
        }

        /*jezeli tag bedzie spozdrowieniem czyli szanownym pozdrowieniem to podstaw*/
        if (tag_without_hash == 'SPOZDROWIENIE') {
            if (object.POZDROWIENIE == 'Pan') {
                content = content.replace(tags[i], 'Szanowny ' + object.POZDROWIENIE);

            } else {
                content = content.replace(tags[i], 'Szanowna ' + object.POZDROWIENIE);

            }
        }
        /*jezeli tag bedzie gpozdrowieniem czyli grzecznosciowym z ofertą pozdrowieniem to podstaw*/
        if (tag_without_hash == 'GPOZDROWIENIE') {
            if (object.POZDROWIENIE == 'Pan') {
                content = content.replace(tags[i], 'Pana ');

            } else {
                content = content.replace(tags[i], 'Panią ');
            }
        }
        /*jezeli tag bedzie gpozdrowieniem czyli zwrot z ofertą pozdrowieniem to podstaw*/
        if (tag_without_hash == 'ZPOZDROWIENIE') {
            if (object.POZDROWIENIE == 'Pan') {
                content = content.replace(tags[i], 'Panu ');

            } else {
                content = content.replace(tags[i], 'Pani ');
            }
        }
        /*jezeli tag bedzie gpozdrowieniem czyli zwrot z ofertą pozdrowieniem to podstaw*/
        if (tag_without_hash == 'KPOZDROWIENIE') {
            if (object.POZDROWIENIE == 'Pan') {
                content = content.replace(tags[i], 'Pana ');

            } else {
                content = content.replace(tags[i], 'Pani ');
            }
        }

    }
    return content;
}

/* ##### --- ###*/


/*na wybor szablonu dodawanie szablonu do pola tekstowego wraz z  dodaniem stopki*/
function append_email_content() {

    var button_content = $("#email-content-select option:selected").text();
    var email_template = $.grep(window.email_template, function(e) {
        return e.NAZWA == button_content;
    });

    var email_content = email_template[0].TRESC;

    if (email_content) {
        var indicies = getIndicesOf('#:', email_content);
        var tags = get_all_hashed_tags(indicies, email_content);
        email_content = replace_email_tags(tags, email_content);
    } else {
        email_content = '';
    }

    console.log(email_content);
    $("#comment").val(email_content);
}

/* wyswietlanie zawartości template email  */
function get_email_content() {
    append_email_content();
    $("#cus-email").val(window.contact_email);
    $("#subject").val(object.KAMPANIA + ' (' + object.LEADID + ')');
}

/*wywoluje modal dzwonienia */
function mod() {
    $('#callTemplate').modal('show')
}

/*pobiera i dodaje szablony*/
function get_and_add_templates() {

    get_date_type(true, "EML_DEF?rodzaj=L", function(data) {
        console.log('szablon');
        $("#email-content-select").empty();
        window.email_template = data;
        console.log(window.email_template);
        for (var i = 0; i < data.length; i++) {
            var select_id = "template-select-" + i;
            var selector = '<option  id=' + select_id + '>' + window.email_template[i].NAZWA + '</option>';
            $("#email-content-select").append(selector);
        }

    }, function() {
        console.log("nie mozna zaladowac email templates");
    });

}

/*funkcja wczytujaca wszystkie dane na strone:  usr , template email oraz renderuje leady */
function load_and_render_page_data() {
    $("#my-leeds").append(' <div class="loader-inner"><img src="ajax-loader.gif" ></div>');

    //console.log(window.test);
    /*podzielenie leadow na nowe i nowe otwarte i wyrenderowanie*/
    $.when(window.new_leads = $.grep(window.test, function(e) {
        return e.STATUSCODE == "NEW"
    })).then(function() {
        render_leeds_in_place(window.new_leads, "new-leads");
    });

    $.when(window.open_with = $.grep(window.test, function(e) {
        return e.STATUSCODE == "OPEN" && !e.UPRAWNIENIA_PRACA

    })).then(function(x) {
        render_leeds_in_place(window.open_with, "open-no-attribution");
    });
    console.log('testą');


    /*pobieram dane templetek email*/
    get_and_add_templates();

    /*pobieram dane usera*/
    get_date_type(true, "usr_ja", function(data) {

        window.footer = data[0].STOPKA_MAIL;
        window.user = data[0];
        window.usr_short = window.user.SKROT;
        console.log(window.user);
        console.log(window.usr_short);

        /*wyswietlanie moich leadow*/

        $.when(window.my_leeds = $.grep(window.test, function(e) {
            return e.UPRAWNIENIA_PRACA == window.usr_short && e.STATUSCODE == "OPEN"
        })).then(function(x) {
            $("#my-leeds").empty();
            render_leeds_in_place(window.my_leeds, "my-leeds");
            window.setTimeout(function() {
                $("#refresh-button").removeClass("glyphicon-refresh-animate");
            }, 1000);
        });

    }, function() {});


}

/*funkcja przeladowywujaca sama tabele leadow*/
function reload_table_leads(operation) {
    $("#refresh-button").addClass("glyphicon-refresh-animate");

    /*pobieram dane leady i wyswietla na ekranie*/
    get_date_type(false, operation, function(data) {
        leads_divison_and_init_render(data);
    }, function() {
        /* console.log("nie mozna zaladowac leadow");*/
    });
}

function send_email() {
    $("#load_assign_gif").css("display", "block");
    var emai_content = $("#email-form").serializeArray();
    var email_text = JSON.stringify(emai_content[0].value);
    email_text = email_text.replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
    //console.log(email_text);
    //console.log(emai_content);


    execute_given_operation("MOB_LEAD_MENU_WYSLIJ_EMAIL",
        "{\"recpient\":" + '"' + emai_content[1].value + '"' + ",\"subject\":" + '"' + emai_content[2].value + '"' + ",\"tresc\":" + email_text + "}",
        function(data) {
            /*  console.log("success");*/
        },
        function(data) {},
        function(data) {
            contact_accomplish(window.object.LEADID);
        },
        function(data) {}
    );

}


/*nowy wykonany kontakt*/
function contact_accomplish(lead_id) {

    $("#load_assign_gif").css("display", "block");

    if (window.object.CONTACTDATE) {
        $("#assign-error").empty();
        $("#load_assign_gif").css("display", "none");
        $("#assign-error").append('<div class="alert alert-success"> Pomyślnie zaznaczono skontatkowanie. Kontakt był już wykonany</div>');

    } else {

        execute_given_operation("LEAD_INBOX_MENU_KONTAKT_WYKONANY", "{\"LEADYLEADID\":" + window.object.LEADID + " }\n",
            function() {
                $.when(reload_table_leads("mob_leady?resultsPerPage=all")).then(function() {
                    get_lead_info(window.click_id);
                    $("#assign-error").empty();
                    $("#load_assign_gif").css("display", "none");
                    $("#assign-error").append('<div class="alert alert-success"> Pomyślnie zaznaczono skontatkowanie.</div>');
                });
            },
            function() {
                $("#assign-error").empty();
                $("#load_assign_gif").css("display", "none");
                $("#assign-error").append('<div class="alert alert-danger"> Nie mozna uaktualnic statusu</div>');
                /* console.log("Nie mozna uaktualnic statusu kontaktu");*/
            },
            function() {},
            function() {}
        );
    }
}
/*czyszczenie divu erroru*/
function clear_error() {
    $("#assign-error").empty();
    $('body').scrollTo('#' + window.object.LEADID);
}


/*przypisanie leadu*/
function assign_lead() {
    $("#load_assign_gif").css("display", "block");

    execute_given_operation("LEAD_INBOX_MENU_DODAJ_FOLDER", "{\"LEADYLEADID\":" + window.object.LEADID + " }\n",
        function() {
            execute_given_operation("LEAD_INBOX_MENU_UAKT_SATUS", "{\"LEADYLEADID\":" + window.object.LEADID + " }\n",
                function() {
                    $.when(reload_table_leads("mob_leady?resultsPerPage=all")).then(function() {
                        get_lead_info(window.click_id);
                        $("#assign-error").empty();
                        $("#load_assign_gif").css("display", "none");
                        $("#assign-error").append('<div class="alert alert-success"> Pomyślnie przypisano lead do Twojego uzytkownika.</div>');
                    });
                },
                function() {
                    $("#assign-error").empty();
                    $("#load_assign_gif").css("display", "none");
                    $("#assign-error").append('<div class="alert alert-danger"> Nie mozna uaktualnic statusu</div>');
                    /* console.log("nie mozna uaktualnic statusu");*/
                },
                function() {},
                function() {}
            );
        },
        function() {
            $("#assign-error").empty();
            $("#load_assign_gif").css("display", "none");
            $("#assign-error").append('<div class="alert alert-danger"> Nie mozna dodac folderu.</div>');
            /* console.log("nie mozna dodać folderu");*/
        },
        function() {},
        function() {});
}


function time_difference_number(time_given) {
    var leed_date = time_given;
    leed_date = leed_date.split(/(?:-| |:)+/);
    var lead_time = new Date(leed_date[0], leed_date[1], leed_date[2],
        leed_date[3], leed_date[4], leed_date[5]);
    var current_time = new Date().getTime();
    return ((lead_time - current_time) - 2678400000);
}