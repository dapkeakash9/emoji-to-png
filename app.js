// =============================================
// Emoji to PNG - Adobe CEP Extension
// Pure JS, zero external dependencies
// =============================================

// State
var currentEmoji = {
    id: 'point_down',
    unified: '1f447',
    native: '👇'
};
var currentSet = 'apple';
var currentCategory = Object.keys(EMOJI_DATA)[0];

// DOM
var previewEmoji = document.getElementById('preview-emoji');
var downloadBtn = document.getElementById('download-btn');
var downloadText = document.getElementById('download-text');
var platformDropdown = document.getElementById('platform-dropdown');
var emojiGrid = document.getElementById('emoji-grid');
var categoryTabs = document.getElementById('category-tabs');
var searchInput = document.getElementById('search-input');

// =============================================
// Build Category Tabs
// =============================================
function buildTabs() {
    categoryTabs.innerHTML = '';
    var categories = Object.keys(EMOJI_DATA);
    for (var i = 0; i < categories.length; i++) {
        var btn = document.createElement('button');
        btn.className = 'cat-tab' + (categories[i] === currentCategory ? ' active' : '');
        btn.textContent = categories[i];
        btn.setAttribute('data-cat', categories[i]);
        btn.addEventListener('click', function () {
            currentCategory = this.getAttribute('data-cat');
            // Update active tab
            var allTabs = categoryTabs.querySelectorAll('.cat-tab');
            for (var j = 0; j < allTabs.length; j++) allTabs[j].classList.remove('active');
            this.classList.add('active');
            renderEmojis();
            // Scroll to top
            document.querySelector('.panel-content').scrollTop = 0;
        });
        categoryTabs.appendChild(btn);
    }
}

// =============================================
// Render Emoji Grid
// =============================================
function renderEmojis(filter) {
    emojiGrid.innerHTML = '';
    var categories = Object.keys(EMOJI_DATA);

    for (var c = 0; c < categories.length; c++) {
        var catName = categories[c];

        // If not searching, only show current category
        if (!filter && catName !== currentCategory) continue;

        var emojis = EMOJI_DATA[catName];
        var filtered = [];

        if (filter) {
            var q = filter.toLowerCase();
            for (var i = 0; i < emojis.length; i++) {
                if (emojis[i][1].indexOf(q) !== -1) {
                    filtered.push(emojis[i]);
                }
            }
            if (filtered.length === 0) continue;
        } else {
            filtered = emojis;
        }

        // Category label
        var label = document.createElement('div');
        label.className = 'category-label';
        label.textContent = catName;
        emojiGrid.appendChild(label);

        // Emoji buttons row
        var row = document.createElement('div');
        row.className = 'emoji-row';

        for (var i = 0; i < filtered.length; i++) {
            var em = filtered[i];
            var cell = document.createElement('button');
            cell.className = 'emoji-cell';
            if (em[2] === currentEmoji.unified) cell.className += ' selected';
            cell.textContent = em[0];
            cell.title = em[1];
            cell.setAttribute('data-id', em[1]);
            cell.setAttribute('data-unified', em[2]);
            cell.setAttribute('data-native', em[0]);
            cell.addEventListener('click', function () {
                currentEmoji = {
                    id: this.getAttribute('data-id'),
                    unified: this.getAttribute('data-unified'),
                    native: this.getAttribute('data-native')
                };
                // Remove old selection
                var prev = emojiGrid.querySelector('.emoji-cell.selected');
                if (prev) prev.classList.remove('selected');
                this.classList.add('selected');
                updatePreview();
            });
            row.appendChild(cell);
        }
        emojiGrid.appendChild(row);
    }

    // Show "no results" if empty
    if (emojiGrid.children.length === 0) {
        var noResult = document.createElement('div');
        noResult.className = 'category-label';
        noResult.textContent = 'No emojis found';
        noResult.style.textAlign = 'center';
        noResult.style.padding = '20px';
        emojiGrid.appendChild(noResult);
    }
}

// =============================================
// Update Preview
// =============================================
function updatePreview() {
    previewEmoji.textContent = currentEmoji.native;
    downloadText.textContent = 'Add ' + currentEmoji.id;
}

// =============================================
// Search
// =============================================
searchInput.addEventListener('input', function () {
    var q = this.value.trim();
    if (q.length > 0) {
        renderEmojis(q);
    } else {
        renderEmojis();
    }
});

// =============================================
// Platform Switching
// =============================================
platformDropdown.addEventListener('change', function () {
    currentSet = this.value;
});

// =============================================
// Download / Add to Timeline
// =============================================
downloadBtn.addEventListener('click', function () {
    var originalText = downloadText.textContent;
    downloadText.textContent = 'Generating...';
    downloadBtn.style.opacity = '0.7';
    downloadBtn.disabled = true;

    // Fetch the high-res image from emoji.aranja.com
    var unifiedUrl = currentEmoji.unified;
    var imageUrl = 'https://emoji.aranja.com/emojis/' + currentSet + '/' + unifiedUrl + '.png';

    fetch(imageUrl)
        .then(function (response) {
            if (!response.ok) throw new Error('Failed to fetch image');
            return response.blob();
        })
        .then(function (blob) {
            var img = new Image();
            var objectUrl = URL.createObjectURL(blob);
            img.src = objectUrl;

            img.onload = function () {
                var canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth || 160;
                canvas.height = img.naturalHeight || 160;
                var ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                var dataUrl = canvas.toDataURL('image/png');
                URL.revokeObjectURL(objectUrl);

                // Adobe CEP or Browser?
                if (typeof window.__adobe_cep__ !== 'undefined') {
                    handleAdobeExport(dataUrl, originalText);
                } else {
                    // Regular browser download
                    var link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = currentEmoji.id + '_' + currentSet + '.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    restoreButton(originalText);
                }
            };

            img.onerror = function () {
                // Fallback: draw native emoji text
                var canvas = document.createElement('canvas');
                canvas.width = 160;
                canvas.height = 160;
                var ctx = canvas.getContext('2d');
                ctx.font = '120px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(currentEmoji.native, 80, 85);

                var dataUrl = canvas.toDataURL('image/png');

                if (typeof window.__adobe_cep__ !== 'undefined') {
                    handleAdobeExport(dataUrl, originalText);
                } else {
                    var link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = currentEmoji.id + '_' + currentSet + '.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    restoreButton(originalText);
                }
            };
        })
        .catch(function (err) {
            console.error('Download error:', err);
            alert('Could not generate the PNG. Please try again.');
            restoreButton(originalText);
        });
});

function restoreButton(text) {
    downloadText.textContent = text;
    downloadBtn.style.opacity = '1';
    downloadBtn.disabled = false;
}

// =============================================
// Adobe CEP Export
// =============================================
function handleAdobeExport(dataUrl, originalText) {
    try {
        var csInterface = new CSInterface();
        var hostAppId = csInterface.getHostEnvironment().appId;

        csInterface.evalScript('getProjectPath("' + hostAppId + '")', function (projectPath) {
            var targetDirectory = '';

            // Normalize: replace any backslashes with forward slashes
            if (projectPath) projectPath = projectPath.replace(/\\/g, '/');

            if (!projectPath || projectPath === '' || projectPath === 'undefined') {
                var sysDocs = csInterface.getSystemPath(SystemPath.MY_DOCUMENTS);
                targetDirectory = sysDocs ? sysDocs.replace(/\\/g, '/') : '';
            } else {
                var lastSlash = projectPath.lastIndexOf('/');
                var projectDir = projectPath.substring(0, lastSlash);
                targetDirectory = projectDir + '/emoji-to-png';
                window.cep.fs.makedir(targetDirectory);
            }

            var filename = currentEmoji.id + '_' + currentSet + '.png';
            var outputPath = targetDirectory + '/' + filename;
            var base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');

            var result = window.cep.fs.writeFile(outputPath, base64Data, window.cep.encoding.Base64);

            if (result.err === 0) {
                downloadText.textContent = 'Adding to Project...';

                // Ensure safe forward-slash path for evalScript
                var safeOutputPath = outputPath.replace(/\\/g, '/');

                csInterface.evalScript('importImage("' + safeOutputPath + '", "' + hostAppId + '")', function (res) {
                    if (res && res.indexOf('Error') !== -1) {
                        alert(res);
                    } else {
                        downloadText.textContent = 'Added!';
                        setTimeout(function () { restoreButton(originalText); }, 2000);
                        return;
                    }
                    restoreButton(originalText);
                });
            } else {
                alert('Failed to save image. Error: ' + result.err);
                restoreButton(originalText);
            }
        });
    } catch (e) {
        alert('Adobe CEP Error: ' + e.toString());
        restoreButton(originalText);
    }
}

// =============================================
// Initialize
// =============================================
buildTabs();
renderEmojis();
updatePreview();
