function getProjectPath(hostAppId) {
    try {
        if (!app.project) return "";
        var path = "";
        if (hostAppId === "PPRO") {
            path = app.project.path ? app.project.path : "";
        } else if (hostAppId === "AEFT") {
            path = app.project.file ? app.project.file.fsName : "";
        }
        // Replace backslashes with forward slashes so they survive the evalScript bridge
        return path ? path.replace(/\\/g, "/") : "";
    } catch (e) { }
    return "";
}

function importImage(imagePath, hostAppId) {
    try {
        var fileToImport = new File(imagePath);
        if (!fileToImport.exists) {
            return "Error: File does not exist at " + imagePath;
        }

        // --- PREMIERE PRO LOGIC ---
        if (hostAppId === "PPRO") {
            if (!app.project) return "Error: No active Premiere Pro project.";

            // 1. Import the file into the project bin
            app.project.importFiles([imagePath], 1, app.project.rootItem, false);

            // Wait slightly for import to complete inside project panel
            var importedItem = null;
            for (var i = 0; i < app.project.rootItem.children.numItems; i++) {
                var child = app.project.rootItem.children[i];
                // Check if name matches our file
                if (child.name === fileToImport.name) {
                    importedItem = child;
                    break;
                }
            }

            if (!importedItem) {
                return "Error: File imported but couldn't locate it in the bin.";
            }

            // 2. Insert into Active Sequence
            var activeSeq = app.project.activeSequence;
            if (activeSeq) {
                var cti = activeSeq.getPlayerPosition(); // Current Time Indicator

                // Find highest empty video track or create one implicitly by using highest index
                var numVideoTracks = activeSeq.videoTracks.numTracks;
                if (numVideoTracks > 0) {
                    var targetTrack = activeSeq.videoTracks[numVideoTracks - 1];

                    // Simple check: we just insert. Premiere usually handles overlap by overwriting, 
                    // but the user explicitly requested "add top of all layers or add new track".
                    // The ExtendScript API for adding a new track is unfortunately not exposed reliably in standard PPRO API without QE DOM.
                    // The safest native approach is to just insert into the top-most track.
                    targetTrack.insertClip(importedItem, cti.seconds);
                } else {
                    return "Error: No video tracks in sequence.";
                }
            } else {
                return "Success: Added to Project Bin (No active sequence open to place it on timeline).";
            }

            return "Success: Imported to Premiere Pro and added to timeline.";
        }

        // --- AFTER EFFECTS LOGIC ---
        if (hostAppId === "AEFT") {
            if (!app.project) return "Error: No active After Effects project.";

            var io = new ImportOptions(fileToImport);
            if (!io.canImportAs(ImportAsType.FOOTAGE)) {
                return "Error: File format not recognized by After Effects.";
            }

            // 1. Import footage
            var importedItem = app.project.importFile(io);

            // 2. Add to active composition if one is open
            var activeComp = app.project.activeItem;
            if (activeComp && activeComp instanceof CompItem) {
                // Add as top layer
                var newLayer = activeComp.layers.add(importedItem);
                return "Success: Added to After Effects composition.";
            } else {
                return "Success: Added to After Effects Project Bin (Open a composition first to add it to timeline).";
            }
        }

        return "Error: Unknown host application (" + hostAppId + ").";
    } catch (e) {
        return "Error: " + e.toString();
    }
}
