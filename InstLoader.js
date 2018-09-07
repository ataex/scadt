const defaultXhrOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function() {
	if (arguments[1] && arguments[1].includes('graphql')) {
		let uri = decodeURIComponent(arguments[1]);

		this.addEventListener('load', function() {
			const {
				edges,
				count,
				page_info: { end_cursor },
			} = JSON.parse(this.responseText).data.user.edge_followed_by;
			uri = uri.replace(/"first":(\d*)/, `"first":${count - edges.length}`);
			uri = uri.replace(/}/, `,"after":"${end_cursor}"}`);
			XMLHttpRequest.prototype.open = defaultXhrOpen;

			loadOther(uri, edges);
		});
	}
	defaultXhrOpen.apply(this, arguments);
};

function loadOther(uri, res) {
	const xhr = new XMLHttpRequest();
	xhr.open('GET', uri);
	xhr.addEventListener('load', function() {
		const { edges, count } = JSON.parse(
			this.responseText
		).data.user.edge_followed_by;
		res = res.concat(edges);
		res = res.reduce((r, v) => (r += v.node.username + '\n'), '');
		res = res.replace(/\n$/, '');

		var file = new Blob([res], { type: 'text/csv' });
		const downloadLink = document.createElement('a');
		downloadLink.text = 'Download';
		downloadLink.style = 'font-size:inherit;margin-left:1em';
		downloadLink.download = 'followers.txt';
		downloadLink.href = URL.createObjectURL(file);
		downloadLink.dataset.downloadurl = [
			'text/csv',
			downloadLink.download,
			downloadLink.href,
		].join(':');
		downloadLink.click(),
		document.querySelector('div[role="dialog"] h1').appendChild(downloadLink);
	});
	xhr.send();
}
