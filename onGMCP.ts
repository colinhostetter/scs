export { }

declare global {
    var args: {
        gmcp_method: string;
        gmcp_args: any;
    }
}

function parseVitals(raw: Record<string, string>) {
    const bools = new Set(["allheale", "balance", "beastbal", "blind", "deaf", "eflowbal", "enigmaticflow", "equilibrium", "head", "healing", "ice", "kafe", "left_arm", "left_leg", "mount", "prone", "psiid", "psisub", "psisuper", "right_arm", "right_leg", "scroll", "slush", "sparkleberry", "steam", "vote"]);
    const ints = new Set(["awp", "bleeding", "bruising", "chestwounds", "dust", "ego", "empathy", "essence", "esteem", "gutwounds", "headwounds", "hemorrhaging", "hp", "karma", "leftarmwounds", "leftlegwounds", "maxawp", "maxego", "maxhp", "maxmp", "maxpow", "mp", "pow", "reserves", "rightarmwounds", "rightlegwounds"]);
    const parsed = {};
    for (const key in raw) {
        const val = raw[key];
        if (bools.has(key)) {
            parsed[key] = val !== "0";
        } else if (ints.has(key)) {
            parsed[key] = parseInt(val);
        } else {
            parsed[key] = val;
        }
    }
    window.SCS.vitals = parsed;
}

function addDefense({ name }: { name: string; }) {
    if (window.SCS.data.defenses[name] && window.SCS.data.defenses[name].gmcp) {
        window.SCS.defenses[name] = {
            ts: Date.now(),
        };
    }
}

function removeDefense({ name }: { name: string; }) {
    if (window.SCS.data.defenses[name] && window.SCS.data.defenses[name].gmcp) {
        delete window.SCS.defenses[name]
    }
}

function clearExpiredExpectations() {
    for (const key in window.SCS.expectedUsage) {
        if (window.SCS.expectedUsage[key] < Date.now() - 1000) {
            delete window.SCS.expectedUsage[key];
        }
    }
}

function takeActions() {
    const balancesForReady = ["equilibrium", "balance", "psisub", "psiid", "psisuper"];
    const ready = balancesForReady.every(bal => window.SCS.vitals[bal]);
    const balanceTypes = ["equilibrium", "balance", "herb"];
    for (const balanceType of balanceTypes) {
        if (!window.SCS.vitals[balanceType]) continue;
        if (window.SCS.expectedUsage[balanceType]) continue;
        for (const def in window.SCS.data.defenses) {
            let { requires, consumes, command } = window.SCS.data.defenses[def];
            if (window.SCS.defenses[def]) continue;
            if (window.SCS.expectedUsage[def]) continue;
            if (requires === "ready" && !ready) continue;
            if (requires !== "ready" && !window.SCS.vitals[requires]) continue;
            if (consumes && consumes !== balanceType) continue;
            const usageKey = consumes || def;
            console.log(usageKey)
            window.SCS.expectedUsage[usageKey] = Date.now();
            send_command(command);
        }
    }
}

if (args.gmcp_method === "Char.Vitals") {
    parseVitals(args.gmcp_args);
} else if (args.gmcp_method === "Char.Defences.Add") {
    addDefense(args.gmcp_args);
} else if (args.gmcp_method === "Char.Defences.Remove") {
    removeDefense(args.gmcp_args);
}

clearExpiredExpectations();
takeActions();
