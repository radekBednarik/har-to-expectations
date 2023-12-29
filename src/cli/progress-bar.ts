import { SingleBar, Presets } from "cli-progress";

export default class ProgressBar {
  private readonly _logEnabled?: string;
  public bar: SingleBar | null;

  constructor(logEnabled?: string) {
    this._logEnabled = logEnabled;
    this.bar = this._init();
  }

  private _init() {
    if (typeof this._logEnabled === "undefined") {
      return new SingleBar({}, Presets.rect);
    }

    return null;
  }

  public start(total: number, firstVal = 0) {
    this.bar?.start(total, firstVal);
  }

  public stop() {
    this.bar?.stop();
  }

  public increment() {
    this.bar?.increment();
  }
}
