$(document).ready(function () {

	// Show more

	$("body").on("click", ".show-more", function () {

		var btn = $(this);

		btn.addClass("loading");

		$.ajax({
			url: btn.attr("href"),
			dataType: "html"
		}).done(function (data) {

			btn.before($(data));

			btn.remove();

		});

		return false;

	});

	// Show more END

	$(".btn-add-address").click(function () {

		$(".account-form-address").slideDown(250);

	});

	// Forms

	$(".input-date").datepicker({
		format: 'dd.mm.yyyy',
		endDate: '0d'
	});

	$(".form-alt select").not(".picker__select--month, .picker__select--year, .rates-nav-select").each(function () {
		if ($(this).attr("multiple")) {
			$(this).selectpicker({
				selectAllText: "Выбрать всё",
				deselectAllText: "Снять выбор",
				noneSelectedText: "",
				selectedTextFormat: "count",
				countSelectedText: function(count) {
					return count + " " + declOfNum(count, ['элемент', 'элемента', 'элементов']);
				}
			});
		} else {
			$(this).selectpicker();
		}
	});

	$(".form-alt select[multiple]").not(".simple-multi").on("shown.bs.select",function () {
		if (!$(this).prev(".dropdown-menu").find(".dropdown-footer").length) {
			dropdownFooter = '\
      <div class="dropdown-footer">\
      <div class="btn btn-1 btn-ico btn-save">Выбрать</div>\
      <div class="btn btn-cancel">Очистить</div>\
      </div>\
      ';
			$(this).prev(".dropdown-menu").find("ul").append(dropdownFooter);
		}
	});

	$(".form-alt select").on("show.bs.select", function () {

		$(this).closest(".form-group").find("label.placeholder").addClass("active");

	});

	$(".form-alt select").on("hide.bs.select", function () {

		if (!$(this).val() || $(this).val() == null) {

			$(this).closest(".form-group").find("label.placeholder").removeClass("active");

		} else {

			$(this).closest(".form-group").find("label.placeholder").addClass("active");

		}



	});

	$("body").on("click",".form-alt .bootstrap-select .btn-save", function () {
		$(this).closest("div.dropdown-menu").next("select").selectpicker("toggle");
		return false;
	});

	$("body").on("click",".form-alt .bootstrap-select .btn-cancel", function () {
		$(this).closest("div.dropdown-menu").next("select").selectpicker('deselectAll');
		return false;
	});


	$('.form-alt .input-numeric').bind('keyup paste', function(){
		this.value = this.value.replace(/[^0-9]/g, '');
	});

	if ($(".form-alt input:text").length) {
		$(".form-alt input:text").each(function() {
			if ($(this).val()) {
				$(this).prev(".placeholder").addClass("active");
			}
		});
	}

	if ($(".form-alt textarea").length) {
		$(".form-alt textarea").each(function() {
			if ($(this).val()) {
				$(this).prev(".placeholder").addClass("active");
			}
		});
	}

	$("body").on("focus",".form-alt input, .form-alt textarea",function() {
		var el = $(this);

		if (el.parent().find(".placeholder").length) {
			var placeholder = el.parent().find(".placeholder");

			placeholder.addClass("active");

		}

	});

	$("body").on("blur",".form-alt input, .form-alt textarea",function() {
		var el = $(this);

		if (el.parent().find(".placeholder").length) {
			var placeholder = el.parent().find(".placeholder");

			if (!el.val() || (el.hasClass("input-phone") && ! /^(?=.*[0-9])[- +()0-9]+$/.test(el.val()))) {
				placeholder.removeClass("active");
			}

		}

	});

	$("body").on("click",".form-alt .placeholder",function(e) {
		if ($(this).parent().find("input").length) {
			$(this).parent().find("input").trigger("focus");
		}
		if ($(this).parent().find("textarea").length) {
			$(this).parent().find("textarea").trigger("focus");
		}
	});

	$("body").on("focus",".form-alt input[type=text], .form-alt input[type=email], .form-alt input[type=password], .form-alt textarea", function () {
		$(this).closest(".form-item").addClass("focus");
	});

	$("body").on("blur",".form-alt input[type=text], .form-alt input[type=email], .form-alt input[type=password], .form-alt textarea", function () {
		$(this).closest(".form-item").removeClass("focus")
	});

	validateForms();

	// Forms END

});

function validateForms() {
	$('.textarea-autogrow').autogrow();
	$("input.input-phone").mask("+7 (999) 999-99-99");
	jQuery.validator.addClassRules('phone-email-group', {
		require_from_group: [1, ".phone-email-group"]
	});
	$("select").not(".location-tabs-select").not(".filter-form select").on("change", function() {
		if (!$(this).closest(".picker").length && !$(this).hasClass("faq-select")) {
			$(this).valid();
		}
	});
	$("body").on("click", ".form-item", function(e) {
		if ($(this).find(".bootstrap-select").length && !$(e.target).hasClass("bootstrap-select") && !$(e.target).parents().hasClass("bootstrap-select")) {
			$(e.target).closest(".form-item").find("select").selectpicker('toggle');
		}
	});
	$(".account-form form, .modal-form form").each(function() {
		form = $(this);
		$(this).validate({
			focusInvalid: true,
			sendForm: false,
			errorPlacement: function(error, element) {
				if (element[0].tagName == "SELECT") {
					element.closest(".form-item").addClass("error");
					element.closest(".btn-group").addClass("btn-group-error");
					if (element.closest(".form-item").length) {
						error.insertAfter(element.closest(".form-item"));
					} else {
						error.insertAfter(element.closest(".btn-group"));
					}
				} else {
					if (element.attr("type") == "checkbox") {
						element.siblings("label").addClass("checkbox-label-error")
					} else {
						error.insertAfter(element);
						element.closest(".form-group").addClass("form-group-error");
					}
				}
			},
			unhighlight: function(element, errorClass, validClass) {
				$(element).removeClass(errorClass);
				$(element).closest(".form-item").removeClass("error").addClass("valid");
				$(element).closest(".form-group").removeClass("form-group-error");
				if ($(element)[0].tagName == "SELECT") {
					$(element).closest(".form-item").removeClass("error");
					$(element).closest(".btn-group").removeClass("btn-group-error");
					if ($(element).closest(".form-item").length) {
						error.insertAfter(element.closest(".form-item"));
						$(element).closest(".form-item").next("label.error").remove();
					} else {
						$(element).closest(".btn-group").next("label.error").remove();
					}
				} else {
					$(element).next(".error").remove();
					if ($(element).attr("type") == "checkbox") {
						$(element).siblings("label").removeClass("checkbox-label-error")
					}
				}
			},
			invalidHandler: function(form, validatorcalc) {
				var errors = validatorcalc.numberOfInvalids();
				if (errors && validatorcalc.errorList[0].element.tagName == "INPUT") {
					validatorcalc.errorList[0].element.focus();
				}
			},
			submitHandler: function(form) {
				$.ajax({
					type: "POST",
					data: $(form).serialize(),
					success: function () {

					}
				});
				return false;
			}
		});
		if ($(this).find("input.password").length && $(this).find("input.password-repeat").length) {
			$(this).find("input.password-repeat").rules('add', {
				equalTo: "#" + form.find("input.password").attr("id")
			});
		}
	});
}
jQuery.extend(jQuery.validator.messages, {
	required: "Не заполнено поле",
	remote: "Please fix this field.",
	email: "Введите правильный e-mail.",
	url: "Please enter a valid URL.",
	date: "Please enter a valid date.",
	dateISO: "Please enter a valid date (ISO).",
	number: "Please enter a valid number.",
	digits: "Please enter only digits.",
	creditcard: "Please enter a valid credit card number.",
	equalTo: "Пароли не совпадают.",
	accept: "Please enter a value with a valid extension.",
	maxlength: jQuery.validator.format("Please enter no more than {0} characters."),
	minlength: jQuery.validator.format("Please enter at least {0} characters."),
	rangelength: jQuery.validator.format("Please enter a value between {0} and {1} characters long."),
	range: jQuery.validator.format("Please enter a value between {0} and {1}."),
	max: jQuery.validator.format("Please enter a value less than or equal to {0}."),
	min: jQuery.validator.format("Please enter a value greater than or equal to {0}.")
});

(function($) {
	$.fn.autogrow = function() {
		return this.each(function() {
			var textarea = this;
			$(textarea).on("focus keyup input blur", function() {
				$(textarea).css('height', 'auto').css('height', $(textarea)[0].scrollHeight + 1 + 'px');
			});
		});
	};

})(jQuery);