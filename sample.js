class MyClass {
    constructor() {
        this.enabled = true;
        this.paused = false;
        //box variables
        this.boxX = 20;
        this.boxY = 20;
        this.colorChangeCounter = 0;
        this.currentColor = 'lightgreen';
        this.canvas = document.getElementById('my-canvas');
        this.ctx = this.canvas.getContext('2d');
    }
    runAnimation() {
        if (this.paused)
            return;
        this.boxX += 1;
        if (this.boxX > 300)
            this.boxX = 0;
        this.ctx.clearRect(0, 0, 300, 300);
        this.ctx.fillStyle = this.currentColor;
        this.ctx.fillRect(this.boxX, this.boxY, 50, 50);
        this.drawText('COLOR: ' + this.currentColor, 20, 230, 'purple');
        if (this.enabled)
            window.requestAnimationFrame(window["myCanvasApp"].runAnimation.bind(this));
    }
    drawText(text, x, y, color) {
        // this.ctx.globalAlpha = 0.5;
        this.ctx.font = "16px Comic Sans MS";
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
        this.ctx.globalAlpha = 1;
    }
    pause() {
        if (this.paused) {
            this.paused = false;
            document.getElementById('btnPause').innerText = 'Pause';
            this.runAnimation();
        }
        else {
            this.paused = true;
            document.getElementById('btnPause').innerText = 'Resume';
        }
    }
}
//clear out old canvases
document.getElementById('divOutput').innerHTML = '';
if (window["myCanvasApp"])
    window["myCanvasApp"].enabled = false;
//create canvas
const canvas = document.createElement("canvas");
canvas.id = "my-canvas";
canvas.style.backgroundColor = "#eeeedd";
canvas.style.width = "300px";
canvas.width = 300;
canvas.height = 300;
canvas.style.imageRendering = 'pixelated';
document.getElementById('divOutput').appendChild(canvas);
const br = document.createElement("br");
document.getElementById('divOutput').appendChild(br);
const button = document.createElement("button");
button.classList.add("btn", "btn-primary");
button.id = "btnPause";
button.innerText = "Pause";
button.style.marginLeft = '20px';
button.style.marginTop = '30px';
button.onclick = () => { window["myCanvasApp"].pause(); };
document.getElementById('divOutput').appendChild(button);
window["myCanvasApp"] = new MyClass();
window["myCanvasApp"].runAnimation();
//# sourceMappingURL=sample.js.map