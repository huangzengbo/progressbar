"use strict";

App.validation = (function () {
    //GLOBAL VARIABLES

    var _IsApplicable = $("fieldset").length > 0;

    var _Initialised = false;
    var _initCustomValidationRules = false;


	function init()
	{
	    //FORM EXISTS & NOT INITIALISED
	    if (!_Initialised && $('form').length && _IsApplicable)
		{			
		    _Initialised = true;
		    initCustomValidationRules();
	    }

        
	    if ($("#add-form input").length > 0) {
	        addFormInit("#add-form");
        }

	}

	function initCustomValidationRules()
	{
	    if (!_initCustomValidationRules) {
	        _initCustomValidationRules = true;

	        jQuery.validator.addMethod(
                "ausPhone",
                function(value, element) {
                    var phoneReg = /^\(?(?:\+?61|0)(?:(?:2\)?[ -]?(?:3[ -]?[38]|[46-9][ -]?[0-9]|5[ -]?[0-35-9])|3\)?(?:4[ -]?[0-57-9]|[57-9][ -]?[0-9]|6[ -]?[1-67])|7\)?[ -]?(?:[2-4][ -]?[0-9]|5[ -]?[2-7]|7[ -]?6)|8\)?[ -]?(?:5[ -]?[1-4]|6[ -]?[0-8]|[7-9][ -]?[0-9]))(?:[ -]?[0-9]){6}|4\)?[ -]?(?:(?:[01][ -]?[0-9]|2[ -]?[0-57-9]|3[ -]?[1-9]|4[ -]?[7-9]|5[ -]?[018])[ -]?[0-9]|3[ -]?0[ -]?[0-5])(?:[ -]?[0-9]){5})$/;
                    value = value.replace(/\s*/g, '');
                    return this.optional(element) || phoneReg.test(value);
                },
                "Please enter a valid Australian mobile or landline number including the area code"
            );
	        jQuery.validator.addMethod("checkboxRequired", function (value, element, params) {
	            var $ele = $(element);
	            return $ele.closest(".checkbox").find("input:checked").length > 0;
	        });

	        jQuery.validator.addMethod("regex", function (value, element, regexp) {
	            var re = new RegExp(regexp);
	            return this.optional(element) || re.test(value);
	        });

	        jQuery.validator.addMethod(
                "js-ausDate",
                function (value, element) {
                    value = value.replace(/\s*/g, '');
                    if (value !== undefined && value != '') {
                        var date = Date.getDateObjectFromString(value);
                        if (date instanceof Date) {
                            return true;
                        }
                        return false;
                    }
                    return true;
                },
                "Please enter a valid date in dd/mm/yyyy format"
            );
	    }
    }

    function initForm(id)
    {
        
        $(id).validate(
		{
			ignore:'', //this will validate also the hidden fields
            onclick: function(ele)
			{
                var $ele = $(ele);
                
				if(!this.checkable($ele))
				{
                    this.element($ele);
                }
            },
            onfocusout: function(element)
			{
                if(!this.checkable(element))
				{
                    this.element(element);
                }
            },
			invalidHandler: function(event, validator)
			{
			    if (!validator.numberOfInvalids())
			        return;
			    $('html, body').animate({
			        scrollTop: $(validator.errorList[0].element).offset().top-123
			    }, 800);
			},
			focusInvalid: false,
            errorPlacement: function(error, element)
            {
                var $formField = $(element).parents('.form-field:first');

                if ($formField.hasClass('form-field-checkbox'))
                {
                    $formField.find('label.error').remove();
                    $formField.append(error);
                }
                else
				{
                    $formField.append(error);
				}
			},
            highlight: function(element)
            {
                var $formField = $(element).parents('.form-field:first');
                $formField.find('.validation-icon').remove();
                $formField.append("<span class='validation-icon'></span>");
                
                $formField.removeClass('correct');
                $formField.addClass('error');

            },
            unhighlight: function(element)
            {
                var $formField = $(element).parents('.form-field:first');
                $formField.find('.validation-icon').remove();
                $formField.append("<span class='validation-icon'></span>");
                
                $formField.removeClass('error');
                $formField.find('label.error').remove();
                
                if($(element).val().length != 0 && !$.isEmptyObject($(element).rules()))
				{
                    $formField.addClass('correct');
                }
				else if($(element).val().length == 0)
				{
				    $formField.removeClass('correct');
                }                
            }
		});	
		
		//CUSTOM NAMES FIELD THAT ALLOWS ALPHANUMERIC CHARACTERS & SPACES
		$.validator.addMethod('names', function(value, element)
		{
			return this.optional(element) || /^[a-zA-Z0-9 ']+$/i.test(value);
		}, 'Please enter a valid name');
		
		//VALIDATE DATE FIELDS IN dd/mm/yyyy FORMAT WITH dateITA METHOD
		$('.date-field, .date-field-wide').each(function (index, element)
		{
            $(element).rules('add',
			{
			    dateITA: true,
			});
		});


		$.validator.addMethod("checkExt", function (value) {
		    var filename = $('#fakeFileName').val().toLowerCase();
		    var extension = filename.substr((filename.lastIndexOf('.') + 1));

		    return (extension == "pdf" || extension == "doc" || extension == "docx");
		}, "Please upload PDF or Word Document");

		$.validator.addMethod(
            "customemail",
            function (value, element) {
                return /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(value);
            },
            "Sorry, I've enabled very strict email validation"
        );

		$.validator.classRuleSettings.checkExt = { checkExt: true };

    }

    function initMultiForm(id) {
        
        $(id).validateWebForm(
		{
		    ignore: '', //this will validate also the hidden fields
		    onclick: function (ele) {
		        var $ele = $(ele);

		        if (!this.checkable($ele)) {
		            this.element($ele);
		        }
		    },
		    onfocusout: function (element) {
		        if (!this.checkable(element)) {
		            this.element(element);
		        }
		    },
		    invalidHandler: function (event, validator) {
		        if (!validator.numberOfInvalids())
		            return;
		        $('html, body').animate({
		            scrollTop: $(validator.errorList[0].element).offset().top - 123
		        }, 800);
		    },
		    focusInvalid: false,
		    errorPlacement: function (error, element) {
		        var $formField = $(element).parents('.form-field:first');
		        var $formFieldWrap = $(element).parents('.form-field-wrap:first');

		        if ($formField.hasClass('form-field-checkbox')) {
		            $formField.find('label.error').remove();
		            $formField.append(error);
		        }
		        else {
		            $formField.append(error);
		        }
		        
		        if ($(element).parents(".form:first").find(".error").length <= 0) {
		            $(element).parents(".form:first").find(".submit").removeClass("disabled");

		        } else {
		            $(element).parents(".form:first").find(".submit").addClass("disabled");
		            $(element).parents(".checkout-section:first").removeClass("success");
		        }

		    },
		    highlight: function (element) {
		        var $formField = $(element).parents('.form-field:first');
		        var $formFieldWrap = $(element).parents('.form-field-wrap:first');
		        $formField.find('.validation-icon').remove();
		        $formField.append("<span class='validation-icon'></span>");
		        $formField.removeClass('correct');
		        $formField.addClass('error');
		        $formFieldWrap.addClass('error-wrap');
		        if ($(element).parents(".form:first").find(".error").length <= 0) {
		            //console.log("valid");
		            $(element).parents(".form:first").find(".submit").removeClass("disabled");

		        } else {
		            //console.log("invalid");
		            $(element).parents(".form:first").find(".submit").addClass("disabled");
		            $(element).parents(".checkout-section:first").removeClass("success");
		            if ($formField.hasClass("dob-field")) {
		                setTimeout(function () {
		                    $formField.children("label.error").hide();
		                    $formField.children("label.error:last").show();
		                }, 1);
		            }
		        }
		    },
		    unhighlight: function (element) {
		        var $formField = $(element).parents('.form-field:first');
		        var $formFieldWrap = $(element).parents('.form-field-wrap:first');
		        $formField.find('.validation-icon').remove();
		        $formField.append("<span class='validation-icon'></span>");

		        $formField.removeClass('error');
		        $formFieldWrap.removeClass('error-wrap');
		        $formField.find('label.error').remove();
		        if ($(element).val()==null||$(element).val().length == 0) {
		            $formField.removeClass('correct');
		        }
		        else if ($(element).val().length != 0 && !$.isEmptyObject($(element).rules())) {
		            $formField.addClass('correct');
		        }
		        if ($(element).parents(".form:first").find(".error").length <= 0) {
		            //console.log("valid");
		            $(element).parents(".form:first").find(".submit").removeClass("disabled");

		        } else {
		            //console.log("invalid");
		            $(element).parents(".form:first").find(".submit").addClass("disabled");
		            $(element).parents(".checkout-section:first").removeClass("success");
		        }
		    },
		    success: function (element) {
		        if ($(element).parents(".form:first").find(".error").length <= 0) {
		            //console.log("valid");
		            $(element).parents(".form:first").find(".submit").removeClass("disabled");

		        } else {
		            //console.log("invalid");
		            $(element).parents(".form:first").find(".submit").addClass("disabled");
		            $(element).parents(".checkout-section:first").removeClass("success");
		        }
		    }
		});

        //CUSTOM NAMES FIELD THAT ALLOWS ALPHANUMERIC CHARACTERS & SPACES
        $.validator.addMethod('names', function (value, element) {
            return this.optional(element) || /^[a-zA-Z0-9 ']+$/i.test(value);
        }, 'Please enter a valid name');

        

        $.validator.addMethod("checkExt", function (value) {
            var filename = $('#fakeFileName').val().toLowerCase();
            var extension = filename.substr((filename.lastIndexOf('.') + 1));

            return (extension == "pdf" || extension == "doc" || extension == "docx");
        }, "Please upload PDF or Word Document");

        $.validator.addMethod("dob_required", function (value, element) {
            return ($("#dobday").val() != 'Day') && ($("#dobmonth").val() != 'Month') && ($("#dobyear").val() != 'Year');
        }, "Please choose your birthday.");

        $.validator.addMethod("check_date_of_birth", function (value, element) {

            var day = $("#dobday").val();
            var month = $("#dobmonth").val();
            var year = $("#dobyear").val();
            var age = 18;

            var mydate = new Date();
            mydate.setFullYear(year, month - 1, day);

            var currdate = new Date();
            currdate.setFullYear(currdate.getFullYear() - age);


            if (currdate > mydate) {
                $(".dob-field").removeClass("middle-error");
                return true;
            }
            else {
                $(".dob-field").addClass("middle-error");
                return false;
            }

        }, "You must be at least 18 years of age.");

        $.validator.addMethod("cc_exp_required", function (value, element) {
            return ($("#expirymonth").val() != 'Month') && ($("#expiryyear").val() != 'Year');
        }, "Please choose your credit card expiry.");

        $.validator.addMethod("check_credit_card_exp", function (value, element) {
            var day = 1;
            var month = $("#expirymonth").val();
            var year = $("#expiryyear").val();

            var mydate = new Date();
            mydate.setFullYear(year, month, day);

            var currdate = new Date();
            currdate.setFullYear(currdate.getFullYear());
            if (currdate < mydate) {
                $(".expiry-field").removeClass("middle-error");
                return true;
            }
            else {
                $(".expiry-field").addClass("middle-error");
                return false;
            }

        }, "Please choose a valid expiry.");

        $.validator.addMethod("check_credit_card_cvv", function (value, element) {
            
            if ($("#creditcardnumber").hasClass("amex"))
                digits = 4;
            else
                digits = 3;

            if(parseInt(digits) == 3)
                return /^[0-9]{3,3}$/.test(value);
            else
                return /^[0-9]{4,4}$/.test(value);


        }, "Please enter 3 or 4 digits number");

        $.validator.addMethod("regex", function (value, element, regexpr) {
            return regexpr.test(value);
        }, "Please enter a valid pasword.");

        $.validator.addMethod(
                "regex",
                function (value, element, regexp) {
                    var re = new RegExp(regexp);
                    //console.log(value);
                    return this.optional(element) || re.test(value);
                },
                "Please check your input."
        );

        $.validator.addMethod(
            "customemail", 
            function(value, element) {
                return /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(value);
            }, 
            "Sorry, I've enabled very strict email validation"
        );

        $.validator.addMethod(
            "customphone",
            function (value, element) {
                return /^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]{6,}$/.test(value);
            },
            "Sorry, I've enabled very strict phone validation"
        );

        $.validator.addMethod(
            "check_postcode",
            function (value, element) {
                var count = value.match(/,/g)||"";
                return (count.length==2);
            },
            "Please enter a valid australian postcode and choose suburb"
        );

        $.validator.addMethod(
            "captcha",
            function (value, element) {
                var correctNumber = parseInt($(element).parents(".captcha-field").find(".js-captcha-number1").text()) + parseInt($(element).parents(".captcha-field").find(".js-captcha-number2").text());
                return (correctNumber==value);
            },
            "Sorry, I've enabled very strict phone validation"
        );

        $.validator.addMethod(
            "dropdown_day_required",
            function (value, element) {
                if (value == "Day") {
                    return false;
                } else {
                    return true;
                }
            },
            "Please choose a month."
        );

        $.validator.addMethod(
            "dropdown_month_required",
            function (value, element) {
                if (value == "Month") {
                    return false;
                } else {
                    return true;
                }
            },
            "Please choose a month."
        );

        $.validator.addMethod(
            "dropdown_year_required",
            function (value, element) {
                if (value == "Year") {
                    return false;
                } else {
                    return true;
                }
            },
            "Please choose a year."
        );

        $.validator.addMethod("isinteger", function (value, element) {
            return (Math.floor(value) == value && $.isNumeric(value) && parseFloat(value)>0);
        }, "Please enter integer.");

        $.validator.classRuleSettings.checkExt = { checkExt: true };

    }
   
    function addFormInit(id) {
        if (_IsApplicable) {
            initMultiForm(id);
            $('#description').rules('add', {
                required: true,
                messages:
                {
                    required: 'Please enter your description'
                }
            });
            $('#url').rules('add', {
                required: true,
                messages:
                {
                    required: 'Please enter your url'
                }
            });

        }
    }



    //RETURN PUBLIC METHODS
    return {
        init: init
    }

})();