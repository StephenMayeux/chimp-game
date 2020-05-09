class ChimpGame {
	constructor({ width, height, delay }) {
		this.START_KEY_CODE = 13;
		this.STOP_KEY_CODE = 27;
		this.width = width;
		this.height = height;
		this.delay = delay;
		this.inProgress = false;
		this.reactionTimes = [];
		this.box = null;
		this.x = null;
		this.y = null;
		this.color = null;
		this.timeOnRender = null;
		this.events = [];
	}

	init() {
		window.addEventListener('keyup', (e) => {
			if (e.keyCode === this.START_KEY_CODE && !this.inProgress){
				this.startGame();
			} else if (e.keyCode === this.STOP_KEY_CODE && this.inProgress) {
				this.stopGame();
			}
		});
	}

	startGame() {
		this.inProgress = true;
		this.handleBox();
	}

	recordEvent() {
		this.events.push({
			color: this.color,
			x: this.x,
			y: this.y,
			response: Date.now() - this.timeOnRender
		});
		console.log(this.events);
	}

	handleBox() {
		this.createBox();
		this.renderBox();
		this.recordTime();
	}

	createBox() {
		this.box = document.createElement('div');
		this.box.setAttribute('class', 'box');
		this.box.setAttribute('style', this.setStyles());
		this.box.addEventListener('click', this.handleClick);
	}

	renderBox() {
		document.body.appendChild(this.box);
	}

	recordTime() {
		this.timeOnRender = Date.now();
	}

	handleClick = () => {
		this.recordEvent();
		this.destroyBox();
		setTimeout(() => {
			if (this.inProgress) {
				this.handleBox();
			}
		}, this.delay);
	}

	destroyBox() {
		if (this.box) {
			document.body.removeChild(this.box);
			this.box = null;
		}
	}

	stopGame() {
		this.inProgress = false;
		this.destroyBox();
		this.exportResults();
		this.clearResults();
	}

	exportResults() {
		const headers = 'color,x,y,response\n';
		const csvContent = this.events.reduce((acc, row) => {
			const [color, x, y, response] = Object.values(row);
			acc += `${color},${x},${y},${response}\n`;
			return acc;
		}, headers);

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const filename = `results-${Date.now()}`;
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, filename);
    } else {
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
	}

	clearResults() {
		this.events.length = 0;
	}

	setStyles() {
		let style = `background-color: ${this.setColor()};`;
		style += `top: ${this.getRandomYPosition()}px;`;
		style += `left: ${this.getRandomXPosition()}px;`;
		style += `width: ${this.width}px; height: ${this.height}px;`;
		return style;
	}

	getRandomXPosition() {
		const left = window.innerWidth
		|| document.documentElement.clientWidth
		|| document.body.clientWidth;
		const position = Math.floor(Math.random() * (left - this.width));
		this.x = position;
		return position;
	}

	getRandomYPosition() {
		const top = window.innerHeight
		|| document.documentElement.clientHeight
		|| document.body.clientHeight;
		const position = Math.floor(Math.random() * (top - this.height));
		this.y = position;
		return position;
	}

	setColor() {
		const colors = ['black', 'red', 'green', 'yellow', 'blue', 'purple'];
		const randomIdx = Math.floor(Math.random() * colors.length);
		const color = colors[randomIdx];
		this.color = color;
		return color;
	}
}

const config = { width: 100, height: 100, delay: 500 }
const game = new ChimpGame(config);
game.init();