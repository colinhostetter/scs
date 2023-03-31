export { }

interface Line {
    // some other stuff...
    parsed_line: {
        chunks: {
            _txt?: string;
        }[]
    }
}

declare global {
    // @ts-expect-error
    var arguments: [Line][];
}

const lines = arguments[0];
for (const line of lines) {
  const text = line.parsed_line.chunks.map(i => i._txt || "").join("");
  const data = window.SCS.data.messageHash[text];
  if (data) {
    if (data.type == "defense") {
      if (data.subtype == "active" || data.subtype == "up") {
        if (!window.SCS.defenses[data.defense]) {
          window.SCS.defenses[data.defense] = {
            ts: Date.now()
          };
        }
      } else if (data.subtype == "down") {
        delete window.SCS.defenses[data.defense];
      }
    }
  }
}
