export function drawGrid(canvas, context, minor, major, stroke, fill) {
    minor = minor || 10;
    major = major || minor * 5;
    stroke = stroke || "#00ff00";
    fill = fill || "#009900";

    context.save();

    context.strokeStyle = stroke;
    context.fillStyle = fill;

    let width = canvas.width;
    let height = canvas.height;

    for(var x = 0; x < width; x+=minor) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.lineWidth = (x % major == 0) ? 0.5 : 0.25;
        context.stroke();
        if (x % major == 0) {
            context.fillText(x, x + 2, 10);
        }
    }
    for(var y = 0; y < height; y+=minor) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.lineWidth = (y % major == 0) ? 0.5 : 0.25;
        context.stroke();
        if (y % major == 0) {
            if (y != 0) {
                context.fillText(y, 2, y + 10);
            }
        }
    }

    context.restore();
}

export function drawPackman(canvas, context, x, y, radius, mouth) {
    x = x || canvas.width / 2;
    y = y || canvas.height / 2;
    radius = radius || 100;
    mouth = mouth || 0;

    context.save();

    context.beginPath();
    context.fillStyle = 'yellow';
    context.arc(x, y, radius, Math.PI * (0 + (mouth / 4)), Math.PI * (2 - (mouth / 4)));
    context.lineTo(x, y);
    context.closePath();
    context.fill();

    context.restore();
}