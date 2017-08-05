/**
 * Created by winter on 7/10/2017.
 */

$(document).ready(() => {

    const API_KEY = '&key=AIzaSyAF_M-MptXdA-BGo-erQ-bYd40L8Zfj8v4'; //TODO CHANGE TO ENV VARIABLE

    const $first_name = $('#form_first_name'),
        $last_name = $('#form_last_name'),
        $email = $('#form_username'),
        $pass = $('#form_password'),
        $phone = $('#form_phone'),
        $phoneH = $('#form_phone_h'),
        $address = $('#form_address'),
        $addressFull = $('#form_full_address'),
        $city = $('#form_city'),
        $stateDiv = $('#form_state'),
        $stateSpan = $stateDiv.children('span'),
        $stateInput = $stateDiv.children('input'),
        $zipcode = $('#form_zipcode'),
        $wrapper_drop = $('.wrapper-dropdown-3');

    let phoneValSplit, phonePossibleNumbers, phoneonlyNumbers, strPhoneOnlyNumbers;
    let fullAddress;
    let validAddress = false, validCity = false, validZip = false;

    const addOns = {};

    let personalFields = {
        form_first_name: false, form_last_name: false, form_username: false,
        form_password: false, form_phone: false, form_place_keys: true,
        form_address: false, form_city: false, form_input_state: false,
        form_zipcode: false, form_input_bedroom: false, form_input_bathroom: false
    };

    serviceFields = {
        form_input_hour: false
    };

    //CONTROLS ALL FORM VALIDATIONS
    const keyFunction = e => {
        //PREVENT FORM TO BE SENT FROM ENTER KEY
        if (e.keyCode === 13 || e.which === 13) {
            e.preventDefault()
        }

        switch (e.target.id) {
            case 'form_first_name':
                if (e.type === 'keypress') {
                    if (/[a-zA-Z]{25}/.test($first_name.val())) {
                        e.preventDefault();
                    }
                    if (!/[a-zA-Z]/.test(String.fromCharCode(e.charCode))) {
                        e.preventDefault();
                    }
                } else if (e.type === 'focusout') {
                    if ($first_name.val().length < 1) {
                        personalFields.form_first_name = false; //TODO CHANGE BORDER COLOR BLACK
                    }
                    else {
                        $first_name.val(/[a-zA-Z]{1,25}/.exec($first_name.val()));
                        personalFields.form_first_name = true; //TODO CHANGE BORDER COLOR
                    }

                }
                break;
            case 'form_last_name':
                if (e.type === 'keypress') {
                    if (/[a-zA-Z]{25}/.test($last_name.val())) {
                        e.preventDefault();
                    }
                    if (!/[a-zA-Z]/.test(String.fromCharCode(e.charCode))) {
                        e.preventDefault();
                    }
                } else if (e.type === 'focusout') {
                    if ($last_name.val().length < 1) {
                        personalFields.form_last_name = false; //TODO CHANGE BORDER COLOR BLACK
                    }
                    else {
                        $last_name.val(/[a-zA-Z]{1,25}/.exec($last_name.val()));
                        personalFields.form_last_name = true; //TODO CHANGE BORDER COLOR
                    }
                }

                break;

            case 'form_username':
                if (e.type === 'focusout') {
                    if (!/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test($email.val())) {
                        console.log("Oops! This doesn't seem to be a valid email address.");
                        personalFields.form_username = false;
                    }
                    else {
                        console.log({email: $email.val()});
                        $.ajax({
                            url: "/check_email",
                            type: "POST",
                            data: {email: $email.val()},
                            xhrFields: {
                                withCredentials: false
                            },
                            headers: {}
                        })
                            .done(data => {
                                if (data.response === 'found') {
                                    console.log('Email already exists.');
                                    personalFields.form_username = false;
                                } else if (data.response === 'not_found') {
                                    console.log('Email valid.');
                                    personalFields.form_username = true;
                                } else {
                                    console.log('Unable to search database.');
                                    personalFields.form_username = false;
                                }
                            })
                            .fail(xhr => {
                                console.log('Unable to perform request.');
                                personalFields.form_username = false;
                            });
                    }
                }
                break;

            case 'form_password':
                if (e.type === 'focusout') {
                    if ($pass.val().length > 3) {
                        personalFields.form_password = true;
                    } else {
                        personalFields.form_password = false;
                    }
                }
                break;

            case 'form_phone':
                let onlyNumbers2 = phoneonlyNumbers || [];
                if (e.type === 'keypress') {
                    if (onlyNumbers2.length >= 10) {
                        e.preventDefault();
                    }
                    if (!/\d/.test(String.fromCharCode(e.charCode))) {
                        e.preventDefault();
                    }
                }
                if (e.type === 'keyup') {
                    phoneValSplit = $phone.val().split('');
                    phonePossibleNumbers = phoneValSplit.filter(number => /\d/.test(number));
                    phoneonlyNumbers = phonePossibleNumbers.map(number => parseInt(number));
                    strPhoneOnlyNumbers = phoneonlyNumbers.join('');
                    if (phoneonlyNumbers.length === 3) {
                        $phone.val(`(${strPhoneOnlyNumbers}) `);
                    }
                    else if (phoneonlyNumbers.length === 6) {
                        $phone.val(`(${strPhoneOnlyNumbers.substr(0, 3)}) ${strPhoneOnlyNumbers.substr(3, 3)}-`);
                    }
                    else if (phoneonlyNumbers.length >= 10) {
                        $phone.val(`(${strPhoneOnlyNumbers.substr(0, 3)}) ${strPhoneOnlyNumbers.substr(3, 3)}-${strPhoneOnlyNumbers.substr(6, 4)}`);
                        strPhoneOnlyNumbers = strPhoneOnlyNumbers.substr(0, 10);
                    }
                }

                if (e.type === 'focusout') {
                    if (/\([0-9]{3}\) [0-9]{3}\-[0-9]{4}/.test($phone.val())) {
                        console.log(strPhoneOnlyNumbers);
                        $.ajax({
                            url: "/check_phone", type: "POST",
                            data: {phone: strPhoneOnlyNumbers},
                            xhrFields: {withCredentials: false},
                            headers: {}
                        })
                            .done(data => {
                                if (data.response === 'found') {
                                    console.log('Phone number already exists.');
                                    personalFields.form_phone = false;
                                } else if (data.response === 'not_found') {
                                    console.log('valid number');
                                    personalFields.form_phone = true;
                                    $phoneH.val(strPhoneOnlyNumbers);
                                } else {
                                    console.log('Unable to search database.');
                                    personalFields.form_phone = false;
                                }
                            })
                            .fail(error => {
                                console.log('Unable to perform request, please check internet connection.');
                                personalFields.form_phone = false;
                            });

                    } else {
                        console.log('invalid number');
                        personalFields.form_phone = false; //TODO CHANGE BORDER COLOR
                    }
                }
                break;

            case 'form_address':
                if (e.type === 'focusout') {
                    if ($address.val().length > 0) {
                        validAddress = true;
                        checkAddress();
                    } else {
                        console.log('Address field left empty.');
                        validAddress = false;
                    }
                }
                break;

            case 'form_city':
                if (e.type === 'keypress') {
                    if (!/[a-zA-Z\s]/.test(String.fromCharCode(e.charCode))) {
                        e.preventDefault();
                    }
                } else if (e.type === 'focusout') {
                    if ($city.val().length > 0) {
                        validCity = true;
                        checkAddress();
                    } else {
                        console.log('City field left empty.');
                        validCity = false;
                    }

                }
                break;

            case 'form_zipcode':
                if (e.type === 'keypress') {
                    if (/[0-9]{5}/.test($zipcode.val())) {
                        e.preventDefault();
                    }
                    if (!/\d/.test(String.fromCharCode(e.charCode))) {
                        e.preventDefault();
                    }
                } else if (e.type === 'focusout') {
                    if (/[0-9]{5}/.test($zipcode.val())) {
                        console.log('valid zipcode');
                        validZip = true;
                        checkAddress();
                        // personalFields.form_zipcode = true;
                        //TODO CHANGE BORDER COLOR
                    } else {
                        console.log('invalid number');
                        validZip = false;
                        // personalFields.form_zipcode = false;
                        //TODO CHANGE BORDER COLOR
                    }
                }
                break;
        }
    };

    //CONTROLS THE CLICK EVENTS
    const clickFunction = e => {
        let target;
        const clickWithId = target => {
            switch (e.target.className) {
                case 'btn-form':
                    e.preventDefault();
                    $('#form_frequency').val(target.text());
                    console.log('FORM FREQUENCY');
                    console.log(document.getElementById('form_frequency').value);
                    break;

                case 'form_addons_box':
                    if (addOns[target.attr('data-val')]) {
                        delete addOns[target.attr('data-val')];
                    } else {
                        addOns[target.attr('data-val')] = true;
                    }
                    $('#form_input_addons').val(JSON.stringify(addOns));
                    console.log(document.getElementById('form_input_addons').value);
                    break;

                case 'apply_code':
                    //TODO AJAX TO DATABSE
                    e.preventDefault();
                    break;

                case 'btn_per':
                    console.log('inside btn per')
                    console.log(personalFields)
                    let pass = true;
                    for (let field in personalFields) {
                        if (!personalFields[field]) {
                            e.preventDefault();
                            pass = false;
                            break;
                        }
                    }
                    console.log('pass', pass)
                    if (pass) {
                        //todo release next section
                    }
                    break;
                case 'btn_ser':
                    let pass1 = true;
                    for (let field in serviceFields) {
                        if (!serviceFields[field]) {
                            e.preventDefault();
                            pass1 = false;
                            break;
                        }
                    }
                    if (pass1) {
                        //todo release next section
                    }
                    break;
                case 'btn-book':
                    if (!document.getElementById('form_checkbox').checked) {
                        e.preventDefault();
                    }
                    break;
//                 case 'test-btn':
//                     // Create a new blank iframe
//                     var newIframe = document.createElement('iframe');
// // Set attributes for iFrame (do whatever suits)
//                     newIframe.width = '100%'; newIframe.height = '100%';
// // This for the src makes it 'friendly'
//                     newIframe.src = 'about:blank';
// // Use whatever method is needed to insert the iframe where you want it
//                     document.body.appendChild(newIframe);
// // Make this reference your hidden div containing the markup you want to insert
//                     var getHTML = $('#HTMLblock').html();
// // List any CSS you want to reference within the iframe
//                     var CSS = '<link rel="stylesheet" href="https://external.com/css/styles.css">';
// // List any JS you want to reference within the iframe
//                     var JS = '<script src="http://external.com/js/plugins.js"></script>';
// // Now sticch it all together into one thing to insert into the iframe
//                     var myContent = '<!DOCTYPE html>' + '<html><head><title>Rendered HTML from Pattern</title>' + CSS + '</head><body>' + getHTML + JS + '</body></html>';
//
// // Use the JavaScript methods to write to the iFrame, then close it
//                     newIframe.contentWindow.document.open('text/html', 'replace');
//                     newIframe.contentWindow.document.write(myContent);
//                     newIframe.contentWindow.document.close();
//                     break;
            }
        };

        const clickNoId = (target) => {
            console.log(target.className, 'no id');
            switch (target.className) { //todo CHANGE TARGET.CLASSNAME
                case 'form_addons_box':
                    if (addOns[target.getAttribute('data-val')]) {
                        delete addOns[target.getAttribute('data-val')]
                    } else {
                        addOns[target.getAttribute('data-val')] = true;
                    }
                    $('#form_input_addons').val(JSON.stringify(addOns));
                    console.log(document.getElementById('form_input_addons').value);
                    break;
            }
        };

        try {
            target = $('#' + e.target.id);
            clickWithId(target);
        }
        catch (err) {
            targetParent = e.target.parentElement;
            clickNoId(targetParent);
        }
    };


    //CONTROLS THE CHANGE IN THE DROPDOWNS
    const changeFunction = e => {
        switch (e) {
            case 'form_input_state':
                personalFields.form_input_state = true;
                checkAddress();
                break;
            case 'form_input_bedroom':
                personalFields.form_input_bedroom = true;
                break;
            case 'form_input_bathroom':
                personalFields.form_input_bathroom = true;
                break;
            case 'form_input_hour':
                serviceFields.form_input_hour = true;
                break;
            // case 'form_input_date':
            //     serviceFields.form_input_date = true;
            //     break;
        }
    };


    //AUTO COMPLETE THE ADDRESS FIELD WITH GOOGLE MAPS API
    const initialize = () => {
        let autocomplete = new google.maps.places.Autocomplete(document.getElementById("form_address"),
            {types: ['address']});
        autocomplete.setComponentRestrictions({'country': 'us'});
        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            console.log('AFTER AUTOCOMPLETE');
            let place = autocomplete.getPlace();
            console.log(place);
            ajaxGeocode(place);
        });
    };
    google.maps.event.addDomListener(window, 'load', initialize);


    //IN CASE THE USER DOES NOT USE THE ADDRESS AUTOCOMPLETE
    const checkAddress = () => {
        if (validAddress && validCity && validZip && personalFields.form_input_state) {
            const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent($address.val())},${encodeURIComponent($city.val())},%20${$stateSpan.text()}%20${$zipcode.val()}${API_KEY}`;
            $.get(geocodeUrl)
                .then(res => {
                    if (res.status === 'ZERO_RESULTS') {
                        throw new Error('Unable to find that address.');
                    } else {
                        console.log('REQUEST OK')
                        console.log(res)
                        if (res.results[0].address_components[0].types[0] === 'street_number') {
                            ajaxDbAddress(res.results[0].formatted_address);
                            $addressFull.val(res.results[0].formatted_address);
                        } else {
                            console.log('Invalid address.') //todo change border color
                        }
                    }
                }).catch(error => {
                console.log('inside error');
                if (error.statusText === 'Not Found' || error.statusText === 'error') {
                    console.log('Unable to perform request, please check internet connection.');
                } else {
                    console.log(error.message);
                }
            });
        }
    };

    const ajaxGeocode = (place) => {
        try {
            const tryAddress = place.address_components[0].types[0];
        }
        catch (err) {
            console.log(err.message);
            return;
            //TODO change border color
        }
        if (place.address_components[0].types[0] === 'street_number') {
            ajaxDbAddress(place.formatted_address);
            $addressFull.val(place.formatted_address);
            let strAddress = '';
            place.address_components.forEach(function (element) {
                // console.log(element);
                if (element.types[0] === 'street_number') {
                    strAddress = `${element.short_name}${strAddress}`;
                }
                else if (element.types[0] === 'route') {
                    strAddress = `${strAddress} ${element.short_name}`;
                }
                else if (element.types[0] === 'locality') {
                    $city.val(element.short_name);
                }
                else if (element.types[0] === 'administrative_area_level_1') {
                    $stateSpan.text(element.short_name);
                    $stateInput.val(element.short_name);
                }
                else if (element.types[0] === 'postal_code') {
                    $zipcode.val(element.short_name);
                }
            });
            $address.val(strAddress);
        }
        else {
            console.log('Oops! This is not a valid address.');
            $city.val('');
            $stateSpan.text('State');
            $zipcode.val('');
        }
        console.log('ADDRESS PLACE AFTER');
    };


    const ajaxDbAddress = (address) => {
        $.get(`/check_address/${address}`)
            .done(data => {
                if (data.response === 'found') {
                    console.log('address already exists.');
                    personalFields.form_address = false;
                    personalFields.form_city = false;
                    personalFields.form_input_state = false;
                    personalFields.form_zipcode = false;
                } else if (data.response === 'not_found') {
                    console.log('valid address');
                    personalFields.form_address = true;
                    personalFields.form_city = true;
                    personalFields.form_input_state = true;
                    personalFields.form_zipcode = true;
                    $address.css("pointer-events", "none");
                    $city.css("pointer-events", "none");
                    $stateDiv.css("pointer-events", "none");
                    $zipcode.css("pointer-events", "none");

                } else {
                    console.log('Unable to search database.');
                    personalFields.form_address = false;
                    personalFields.form_city = false;
                    personalFields.form_input_state = false;
                    personalFields.form_zipcode = false;
                }
            })
            .fail(data => {
                console.log('Unable to perform request, please check internet connection.');
                personalFields.form_address = false;
                personalFields.form_city = false;
                personalFields.form_input_state = false;
                personalFields.form_zipcode = false;
            })
    };


    //CONTROLS THE DROPDOWNS
    function DropDown(el) {
        this.dd = el;
        this.placeholder = this.dd.children('span');
        this.placeholder2 = this.dd.children('input');
        this.opts = this.dd.find('ul.dropdown > li');
        this.val = '';
        this.index = -1;
        this.initEvents();
    }

    DropDown.prototype = {
        initEvents() {
            const obj = this;
            obj.dd.on('click', function (event) {
                $(this).toggleClass('active');
                return false;
            });
            obj.opts.on('click', function () {
                const opt = $(this);
                obj.index = opt.index();
                obj.placeholder[0].innerText = opt[0].innerText;
                obj.placeholder2[0].value = opt[0].innerText;
            });
        },
    };


    const dd = new DropDown($stateDiv),
        dd2 = new DropDown($('#form_bedroom')),
        dd3 = new DropDown($('#form_bathroom')),
        dd4 = new DropDown($('#form_hour'));
    $(document).click(() => {
        // all dropdowns
        $wrapper_drop.removeClass('active');
    });


    //CALLING THE CONTROLLERS
    $('#container')
        .keypress(keyFunction)
        .keyup(keyFunction)
        .focusout(keyFunction)
        .click(clickFunction);

    // $wrapper_drop.bind('DOMSubtreeModified', function(e) {
    $wrapper_drop.on('DOMSubtreeModified', "span", function () {
        changeFunction($(this)[0].id);
    });
});