var IconController = {
	icons: {},
	container: $('body>.container'),

	init: function() {
		this.getIcons();
	},

	getIcons: function() {
		$.getJSON('icons.php')
			.success(function(data) {
				this.parseIcons(data);
				this.showIcons();
			}.bind(this))
			.error(function(data) {
				console.error('Something went wrong', data);
			});
	},

	parseIcons: function(data) {
		// Parse categories
		data.categories.forEach(function(category) {
			this.icons[category.name] = {};

			// Parse icons
			category.keys.forEach(function(key) {
				this.icons[category.name][this._cleanKey(key)] = new Icon(category.name, this._cleanKey(key));
			}.bind(this));
		}.bind(this));
	},

	showIcons: function() {
		this.container.html('');
		$('#topnav .navbar-nav ').html('');

		_.each(this.icons, function(category, key) {
			var categoryDom = $('<div class="row">')
				.append($('<a>').addClass('category-anchor').attr('id', this._keyToId(key)))
				.append($('<h2>').text(key));
			_.each(category, function(icon) {
				categoryDom.append(icon.getHtml());
			}.bind(this));

			this.container.append(categoryDom);
			$('#topnav .navbar-nav ').append(
				$('<li>').append($('<a>').attr('href', '#' + this._keyToId(key)).text(key))
			);
		}.bind(this));

		$('.icon img').lazyload({
			effect: 'fadeIn'
		});

		$('[data-spy="scroll"]').each(function() {
			var $spy = $(this).scrollspy('refresh');
		});

		var navHeight = $('#topnav').outerHeight();
		$('body').css('padding-top', navHeight);
		$('.category-anchor').css('top', navHeight * -1);
	},

	_cleanKey: function(key) {
		key = key.replace(/x$|\-icn$/, '');
		return key;
	},

	_keyToId: function(key) {
		return key.replace(/[ &]/g, '-');
	}
};

function Icon(category, key) {
	this.category = category;
	this.key = key;
	this.url = 'http://cdn.device-icons.smartthings.com';

	var pieces = key.split('.');
	// remove st.
	delete pieces[0];
	this.url += pieces.join('/') + '-icn@2x.png';

	this.getHtml = function() {
		var dom = $('<div class="col-md-6 col-lg-4" />');
		$('<div class="icon clearfix">').appendTo(dom)
			.append($('<img class="col-xs-2 lazy">').attr('data-original', this.url))
			.append($('<div class="col-xs-10">')
				.append($('<input type="text" readonly class="icon-key">').val(this.key))
				.append($('<input type="text" readonly class="icon-url">').val(this.url))
			);
		return dom;
	}.bind(this);
};


$().ready(function() {
	IconController.init();
});