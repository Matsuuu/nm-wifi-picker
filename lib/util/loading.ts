let loadingInterval: NodeJS.Timeout;

export function startLoadingAnimation(
    text = "",
    chars = ["⠙", "⠘", "⠰", "⠴", "⠤", "⠦", "⠆", "⠃", "⠋", "⠉"],
    delay = 100,
) {
    let x = 0;

    loadingInterval = setInterval(function () {
        process.stdout.write("\r" + chars[x++] + " " + text);
        x = x % chars.length;
    }, delay);
}

export function stopLoadingAnimation() {
    clearInterval(loadingInterval);
    process.stdout.write("\r\n");
}
