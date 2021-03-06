import app from './../../app.js';
import config from './../../config.js';
import Base_gui_class from './../../core/base-gui.js';
import Dialog_class from './../../libs/popup.js';
import alertify from './../../../../node_modules/alertifyjs/build/alertify.min.js';

class Image_size_class {

	constructor() {
		this.Base_gui = new Base_gui_class();
		this.POP = new Dialog_class();
	}

	size() {
		var _this = this;
		var common_dimensions = this.Base_gui.common_dimensions;

		var resolutions = ['Custom'];
		for (var i in common_dimensions) {
			var value = common_dimensions[i];
			resolutions.push(value[0] + 'x' + value[1] + ' - ' + value[2]);
		}

		var settings = {
			title: 'Canvas size',
			params: [
				{name: "w", title: "Width:", value: config.WIDTH, placeholder: config.WIDTH, comment: "in pixels"},
				{name: "h", title: "Height:", value: config.HEIGHT, placeholder: config.HEIGHT, comment: "in pixels"},
				{name: "resolution", title: "Resolution:", values: resolutions},
			],
			on_finish: function (params) {
				_this.size_handler(params);
			},
		};
		this.POP.show(settings);
	}

	size_handler(data) {
		var width = parseInt(data.w);
		var height = parseInt(data.h);
		var ratio = config.WIDTH / config.HEIGHT;

		if (width < 1){
			width = 1;
		}
		if (height < 1){
			height = 1;
		}
		
		//aspect ratio
		if (isNaN(width) && isNaN(height)){
			alertify.error('Wrong dimensions');
			return;
		}
		if (isNaN(width)){
			width = height * ratio;
		}
		if (isNaN(height)){
			height = width / ratio;
		}
		
		if (data.resolution != 'Custom') {
			var dim = data.resolution.split(" ");
			dim = dim[0].split("x");
			width = dim[0];
			height = dim[1];
		}

		app.State.do_action(
			new app.Actions.Bundle_action('set_image_size', 'Set Image Size', [
				new app.Actions.Prepare_canvas_action('undo'),
				new app.Actions.Update_config_action({
					WIDTH: parseInt(width),
					HEIGHT: parseInt(height)
				}),
				new app.Actions.Prepare_canvas_action('do')
			])
		);
	}
}

export default Image_size_class;
