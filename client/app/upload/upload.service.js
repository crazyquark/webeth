'use strict'

angular.module('webethApp')
	.service('uploaderService', function (FileUploader, socket) {
		var uploader = new FileUploader({
			socketJsClient: socket
		});

		uploader.filters.push({
			name: 'customFilter',
			fn: function (item /*{File|FileLikeObject}*/, options) {
				return this.queue.length < 10;
			}
		});

		return uploader;
	});