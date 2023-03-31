window.SCS = {
	data: { defenses: {}, messageHash: {} },
  	vitals: {},
  	defenses: {},
  	expectedUsage: {},
};

fetch("https://raw.githubusercontent.com/colinhostetter/scs/master/data/defenses.json")
	.then(res => res.json())
 	.then(data => {
		window.SCS.data.defenses = data.defenses;
  		const types = ['up', 'down', 'active'];
  		for (const def in data.defenses) {
          for (const type of types) {
            if (data.defenses[def][type]) {
              for (const msg of data.defenses[def][type]) {
                window.SCS.data.messageHash[msg] = {
                  type: "defense",
                  subtype: type,
                  defense: def,
                };
              }
            }
          }
        }
  		display_notice("Loaded defenses data.");
	})
 	.catch(display_notice);
