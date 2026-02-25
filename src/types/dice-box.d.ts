declare module "@3d-dice/dice-box" {
  interface DiceBoxConfig {
    assetPath: string;
    theme?: string;
    themeColor?: string;
    scale?: number;
    gravity?: number;
    enableShadows?: boolean;
    settleTimeout?: number;
    delay?: number;
  }

  interface DieResult {
    sides: number;
    groupId: number;
    rollId: number;
    theme: string;
    themeColor?: string;
    value: number;
  }

  interface RollGroupResult {
    id: number;
    groupId: number;
    qty: number;
    sides: number;
    value: number;
    mods: number[];
    rolls: DieResult[];
    theme: string;
    themeColor?: string;
  }

  export default class DiceBox {
    constructor(selector: string, config: DiceBoxConfig);
    init(): Promise<void>;
    roll(notation: string): void;
    clear(): void;
    hide(className?: string): this;
    show(): this;
    updateConfig(config: Partial<DiceBoxConfig>): void;
    onRollComplete: ((results: RollGroupResult[]) => void) | null;
    onThemeConfigLoaded: ((themeData: any) => void) | null;
  }
}
