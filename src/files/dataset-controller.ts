import fs from "fs";

export class DatasetController {
  log: fs.WriteStream;

  constructor(filename: string) {
    this.log = fs.createWriteStream(filename, {
      flags: "a",
    });
  }

  write(entry: string) {
    this.log.write(entry);
  }

  end() {
    this.log.end();
  }
}
