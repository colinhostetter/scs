declare global {
    var SCS: {
        vitals: Record<string, any>,
        defenses: Record<string, ActiveDefense>,
        expectedUsage: Record<string, number>,
        data: {
            defenses: Record<string, DefenseSpec>,
            messageHash: Record<string, MessageEffect>,
        }
    }

    function send_command(command: string): void;
    function display_notice(text: string): void;

    // @ts-expect-error
    var arguments: [Line][];
    var args: {
        gmcp_method: string;
        gmcp_args: any;
    }
}

interface Line {
    // some other stuff...
    parsed_line: {
        chunks: {
            _txt?: string;
        }[]
    }
}

interface ActiveDefense {
    ts: number;
}

interface DefenseSpec {
    command: string;
    requires: string;
    consumes: string;
    gmcp?: boolean;
}

interface BaseMessageEffect {
    type: string;
    subtype: string;
}

interface DefenseEffect extends BaseMessageEffect {
    defense: string;
}

// eventually OR other types
type MessageEffect = DefenseEffect;

export { }