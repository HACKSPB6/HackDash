var display = require('display');
var keyboardApi = require('keyboard');
var storage = require('storage');
var device = require('device');
var width = display.width;
var height = display.height;
var color = display.color;
var drawFillRect = display.drawFillRect;
var drawRect = display.drawRect;
var drawString = display.drawString;
var setTextColor = display.setTextColor;
var setTextSize = display.setTextSize;
var getPrevPress = keyboardApi.getPrevPress;
var getNextPress = keyboardApi.getNextPress;
var getSelPress = keyboardApi.getSelPress;
var getEscPress = keyboardApi.getEscPress;
var screenWidth = width();
var screenHeight = height();

var GAME_VERSION = "V:0.0.4BETA BY HACKSPB";

var COLOR_BG = color(15, 20, 35);
var COLOR_GROUND = color(30, 40, 60);
var COLOR_SPIKE = color(255, 50, 50);
var COLOR_WHITE = color(255, 255, 255);
var COLOR_PROGRESS = color(0, 255, 100);
var COLOR_FINISH = color(255, 255, 100);
var COLOR_GOLD = color(255, 215, 0);
var COLOR_RED = color(255, 0, 0);
var COLOR_BLUE = color(0, 150, 255);
var COLOR_PURPLE = color(150, 50, 255);
var COLOR_BLACK = color(0, 0, 0);
var COLOR_ORANGE = color(255, 140, 0);
var COLOR_PINK = color(255, 50, 150);
var COLOR_GREEN = color(0, 255, 0);
var COLOR_CYAN = color(0, 255, 255);
var COLOR_YELLOW = color(255, 255, 0);
var COLOR_GRAY = color(100, 100, 100);
var COLOR_BROWN = color(139, 69, 19);
var COLOR_LIGHT_BROWN = color(205, 133, 63);

var playerSize = 15;
var playerX = 30;
var groundY = screenHeight - 20;
var playerY = groundY - playerSize;
var velocityY = 0;
var gravity = 2;
var jumpForce = -14;
var gameSpeed = 5;
var isJumping = false;
var jumpScaleX = 1;
var jumpScaleY = 1;

var ACTIVATION_FILE = "/key_data.json";
var isActivated = false;
var VALID_KEY = "217HACKSPB-0110";
var VALID_KEY_ALT = "217STICKFLUX-2344";

function isValidActivationKey(key) {
    return key === VALID_KEY || key === VALID_KEY_ALT;
}

var FACE_COLORS = [
{ name: "WHITE", color: color(255, 255, 255) },
{ name: "BLACK", color: color(30, 30, 30) },
{ name: "RED", color: color(255, 50, 50) },
{ name: "BLUE", color: color(50, 150, 255) },
{ name: "GREEN", color: color(50, 255, 50) },
{ name: "GOLD", color: color(255, 215, 0) },
{ name: "PURPLE", color: color(150, 50, 255) },
{ name: "RAINBOW", color: color(255, 0, 255) }
];

var HAT_COLORS = [
{ name: "NONE", color: null },
{ name: "RED", color: color(255, 0, 0) },
{ name: "BLUE", color: color(0, 100, 255) },
{ name: "GREEN", color: color(0, 200, 0) },
{ name: "GOLD", color: color(255, 215, 0) },
{ name: "PURPLE", color: color(180, 50, 255) },
{ name: "BLACK", color: color(40, 40, 40) },
{ name: "RAINBOW", color: color(255, 100, 255) }
];

var SKINS = [
{ name: "CYAN", color: color(0, 255, 255), shipColor: color(255, 200, 0) },
{ name: "GREEN", color: color(0, 255, 0), shipColor: color(100, 255, 100) },
{ name: "RED", color: color(255, 50, 50), shipColor: color(255, 150, 50) },
{ name: "PURPLE", color: color(150, 50, 255), shipColor: color(200, 100, 255) },
{ name: "ORANGE", color: color(255, 140, 0), shipColor: color(255, 200, 100) },
{ name: "PINK", color: color(255, 50, 150), shipColor: color(255, 100, 200) },
{ name: "GOLD", color: color(255, 215, 0), shipColor: color(255, 180, 0) },
{ name: "BLACK", color: color(50, 50, 50), shipColor: color(80, 80, 80) },
{ name: "FLUX", color: color(255, 20, 20), shipColor: color(255, 100, 100) },
{ name: "RAINBOW", color: color(255, 0, 255), shipColor: color(0, 255, 255) }
];

var UPDATES = [
    { version: "V0.0.1", date: "23.04.2026" },
    { version: "V0.0.2", date: "01.05.2026" },
    { version: "V0.0.3", date: "12.05.2026" },
    { version: "V0.0.4", date: "21.05.2026" },
    { version: "V0.0.5", date: "coming soon" },
    { version: "V0.0.6", date: "coming soon" }
];

var LEVELS = [
{ name: "EASY", speed: 8, spawnRate: 50, gravity: 2, jumpForce: -14, length: 600, obstacles: ["SPIKE"], theme: "pastel" },
{ name: "MEDIUM", speed: 9, spawnRate: 40, gravity: 2.5, jumpForce: -15, length: 800, obstacles: ["SPIKE", "TWIN", "TALL_SPIKE"], theme: "neon" },
{ name: "HARD", speed: 10, spawnRate: 32, gravity: 3, jumpForce: -16, length: 1100, obstacles: ["SPIKE", "TWIN", "TRIPLE", "TALL_SPIKE", "FLYING"], theme: "lava" },
{ name: "INSANE", speed: 11, spawnRate: 25, gravity: 3.5, jumpForce: -17, length: 1500, obstacles: ["SPIKE", "TWIN", "TRIPLE", "FLYING", "DROP_SPIKE"], theme: "cyber" },
{ name: "EXTREME", speed: 12, spawnRate: 20, gravity: 4, jumpForce: -18, length: 2000, obstacles: ["TWIN", "TRIPLE", "FLYING", "BLOCK", "TALL_SPIKE", "DROP_SPIKE"], theme: "void" },
{ name: "IMPOSSIBLE", speed: 13, spawnRate: 15, gravity: 4.5, jumpForce: -19, length: 2500, obstacles: ["TRIPLE", "WAVE", "BLOCK", "TALL_SPIKE", "DROP_SPIKE"], theme: "storm" },
{ name: "CREEPER", speed: 11, spawnRate: 999, gravity: 3, jumpForce: -15, length: 99999, obstacles: [], isBoss: true, bossType: "CREEPER", theme: "shadow" },
{ name: "BILL CIPHER", speed: 11, spawnRate: 999, gravity: 3, jumpForce: -15, length: 99999, obstacles: [], isBoss: true, bossType: "BILL", theme: "void" },
{ name: "FLOWEY", speed: 11, spawnRate: 999, gravity: 3, jumpForce: -15, length: 99999, obstacles: [], isBoss: true, bossType: "FLOWEY", theme: "poison" },
{ name: "SANS", speed: 11, spawnRate: 999, gravity: 3, jumpForce: -15, length: 99999, obstacles: [], isBoss: true, bossType: "SANS", theme: "bone" },
{ name: "FREDDY", speed: 11, spawnRate: 999, gravity: 3, jumpForce: -15, length: 99999, obstacles: [], isBoss: true, bossType: "FREDDY", theme: "shadow" },
{ name: "VADER", speed: 11, spawnRate: 999, gravity: 3, jumpForce: -15, length: 99999, obstacles: [], isBoss: true, bossType: "VADER", theme: "space" },
{ name: "METTATON", speed: 11, spawnRate: 999, gravity: 3, jumpForce: -15, length: 99999, obstacles: [], isBoss: true, bossType: "METTATON", theme: "glam" },
{ name: "CAINE", speed: 11, spawnRate: 999, gravity: 3, jumpForce: -15, length: 99999, obstacles: [], isBoss: true, bossType: "CAINE", theme: "digital" }
];
var shouldExit = false;

var gameState = 0;
var selectedLevel = 0;
var selectedSkin = 0;
var selectedFaceColor = 0;
var selectedHatColor = 0;
var score = 0;
var frameCounter = 0;
var menuAnimation = 0;
var levelProgress = 0;
var batteryPercent = 0;

var playerStoneTimer = 0;
var isGravityInverted = false;
var floweyGlitchTimer = 0;

var gameMode = 0;
var shipY = 0;
var shipVelocity = 0;

var playerProjectiles = [];
var shootCooldown = 0;

var deathAnimFrame = 0;
var isDead = false;
var finishAnimFrame = 0;
var isFinished = false;
var finishParticles = [];

var obstacles = [];
var obstacleSize = 15;
var flyingObstacles = [];

var boss = { 
active: false, 
x: 0, 
y: 0, 
targetY: 0, 
phase: 0, 
attackTimer: 0, 
hp: 100, 
maxHp: 100,
bossType: "CREEPER",
invincible: 0,
phaseTimer: 0,
specialTimer: 0,
teleportTimer: 0,
shieldActive: false
};
var lasers = [];
var bossProjectiles = [];
var bossLava = [];
var bossMinions = [];
var bossShields = [];

var menuSelection = 0;
var mainMenuIndex = 0;
var shopSelection = 0;

var fileSystem = "littlefs";
var DATA_FILE = "/hackdash_data.json";
var ENCRYPTION_KEY = generateDeviceKey();
var highScores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var playerNickname = "Player";
var easterEggFlags = {
hacksbp: false,
lithromantov: false,
dev: false,
admin: false,
god: false,
flux: false
};

var CREATOR_USERNAME = "@HackDash_maneger";
var CREATOR_TELEGRAM = "t.me/hackspb6";
var CREATOR_TIKTOK = "@hackspb6";
var CREATOR_PARTNER_TELEGRAM = "@StickFluxBot";
var MENU_BACKGROUNDS = ["DEFAULT","NEON","PASTEL","DARK"];
var selectedMenuBackground = 0;
var checksum = 0;
var gameStartTime = Date.now();
var minPlayTime = 10000;

function verifyCoreConstants() {
    return false;
}

function verifyCoreBuiltinIntegrity() {
    return false;
}

function generateChecksum(data) {
var hash = 0;
for (var i = 0; i < data.length; i++) {
hash = ((hash << 5) - hash) + data.charCodeAt(i);
hash = hash & hash;
}
return Math.abs(hash);
}

function verifyDataIntegrity(data) {
if (!data || !data.encryptedData || !data.checksum) return false;
var decrypted = decrypt(data.encryptedData);
if (!decrypted) return false;
var computedChecksum = generateChecksum(decrypted);
return computedChecksum === data.checksum;
}

function checkSpeedHack() {

return false;
}

function checkScoreIntegrity() {

return false;
}

function checkProgressIntegrity() {

return false;
}

function checkVariableIntegrity() {

return false;
}

function runSecurityCheck() {
    return true;
}

function showLoadingScreen() {
var spinner = ["|", "/", "-", "\\"];
var barWidth = screenWidth - 40;
for (var step = 0; step <= 100; step += 5) {
var fillWidth = Math.floor((barWidth - 4) * step / 100);
display.fill(COLOR_BG);
drawFillRect(20, screenHeight / 2 - 10, barWidth, 14, color(50, 50, 80));
drawFillRect(22, screenHeight / 2 - 8, fillWidth, 10, COLOR_PROGRESS);
setTextColor(COLOR_WHITE);
setTextSize(2);
drawString("LOADING GAME", screenWidth / 2 - 50, screenHeight / 2 - 40);
setTextSize(0);
drawString("Please wait " + step + "% " + spinner[(step / 5) % spinner.length], screenWidth / 2 - 55, screenHeight / 2 + 10);
drawString("Initializing resources...", 20, screenHeight / 2 + 34);
drawString("Powered by " + CREATOR_USERNAME, 20, screenHeight - 15);
delay(40);
}
for (var i = 0; i < 8; i++) {
var pos = 28 + i * 18;
drawFillRect(pos, screenHeight / 2 - 40, 12, 12, (i % 2 === 0) ? COLOR_FINISH : COLOR_CYAN);
}
delay(200);
}

function checkActivation() {
try {
var data = storage.read({ fs: fileSystem, path: ACTIVATION_FILE });
if (data) {
var parsed = JSON.parse(data);
if (parsed.activated && isValidActivationKey(parsed.key)) {
isActivated = true;
return true;
}
}
} catch (e) {
return false;
}
return false;
}

function activateGame(keyInput) {
if (!keyInput || !isValidActivationKey(keyInput)) {
return { success: false, message: "" };
}
var activationData = {
activated: true,
key: keyInput,
timestamp: Date.now()
};
try {
storage.write({ fs: fileSystem, path: ACTIVATION_FILE }, JSON.stringify(activationData, null, 2), "write");
isActivated = true;
return { success: true, message: "Activation successful!" };
} catch (e) {
return { success: false, message: "Save error 404" + e.message };
}
}

function showActivationScreen() {
display.fill(COLOR_BG);
setTextColor(COLOR_GOLD);
setTextSize(2);
drawString("ACTIVATION", screenWidth / 2 - 50, screenHeight / 2 - 60);
setTextColor(COLOR_WHITE);
setTextSize(1);
drawString("Enter Activation Key:", screenWidth / 2 - 60, screenHeight / 2 - 30);
drawString("Format: XXXXXXXXXX-XXXX", screenWidth / 2 - 55, screenHeight / 2 - 15);
setTextColor(COLOR_PROGRESS);
setTextSize(0);
drawString("Press Sel to enter key", screenWidth / 2 - 50, screenHeight / 2 + 10);
drawString("Press Esc to exit", screenWidth / 2 - 40, screenHeight / 2 + 25);
var entered = false;
var frame = 0;
while (!entered && frame < 300) {
if (getSelPress()) {
entered = true;
delay(200);
break;
}
if (getEscPress()) {
entered = true;
delay(200);
return false;
}
frame++;
delay(30);
}
if (getEscPress()) return false;
display.fill(COLOR_BG);
setTextColor(COLOR_GOLD);
setTextSize(2);
drawString("ENTER KEY", screenWidth / 2 - 45, screenHeight / 2 - 60);
setTextColor(COLOR_WHITE);
setTextSize(1);
drawString("Key:", screenWidth / 2 - 40, screenHeight / 2 - 20);
setTextColor(COLOR_PROGRESS);
setTextSize(0);
drawString("Use keyboard to enter", screenWidth / 2 - 45, screenHeight / 2);
delay(1000);
var keyInput = keyboardApi.keyboard(30, "Enter activation key:", false);
if (!keyInput || keyInput === "" || keyInput === "\x1b") {
return false;
}
var result = activateGame(keyInput);
var flashColor = result.success ? color(0, 80, 0) : color(100, 0, 0);
var bgColor = result.success ? color(0, 50, 0) : color(80, 0, 0);
for (var flash = 0; flash < 10; flash++) {
display.fill(flash % 2 === 0 ? flashColor : bgColor);
delay(80);
}
display.fill(COLOR_BG);
setTextColor(result.success ? COLOR_GOLD : COLOR_RED);
setTextSize(2);
drawString(result.success ? "ACTIVATED!" : "FAILED!", screenWidth / 2 - 55, screenHeight / 2 - 30);
setTextColor(COLOR_WHITE);
setTextSize(1);
drawString(result.message, screenWidth / 2 - 50, screenHeight / 2);
if (result.success) {
setTextColor(COLOR_GOLD);
setTextSize(0);
drawString("Welcome to HackDash!", screenWidth / 2 - 55, screenHeight / 2 + 20);
delay(2000);
return true;
} else {
display.fill(COLOR_RED);
delay(200);
display.fill(COLOR_BG);
delay(200);
display.fill(COLOR_RED);
delay(200);
display.fill(COLOR_BG);
delay(200);
display.fill(COLOR_BG);
setTextColor(COLOR_RED);
setTextSize(2);
drawString("ACCESS DENIED", screenWidth / 2 - 65, screenHeight / 2 - 30);
setTextColor(COLOR_WHITE);
setTextSize(1);
drawString("Invalid activation key!", screenWidth / 2 - 60, screenHeight / 2);
drawString("Game will now close.", screenWidth / 2 - 55, screenHeight / 2 + 20);
delay(3000);
shouldExit = true;
return false;
}
}

function triggerHacksbpEasterEgg() {
display.fill(COLOR_BG);
setTextColor(COLOR_SPIKE);
setTextSize(2);
drawString("WARNING", screenWidth / 2 - 40, screenHeight / 2 - 40);
delay(500);
display.fill(color(0, 0, 0));
setTextColor(color(0, 255, 0));
setTextSize(1);
drawString("> ACCESSING MAINFRAME...", 10, 30);
delay(300);
drawString("> BYPASSING FIREWALL...", 10, 45);
delay(300);
drawString("> DECRYPTING DATA...", 10, 60);
delay(300);
drawString("> ADMIN PRIVILEGES FOUND", 10, 75);
delay(300);
drawString("> GOD MODE ACTIVATED", 10, 90);
delay(300);
drawString("> ALL LEVELS UNLOCKED", 10, 105);
delay(300);
drawString("> IMMORTALITY ENABLED", 10, 120);
delay(500);
display.fill(COLOR_BG);
setTextColor(COLOR_FINISH);
setTextSize(2);
drawString("HACKSPB DETECTED!", screenWidth / 2 - 70, screenHeight / 2 - 30);
setTextColor(COLOR_WHITE);
setTextSize(1);
drawString("ALL PRIVILEGES GRANTED", screenWidth / 2 - 60, screenHeight / 2 + 5);
drawString("IMMORTALITY ENABLED", screenWidth / 2 - 55, screenHeight / 2 + 20);
easterEggFlags.hacksbp = true;
easterEggFlags.admin = true;
easterEggFlags.god = true;
easterEggFlags.dev = true;
easterEggFlags.lithromantov = true;
playerNickname = "HACKSPB";
selectedSkin = 6;
saveData();
delay(3000);
}

function triggerLithromantovEasterEgg() {
display.fill(COLOR_BG);
setTextColor(COLOR_GOLD);
setTextSize(2);
drawString("LEGEND", screenWidth / 2 - 30, screenHeight / 2 - 40);
delay(500);
for (var i = 0; i < 10; i++) {
display.fill(i % 2 === 0 ? COLOR_BG : color(50, 50, 0));
setTextColor(COLOR_GOLD);
setTextSize(1);
drawString("WELCOME LITHROMANTOV", screenWidth / 2 - 70, screenHeight / 2 - 20);
drawString("THE MYSTIC PLAYER", screenWidth / 2 - 50, screenHeight / 2);
delay(100);
}
display.fill(COLOR_BG);
setTextColor(COLOR_GOLD);
setTextSize(2);
drawString("LITHROMANTOV", screenWidth / 2 - 55, screenHeight / 2 - 20);
setTextColor(COLOR_WHITE);
setTextSize(1);
drawString("Mystic Mode Activated", screenWidth / 2 - 55, screenHeight / 2 + 10);
drawString("All skins unlocked!", screenWidth / 2 - 50, screenHeight / 2 + 25);
easterEggFlags.lithromantov = true;
playerNickname = "Lithromantov";
selectedSkin = 7;
saveData();
delay(2000);
}

function triggerDevEasterEgg() {
display.fill(color(0, 0, 0));
setTextColor(color(0, 255, 0));
setTextSize(1);
drawString("> DEV MODE", 10, 20);
drawString("> UNLOCKING ALL FEATURES...", 10, 40);
delay(500);
for (var i = 0; i < LEVELS.length; i++) {
drawString("> LEVEL " + LEVELS[i].name + " UNLOCKED", 10, 60 + (i * 15));
delay(100);
}
display.fill(COLOR_BG);
setTextColor(color(0, 255, 0));
setTextSize(2);
drawString("DEV MODE", screenWidth / 2 - 35, screenHeight / 2 - 20);
setTextColor(COLOR_WHITE);
setTextSize(1);
drawString("All features unlocked!", screenWidth / 2 - 50, screenHeight / 2 + 10);
easterEggFlags.dev = true;
playerNickname = "DEV";
selectedSkin = 1;
saveData();
delay(2000);
}

function triggerAdminEasterEgg() {
display.fill(color(50, 0, 0));
setTextColor(COLOR_WHITE);
setTextSize(2);
drawString("ADMIN ACCESS", screenWidth / 2 - 45, screenHeight / 2 - 30);
delay(300);
display.fill(color(0, 50, 0));
setTextColor(COLOR_WHITE);
drawString("ACCESS GRANTED", screenWidth / 2 - 45, screenHeight / 2 - 15);
delay(300);
display.fill(COLOR_BG);
setTextColor(COLOR_FINISH);
setTextSize(2);
drawString("ADMIN MODE", screenWidth / 2 - 40, screenHeight / 2 - 20);
setTextColor(COLOR_WHITE);
setTextSize(1);
drawString("God Mode Activated", screenWidth / 2 - 50, screenHeight / 2 + 10);
drawString("No damage possible", screenWidth / 2 - 50, screenHeight / 2 + 25);
easterEggFlags.admin = true;
playerNickname = "ADMIN";
selectedSkin = 0;
saveData();
delay(2000);
}

function triggerGodEasterEgg() {
display.fill(color(255, 255, 200));
setTextColor(color(0, 0, 0));
setTextSize(2);
drawString("GOD MODE", screenWidth / 2 - 40, screenHeight / 2 - 30);
delay(500);
display.fill(color(255, 200, 255));
setTextColor(color(0, 0, 0));
drawString("DIVINE POWER", screenWidth / 2 - 45, screenHeight / 2 - 15);
delay(500);
display.fill(COLOR_BG);
setTextColor(COLOR_GOLD);
setTextSize(2);
drawString("GOD MODE", screenWidth / 2 - 35, screenHeight / 2 - 20);
setTextColor(COLOR_WHITE);
setTextSize(1);
drawString("Immortal!", screenWidth / 2 - 30, screenHeight / 2 + 10);
drawString("Score x10", screenWidth / 2 - 30, screenHeight / 2 + 25);
easterEggFlags.god = true;
playerNickname = "GOD";
selectedSkin = 6;
saveData();
delay(2000);
}



function triggerFluxEasterEgg() {
display.fill(COLOR_BG);
setTextColor(COLOR_CYAN);
setTextSize(2);
drawString("FLUX MODE", screenWidth / 2 - 45, screenHeight / 2 - 30);
delay(400);
for (var i = 0; i < 6; i++) {
setTextColor(i % 2 === 0 ? COLOR_CYAN : COLOR_PURPLE);
setTextSize(1);
drawString("ENERGY SURGE ENABLED", screenWidth / 2 - 70, screenHeight / 2 - 5 + (i * 12));
delay(120);
}
display.fill(COLOR_BG);
setTextColor(COLOR_CYAN);
setTextSize(2);
drawString("FLUX UNLOCKED", screenWidth / 2 - 55, screenHeight / 2 - 20);
setTextColor(COLOR_WHITE);
setTextSize(1);
drawString("Pulse skin activated", screenWidth / 2 - 55, screenHeight / 2 + 10);
drawString("Speed boost +1", screenWidth / 2 - 55, screenHeight / 2 + 25);
easterEggFlags.flux = true;
playerNickname = "FLUX";
selectedSkin = 8;
saveData();
delay(2000);
}

function inputNickname() {
display.fill(COLOR_BG);
setTextColor(COLOR_WHITE);
setTextSize(2);
drawString("Enter Nickname", screenWidth / 2 - 60, screenHeight / 2 - 30);
setTextColor(COLOR_PROGRESS);
setTextSize(1);
drawString("Press any key...", screenWidth / 2 - 50, screenHeight / 2 + 10);
delay(1000);
var newNickname = keyboardApi.keyboard(50, "Enter your nickname:", false);
if (newNickname && newNickname !== "" && newNickname !== "\x1b") {
var upperNick = newNickname.toUpperCase();
var wasEasterEggName = (playerNickname.toUpperCase() === "HACKSPB" || 
playerNickname.toUpperCase() === "LITHROMANTOV" || 
playerNickname.toUpperCase() === "DEV" || 
playerNickname.toUpperCase() === "DEVELOPER" || 
playerNickname.toUpperCase() === "ADMIN" || 
playerNickname.toUpperCase() === "ADMINISTRATOR" || 
playerNickname.toUpperCase() === "GOD" || 
playerNickname.toUpperCase() === "GODMODE" || 
playerNickname.toUpperCase() === "FLUX");
if (upperNick === "HACKSPB") {
triggerHacksbpEasterEgg();
return playerNickname;
} else if (upperNick === "LITHROMANTOV") {
triggerLithromantovEasterEgg();
return playerNickname;
} else if (upperNick === "DEV" || upperNick === "DEVELOPER") {
triggerDevEasterEgg();
return playerNickname;
} else if (upperNick === "ADMIN" || upperNick === "ADMINISTRATOR") {
triggerAdminEasterEgg();
return playerNickname;
} else if (upperNick === "GOD" || upperNick === "GODMODE") {
triggerGodEasterEgg();
return playerNickname;
} else if (upperNick === "FLUX") {
triggerFluxEasterEgg();
return playerNickname;
}
if (wasEasterEggName) {
easterEggFlags = {
hacksbp: false,
lithromantov: false,
dev: false,
admin: false,
god: false
};
saveData();
}
if (newNickname.length > 15) {
newNickname = newNickname.substring(0, 15);
}
playerNickname = newNickname;
saveData();
display.fill(COLOR_BG);
setTextColor(COLOR_WHITE);
setTextSize(1);
drawString("Nickname saved!", screenWidth / 2 - 45, screenHeight / 2);
drawString("Welcome, " + playerNickname, screenWidth / 2 - 55, screenHeight / 2 + 20);
delay(1500);
}
return playerNickname;
}

function resetEasterEggRewards() {
if (easterEggFlags.hacksbp || easterEggFlags.lithromantov || 
easterEggFlags.dev || easterEggFlags.admin || easterEggFlags.god || easterEggFlags.flux) {
selectedSkin = 0;
selectedFaceColor = 0;
selectedHatColor = 0;
easterEggFlags = {
hacksbp: false,
lithromantov: false,
dev: false,
admin: false,
god: false,
flux: false
};
saveData();
}
}

function hasAnyEgg() {
return (easterEggFlags.hacksbp || easterEggFlags.lithromantov || easterEggFlags.dev || easterEggFlags.admin || easterEggFlags.god || easterEggFlags.flux);
}

function getNickWithEggs() {
var prefix = "";
if (easterEggFlags.hacksbp) prefix = "[HCK] ";
else if (easterEggFlags.god) prefix = "[GOD] ";
else if (easterEggFlags.admin) prefix = "[ADM] ";
else if (easterEggFlags.lithromantov) prefix = "[LIT] ";
else if (easterEggFlags.flux) prefix = "[FLX] ";
else if (easterEggFlags.dev) prefix = "[DEV] ";
return prefix + playerNickname;
}

function generateDeviceKey() {
var seed = "HACKDASH_217-HACKSPB-2026";
try {
var deviceId = storage.read({ fs: "littlefs", path: "/.device_id" });
if (deviceId) {
return simpleHash(deviceId + seed);
}
var newId = "DEV_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
storage.write({ fs: "littlefs", path: "/.device_id" }, newId, "write");
return simpleHash(newId + seed);
} catch (e) {
return simpleHash(seed + screenWidth + screenHeight);
}
}

function simpleHash(str) {
var hash = 0;
for (var i = 0; i < str.length; i++) {
var char = str.charCodeAt(i);
hash = ((hash << 5) - hash) + char;
hash = hash & hash;
}
return Math.abs(hash);
}

function encrypt(plaintext) {
if (!plaintext) return null;
var result = "";
var keyStr = ENCRYPTION_KEY.toString();
for (var i = 0; i < plaintext.length; i++) {
var charCode = plaintext.charCodeAt(i) ^ keyStr.charCodeAt(i % keyStr.length);
result += String.fromCharCode(charCode);
}
return btoa(result);
}

function decrypt(encrypted) {
if (!encrypted) return null;
try {
var decoded = atob(encrypted);
var result = "";
var keyStr = ENCRYPTION_KEY.toString();
for (var i = 0; i < decoded.length; i++) {
var charCode = decoded.charCodeAt(i) ^ keyStr.charCodeAt(i % keyStr.length);
result += String.fromCharCode(charCode);
}
return result;
} catch (e) {
return null;
}
}

function detectFileSystem() {
try {
var confData = storage.read({ fs: "sd", path: "/bruce.conf" });
fileSystem = confData ? "sd" : "littlefs";
} catch (e) {
fileSystem = "littlefs";
}
}

function loadData() {
try {
var data = storage.read({ fs: fileSystem, path: DATA_FILE });
if (data) {
var loaded = JSON.parse(data);
if (verifyDataIntegrity(loaded)) {
if (loaded.encryptedData) {
var decrypted = decrypt(loaded.encryptedData);
if (decrypted) {
var parsed = JSON.parse(decrypted);
highScores = parsed.highScores || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
selectedSkin = parsed.selectedSkin || 0;
selectedFaceColor = parsed.selectedFaceColor || 0;
selectedHatColor = parsed.selectedHatColor || 0;
                selectedMenuBackground = parsed.selectedMenuBackground || 0;
playerNickname = parsed.playerNickname || "Player";
easterEggFlags = parsed.easterEggFlags || easterEggFlags;
}
}
} else {
display.fill(COLOR_RED);
setTextColor(COLOR_WHITE);
setTextSize(2);
drawString("DATA CORRUPTED", screenWidth / 2 - 60, screenHeight / 2 - 20);
setTextColor(COLOR_WHITE);
setTextSize(1);
drawString("Resetting game data...", screenWidth / 2 - 50, screenHeight / 2);
delay(2000);
highScores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
playerNickname = "Player";
saveData();
}
if (loaded.encryptedNickname) {
var nickDecrypted = decrypt(loaded.encryptedNickname);
if (nickDecrypted) {
playerNickname = nickDecrypted;
}
} else if (loaded.nickname) {
playerNickname = loaded.nickname;
saveData();
}
if (loaded.selectedSkin !== undefined) {
selectedSkin = loaded.selectedSkin;
}
    if (loaded.selectedMenuBackground !== undefined) {
        selectedMenuBackground = loaded.selectedMenuBackground;
    }
if (loaded.easterEggFlags) {
easterEggFlags = loaded.easterEggFlags;
}
}
} catch (e) {
highScores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
playerNickname = "Player";
}
}

function saveData() {
try {
var dataToSave = JSON.stringify({
highScores: highScores,
selectedSkin: selectedSkin,
selectedFaceColor: selectedFaceColor,
selectedHatColor: selectedHatColor,
selectedMenuBackground: selectedMenuBackground,
playerNickname: playerNickname,
easterEggFlags: easterEggFlags,
timestamp: Date.now()
});
var checksum = generateChecksum(dataToSave);
var toSave = {
encryptedData: encrypt(dataToSave),
checksum: checksum,
timestamp: Date.now()
};
storage.write({ fs: fileSystem, path: DATA_FILE }, JSON.stringify(toSave, null, 2), "write");
} catch (e) {
console.log("Warning: Could not save data: " + e.message);
}
}

function updateHighScore() {
if (score > highScores[selectedLevel]) {
highScores[selectedLevel] = score;
saveData();
return true;
}
return false;
}

function resetGame() {
var level = LEVELS[selectedLevel];
gameSpeed = level.speed;
gravity = level.gravity;
jumpForce = level.jumpForce;
score = 0;
frameCounter = 0;
levelProgress = 0;
playerX = 30;
playerY = groundY - playerSize;
velocityY = 0;
isJumping = false;
jumpScaleX = 1;
jumpScaleY = 1;
shipY = groundY - playerSize;
shipVelocity = 0;
obstacles = [];
flyingObstacles = [];
playerProjectiles = [];
bossProjectiles = [];
lasers = [];
bossLava = [];
bossMinions = [];
bossShields = [];
shootCooldown = 0;
isDead = false;
isFinished = false;
deathAnimFrame = 0;
finishAnimFrame = 0;
finishParticles = [];
playerStoneTimer = 0;
isGravityInverted = false;
floweyGlitchTimer = 0;
protectedScore = 0;
protectedProgress = 0;
if (level.isBoss) {
gameMode = 1;
boss.active = true;
boss.bossType = level.bossType;
boss.x = screenWidth + 50;
boss.y = groundY / 2;
if (boss.bossType === "CREEPER") boss.maxHp = 100;
else if (boss.bossType === "BILL") boss.maxHp = 150;
else if (boss.bossType === "FLOWEY") boss.maxHp = 200;
else if (boss.bossType === "SANS") boss.maxHp = 300;
else if (boss.bossType === "FREDDY") boss.maxHp = 250;
else if (boss.bossType === "VADER") boss.maxHp = 500;
else if (boss.bossType === "METTATON") boss.maxHp = 400;
else if (boss.bossType === "CAINE") boss.maxHp = 220;
boss.hp = boss.maxHp;
boss.attackTimer = 0;
boss.phase = 0;
boss.phaseTimer = 0;
boss.invincible = 0;
boss.specialTimer = 0;
boss.teleportTimer = 0;
boss.shieldActive = false;
} else {
gameMode = 0;
boss.active = false;
}
gameState = 3;
}

function spawnObstacle() {
var level = LEVELS[selectedLevel];
var obstacleTypes = level.obstacles;
if (obstacleTypes.length === 0) return;
var type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
var startX = screenWidth + 20;
if (type === "SPIKE") {
obstacles.push({ x: startX, y: groundY - obstacleSize, w: obstacleSize, h: obstacleSize, type: "SPIKE" });
} else if (type === "TWIN") {
obstacles.push({ x: startX, y: groundY - obstacleSize, w: obstacleSize, h: obstacleSize, type: "SPIKE" });
obstacles.push({ x: startX + obstacleSize, y: groundY - obstacleSize, w: obstacleSize, h: obstacleSize, type: "SPIKE" });
} else if (type === "TRIPLE") {
for (var i = 0; i < 3; i++) {
obstacles.push({ x: startX + (i * obstacleSize), y: groundY - obstacleSize, w: obstacleSize, h: obstacleSize, type: "SPIKE" });
}
} else if (type === "TALL_SPIKE") {
obstacles.push({ x: startX, y: groundY - (obstacleSize * 1.5), w: obstacleSize, h: obstacleSize * 1.5, type: "SPIKE" });
} else if (type === "BLADE") {
obstacles.push({ x: startX, y: groundY - obstacleSize * 2, w: obstacleSize / 2, h: obstacleSize * 2, type: "BLADE" });
} else if (type === "NEON") {
obstacles.push({ x: startX, y: groundY - obstacleSize, w: obstacleSize, h: obstacleSize, type: "NEON", pulse: 0 });
} else if (type === "FLYING") {
flyingObstacles.push({ x: startX, y: groundY - obstacleSize * 3, w: obstacleSize, h: obstacleSize, type: "FLYING", phase: 0 });
} else if (type === "DROP_SPIKE") {
flyingObstacles.push({ x: startX, y: groundY - obstacleSize * 5, w: obstacleSize, h: obstacleSize, type: "DROP_SPIKE", dropped: false });
} else if (type === "BLOCK") {
obstacles.push({ x: startX, y: groundY - obstacleSize * 2, w: obstacleSize * 2, h: obstacleSize / 2, type: "BLOCK" });
} else if (type === "WAVE") {
flyingObstacles.push({ x: startX, y: groundY - obstacleSize * 2, w: obstacleSize, h: obstacleSize, type: "WAVE", phase: 0 });
}
}

function createFinishParticles() {
for (var i = 0; i < 30; i++) {
finishParticles.push({
x: playerX + playerSize / 2,
y: (gameMode === 0 ? playerY : shipY) + playerSize / 2,
vx: (Math.random() - 0.5) * 10,
vy: (Math.random() - 0.5) * 10,
size: Math.random() * 6 + 2,
color: Math.random() > 0.5 ? COLOR_FINISH : SKINS[selectedSkin].color
});
}
}

function checkCollision(rect1, rect2) {
var padding = 2;
return (rect1.x + padding < rect2.x + rect2.w &&
rect1.x + rect1.w - padding > rect2.x &&
rect1.y + padding < rect2.y + rect2.h &&
rect1.y + rect1.h - padding > rect2.y);
}

function drawSpike(obs) {
var cx = obs.x + obs.w / 2;
for (var py = obs.y; py <= obs.y + obs.h; py++) {
var progress = (py - obs.y) / obs.h;
var halfWidth = (obs.w / 2) * progress;
drawFillRect(cx - halfWidth, py, halfWidth * 2 + 1, 1, COLOR_SPIKE);
}
}

function drawFlyingObstacle(obs) {
if (obs.type === "FLYING" || obs.type === "DROP_SPIKE" || obs.type === "BOSS_SPIKE") {
drawSpike(obs);
} else if (obs.type === "WAVE") {
drawSpike(obs);
}
}

function drawBlock(obs) {
drawFillRect(obs.x, obs.y, obs.w, obs.h, COLOR_BLUE);
drawRect(obs.x, obs.y, obs.w, obs.h, COLOR_WHITE);
}

function drawCube() {
var playerColor = SKINS[selectedSkin].color;
if (easterEggFlags.hacksbp) {
var hue = (frameCounter % 360);
playerColor = color(
Math.floor(255 * Math.abs(Math.sin(hue * 0.01745))),
Math.floor(255 * Math.abs(Math.sin((hue + 120) * 0.01745))),
Math.floor(255 * Math.abs(Math.sin((hue + 240) * 0.01745)))
);
}
var drawW = Math.floor(playerSize * jumpScaleX);
var drawH = Math.floor(playerSize * jumpScaleY);
var drawX = playerX + Math.floor((playerSize - drawW) / 2);
var drawY = playerY + Math.floor((playerSize - drawH));
drawFillRect(drawX, drawY, drawW, drawH, playerColor);
drawRect(drawX, drawY, drawW, drawH, COLOR_WHITE);
var faceColor = FACE_COLORS[selectedFaceColor].color;
var faceSize = Math.max(6, Math.floor(drawH * 0.6));
var faceOffset = Math.floor((drawH - faceSize) / 2);
drawFillRect(drawX + 3, drawY + faceOffset, faceSize, faceSize, faceColor);
drawFillRect(drawX + 4, drawY + faceOffset + 2, 2, 2, COLOR_WHITE);
drawFillRect(drawX + 9, drawY + faceOffset + 2, 2, 2, COLOR_WHITE);
drawFillRect(drawX + 4.5, drawY + faceOffset + 2.5, 1, 1, COLOR_BLACK);
drawFillRect(drawX + 9.5, drawY + faceOffset + 2.5, 1, 1, COLOR_BLACK);
drawFillRect(drawX + 5, drawY + faceOffset + 6, 5, 1, COLOR_WHITE);
var hatColor = HAT_COLORS[selectedHatColor].color;
if (hatColor) {
drawFillRect(drawX - 1, drawY - 4, 17, 4, hatColor);
drawFillRect(drawX + 4, drawY - 8, 7, 4, hatColor);
}
if (easterEggFlags.hacksbp && selectedSkin === 6) {
drawFillRect(drawX + 5, drawY - 5, 5, 3, COLOR_FINISH);
}

if (easterEggFlags.lithromantov && selectedSkin === 7) {
drawFillRect(drawX + 3, drawY + faceOffset, 9, 2, COLOR_GOLD);
}
if (easterEggFlags.god || easterEggFlags.admin) {
drawFillRect(drawX + 5, drawY - 8, 5, 3, COLOR_GOLD);
}
if (SKINS[selectedSkin].name === "FLUX") {
drawFillRect(drawX + 5, drawY + faceOffset + 1, 1, faceSize - 2, COLOR_BLACK);
drawFillRect(drawX + 5, drawY + faceOffset + 1, 5, 1, COLOR_BLACK);
drawFillRect(drawX + 5, drawY + faceOffset + Math.floor(faceSize / 2), 4, 1, COLOR_BLACK);
}
}

function drawShip() {
var shipColor = SKINS[selectedSkin].shipColor;
var cockpitColor = COLOR_WHITE;
if (playerStoneTimer > 0) {
shipColor = color(100, 100, 100);
cockpitColor = color(50, 50, 50);
} else if (easterEggFlags.hacksbp) {
var hue = (frameCounter % 360);
shipColor = color(
Math.floor(255 * Math.abs(Math.sin(hue * 0.01745))),
Math.floor(255 * Math.abs(Math.sin((hue + 120) * 0.01745))),
Math.floor(255 * Math.abs(Math.sin((hue + 240) * 0.01745)))
);
cockpitColor = color(0, 255, 255);
}
var px = playerX;
var py = shipY;
drawFillRect(px, py + 4, 14, 7, shipColor);
drawFillRect(px + 14, py + 5, 3, 5, shipColor);
drawFillRect(px + 17, py + 6, 2, 3, shipColor);
drawFillRect(px - 3, py + 5, 3, 5, shipColor);
drawFillRect(px - 5, py + 6, 2, 3, color(100, 100, 100));
if (frameCounter % 4 < 2) {
drawFillRect(px - 9, py + 6, 4, 3, COLOR_FINISH);
drawFillRect(px - 11, py + 7, 2, 1, COLOR_RED);
} else {
drawFillRect(px - 8, py + 6, 3, 3, COLOR_RED);
}
drawFillRect(px + 2, py + 2, 5, 2, shipColor);
drawFillRect(px + 3, py, 3, 2, shipColor);
drawFillRect(px + 2, py + 11, 5, 2, shipColor);
drawFillRect(px + 3, py + 13, 3, 2, shipColor);
drawFillRect(px + 7, py + 4, 5, 3, cockpitColor);
drawFillRect(px + 12, py + 5, 2, 2, cockpitColor);
if (easterEggFlags.hacksbp && selectedSkin === 6) {
drawFillRect(playerX + 8, shipY - 4, 4, 3, COLOR_FINISH);
}

if (easterEggFlags.lithromantov && selectedSkin === 7) {
drawFillRect(playerX - 2, shipY + 2, 3, 3, COLOR_GOLD);
}
if (easterEggFlags.god || easterEggFlags.admin) {
drawFillRect(playerX + 8, shipY - 5, 4, 3, COLOR_GOLD);
}
}

function drawPlayer() {
if (isDead && !easterEggFlags.admin && !easterEggFlags.god && !easterEggFlags.hacksbp && !easterEggFlags.lithromantov && !easterEggFlags.dev) {
deathAnimFrame++;
var playerColor = SKINS[selectedSkin].color;
for (var i = 0; i < 12; i++) {
var angle = (i / 12) * Math.PI * 2;
var spread = deathAnimFrame * 4;
var px = playerX + playerSize/2 + Math.cos(angle) * spread;
var py = (gameMode === 0 ? playerY : shipY) + playerSize/2 + Math.sin(angle) * spread;
drawFillRect(px - 2, py - 2, 4, 4, playerColor);
}
return;
}
if (isFinished) return;
if (gameMode === 0) drawCube();
else drawShip();
}

function drawFinishParticles() {
for (var i = 0; i < finishParticles.length; i++) {
var p = finishParticles[i];
p.x += p.vx;
p.y += p.vy;
p.vy += 0.3;
p.size = Math.max(1, p.size - 0.15);
drawFillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size, p.color);
}
}

function drawProgressBar() {
if (LEVELS[selectedLevel].isBoss) return;
var level = LEVELS[selectedLevel];
var percent = Math.min(100, Math.floor((levelProgress / level.length) * 100));
drawFillRect(10, 5, screenWidth - 20, 6, color(50, 50, 50));
var fillWidth = Math.floor((screenWidth - 20) * (percent / 100));
drawFillRect(10, 5, fillWidth, 6, COLOR_PROGRESS);
drawRect(10, 5, screenWidth - 20, 6, COLOR_WHITE);
setTextColor(COLOR_WHITE);
setTextSize(0);
drawString(percent + "%", screenWidth / 2 - 5, 7);
}

function drawMenuBackground() {
var style = MENU_BACKGROUNDS[selectedMenuBackground] || "DEFAULT";
var topR = 10, topG = 10, topB = 35;
if (style === "DEFAULT") { topR = 10; topG = 10; topB = 35; }
else if (style === "NEON") { topR = 15; topG = 6; topB = 90; }
else if (style === "PASTEL") { topR = 70; topG = 90; topB = 180; }
else if (style === "DARK") { topR = 5; topG = 5; topB = 20; }
for (var y = 0; y < screenHeight; y += 12) {
    var blend = y / screenHeight;
    var r = Math.floor(topR + blend * 30);
    var g = Math.floor(topG + blend * 20);
    var b = Math.floor(topB + blend * 50);
    drawFillRect(0, y, screenWidth, 12, color(r, g, b));
}
if (style === "NEON") {
    for (var i = 0; i < 14; i++) {
        var x = ((menuAnimation * 6 + i * 27) % screenWidth);
        var y = 18 + ((i * 12 + menuAnimation * 4) % (screenHeight / 2));
        drawFillRect(x, y, 2, 2, i % 2 === 0 ? COLOR_CYAN : COLOR_PURPLE);
    }
} else {
    for (var i = 0; i < 12; i++) {
        var x = ((menuAnimation * 4 + i * 37) % screenWidth);
        var y = 20 + ((i * 16 + menuAnimation * 3) % (screenHeight / 2));
        drawFillRect(x, y, 2, 2, i % 2 === 0 ? COLOR_CYAN : COLOR_WHITE);
    }
}
for (var i = 0; i < 3; i++) {
    var baseX = 18 + i * 42;
    drawFillRect(baseX, screenHeight - 50 + i * 8, 34, 6, color(40, 10 + i * 10, 80));
}
}

function drawLevelBackground(level) {
var topR = 30, topG = 35, topB = 90;
if (level.theme === "pastel") { topR = 70; topG = 90; topB = 180; }
else if (level.theme === "neon") { topR = 15; topG = 10; topB = 90; }
else if (level.theme === "lava") { topR = 120; topG = 35; topB = 15; }
else if (level.theme === "cyber") { topR = 10; topG = 70; topB = 90; }
else if (level.theme === "void") { topR = 5; topG = 5; topB = 30; }
else if (level.theme === "storm") { topR = 20; topG = 20; topB = 55; }
else if (level.name === "MEDIUM") { topR = 18; topG = 6; topB = 70; }
else if (level.name === "HARD") { topR = 8; topG = 8; topB = 80; }
else if (level.name === "INSANE") { topR = 12; topG = 0; topB = 90; }
else if (level.name === "EXTREME") { topR = 30; topG = 0; topB = 45; }
else if (level.name === "IMPOSSIBLE") { topR = 5; topG = 0; topB = 25; }
for (var y = 0; y < groundY; y += 8) {
var blend = y / groundY;
var r = Math.floor(topR + blend * 25);
var g = Math.floor(topG + blend * 18);
var b = Math.floor(topB + blend * 40);
drawFillRect(0, y, screenWidth, 8, color(r, g, b));
}
if (!level.isBoss) {
for (var i = 0; i < 6; i++) {
var x = ((menuAnimation * 7 + i * 43) % screenWidth);
var y = 30 + (i * 18);
var dotColor = level.theme === "lava" ? color(255, 140, 60) : level.theme === "neon" ? COLOR_CYAN : level.theme === "cyber" ? COLOR_PURPLE : COLOR_WHITE;
drawFillRect(x, y, 4, 4, dotColor);
}
if (level.theme === "neon" || level.theme === "cyber") {
for (var i = 0; i < 4; i++) {
var glowX = (menuAnimation * 5 + i * 64) % screenWidth;
var glowY = 50 + i * 28;
drawFillRect(glowX, glowY, 8, 2, COLOR_PURPLE);
}
}
if (level.theme === "pastel") {
for (var i = 0; i < 3; i++) {
var bubbleX = (menuAnimation * 3 + i * 76) % screenWidth;
var bubbleY = 80 + i * 22;
drawFillRect(bubbleX, bubbleY, 6, 6, color(220, 220, 255));
}
}
if (level.theme === "storm") {
for (var i = 0; i < 5; i++) {
var cloudX = (menuAnimation * 6 + i * 52) % screenWidth;
var cloudY = 20 + i * 18;
drawFillRect(cloudX, cloudY, 12, 4, color(180, 180, 200));
}
}
} else {
var bossColor = color(20, 0, 30);
drawFillRect(0, 0, screenWidth, screenHeight, bossColor);
for (var i = 0; i < 8; i++) {
var orbX = 30 + ((menuAnimation * 12 + i * 47) % (screenWidth - 60));
var orbY = 20 + (i * 16);
drawFillRect(orbX, orbY, 6, 6, color(100, 0, 120));
}
}
}

function drawBlade(obs) {
drawFillRect(obs.x, obs.y, obs.w, obs.h, color(180, 20, 220));
drawRect(obs.x, obs.y, obs.w, obs.h, COLOR_WHITE);
drawFillRect(obs.x, obs.y + obs.h - 4, obs.w, 4, COLOR_PURPLE);
}

function drawNeonObstacle(obs) {
var pulse = (Math.sin(menuAnimation * 0.15) * 0.5 + 0.5) * 120 + 100;
drawFillRect(obs.x, obs.y, obs.w, obs.h, color(120, 0, pulse));
drawRect(obs.x, obs.y, obs.w, obs.h, COLOR_CYAN);
}

function drawBatteryInfo() {
var battery = device.getBatteryDetailed();
batteryPercent = battery.battery_percent;
var batteryColor = COLOR_GREEN;
if (batteryPercent <= 25) {
batteryColor = COLOR_RED;
} else if (batteryPercent <= 50) {
batteryColor = COLOR_ORANGE;
}
var batteryX = screenWidth - 65;
var batteryY = 5;
var batteryW = 25;
var batteryH = 12;
drawRect(batteryX, batteryY, batteryW, batteryH, batteryColor);
var chargeW = Math.floor((batteryW - 2) * (batteryPercent / 100));
drawFillRect(batteryX + 1, batteryY + 1, chargeW, batteryH - 2, batteryColor);
drawFillRect(batteryX + batteryW, batteryY + 3, 3, 6, batteryColor);
setTextColor(batteryColor);
setTextSize(0);
drawString(batteryPercent + "%", batteryX - 35, batteryY + 4);
}

function drawBoss() {
if (!boss.active) return;
var bossX = boss.x;
var bossY = boss.y;
var bossSize = 30;
if (boss.bossType === "CREEPER") {
drawFillRect(bossX - 15, bossY - 20, 30, 30, color(0, 180, 0)); 
drawFillRect(bossX - 10, bossY - 10, 6, 6, COLOR_BLACK); 
drawFillRect(bossX + 4, bossY - 10, 6, 6, COLOR_BLACK); 
drawFillRect(bossX - 4, bossY, 8, 10, COLOR_BLACK); 
drawFillRect(bossX - 8, bossY + 4, 4, 6, COLOR_BLACK); 
drawFillRect(bossX + 4, bossY + 4, 4, 6, COLOR_BLACK); 
} 
else if (boss.bossType === "BILL") {
for(var r=0; r<18; r++) { 
drawFillRect(bossX - r, bossY - 16 + (r*1.5), r*2, 2, COLOR_YELLOW); 
}
drawFillRect(bossX - 5, bossY - 30, 10, 12, COLOR_BLACK); 
drawFillRect(bossX - 12, bossY - 18, 24, 2, COLOR_BLACK); 
drawFillRect(bossX - 5, bossY - 10, 10, 8, COLOR_WHITE); 
drawFillRect(bossX - 1, bossY - 8, 2, 6, COLOR_BLACK); 
drawFillRect(bossX - 4, bossY + 5, 8, 3, COLOR_BLACK);
} 
else if (boss.bossType === "FLOWEY") {
drawFillRect(bossX - 22, bossY - 8, 44, 16, COLOR_YELLOW);
drawFillRect(bossX - 8, bossY - 22, 16, 44, COLOR_YELLOW);
drawFillRect(bossX - 18, bossY - 18, 36, 36, COLOR_YELLOW);
drawFillRect(bossX - 14, bossY - 14, 28, 28, COLOR_WHITE);
drawFillRect(bossX - 8, bossY - 6, 4, 8, COLOR_BLACK);
drawFillRect(bossX + 4, bossY - 6, 4, 8, COLOR_BLACK);
drawFillRect(bossX - 10, bossY + 6, 20, 2, COLOR_BLACK);
drawFillRect(bossX - 10, bossY + 4, 2, 4, COLOR_BLACK);
drawFillRect(bossX + 8, bossY + 4, 2, 4, COLOR_BLACK);
} 
else if (boss.bossType === "SANS") {
drawFillRect(bossX - 18, bossY - 18, 36, 36, COLOR_WHITE); 
drawFillRect(bossX - 12, bossY - 6, 10, 10, COLOR_BLACK); 
drawFillRect(bossX + 2, bossY - 6, 10, 10, COLOR_BLACK); 
if(frameCounter % 10 < 5) drawFillRect(bossX - 10, bossY - 4, 4, 4, COLOR_CYAN); 
drawFillRect(bossX - 2, bossY + 6, 4, 3, COLOR_BLACK); 
drawFillRect(bossX - 14, bossY + 12, 28, 3, COLOR_BLACK); 
} 
else if (boss.bossType === "FREDDY") {
drawFillRect(bossX - 18, bossY - 15, 36, 30, COLOR_BROWN); 
drawFillRect(bossX - 22, bossY - 20, 10, 10, COLOR_BROWN); 
drawFillRect(bossX + 12, bossY - 20, 10, 10, COLOR_BROWN);
drawFillRect(bossX - 8, bossY - 25, 16, 10, COLOR_BLACK); 
drawFillRect(bossX - 12, bossY - 15, 24, 2, COLOR_BLACK); 
drawFillRect(bossX - 12, bossY - 5, 10, 10, COLOR_BLACK);
drawFillRect(bossX + 2, bossY - 5, 10, 10, COLOR_BLACK);
drawFillRect(bossX - 9, bossY - 2, 4, 4, COLOR_WHITE);
drawFillRect(bossX + 5, bossY - 2, 4, 4, COLOR_WHITE);
drawFillRect(bossX - 10, bossY + 8, 20, 10, COLOR_LIGHT_BROWN);
drawFillRect(bossX - 3, bossY + 8, 6, 4, COLOR_BLACK); 
} 
else if (boss.bossType === "VADER") {
bossSize = 40;
drawFillRect(bossX - 20, bossY - 20, 40, 40, color(30, 30, 30)); 
drawFillRect(bossX - 25, bossY, 50, 20, color(20, 20, 20)); 
drawFillRect(bossX - 14, bossY - 5, 10, 10, color(10, 10, 10)); 
drawFillRect(bossX + 4, bossY - 5, 10, 10, color(10, 10, 10));
drawFillRect(bossX - 8, bossY + 10, 16, 12, color(50, 50, 50)); 
} 
else if (boss.bossType === "METTATON") {
drawFillRect(bossX - 15, bossY - 25, 30, 40, color(150, 150, 150)); 
drawFillRect(bossX - 12, bossY - 20, 24, 15, color(255, 150, 0)); 
drawFillRect(bossX - 6, bossY - 18, 12, 10, COLOR_YELLOW); 
drawFillRect(bossX - 10, bossY, 20, 10, color(50, 50, 50)); 
drawFillRect(bossX - 5, bossY + 15, 10, 15, color(100, 100, 100)); 
} 
else if (boss.bossType === "CAINE") {
var hatY = bossY - 24;

drawFillRect(bossX - 12, bossY - 30, 24, 10, COLOR_BLACK);

drawFillRect(bossX - 15, bossY - 20, 30, 25, COLOR_RED);

drawFillRect(bossX - 12, bossY - 18, 24, 18, COLOR_WHITE);

drawFillRect(bossX - 8, bossY - 12, 4, 4, COLOR_BLACK);
drawFillRect(bossX + 4, bossY - 12, 4, 4, COLOR_BLACK);

drawFillRect(bossX - 2, bossY - 8, 4, 4, COLOR_RED);

drawFillRect(bossX - 6, bossY - 2, 12, 2, COLOR_WHITE);
for (var i = 0; i < 5; i++) {
drawFillRect(bossX - 5 + i * 2, bossY, 1, 4, COLOR_WHITE);
}

drawFillRect(bossX - 18, bossY + 5, 36, 20, COLOR_BLACK);

drawFillRect(bossX - 20, bossY + 10, 6, 10, COLOR_WHITE);
drawFillRect(bossX + 14, bossY + 10, 6, 10, COLOR_WHITE);

drawFillRect(bossX - 8, bossY + 25, 6, 10, COLOR_BLACK);
drawFillRect(bossX + 2, bossY + 25, 6, 10, COLOR_BLACK);
}
if (boss.shieldActive) {
drawRect(bossX - 25, bossY - 30, 50, 60, COLOR_BLUE);
if (frameCounter % 12 < 6) {
drawRect(bossX - 27, bossY - 32, 54, 64, COLOR_CYAN);
}
}
}

function updateBoss() {
if (!boss.active && !isFinished) return;
if (boss.invincible > 0) boss.invincible--;
if (boss.phaseTimer > 0) boss.phaseTimer--;
if (boss.specialTimer > 0) boss.specialTimer--;
if (boss.hp > 0) {
boss.phase += 0.03;
boss.targetY = (groundY / 2) + Math.sin(boss.phase) * (groundY / 4);
if(boss.bossType === "FREDDY") {
if(frameCounter % 100 === 0) {
boss.y = 30 + Math.random() * (groundY - 60);
}
} else if (boss.bossType === "SANS") {
boss.y += (boss.targetY - boss.y) * 0.1; 
} else {
boss.y += (boss.targetY - boss.y) * 0.03; 
}
if (boss.x > screenWidth - 50) boss.x -= 1;
}
boss.attackTimer++;
boss.phaseTimer++;
var attackInterval = 45;
if (boss.bossType === "BILL") attackInterval = 40;
else if (boss.bossType === "FLOWEY") attackInterval = 35;
else if (boss.bossType === "SANS") attackInterval = 25;
else if (boss.bossType === "FREDDY") attackInterval = 38;
else if (boss.bossType === "VADER") attackInterval = 50;
else if (boss.bossType === "METTATON") attackInterval = 32;
else if (boss.bossType === "CAINE") attackInterval = 37;
if (boss.hp > 0 && boss.attackTimer > attackInterval) {
var rand = Math.random();
if (boss.bossType === "CREEPER") {
if (easterEggFlags.hacksbp && boss.specialTimer <= 0 && rand < 0.15) {
for (var i = -3; i <= 3; i++) {
bossProjectiles.push({
x: boss.x,
y: boss.y + i * 6,
w: 8, h: 8,
vx: -(gameSpeed + 5),
vy: i * 0.6,
color: COLOR_RED
});
}
boss.specialTimer = 120;
} else if (rand < 0.4) {
for (var i = -2; i <= 2; i++) {
bossProjectiles.push({
x: boss.x,
y: boss.y + i * 5,
w: 10, h: 10,
vx: -(gameSpeed + 2),
vy: i * 0.5,
color: color(0, 200, 0)
});
}
} else if (rand < 0.7) {
lasers.push({ y: shipY, h: 15, timer: 0, state: 'warning' });
} else {
bossLava.push({ y: groundY - 10, h: 10, timer: 0, state: 'warning' });
}
} 
else if (boss.bossType === "BILL") {
if (easterEggFlags.hacksbp && boss.specialTimer <= 0 && rand < 0.15) {
floweyGlitchTimer = 18;
for (var i = 0; i < 3; i++) {
lasers.push({ y: shipY - 20 + i * 20, h: 10, timer: 0, state: 'warning' });
}
boss.specialTimer = 120;
} else if (rand < 0.25) {
playerStoneTimer = 40; 
} else if (rand < 0.4) {
lasers.push({ y: shipY - 15, h: 8, timer: 0, state: 'warning' });
lasers.push({ y: shipY + 15, h: 8, timer: 0, state: 'warning' });
} else if (rand < 0.7) {
for (var i = 0; i < 6; i++) {
bossProjectiles.push({
x: boss.x,
y: boss.y,
w: 8, h: 8,
vx: -(gameSpeed + 4),
vy: Math.sin(i) * 3, 
color: COLOR_CYAN
});
}
} else {
bossLava.push({ y: groundY - 5, h: 8, timer: 0, state: 'warning' });
}
} 
else if (boss.bossType === "FLOWEY") {
if (easterEggFlags.hacksbp && boss.specialTimer <= 0 && rand < 0.15) {
for (var i = 0; i < 12; i++) {
bossProjectiles.push({
x: boss.x,
y: boss.y,
w: 6, h: 6,
vx: Math.cos(i * 0.52) * -(gameSpeed + 4),
vy: Math.sin(i * 0.52) * 4,
color: COLOR_YELLOW
});
}
boss.specialTimer = 120;
} else if (rand < 0.25) {
floweyGlitchTimer = 15;
shipY = 30 + Math.random() * (groundY - 60 - playerSize);
boss.x = screenWidth / 2 + Math.random() * 50;
} else if (rand < 0.6) {
var gapIndex = Math.floor(Math.random() * 7) - 3; 
for (var i = -4; i <= 4; i++) {
if (Math.abs(i - gapIndex) <= 1) continue; 
bossProjectiles.push({
x: boss.x,
y: boss.y + i * 10,
w: 6, h: 6,
vx: -(gameSpeed + 3),
vy: 0, 
color: COLOR_WHITE
});
}
} else {
for (var i = 0; i < 8; i++) {
bossProjectiles.push({
x: boss.x + 10,
y: boss.y,
w: 6, h: 6,
vx: -(gameSpeed + 2) - Math.random() * 3,
vy: (Math.random() - 0.5) * 5,
color: COLOR_WHITE
});
}
}
} 
else if (boss.bossType === "SANS") {
if (easterEggFlags.hacksbp && boss.specialTimer <= 0 && rand < 0.15) {
for (var i = 0; i < 5; i++) {
lasers.push({ y: 20 + i * 22, h: 8, timer: 0, state: 'warning' });
}
boss.specialTimer = 120;
} else if (rand < 0.2) {
isGravityInverted = !isGravityInverted;
} else if (rand < 0.5) {
lasers.push({ y: shipY, h: 25, timer: 0, state: 'warning' });
} else {
var gapY = 20 + Math.random() * (groundY - 60);
for (var py = 10; py < groundY; py += 12) {
if (Math.abs(py - gapY) < 25) continue; 
bossProjectiles.push({
x: boss.x,
y: py,
w: 8, h: 8,
vx: -(gameSpeed + 3),
vy: 0,
color: COLOR_WHITE
});
}
}
} 
else if (boss.bossType === "CAINE") {
if (easterEggFlags.hacksbp && boss.specialTimer <= 0 && rand < 0.15) {
for (var i = 0; i < 6; i++) {
bossProjectiles.push({
x: boss.x + Math.cos(i * 1.05) * 16,
y: boss.y + Math.sin(i * 1.05) * 16,
w: 8, h: 8,
vx: Math.cos(i * 1.05) * -(gameSpeed + 4),
vy: Math.sin(i * 1.05) * 4,
color: COLOR_PURPLE
});
}
for (var i = 0; i < 3; i++) {
lasers.push({ y: 20 + i * 28, h: 8, timer: 0, state: 'warning' });
}
boss.specialTimer = 120;
} else if (rand < 0.25) {
for (var i = 0; i < 3; i++) {
bossProjectiles.push({
x: boss.x + Math.random() * 10 - 5,
y: 30 + i * 25,
w: 8, h: 8,
vx: -(gameSpeed + 3),
vy: 0,
color: COLOR_PURPLE
});
}
} else if (rand < 0.55) {
for (var i = 0; i < 4; i++) {
lasers.push({ y: shipY - 20 + i * 15, h: 10, timer: 0, state: 'warning' });
}
} else {
for (var i = 0; i < 5; i++) {
bossProjectiles.push({
x: boss.x + Math.random() * 10 - 5,
y: boss.y + Math.random() * 30 - 15,
w: 6, h: 6,
vx: -(gameSpeed + 2) - Math.random() * 3,
vy: (Math.random() - 0.5) * 4,
color: COLOR_PINK
});
}
}
} 
else if (boss.bossType === "FREDDY") {
if (easterEggFlags.hacksbp && boss.specialTimer <= 0 && rand < 0.15) {
for (var i = 0; i < 8; i++) {
bossProjectiles.push({
x: boss.x + Math.cos(i * 0.78) * 24,
y: boss.y + Math.sin(i * 0.78) * 24,
w: 10, h: 10,
vx: Math.cos(i * 0.78) * -(gameSpeed + 4),
vy: Math.sin(i * 0.78) * 4,
color: COLOR_RED
});
}
boss.specialTimer = 120;
} else if (rand < 0.3) {
boss.x = playerX + 60;
boss.y = shipY;
bossProjectiles.push({
x: boss.x, y: boss.y, w: 15, h: 15, vx: -(gameSpeed+1), vy: 0, color: COLOR_BROWN
});
} else if (rand < 0.6) {
for (var i = 0; i < 5; i++) {
bossProjectiles.push({
x: boss.x,
y: boss.y,
w: 10, h: 10,
vx: -(gameSpeed + 3),
vy: (i - 2) * 2,
color: color(255, 140, 0)
});
}
} else {
lasers.push({ y: shipY, h: 12, timer: 0, state: 'warning' });
}
} 
else if (boss.bossType === "VADER") {
if (easterEggFlags.hacksbp && boss.specialTimer <= 0 && rand < 0.15) {
playerX = Math.max(0, playerX - 20);
for (var i = 0; i < 4; i++) {
lasers.push({ y: shipY - 12 + i * 8, h: 8, timer: 0, state: 'warning' });
}
boss.specialTimer = 120;
} else if (boss.phaseTimer > 150 && !boss.shieldActive) {
boss.shieldActive = true;
boss.phaseTimer = 0;
} else if (rand < 0.3) {
playerX += 15; 
lasers.push({ y: shipY, h: 10, timer: 0, state: 'warning' });
} else if (rand < 0.6) {
for (var i = 0; i < 3; i++) {
bossProjectiles.push({
x: boss.x,
y: boss.y + (i*15) - 15,
w: 20, h: 4,
vx: -(gameSpeed + 5),
vy: 0,
color: COLOR_RED
});
}
} else {
lasers.push({ y: shipY - 15, h: 18, timer: 0, state: 'warning' });
lasers.push({ y: shipY + 15, h: 18, timer: 0, state: 'warning' });
}
} 
else if (boss.bossType === "METTATON") {
if (easterEggFlags.hacksbp && boss.specialTimer <= 0 && rand < 0.15) {
boss.shieldActive = true;
for (var i = -3; i <= 3; i++) {
bossMinions.push({
x: boss.x + 20,
y: boss.y + i * 12,
w: 10, h: 10,
vx: -(gameSpeed + 4),
vy: i * 0.4,
color: COLOR_PINK,
timer: 0
});
}
boss.specialTimer = 120;
} else if (rand < 0.2) {
boss.shieldActive = !boss.shieldActive;
}
if (rand < 0.5) {
for (var i = -2; i <= 2; i++) {
bossMinions.push({
x: boss.x + 20,
y: boss.y + i * 15,
w: 10, h: 10,
vx: -(gameSpeed + 2),
vy: i * 0.5,
color: COLOR_YELLOW,
timer: 0
});
}
} else {
for (var i = 0; i < 6; i++) {
bossProjectiles.push({
x: boss.x,
y: boss.y,
w: 8, h: 8,
vx: -(gameSpeed + 3),
vy: (Math.random() - 0.5) * 6,
color: COLOR_PINK
});
}
}
}
boss.attackTimer = 0;
}
for (var i = lasers.length - 1; i >= 0; i--) {
lasers[i].timer++;
if (lasers[i].state === 'warning' && lasers[i].timer > 25) {
lasers[i].state = 'active';
lasers[i].timer = 0;
} else if (lasers[i].state === 'active' && lasers[i].timer > 12) {
lasers.splice(i, 1);
}
}
for (var i = bossLava.length - 1; i >= 0; i--) {
bossLava[i].timer++;
if (bossLava[i].state === 'warning' && bossLava[i].timer > 30) {
bossLava[i].state = 'active';
bossLava[i].timer = 0;
} else if (bossLava[i].state === 'active' && bossLava[i].timer > 15) {
bossLava[i].y -= 0.5;
if (bossLava[i].y < groundY - 20) {
bossLava.splice(i, 1);
}
}
}
for (var i = bossMinions.length - 1; i >= 0; i--) {
bossMinions[i].x += bossMinions[i].vx;
bossMinions[i].y += bossMinions[i].vy;
bossMinions[i].timer++;
if (bossMinions[i].timer > 300) {
bossMinions.splice(i, 1);
continue;
}

if (!isDead && !easterEggFlags.admin && !easterEggFlags.god && !easterEggFlags.hacksbp && !easterEggFlags.lithromantov && !easterEggFlags.dev) {
if (checkCollision({x: playerX, y: shipY, w: playerSize, h: playerSize}, 
{x: bossMinions[i].x, y: bossMinions[i].y, w: bossMinions[i].w, h: bossMinions[i].h})) {
isDead = true;
updateHighScore();
}
}
if (bossMinions[i].x < -10) {
bossMinions.splice(i, 1);
}
}

if (!easterEggFlags.admin && !easterEggFlags.god && !easterEggFlags.hacksbp && !easterEggFlags.lithromantov && !easterEggFlags.dev) {
for (var i = 0; i < lasers.length; i++) {
if (lasers[i].state === 'active') {
if (shipY < lasers[i].y + lasers[i].h && shipY + playerSize > lasers[i].y) {
if (!boss.shieldActive || boss.bossType !== "VADER") {
isDead = true;
updateHighScore();
}
}
}
}
for (var i = 0; i < bossLava.length; i++) {
if (bossLava[i].state === 'active') {
if (shipY + playerSize > bossLava[i].y) {
if (!boss.shieldActive || boss.bossType !== "VADER") {
isDead = true;
updateHighScore();
}
}
}
}
}
}

function updateBossProjectiles() {
for (var i = bossProjectiles.length - 1; i >= 0; i--) {
var proj = bossProjectiles[i];
proj.x += proj.vx;
proj.y += proj.vy;

if (!isDead && !easterEggFlags.admin && !easterEggFlags.god && !easterEggFlags.hacksbp && !easterEggFlags.lithromantov && !easterEggFlags.dev) {
if (checkCollision({x: playerX, y: shipY, w: playerSize, h: playerSize}, 
{x: proj.x, y: proj.y, w: proj.w, h: proj.h})) {
if (!boss.shieldActive || boss.bossType !== "VADER") {
isDead = true;
updateHighScore();
}
}
}
if (proj.x < -10) {
bossProjectiles.splice(i, 1);
}
}
}

function drawBossProjectiles() {
for (var i = 0; i < bossProjectiles.length; i++) {
var proj = bossProjectiles[i];
drawFillRect(proj.x, proj.y, proj.w, proj.h, proj.color);
drawRect(proj.x, proj.y, proj.w, proj.h, COLOR_WHITE);
}
}

function drawLasers() {
for (var i = 0; i < lasers.length; i++) {
if (lasers[i].state === 'warning') {
if (frameCounter % 6 < 3) {
var lColor = (boss.bossType === "SANS" || boss.bossType === "BILL") ? COLOR_CYAN : COLOR_RED;
drawFillRect(0, lasers[i].y + lasers[i].h/2 - 1, screenWidth, 2, lColor);
}
} else if (lasers[i].state === 'active') {
var mColor = (boss.bossType === "SANS" || boss.bossType === "BILL") ? COLOR_CYAN : COLOR_RED;
drawFillRect(0, lasers[i].y, screenWidth, lasers[i].h, mColor);
drawFillRect(0, lasers[i].y + 2, screenWidth, lasers[i].h - 4, COLOR_WHITE);
}
}
}

function drawBossLava() {
for (var i = 0; i < bossLava.length; i++) {
if (bossLava[i].state === 'warning') {
if (frameCounter % 8 < 4) {
drawFillRect(0, bossLava[i].y, screenWidth, bossLava[i].h, color(150, 50, 0));
}
} else if (bossLava[i].state === 'active') {
drawFillRect(0, bossLava[i].y, screenWidth, bossLava[i].h, color(255, 80, 0));
drawFillRect(0, bossLava[i].y + 2, screenWidth, bossLava[i].h - 4, color(255, 200, 0));
}
}
}

function drawBossMinions() {
for (var i = 0; i < bossMinions.length; i++) {
var m = bossMinions[i];
drawFillRect(m.x, m.y, m.w, m.h, m.color);
drawRect(m.x, m.y, m.w, m.h, COLOR_WHITE);
}
}

function drawBossHealth() {
if (!boss.active) return;
drawFillRect(screenWidth/2 - 50, 8, 100, 8, color(50, 0, 0));
var hpPercent = (boss.hp / boss.maxHp) * 100;
drawFillRect(screenWidth/2 - 50, 8, hpPercent, 8, COLOR_RED);
drawRect(screenWidth/2 - 50, 8, 100, 8, COLOR_WHITE);
setTextColor(COLOR_WHITE);
setTextSize(0);
drawString("BOSS " + boss.bossType, screenWidth/2 - 35, 10);
if (boss.shieldActive) {
setTextColor(COLOR_CYAN);
drawString("SHIELD", screenWidth/2 - 20, 20);
}
}

function drawSkinMenu() {
setTextColor(COLOR_WHITE);
setTextSize(1);
drawString("SELECT SKIN", screenWidth / 2 - 40, 10);
var previewY = 25;
drawFillRect(screenWidth / 2 - 10, previewY, playerSize, playerSize, SKINS[selectedSkin].color);
drawRect(screenWidth / 2 - 10, previewY, playerSize, playerSize, COLOR_WHITE);
setTextColor(SKINS[selectedSkin].color);
drawString(SKINS[selectedSkin].name, screenWidth / 2 - 20, previewY + 25);
var startIdx = 0;
var maxVisible = 3;
if (selectedSkin >= maxVisible) startIdx = selectedSkin - 1;
for (var i = startIdx; i < SKINS.length && i < startIdx + maxVisible; i++) {
var yPos = 55 + ((i - startIdx) * 14);
if (i === selectedSkin) {
setTextColor(COLOR_PROGRESS);
drawString("> " + SKINS[i].name, screenWidth / 2 - 45, yPos);
} else {
setTextColor(COLOR_WHITE);
drawString("  " + SKINS[i].name, screenWidth / 2 - 45, yPos);
}
drawFillRect(screenWidth / 2 + 25, yPos + 2, 8, 8, SKINS[i].color);
}
setTextColor(COLOR_WHITE);
setTextSize(0);
drawString("Prev/Next - Change", screenWidth / 2 - 40, screenHeight - 25);
drawString("Sel - OK  Esc - Back", screenWidth / 2 - 40, screenHeight - 15);
}

function drawFaceMenu() {
setTextColor(COLOR_WHITE);
setTextSize(1);
drawString("SELECT FACE", screenWidth / 2 - 40, 10);
var previewY = 25;
var faceColor = FACE_COLORS[selectedFaceColor].color;
drawFillRect(screenWidth / 2 - 10, previewY, playerSize, playerSize, SKINS[selectedSkin].color);
drawRect(screenWidth / 2 - 10, previewY, playerSize, playerSize, COLOR_WHITE);
drawFillRect(screenWidth / 2 - 7, previewY + 3, 9, 9, faceColor);
drawFillRect(screenWidth / 2 - 6, previewY + 5, 2, 2, COLOR_WHITE);
drawFillRect(screenWidth / 2 - 1, previewY + 5, 2, 2, COLOR_WHITE);
setTextColor(faceColor);
drawString(FACE_COLORS[selectedFaceColor].name, screenWidth / 2 - 25, previewY + 25);
var startIdx = 0;
var maxVisible = 3;
if (selectedFaceColor >= maxVisible) startIdx = selectedFaceColor - 1;
for (var i = startIdx; i < FACE_COLORS.length && i < startIdx + maxVisible; i++) {
var yPos = 55 + ((i - startIdx) * 14);
if (i === selectedFaceColor) {
setTextColor(COLOR_PROGRESS);
drawString("> " + FACE_COLORS[i].name, screenWidth / 2 - 45, yPos);
} else {
setTextColor(COLOR_WHITE);
drawString("  " + FACE_COLORS[i].name, screenWidth / 2 - 45, yPos);
}
drawFillRect(screenWidth / 2 + 25, yPos + 2, 8, 8, FACE_COLORS[i].color);
}
setTextColor(COLOR_WHITE);
setTextSize(0);
drawString("Prev/Next - Change", screenWidth / 2 - 40, screenHeight - 25);
drawString("Sel - OK  Esc - Back", screenWidth / 2 - 40, screenHeight - 15);
}

function drawHatMenu() {
setTextColor(COLOR_WHITE);
setTextSize(1);
drawString("SELECT HAT", screenWidth / 2 - 40, 10);
var previewY = 25;
var hatColor = HAT_COLORS[selectedHatColor].color;
drawFillRect(screenWidth / 2 - 10, previewY, playerSize, playerSize, SKINS[selectedSkin].color);
drawRect(screenWidth / 2 - 10, previewY, playerSize, playerSize, COLOR_WHITE);
drawFillRect(screenWidth / 2 - 7, previewY + 3, 9, 9, FACE_COLORS[selectedFaceColor].color);
drawFillRect(screenWidth / 2 - 6, previewY + 5, 2, 2, COLOR_WHITE);
drawFillRect(screenWidth / 2 - 1, previewY + 5, 2, 2, COLOR_WHITE);
if (hatColor) {
drawFillRect(screenWidth / 2 - 11, previewY - 4, 17, 4, hatColor);
drawFillRect(screenWidth / 2 - 6, previewY - 8, 7, 4, hatColor);
}

setTextColor(hatColor || COLOR_WHITE);
drawString(HAT_COLORS[selectedHatColor].name, screenWidth / 2 - 25, previewY + 25);
var startIdx = 0;
var maxVisible = 3;
if (selectedHatColor >= maxVisible) startIdx = selectedHatColor - 1;
for (var i = startIdx; i < HAT_COLORS.length && i < startIdx + maxVisible; i++) {
var yPos = 55 + ((i - startIdx) * 14);
if (i === selectedHatColor) {
setTextColor(COLOR_PROGRESS);
drawString("> " + HAT_COLORS[i].name, screenWidth / 2 - 45, yPos);
} else {
setTextColor(COLOR_WHITE);
drawString("  " + HAT_COLORS[i].name, screenWidth / 2 - 45, yPos);
}
if (HAT_COLORS[i].color) {
drawFillRect(screenWidth / 2 + 25, yPos + 2, 8, 8, HAT_COLORS[i].color);
} else {
drawRect(screenWidth / 2 + 25, yPos + 2, 8, 8, COLOR_WHITE);
}
}
setTextColor(COLOR_WHITE);
setTextSize(0);
drawString("Prev/Next - Change", screenWidth / 2 - 40, screenHeight - 25);
drawString("Sel - OK  Esc - Back", screenWidth / 2 - 40, screenHeight - 15);
}

function drawBackgroundMenu() {
    drawMenuBackground();
    setTextColor(COLOR_GOLD);
    setTextSize(2);
    drawString("MENU BACKGROUND", screenWidth / 2 - 75, 10);
    setTextColor(COLOR_WHITE);
    setTextSize(1);
    for (var i = 0; i < MENU_BACKGROUNDS.length; i++) {
        var yPos = 40 + i * 14;
        if (i === selectedMenuBackground) {
            setTextColor(COLOR_PROGRESS);
            drawString("> " + MENU_BACKGROUNDS[i], screenWidth / 2 - 30, yPos);
        } else {
            setTextColor(COLOR_WHITE);
            drawString("  " + MENU_BACKGROUNDS[i], screenWidth / 2 - 30, yPos);
        }
    }
    setTextColor(COLOR_WHITE);
    setTextSize(0);
    drawString("Prev/Next - Change", screenWidth / 2 - 40, screenHeight - 25);
    drawString("Sel - OK  Esc - Back", screenWidth / 2 - 40, screenHeight - 15);
}

function drawCreatorMenu() {
drawFillRect(0, 0, screenWidth, screenHeight, COLOR_BG);
setTextColor(COLOR_GOLD);
setTextSize(2);
drawString("CREATOR", screenWidth / 2 - 35, 10);
setTextColor(COLOR_WHITE);
setTextSize(1);
drawString("@HackDash_maneger", screenWidth / 2 - 25, 30);
setTextColor(COLOR_CYAN);
setTextSize(0);
drawString("Telegram: t.me/hackspb6", screenWidth / 2 - 50, 50);
drawString("TikTok: @hackspb6", screenWidth / 2 - 55, 65);
setTextColor(COLOR_WHITE);
setTextSize(0);
drawString("Partners:", screenWidth / 2 - 50, 82);
setTextColor(COLOR_CYAN);
drawString("Telegram partner: " + (CREATOR_PARTNER_TELEGRAM || ""), screenWidth / 2 - 50, 96);
setTextColor(COLOR_WHITE);
setTextSize(0);
drawString("Sel - Back  Esc - Exit", screenWidth / 2 - 40, screenHeight - 15);
}

function drawUpdatesMenu() {
    drawFillRect(0, 0, screenWidth, screenHeight, COLOR_BG);
    setTextColor(COLOR_GOLD);
    setTextSize(2);
    drawString("UPDATES", screenWidth / 2 - 30, 10);
    setTextColor(COLOR_WHITE);
    setTextSize(1);
    var startY = 36;
    for (var i = 0; i < UPDATES.length; i++) {
        var item = UPDATES[i];
        var ver = item.version && item.version !== "" ? item.version : "Version " + (i+1);
        var date = item.date || "";
        drawString((i+1) + ". " + ver + (date ? " - " + date : ""), 12, startY + i * 14);
    }
    setTextColor(COLOR_WHITE);
    setTextSize(0);
    drawString("Sel - Back  Esc - Exit", screenWidth / 2 - 40, screenHeight - 15);
}

function drawMainMenu() {
drawMenuBackground();
setTextColor(SKINS[selectedSkin].color);
setTextSize(2);
drawString("HACK", (screenWidth - (4 * 12)) / 2, 4);
drawString("DASH", (screenWidth - (4 * 12)) / 2, 20);
var iconY = 40;
drawFillRect(screenWidth / 2 - 8, iconY, playerSize, playerSize, SKINS[selectedSkin].color);
var faceColor = FACE_COLORS[selectedFaceColor].color;
drawFillRect(screenWidth / 2 - 5, iconY + 3, 9, 9, faceColor);
drawFillRect(screenWidth / 2 - 4, iconY + 5, 2, 2, COLOR_WHITE);
drawFillRect(screenWidth / 2 + 1, iconY + 5, 2, 2, COLOR_WHITE);
var hatColor = HAT_COLORS[selectedHatColor].color;
if (hatColor) {
drawFillRect(screenWidth / 2 - 9, iconY - 4, 17, 4, hatColor);
drawFillRect(screenWidth / 2 - 4, iconY - 8, 7, 4, hatColor);
}
setTextColor(COLOR_WHITE);
setTextSize(1);
var nickText = getNickWithEggs();
drawString(nickText, (screenWidth - (nickText.length * 6)) / 2, 58);
var menuY = 70; 
var buttonWidth = 56;
var buttonHeight = 14; 
var buttonSpacing = 4;
var buttons = ["PLAY", "CUSTOM", "NAME", "CREATOR", "UPDATES"];
for (var i = 0; i < buttons.length; i++) {
var isSelected = (mainMenuIndex === i);
var col = i % 2; 
var row = Math.floor(i / 2); 
var btnX = (screenWidth / 2) + (col === 0 ? -buttonWidth - 2 : 2);
var btnY = menuY + (row * (buttonHeight + buttonSpacing));
if (isSelected) {
drawFillRect(btnX, btnY, buttonWidth, buttonHeight, SKINS[selectedSkin].color);
setTextColor(COLOR_BG);
} else {
drawRect(btnX, btnY, buttonWidth, buttonHeight, SKINS[selectedSkin].color);
setTextColor(SKINS[selectedSkin].color);
}
var textWidth = buttons[i].length * 6;
var textX = btnX + (buttonWidth - textWidth) / 2;
var textY = btnY + (buttonHeight - 8) / 2; 
drawString(buttons[i], textX, textY);
}
setTextColor(COLOR_WHITE);
setTextSize(0);
var scoresTxt = "E:" + highScores[0] + " H:" + highScores[2] + " B:" + highScores[7];
drawString(scoresTxt, (screenWidth - (scoresTxt.length * 6)) / 2, screenHeight - 20);
setTextColor(COLOR_PURPLE);
drawString(GAME_VERSION, 2, screenHeight - 10);
setTextColor(COLOR_WHITE);
var ctrlTxt = "Nav:<> Sel:OK";
drawString(ctrlTxt, screenWidth - (ctrlTxt.length * 6) - 2, screenHeight - 10);
drawFillRect(screenWidth - 15, 4, 10, 10, SKINS[selectedSkin].color);
drawRect(screenWidth - 15, 4, 10, 10, COLOR_WHITE);
drawBatteryInfo();
}

function drawGame() {
if (gameState === 0) {
drawMainMenu();
} else if (gameState === 1) {
drawMenuBackground();
var lvl = LEVELS[menuSelection];
var bestScore = highScores[menuSelection] !== undefined ? highScores[menuSelection] : 0;
var isBoss = lvl.isBoss;
setTextColor(COLOR_WHITE);
setTextSize(2);
drawString("<", 5, screenHeight / 2 - 10);
drawString(">", screenWidth - 15, screenHeight / 2 - 10);
setTextSize(1);
setTextColor(COLOR_WHITE);
var nameWidth = lvl.name.length * 6;
var nameX = (screenWidth - nameWidth) / 2;
drawString(lvl.name, nameX, 15);
var iconSize = 24;
var iconX = (screenWidth - iconSize) / 2;
var iconY = 35;
var diffColor = COLOR_WHITE;
if (lvl.name === "EASY") diffColor = COLOR_GREEN;
else if (lvl.name === "MEDIUM") diffColor = COLOR_YELLOW;
else if (lvl.name === "HARD") diffColor = COLOR_ORANGE;
else if (lvl.name === "INSANE") diffColor = COLOR_PINK;
else if (lvl.name === "EXTREME") diffColor = COLOR_RED;
else if (lvl.name === "IMPOSSIBLE") diffColor = COLOR_PURPLE;
else if (lvl.name === "CAINE") diffColor = color(180, 50, 180);
else if (isBoss) diffColor = color(150, 0, 0); 
drawFillRect(iconX, iconY, iconSize, iconSize, diffColor);
drawRect(iconX, iconY, iconSize, iconSize, COLOR_WHITE);
if (isBoss) {
drawFillRect(iconX + 4, iconY + 6, 5, 5, COLOR_BLACK);
drawFillRect(iconX + 15, iconY + 6, 5, 5, COLOR_BLACK);
drawFillRect(iconX + 6, iconY + 16, 12, 4, COLOR_BLACK);
drawFillRect(iconX + 8, iconY + 14, 2, 2, COLOR_WHITE); 
drawFillRect(iconX + 14, iconY + 14, 2, 2, COLOR_WHITE);
} else {
drawFillRect(iconX + 5, iconY + 6, 4, 4, COLOR_BLACK);
drawFillRect(iconX + 15, iconY + 6, 4, 4, COLOR_BLACK);
drawFillRect(iconX + 8, iconY + 14, 8, 3, COLOR_BLACK);
}
setTextSize(0);
var barY = iconY + 40;
if (isBoss) {
setTextColor(COLOR_RED);
var scoreTxt = "BEST SCORE: " + bestScore;
drawString(scoreTxt, (screenWidth - (scoreTxt.length * 6)) / 2, barY - 10);
setTextColor(COLOR_WHITE);
var modeTxt = "BOSS BATTLE";
drawString(modeTxt, (screenWidth - (modeTxt.length * 6)) / 2, barY + 5);
} else {
var percent = Math.min(100, Math.floor((bestScore / lvl.length) * 100));
setTextColor(COLOR_WHITE);
var modeTxt = "NORMAL MODE";
drawString(modeTxt, (screenWidth - (modeTxt.length * 6)) / 2, barY - 10);
var barWidth = 80;
var barX = (screenWidth - barWidth) / 2;
drawFillRect(barX, barY, barWidth, 8, color(50, 50, 50));
var fillWidth = Math.floor((barWidth * percent) / 100);
if (fillWidth > 0) {
drawFillRect(barX, barY, fillWidth, 8, COLOR_PROGRESS);
}
drawRect(barX, barY, barWidth, 8, COLOR_WHITE);
drawString(percent + "%", barX + barWidth + 5, barY + 1);
}
setTextColor(COLOR_PROGRESS);
var playTxt = "[SEL] PLAY   [ESC] BACK";
drawString(playTxt, (screenWidth - (playTxt.length * 6)) / 2, screenHeight - 15);
} else if (gameState === 2) {
showActivationScreen();
gameState = 0;
} else if (gameState === 3) {
if (LEVELS[selectedLevel].isBoss) {
var r = Math.floor(20 + 15 * Math.sin(frameCounter * 0.05));
var g = Math.floor(25 + 15 * Math.sin(frameCounter * 0.05 + 2));
var b = Math.floor(40 + 20 * Math.sin(frameCounter * 0.05 + 4));
drawFillRect(0, 0, screenWidth, screenHeight, color(r, g, b));
} else {
drawLevelBackground(LEVELS[selectedLevel]);
}
drawFillRect(0, groundY, screenWidth, screenHeight - groundY, COLOR_GROUND);
drawProgressBar();
drawPlayer();
drawBatteryInfo();
if (!isFinished) {
for (var p = 0; p < playerProjectiles.length; p++) {
drawFillRect(playerProjectiles[p].x, playerProjectiles[p].y, playerProjectiles[p].w, playerProjectiles[p].h, COLOR_FINISH);
drawRect(playerProjectiles[p].x, playerProjectiles[p].y, playerProjectiles[p].w, playerProjectiles[p].h, COLOR_WHITE);
}
if (boss.active) {
drawLasers();
drawBossLava();
drawBoss();
drawBossHealth();
drawBossProjectiles();
drawBossMinions();
}
for (var i = 0; i < obstacles.length; i++) {
if (obstacles[i].type === "BLOCK") drawBlock(obstacles[i]);
else if (obstacles[i].type === "BLADE") drawBlade(obstacles[i]);
else if (obstacles[i].type === "NEON") drawNeonObstacle(obstacles[i]);
else drawSpike(obstacles[i]);
}
for (var i = 0; i < flyingObstacles.length; i++) {
drawFlyingObstacle(flyingObstacles[i]);
}
} else {
drawFinishParticles();
}
if (floweyGlitchTimer > 0) {
if (frameCounter % 2 === 0) {
for(var g = 0; g < 15; g++) {
drawFillRect(Math.random() * screenWidth, Math.random() * screenHeight, Math.random() * 40, Math.random() * 8, COLOR_WHITE);
}
setTextColor(COLOR_GREEN);
setTextSize(2);
drawString("FILE LOADED", screenWidth/2 - 40, screenHeight/2);
}
}
if (isGravityInverted) {
drawRect(0, 0, screenWidth, screenHeight, COLOR_BLUE);
drawRect(1, 1, screenWidth-2, screenHeight-2, COLOR_BLUE);
}
setTextColor(COLOR_WHITE);
setTextSize(0);
var gameNick = getNickWithEggs();
drawString(gameNick, 5, 15);
drawString("Score: " + score, 5, 25);
setTextColor(LEVELS[selectedLevel].isBoss ? COLOR_RED : COLOR_WHITE);
drawString("Level: " + LEVELS[selectedLevel].name, screenWidth - 75, 15);
setTextColor(SKINS[selectedSkin].color);
drawString(gameMode === 0 ? "[CUBE]" : "[SHIP]", screenWidth - 75, 25);
} else if (gameState === 4) {
drawFillRect(0, 0, screenWidth, screenHeight, COLOR_BG);
drawFillRect(0, groundY, screenWidth, screenHeight - groundY, COLOR_GROUND);
drawPlayer();
setTextColor(COLOR_SPIKE);
setTextSize(2);
drawString("GAME OVER", screenWidth / 2 - 40, screenHeight / 2 - 25);
setTextColor(COLOR_WHITE);
setTextSize(1);
drawString("Score: " + score, screenWidth / 2 - 25, screenHeight / 2);
setTextColor(COLOR_PROGRESS);
setTextSize(0);
drawString("Sel - Restart  Esc - Menu", screenWidth / 2 - 50, screenHeight / 2 + 20);
} else if (gameState === 5) {
finishAnimFrame++;
drawFillRect(0, 0, screenWidth, screenHeight, (Math.floor(finishAnimFrame / 10) % 2 === 0 ? color(30, 30, 50) : COLOR_BG));
drawFillRect(0, groundY, screenWidth, screenHeight - groundY, COLOR_GROUND);
drawFinishParticles();
setTextColor(COLOR_FINISH);
setTextSize(2);
drawString("COMPLETE!", screenWidth / 2 - 45, screenHeight / 2 - 20);
setTextColor(COLOR_WHITE);
setTextSize(1);
drawString("Score: " + score, screenWidth / 2 - 25, screenHeight / 2 + 5);
setTextColor(COLOR_PROGRESS);
setTextSize(0);
drawString("Sel - Menu  Esc - Exit", screenWidth / 2 - 45, screenHeight / 2 + 25);
} else if (gameState === 6) {
drawFillRect(0, 0, screenWidth, screenHeight, COLOR_BG);
drawSkinMenu();
} else if (gameState === 7) {
drawFillRect(0, 0, screenWidth, screenHeight, COLOR_BG);
drawFaceMenu();
} else if (gameState === 8) {
drawFillRect(0, 0, screenWidth, screenHeight, COLOR_BG);
drawHatMenu();
} else if (gameState === 10) {
drawCreatorMenu();
}
}

function updateGame() {

if (isDead && !easterEggFlags.admin && !easterEggFlags.god && !easterEggFlags.hacksbp && !easterEggFlags.lithromantov && !easterEggFlags.dev) {
deathAnimFrame++;
return;
}
if (isFinished) {
finishAnimFrame++;
return;
}
if (shootCooldown > 0) shootCooldown--;
if (playerStoneTimer > 0) playerStoneTimer--;
if (floweyGlitchTimer > 0) floweyGlitchTimer--;
if (gameMode === 0) {
if (isJumping && velocityY < 0) {
jumpScaleX = 0.8;
jumpScaleY = 1.2;
} else if (isJumping && velocityY > 0) {
jumpScaleX = 1.1;
jumpScaleY = 0.9;
} else if (!isJumping) {
jumpScaleX += (1 - jumpScaleX) * 0.2;
jumpScaleY += (1 - jumpScaleY) * 0.2;
if (Math.abs(jumpScaleX - 1) < 0.05) jumpScaleX = 1;
if (Math.abs(jumpScaleY - 1) < 0.05) jumpScaleY = 1;
}
velocityY += gravity;
playerY += velocityY;
if (playerY >= groundY - playerSize) {
playerY = groundY - playerSize;
velocityY = 0;
isJumping = false;
jumpScaleX = 1;
jumpScaleY = 1;
}
} else {
shipVelocity += (isGravityInverted ? -gravity * 0.5 : gravity * 0.5);
shipY += shipVelocity;
if (shipY >= groundY - playerSize) {
shipY = groundY - playerSize;
shipVelocity = 0;
}
if (shipY <= 30) {
shipY = 30;
shipVelocity = 0;
}
}
var playerRect = {
x: playerX,
y: gameMode === 0 ? playerY : shipY,
w: playerSize,
h: playerSize
};
for (var i = playerProjectiles.length - 1; i >= 0; i--) {
playerProjectiles[i].x += 12;
if (boss.active && checkCollision(playerProjectiles[i], {x: boss.x - 15, y: boss.y - 20, w: 30, h: 40})) {
if (boss.shieldActive && boss.bossType === "VADER") {
playerProjectiles.splice(i, 1);
continue;
}
boss.hp -= 5;
boss.invincible = 10;
playerProjectiles.splice(i, 1);
score += 50;
if (boss.hp <= 0) {
isFinished = true;
score += 10000;
for (var p = 0; p < 50; p++) {
finishParticles.push({
x: boss.x,
y: boss.y,
vx: (Math.random() - 0.5) * 15,
vy: (Math.random() - 0.5) * 15,
size: Math.random() * 8 + 2,
color: Math.random() > 0.5 ? COLOR_RED : COLOR_FINISH
});
}
updateHighScore();
}
continue;
}
if (playerProjectiles[i] && playerProjectiles[i].x > screenWidth) {
playerProjectiles.splice(i, 1);
}
}
for (var i = 0; i < obstacles.length; i++) {
obstacles[i].x -= gameSpeed;

if (!isDead && !easterEggFlags.admin && !easterEggFlags.god && !easterEggFlags.hacksbp && !easterEggFlags.lithromantov && !easterEggFlags.dev && checkCollision(playerRect, obstacles[i])) {
isDead = true;
updateHighScore();
}
}
for (var i = 0; i < flyingObstacles.length; i++) {
if (flyingObstacles[i].type === "BOSS_SPIKE") {
flyingObstacles[i].x += flyingObstacles[i].vx;
flyingObstacles[i].y += flyingObstacles[i].vy;
} else {
flyingObstacles[i].x -= gameSpeed;
if (flyingObstacles[i].type === "WAVE") {
flyingObstacles[i].phase += 0.1;
flyingObstacles[i].y = groundY - obstacleSize * 2 + Math.sin(flyingObstacles[i].phase) * 10;
} else if (flyingObstacles[i].type === "DROP_SPIKE") {
if (flyingObstacles[i].x < screenWidth * 0.7 && !flyingObstacles[i].dropped) {
flyingObstacles[i].y += 6;
if (flyingObstacles[i].y >= groundY - obstacleSize) {
flyingObstacles[i].y = groundY - obstacleSize;
flyingObstacles[i].dropped = true;
}
}
}
}

if (!isDead && !easterEggFlags.admin && !easterEggFlags.god && !easterEggFlags.hacksbp && !easterEggFlags.lithromantov && !easterEggFlags.dev && checkCollision(playerRect, flyingObstacles[i])) {
isDead = true;
updateHighScore();
}
}
if (obstacles.length > 0 && obstacles[0].x + obstacles[0].w < 0) {
obstacles.shift();
score += easterEggFlags.god || easterEggFlags.hacksbp ? 100 : 10;
}
if (flyingObstacles.length > 0 && flyingObstacles[0].x + flyingObstacles[0].w < 0) {
flyingObstacles.shift();
score += easterEggFlags.god || easterEggFlags.hacksbp ? 100 : 10;
}
if (boss.active && !isDead && !isFinished) {
updateBoss();
updateBossProjectiles();
} else if (!LEVELS[selectedLevel].isBoss) {
frameCounter++;
if (frameCounter > LEVELS[selectedLevel].spawnRate) {
if (Math.random() > 0.3) spawnObstacle();
frameCounter = 0;
}
levelProgress++;
if (levelProgress >= LEVELS[selectedLevel].length) {
isFinished = true;
createFinishParticles();
updateHighScore();
}
}
}


detectFileSystem();
loadData();
showLoadingScreen();
if (!checkActivation()) {
    showActivationScreen();
}
if (!isActivated) {
shouldExit = true;
} else if (playerNickname === "Player" || !hasAnyEgg()) {
inputNickname();
}


while (!shouldExit) {
var btnPrev = getPrevPress();
var btnNext = getNextPress();
var btnSel = getSelPress();
var btnEsc = getEscPress();
if (gameState === 0) {
if (btnNext) { mainMenuIndex = (mainMenuIndex + 1) % 5; delay(150); }
if (btnPrev) { mainMenuIndex = (mainMenuIndex - 1 + 5) % 5; delay(150); }
if (btnSel) {
if (mainMenuIndex === 0) { gameState = 1; menuSelection = selectedLevel; }
else if (mainMenuIndex === 1) { gameState = 9; shopSelection = 0; }
else if (mainMenuIndex === 2) { inputNickname(); }
else if (mainMenuIndex === 3) { gameState = 10; }
else if (mainMenuIndex === 4) { gameState = 11; }
delay(200);
}
if (btnEsc) break;
} else if (gameState === 1) {
if (btnNext) { menuSelection = (menuSelection + 1) % LEVELS.length; delay(150); }
if (btnPrev) { menuSelection = (menuSelection - 1 + LEVELS.length) % LEVELS.length; delay(150); }
if (btnSel) { selectedLevel = menuSelection; resetGame(); delay(200); }
if (btnEsc) { gameState = 0; delay(200); }
} else if (gameState === 2) {
if (btnEsc || btnSel) { gameState = 0; delay(200); }
} else if (gameState === 3) {
if (!isDead && !isFinished) {
if (gameMode === 0) {
if (btnSel && !isJumping) { velocityY = jumpForce; isJumping = true; }
if (btnNext) { playerX += 5; if (playerX > screenWidth - playerSize) playerX = screenWidth - playerSize; }
if (btnPrev) { playerX -= 5; if (playerX < 0) playerX = 0; }
} else {
if (btnNext) { playerX += 5; if (playerX > screenWidth - 40) playerX = screenWidth - 40; }
if (btnPrev) { playerX -= 5; if (playerX < 0) playerX = 0; }
if (btnSel) {
if (playerStoneTimer <= 0) {
shipVelocity = isGravityInverted ? 10 : -10;
}
if (shootCooldown <= 0) {
playerProjectiles.push({ x: playerX + playerSize, y: shipY + playerSize / 2 - 2, w: 8, h: 4 });
shootCooldown = 15;
}
}
}
}
updateGame();
if (isDead && deathAnimFrame >= 25) gameState = 4;
if (isFinished && finishAnimFrame > 30) gameState = 5;
} else if (gameState === 4) {
if (btnSel) { resetGame(); delay(200); }
if (btnEsc) { gameState = 0; mainMenuIndex = 0; delay(200); }
} else if (gameState === 5) {
if (btnSel || btnEsc) { gameState = 0; mainMenuIndex = 0; delay(200); }
} else if (gameState === 6) {
drawFillRect(0, 0, screenWidth, screenHeight, COLOR_BG);
drawSkinMenu();
if (btnNext) { 
selectedSkin++;
if (selectedSkin >= SKINS.length) selectedSkin = 0;
delay(150); 
}
if (btnPrev) { 
selectedSkin--;
if (selectedSkin < 0) selectedSkin = SKINS.length - 1;
delay(150); 
}
if (btnSel) { 
gameState = 9;
delay(200); 
}
if (btnEsc) { 
gameState = 0; 
mainMenuIndex = 0;
delay(200); 
}
} else if (gameState === 7) {
drawFillRect(0, 0, screenWidth, screenHeight, COLOR_BG);
drawFaceMenu();
if (btnNext) { 
selectedFaceColor++;
if (selectedFaceColor >= FACE_COLORS.length) selectedFaceColor = 0;
delay(150); 
}
if (btnPrev) { 
selectedFaceColor--;
if (selectedFaceColor < 0) selectedFaceColor = FACE_COLORS.length - 1;
delay(150); 
}
if (btnSel) { 
saveData();
gameState = 9;
delay(200); 
}
if (btnEsc) { 
gameState = 9; 
delay(200); 
}
} else if (gameState === 8) {
drawFillRect(0, 0, screenWidth, screenHeight, COLOR_BG);
drawHatMenu();
if (btnNext) { 
selectedHatColor++;
if (selectedHatColor >= HAT_COLORS.length) selectedHatColor = 0;
delay(150); 
}
if (btnPrev) { 
selectedHatColor--;
if (selectedHatColor < 0) selectedHatColor = HAT_COLORS.length - 1;
delay(150); 
}
if (btnSel) { 
saveData();
gameState = 9;
delay(200); 
}
if (btnEsc) { 
gameState = 9; 
delay(200); 
}
} else if (gameState === 9) {
drawFillRect(0, 0, screenWidth, screenHeight, COLOR_BG);
setTextColor(COLOR_WHITE);
setTextSize(1);
drawString("CUSTOMIZE", screenWidth / 2 - 40, 10);
var previewY = 30;
drawFillRect(screenWidth / 2 - 10, previewY, playerSize, playerSize, SKINS[selectedSkin].color);
drawRect(screenWidth / 2 - 10, previewY, playerSize, playerSize, COLOR_WHITE);
var faceColor = FACE_COLORS[selectedFaceColor].color;
drawFillRect(screenWidth / 2 - 7, previewY + 3, 9, 9, faceColor);
drawFillRect(screenWidth / 2 - 6, previewY + 5, 2, 2, COLOR_WHITE);
drawFillRect(screenWidth / 2 - 1, previewY + 5, 2, 2, COLOR_WHITE);
var hatColor = HAT_COLORS[selectedHatColor].color;
if (hatColor) {
drawFillRect(screenWidth / 2 - 11, previewY - 4, 17, 4, hatColor);
drawFillRect(screenWidth / 2 - 6, previewY - 8, 7, 4, hatColor);
}
var menuY = 70;
var options = ["SKIN", "FACE", "HAT", "BG", "BACK"];
var customIndex = ((shopSelection % options.length) + options.length) % options.length;
for (var i = 0; i < options.length; i++) {
    var yPos = menuY + (i * 14);
    if (i === customIndex) {
        setTextColor(COLOR_PROGRESS);
        drawString("> " + options[i], screenWidth / 2 - 30, yPos);
    } else {
        setTextColor(COLOR_WHITE);
        drawString("  " + options[i], screenWidth / 2 - 30, yPos);
    }
}
if (btnNext) { shopSelection++; delay(150); }
if (btnPrev) { shopSelection--; delay(150); }
if (btnSel) {
    if (customIndex === 0) gameState = 6;
    else if (customIndex === 1) gameState = 7;
    else if (customIndex === 2) gameState = 8;
    else if (customIndex === 3) gameState = 12;
    else if (customIndex === 4) { gameState = 0; mainMenuIndex = 0; saveData(); }
    delay(200);
}
if (btnEsc) { gameState = 0; mainMenuIndex = 0; saveData(); delay(200); }
} else if (gameState === 10) {
drawCreatorMenu();
if (btnSel) { 
gameState = 0; 
mainMenuIndex = 0;
delay(200); 
}
if (btnEsc) { 
gameState = 0; 
mainMenuIndex = 0;
delay(200); 
}
} else if (gameState === 11) {
    drawUpdatesMenu();
    if (btnSel) {
        gameState = 0;
        mainMenuIndex = 0;
        delay(200);
    }
    if (btnEsc) {
        gameState = 0;
        mainMenuIndex = 0;
        delay(200);
    }
} else if (gameState === 12) {
    drawBackgroundMenu();
    if (btnNext) {
        selectedMenuBackground++;
        if (selectedMenuBackground >= MENU_BACKGROUNDS.length) selectedMenuBackground = 0;
        delay(150);
    }
    if (btnPrev) {
        selectedMenuBackground--;
        if (selectedMenuBackground < 0) selectedMenuBackground = MENU_BACKGROUNDS.length - 1;
        delay(150);
    }
    if (btnSel) {
        saveData();
        gameState = 9;
        delay(200);
    }
    if (btnEsc) {
        gameState = 9;
        delay(200);
    }
}
if (gameState !== 3) menuAnimation++;
drawGame();
delay(50);
}
